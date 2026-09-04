import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { ShipmentMilestone } from '@/lib/types';
import { truncateHash } from '@/lib/crypto';

interface ShipmentTimelineProps {
  milestones: ShipmentMilestone[];
  currentStatus: string;
}

export default function ShipmentTimeline({ milestones, currentStatus }: ShipmentTimelineProps) {
  const getIcon = (status: string, completed: boolean, current: boolean) => {
    if (completed && !current) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    }
    if (current) {
      return <Truck className="w-5 h-5 text-cyan-400 animate-pulse" />;
    }
    return <Circle className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <Truck className="w-4 h-4 text-cyan-400" />
          Shipment Journey Milestones
        </h3>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Status: {currentStatus}
        </span>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-cyan-500 before:to-slate-800">
        {milestones.map((step) => (
          <div key={step.id} className="relative group">
            {/* Step Icon Node */}
            <div
              className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 transition-all ${
                step.completed
                  ? 'bg-slate-950 border-2 border-emerald-500 shadow-glow-sm shadow-emerald-500/30'
                  : step.current
                  ? 'bg-slate-950 border-2 border-cyan-400 shadow-glow-sm shadow-cyan-400/50 scale-110'
                  : 'bg-slate-900 border-2 border-slate-700'
              }`}
            >
              {getIcon(step.status, step.completed, step.current)}
            </div>

            {/* Step Card Content */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                step.current
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                  : step.completed
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                      step.completed
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : step.current
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.status}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{step.timestamp}</span>
                </div>
              </div>

              {/* Location & Operator */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{step.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{step.operator}</span>
                </div>
              </div>

              {/* Note / Log */}
              {step.note && (
                <div className="mt-3 p-2.5 rounded-lg bg-slate-950/70 border border-white/5 text-xs text-slate-300 font-mono leading-relaxed">
                  {step.note}
                </div>
              )}

              {/* Optional On-Chain Tx Hash */}
              {step.txHash && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                  <span className="text-slate-500">Tx:</span>
                  <span className="hover:underline">{truncateHash(step.txHash, 10, 8)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
