import { forwardRef } from "react";

type Props = {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
};

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, error, options, ...rest }, ref) => {
    return (
      <>
        {label && <label>{label}</label>}
        <select className="border" ref={ref} {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <div>{error}</div>}
      </>
    );
  }
);
