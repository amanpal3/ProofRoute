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
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
    if (current) {
      return <Truck className="w-4 h-4 text-zinc-100" />;
    }
    return <Circle className="w-3.5 h-3.5 text-zinc-600" />;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-zinc-400" />
          Shipment Journey Milestones
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-300">
          Status: {currentStatus}
        </span>
      </div>

      <div className="relative pl-5 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
        {milestones.map((step) => (
          <div key={step.id} className="relative group">
            {/* Step Icon Node */}
            <div
              className={`absolute -left-5 top-1 w-5 h-5 rounded-full flex items-center justify-center -translate-x-1/2 transition-all ${
                step.completed
                  ? 'bg-zinc-950 border border-emerald-500/50'
                  : step.current
                  ? 'bg-zinc-950 border border-white'
                  : 'bg-zinc-900 border border-zinc-700'
              }`}
            >
              {getIcon(step.status, step.completed, step.current)}
            </div>

            {/* Step Card Content */}
            <div
              className={`p-4 rounded-lg border transition-all ${
                step.current
                  ? 'bg-zinc-900/90 border-zinc-700 shadow-sm'
                  : step.completed
                  ? 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                  : 'bg-zinc-950/30 border-zinc-900 opacity-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-medium ${
                      step.completed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : step.current
                        ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    {step.status}
                  </span>
                  <h4 className="text-xs font-semibold text-white">{step.title}</h4>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{step.timestamp}</span>
                </div>
              </div>

              {/* Location & Operator */}
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                  <span className="truncate">{step.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                  <ShieldCheck className="w-3 h-3 text-zinc-500 shrink-0" />
                  <span className="truncate">{step.operator}</span>
                </div>
              </div>

              {/* Note / Log */}
              {step.note && (
                <div className="mt-2.5 p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 font-mono leading-relaxed">
                  {step.note}
                </div>
              )}

              {/* Optional On-Chain Tx Hash */}
              {step.txHash && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  <span className="text-zinc-600">Tx:</span>
                  <span>{truncateHash(step.txHash, 10, 8)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
