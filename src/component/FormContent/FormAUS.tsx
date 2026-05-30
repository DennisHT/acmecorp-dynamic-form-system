import { Input } from "../Input";
import { Select } from "../Select";

const stateOptions = [
  { label: "New South Wales", value: "NSW" },
  { label: "Victoria", value: "VIC" },
  { label: "Queensland", value: "QLD" },
  { label: "Western Australia", value: "WA" },
  { label: "South Australia", value: "SA" },
  { label: "Tasmania", value: "TAS" },
  { label: "Australian Capital Territory", value: "ACT" },
  { label: "Northern Territory", value: "NT" },
];

type FormAUSProps = {
  register: any;
};

export const FormAUS = ({ register }: FormAUSProps) => {
  return (
    <div className="flex flex-col gap-3">
      <label>Form AUS</label>
      <Input label="Address Line 1" required={true} {...register("addressLine1")} />
      <Input label="Address Line 2" required={false} {...register("addressLine2")} />
      <Input label="Suburb" required={true} {...register("suburb")} />
      <Select label="Select State" options={stateOptions} {...register("state")} />
      <Input label="Postcode" required={true} {...register("postcode")} maxLength={4} />
    </div>
  );
};