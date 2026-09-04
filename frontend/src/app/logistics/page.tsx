'use client';

import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Package,
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/lib/mockData';
import { ShipmentMilestoneStatus } from '@/lib/types';
import ShipmentTimeline from '@/components/timeline/ShipmentTimeline';

export default function LogisticsPortalPage() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState('PR-8829-X');

  // Milestone transition inputs
  const [targetStatus, setTargetStatus] = useState<ShipmentMilestoneStatus>('DELIVERED');
  const [checkpointLocation, setCheckpointLocation] = useState('John F. Kennedy Cargo Hub, New York, USA');
  const [operatorId, setOperatorId] = useState('JFK Port Logistics Inspector #882');
  const [checkpointNote, setCheckpointNote] = useState('Customs inspection passed. Cold-chain seal intact at -20°C. Batch accepted.');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const currentProduct = products[selectedProductId];

  const handleUpdateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateSuccess(false);

    setTimeout(() => {
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
      }));

      const updatedProduct = {
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
      setTimeout(() => setUpdateSuccess(false), 3500);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Update Form */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Package className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-white">Record Checkpoint Event</h2>
          </div>

          <form onSubmit={handleUpdateMilestone} className="space-y-4 text-xs">
            {/* Select product */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Select Active Shipment</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                {Object.values(products).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} — {p.name.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Current Status Pill */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Status:</span>
              <span className="font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                {currentProduct.status}
              </span>
            </div>

            {/* Target Status Selection */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">New Milestone Status</label>
              <div className="grid grid-cols-3 gap-2">
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

            {/* Location */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Checkpoint Location</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={checkpointLocation}
                  onChange={(e) => setCheckpointLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                />
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Operator Signature */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Logistics Operator ID</label>
              <input
                type="text"
                required
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Inspector Notes */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">Checkpoint Audit Notes</label>
              <textarea
                rows={3}
                value={checkpointNote}
                onChange={(e) => setCheckpointNote(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isUpdating ? 'Recording Milestone...' : 'Commit Milestone Transition'}
            </button>

            {updateSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Milestone transitioned to {targetStatus} successfully!</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Col: Live Timeline Preview */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-semibold text-white">
                Live Journey: {currentProduct.name}
              </h3>
              <p className="text-xs text-cyan-400 font-mono">{currentProduct.id}</p>
            </div>
            <a
              href={`/verify/${currentProduct.id}`}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <span>Public View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <ShipmentTimeline milestones={currentProduct.milestones} currentStatus={currentProduct.status} />
        </div>
      </div>
    </div>
  );
}
