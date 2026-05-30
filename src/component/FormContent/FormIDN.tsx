import { Input } from "../Input";
import { Select } from "../Select";

const provinceOptions = [
  { label: "Jakarta", value: "Jakarta" },
  { label: "Jawa Barat", value: "Jawa Barat" },
  { label: "Jawa Tengah", value: "Jawa Tengah" },
  { label: "Jawa Timur", value: "Jawa Timur" },
  { label: "Sulawesi Selatan", value: "Sulawesi Selatan" },
  { label: "Sulawesi Utara", value: "Sulawesi Utara" },
];

type FormIDNProps = {
  register: any;
};

export const FormIDN = ({ register }: FormIDNProps) => {
  return (
    <div className="flex flex-col gap-3">
      <label>Form IDN</label>
      <Select label="Select Province" options={provinceOptions} {...register("province")} />
      <Input label="City / Regency" required={true} {...register("city")} />
      <Input label="District" required={true} {...register("district")} />
      <Input label="Village" required={false} {...register("village")} />
      <Input label="Postal Code" required={true} {...register("postalCode")} maxLength={5} />
      <Input label="Street Address" required={true} {...register("streetAddress")} />
    </div>
  );
};