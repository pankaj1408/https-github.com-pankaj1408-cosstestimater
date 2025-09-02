
import React, { useState, useCallback } from 'react';
import { EC2InstanceCost } from './types';
import { fetchEC2Cost } from './services/geminiService';
import { EC2_INSTANCE_TYPES, OPERATING_SYSTEMS, EBS_VOLUME_TYPES } from './constants';
import InstanceSelector from './components/InstanceSelector';
import CostDisplay from './components/CostDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { SparklesIcon, ServerIcon, DatabaseIcon } from './components/Icons';

const App: React.FC = () => {
  const [selectedInstance, setSelectedInstance] = useState<string>(EC2_INSTANCE_TYPES[0]);
  const [operatingSystem, setOperatingSystem] = useState<string>(OPERATING_SYSTEMS[0]);
  const [ebsVolumeType, setEbsVolumeType] = useState<string>(EBS_VOLUME_TYPES[0]);
  const [ebsVolumeSize, setEbsVolumeSize] = useState<number>(100);
  const [costData, setCostData] = useState<EC2InstanceCost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchCost = useCallback(async () => {
    if (!selectedInstance) return;

    setIsLoading(true);
    setError(null);
    setCostData(null);

    try {
      const data = await fetchEC2Cost(selectedInstance, operatingSystem, ebsVolumeType, ebsVolumeSize);
      setCostData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedInstance, operatingSystem, ebsVolumeType, ebsVolumeSize]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SparklesIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              EC2 Cost Estimator
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            Instantly estimate monthly costs for AWS EC2 instances with AI.
          </p>
        </header>

        <main className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl shadow-slate-950/50 border border-slate-700 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label htmlFor="instance-type" className="block mb-2 text-sm font-medium text-slate-400">Instance Type</label>
                <InstanceSelector
                selectedInstance={selectedInstance}
                onChange={(e) => setSelectedInstance(e.target.value)}
                instanceTypes={EC2_INSTANCE_TYPES}
                disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor="os-type" className="block mb-2 text-sm font-medium text-slate-400">Operating System</label>
                 <div className="relative w-full">
                    <ServerIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                        id="os-type"
                        value={operatingSystem}
                        onChange={(e) => setOperatingSystem(e.target.value)}
                        disabled={isLoading}
                        className="w-full bg-slate-700 border border-slate-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-3 pl-10 appearance-none disabled:opacity-50"
                    >
                        {OPERATING_SYSTEMS.map((os) => (
                        <option key={os} value={os}>
                            {os}
                        </option>
                        ))}
                    </select>
                </div>
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label htmlFor="ebs-type" className="block mb-2 text-sm font-medium text-slate-400">EBS Volume Type</label>
                     <div className="relative w-full">
                        <DatabaseIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <select
                            id="ebs-type"
                            value={ebsVolumeType}
                            onChange={(e) => setEbsVolumeType(e.target.value)}
                            disabled={isLoading}
                            className="w-full bg-slate-700 border border-slate-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-3 pl-10 appearance-none disabled:opacity-50"
                        >
                            {EBS_VOLUME_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="ebs-size" className="block mb-2 text-sm font-medium text-slate-400">EBS Volume Size (GB)</label>
                    <input
                        id="ebs-size"
                        type="number"
                        value={ebsVolumeSize}
                        onChange={(e) => setEbsVolumeSize(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        disabled={isLoading}
                        min="1"
                        className="w-full bg-slate-700 border border-slate-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-3 disabled:opacity-50"
                    />
                </div>
           </div>

          <button
            onClick={handleFetchCost}
            disabled={isLoading}
            className="w-full flex-shrink-0 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
          >
            {isLoading ? 'Estimating...' : 'Get Estimate'}
          </button>
          
          <div className="mt-8 min-h-[200px] flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {costData && !isLoading && <CostDisplay costData={costData} />}
            {!isLoading && !error && !costData && (
              <div className="text-center text-slate-500">
                <p>Select your configuration and click "Get Estimate" to see the details.</p>
              </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-8">
          <p className="text-xs text-slate-600">
            Disclaimer: All cost estimates are for on-demand instances in the 'us-east-1' region and are generated by an AI model. For official pricing, please consult the official AWS pricing calculator.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
