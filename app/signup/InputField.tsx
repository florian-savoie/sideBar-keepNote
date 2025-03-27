// components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  icon: Icon,
  placeholder
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="pl-10 w-full py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

export default InputField;