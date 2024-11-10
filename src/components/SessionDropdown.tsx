import React, { useState } from 'react';

interface DropdownSelectProps {
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (value: string) => void;
  defaultOption?: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  onChange,
  defaultOption,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    defaultOption || ''
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="flex text-[14px] font-medium flex-col ">
      <select
        id="dropdown"
        value={selectedOption}
        onChange={handleChange}
        className="p-3 shadow min-w-[154px]  text-center rounded-lg bg-white focus:outline-orange-500 focus:outline-1"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelect;
