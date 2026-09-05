'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, MapPin, CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/mockData';
import { ProductItem, ShipmentMilestoneStatus } from '@/lib/types';
import ShipmentTimeline from '@/components/timeline/ShipmentTimeline';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { fetchProducts, updateProductMilestone } from '@/lib/api';

const LOCATION_PRESETS = [
  'Rotterdam Hub, Netherlands',
  'Singapore Port, Singapore',
  'Frankfurt Customs, Germany',
  'John F. Kennedy Cargo Hub, New York, USA',
];

export default function LogisticsPortalPage() {
  const [products, setProducts] = useState<Record<string, ProductItem>>(SAMPLE_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState('PR-8829-X');
  const [targetStatus, setTargetStatus] = useState<ShipmentMilestoneStatus>('DELIVERED');
  const [checkpointLocation, setCheckpointLocation] = useState(LOCATION_PRESETS[3]);
  const [operatorId, setOperatorId] = useState('JFK Port Logistics Inspector #882');
  const [checkpointNote, setCheckpointNote] = useState(
    'Customs inspection passed. Cold-chain seal intact at -20°C. Batch accepted.'
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    fetchProducts().then((items) => {
      if (items && items.length > 0) {
        const mapped: Record<string, ProductItem> = {};
        items.forEach((p) => {
          mapped[p.id] = p;
        });
        setProducts(mapped);
      }
    });
  }, []);

  const currentProduct = products[selectedProductId];

  const handleUpdateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) {
      setFormError('Select a shipment before recording a checkpoint.');
      return;
    }
    setFormError('');
    setIsUpdating(true);
    setUpdateSuccess(false);

    window.setTimeout(() => {
      const newMilestone = {
        id: `m-logistics-${Date.now()}`,
        status: targetStatus,
        title: `Milestone: ${targetStatus.replace('_', ' ')} Updated`,
        location: checkpointLocation,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        operator: operatorId,
        note: checkpointNote,
        completed: true,
        current: true,
      };

      const updatedMilestones = currentProduct.milestones.map((m) => ({
        ...m,
        current: false,
        completed: true,
      }));

      const updatedProduct: ProductItem = {
        ...currentProduct,
        status: targetStatus,
        milestones: [...updatedMilestones, newMilestone],
      };

      setProducts({
        ...products,
        [selectedProductId]: updatedProduct,
      });

      // Asynchronously record milestone transition on backend
      updateProductMilestone(selectedProductId, {
        status: targetStatus,
        actorAddress: currentProduct.manufacturer || '0x1234567890123456789012345678901234567890',
        location: checkpointLocation,
        notes: checkpointNote,
      });

      setIsUpdating(false);
      setUpdateSuccess(true);
      window.setTimeout(() => setUpdateSuccess(false), 3500);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-300 mb-2 shadow-sm">
          <Truck className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-400" />
          <span className="font-semibold">Custodian & Logistics Status Transition</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
          Logistics Milestone Operator
        </h1>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-400">
          Record custody transfers, transit checkpoints, and customs clearances along the international route.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 specular-card p-5 sm:p-7 rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <Package className="w-4 h-4 text-zinc-700 dark:text-zinc-400" />
            <h2 className="text-sm font-bold text-zinc-950 dark:text-white">Record Checkpoint Event</h2>
          </div>

          <form onSubmit={handleUpdateMilestone} className="space-y-3.5 text-xs">
            <div>
              <label htmlFor="shipment" className="block text-zinc-900 dark:text-zinc-300 font-semibold mb-1">
                Select Active Shipment
              </label>
              <select
                id="shipment"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded-lg text-zinc-950 dark:text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-500 shadow-sm"
              >
                {Object.values(products).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.name.slice(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between text-xs shadow-sm">
              <span className="text-zinc-700 dark:text-zinc-400 font-medium">Current Status:</span>
              <Badge tone="indigo">{currentProduct.status}</Badge>
            </div>

            <div>
              <span className="block text-zinc-900 dark:text-zinc-300 font-semibold mb-1">New Milestone Status</span>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Milestone status">
                {(['CREATED', 'IN_TRANSIT', 'DELIVERED'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTargetStatus(st)}
                    className={`py-1.5 px-2 rounded-lg font-mono text-[11px] font-bold border transition-all active:scale-[0.98] ${
                      targetStatus === st
                        ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-100 dark:border-white dark:text-zinc-950 shadow-sm'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Checkpoint Location
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  required
                  value={checkpointLocation}
                  onChange={(e) => setCheckpointLocation(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded-lg text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 shadow-sm"
                />
                <MapPin className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {LOCATION_PRESETS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setCheckpointLocation(loc)}
                    className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-700 transition-colors"
                  >
                    {loc.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="operator" className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Logistics Operator ID
              </label>
              <input
                id="operator"
                type="text"
                required
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded-lg text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 font-mono shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Checkpoint Audit Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={checkpointNote}
                onChange={(e) => setCheckpointNote(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded-lg text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:border-zinc-500 leading-relaxed shadow-sm"
              />
            </div>

            {formError && (
              <p className="text-rose-600 dark:text-rose-400 text-xs font-mono" role="alert">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? 'Recording Milestone...' : 'Commit Milestone Transition'}
            </Button>

            {updateSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Milestone transitioned to {targetStatus} successfully.</span>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-7 specular-card p-5 sm:p-7 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Live Journey: {currentProduct.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{currentProduct.id}</p>
            </div>
            <Link
              href={`/verify/${currentProduct.id}`}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              <span>Public View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <ShipmentTimeline milestones={currentProduct.milestones} currentStatus={currentProduct.status} />
        </div>
      </div>
    </div>
  );
}
