
import React from 'react';

interface InstanceSelectorProps {
  selectedInstance: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  instanceTypes: string[];
  disabled: boolean;
}

const InstanceSelector: React.FC<InstanceSelectorProps> = ({
  selectedInstance,
  onChange,
  instanceTypes,
  disabled,
}) => {
  return (
    <div className="relative w-full">
      <select
        value={selectedInstance}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-slate-700 border border-slate-600 text-white text-md rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-3 appearance-none disabled:opacity-50"
      >
        {instanceTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default InstanceSelector;
