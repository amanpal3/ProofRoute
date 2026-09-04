'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, MapPin, CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/mockData';
import { ProductItem, ShipmentMilestoneStatus } from '@/lib/types';
import ShipmentTimeline from '@/components/timeline/ShipmentTimeline';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

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

      setIsUpdating(false);
      setUpdateSuccess(true);
      window.setTimeout(() => setUpdateSuccess(false), 3500);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-2">
          <Truck className="w-4 h-4 text-cyan-400" />
          <span>Custodian & Logistics Status Transition</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Logistics Milestone Operator
        </h1>
        <p className="text-sm text-slate-400">
          Record custody transfers, transit checkpoints, and customs clearances along the international route.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Package className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-white">Record Checkpoint Event</h2>
          </div>

          <form onSubmit={handleUpdateMilestone} className="space-y-4 text-xs">
            <div>
              <label htmlFor="shipment" className="block text-slate-300 font-medium mb-1">
                Select Active Shipment
              </label>
              <select
                id="shipment"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {Object.values(products).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.name.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Status:</span>
              <Badge tone="indigo">{currentProduct.status}</Badge>
            </div>

            <div>
              <span className="block text-slate-300 font-medium mb-1">New Milestone Status</span>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Milestone status">
                {(['CREATED', 'IN_TRANSIT', 'DELIVERED'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTargetStatus(st)}
                    className={`py-2 px-2 rounded-xl font-mono text-[11px] font-semibold border transition-all ${
                      targetStatus === st
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-slate-300 font-medium mb-1">
                Checkpoint Location
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  required
                  value={checkpointLocation}
                  onChange={(e) => setCheckpointLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {LOCATION_PRESETS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setCheckpointLocation(loc)}
                    className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40"
                  >
                    {loc.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="operator" className="block text-slate-300 font-medium mb-1">
                Logistics Operator ID
              </label>
              <input
                id="operator"
                type="text"
                required
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 font-mono"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-slate-300 font-medium mb-1">
                Checkpoint Audit Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={checkpointNote}
                onChange={(e) => setCheckpointNote(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 leading-relaxed"
              />
            </div>

            {formError && (
              <p className="text-rose-400" role="alert">
                {formError}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? 'Recording Milestone...' : 'Commit Milestone Transition'}
            </Button>

            {updateSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Milestone transitioned to {targetStatus} successfully.</span>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-semibold text-white">
                Live Journey: {currentProduct.name}
              </h3>
              <p className="text-xs text-cyan-400 font-mono">{currentProduct.id}</p>
            </div>
            <Link
              href={`/verify/${currentProduct.id}`}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Public View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ShipmentTimeline milestones={currentProduct.milestones} currentStatus={currentProduct.status} />
        </div>
      </div>
    </div>
  );
}
