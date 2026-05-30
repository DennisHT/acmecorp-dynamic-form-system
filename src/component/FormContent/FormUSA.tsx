import { Input } from "../Input";
import { Select } from "../Select";

const stateOptions = [
  { label: "California", value: "CA" },
  { label: "New York", value: "NY" },
  { label: "Texas", value: "TX" },
];

type FormUSAProps = {
  register: any;
};

export const FormUSA = ({ register }: FormUSAProps) => {
  return (
    <div className="flex flex-col gap-3">
      <label>Form USA</label>
      <Input label="Address Line 1" required={true} {...register("addressLine1")} />
      <Input label="Address Line 2" required={false} {...register("addressLine2")} />
      <Input label="City" required={true} {...register("city")} />
      <Select label="Select State" options={stateOptions} {...register("state")} />
      <Input label="ZIP Code" required={true} {...register("zipCode")} maxLength={5} />
    </div>
  );
};