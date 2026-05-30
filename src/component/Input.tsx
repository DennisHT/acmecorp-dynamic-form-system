import { forwardRef } from "react";

type Props = {
  label?: string;
  error?: string;
  required?: boolean;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, required = false, ...rest }, ref) => {
    return (
      <>
        {label && <label>{label}{required && <span className="text-red-500">*</span>}</label>}
        <input className="border w-full" type="text" ref={ref} {...rest} required={required} />
        {error && <div>{error}</div>}
      </>
    );
  }
);
