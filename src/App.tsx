
import { useState } from "react";
import { Input } from "./component/Input";
import { Select } from "./component/Select";
import { FormUSA } from "./component/FormContent/FormUSA";
import { FormAUS } from "./component/FormContent/FormAUS";
import { FormIDN } from "./component/FormContent/FormIDN";
import { useForm } from "react-hook-form";
import { AddressAutocomplete } from "./component/AddressAutocomplete";

type AcmeCorpForm = {
  country: string;
  address: string;
  [key: string]: string;
};

const onSubmit = async (data: AcmeCorpForm) => {
  const { country, address, ...fields } = data;

  const res = await fetch("/api/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country,
      fields,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Validation failed:", err.errors);
    return;
  }

  const result = await res.json();
  console.log("Saved with id:", result.id);
};

export default function App() {
  const [manualEdit, setManualEdit] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<AcmeCorpForm>();
  const selectedCountry = watch("country");

  return (
    <div className="flex items-center flex-col gap-2">
      <h1>AcmeCorp Form</h1>
      <div className="flex flex-col gap-3">
        <Select
          label="Select Country"
          options={[
            { label: "USA", value: "us" },
            { label: "AUS", value: "au" },
            { label: "IDN", value: "id" },
          ]}
          {...register("country")}
        />
        <AddressAutocomplete setValue={setValue} country={selectedCountry} />
        <button
          onClick={() => setManualEdit((edit) => !edit)}
          className="border"
        >
          Toggle Edit
        </button>
        {manualEdit && selectedCountry === "us" && <FormUSA register={register} />}
        {manualEdit && selectedCountry === "au" && <FormAUS register={register} />}
        {manualEdit && selectedCountry === "id" && <FormIDN register={register} />}
        <button onClick={handleSubmit(onSubmit, (errs) => console.log("RHF blocked submit:", errs))}>Submit</button>
      </div>
    </div>
  );
}
