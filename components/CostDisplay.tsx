
import React from 'react';
import { EC2InstanceCost } from '../types';
import { CpuChipIcon, MemoryStickIcon, ServerIcon, DatabaseIcon } from './Icons';

interface CostDisplayProps {
  costData: EC2InstanceCost;
}

const CostDisplay: React.FC<CostDisplayProps> = ({ costData }) => {
  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cost);
  };

  const SpecItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number;}> = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg text-sm">
        {icon}
        <span className="text-slate-400">{label}:</span>
        <span className="font-semibold text-white">{value}</span>
    </div>
  );

  const CostItem: React.FC<{ label: string; value: number; isSubItem?: boolean }> = ({ label, value, isSubItem = false }) => (
    <div className={`flex justify-between items-center py-3 ${isSubItem ? 'pl-4' : ''}`}>
        <p className={isSubItem ? 'text-slate-400' : 'text-slate-300'}>{label}</p>
        <p className={`font-mono ${isSubItem ? 'text-slate-400' : 'text-slate-300'}`}>{formatCost(value)}</p>
    </div>
  );


  return (
    <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 animate-fade-in border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
        {costData.instanceType}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <SpecItem icon={<CpuChipIcon className="w-5 h-5 text-purple-400"/>} label="vCPU" value={costData.vcpu} />
        <SpecItem icon={<MemoryStickIcon className="w-5 h-5 text-green-400"/>} label="Memory" value={`${costData.memory} GiB`} />
        <SpecItem icon={<ServerIcon className="w-5 h-5 text-blue-400"/>} label="OS" value={costData.operatingSystem} />
        <SpecItem icon={<DatabaseIcon className="w-5 h-5 text-orange-400"/>} label="EBS" value={`${costData.ebsVolumeSizeGB}GB ${costData.ebsVolumeType}`} />
      </div>
      
      <div className="space-y-1 border-t border-b border-slate-700 py-2">
        <h3 className="text-lg font-semibold text-slate-200 mb-2">Cost Breakdown</h3>
        <CostItem label="EC2 Instance" value={costData.instanceCostUSD} />
        <CostItem label="Operating System" value={costData.osCostUSD} />
        <CostItem label="EBS Volume" value={costData.ebsCostUSD} />
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-cyan-500/50">
        <p className="text-xl font-bold text-slate-100">Total Estimated Monthly Cost</p>
        <p className="text-2xl font-bold text-yellow-400">{formatCost(costData.totalMonthlyCostUSD)}</p>
      </div>

       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CostDisplay;
