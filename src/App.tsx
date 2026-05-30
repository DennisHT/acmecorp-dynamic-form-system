import { useEffect, useState } from "react";
import { Input } from "./component/Input";
import { Select } from "./component/Select";
import { useForm } from "react-hook-form";
import { AddressAutocomplete } from "./component/AddressAutocomplete";

type AcmeCorpForm = {
  country: string;
  address: string;
  [key: string]: string;
};

type CountryField = {
  name: string;
  label: string;
  type: "text" | "select";
  required: boolean;
  options?: string[];
};

type CountrySchema = {
  formName: string;
  label: string;
  fields: CountryField[];
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
  const { register, handleSubmit, watch, setValue } = useForm<AcmeCorpForm>({
    shouldUnregister: true,
    defaultValues: { country: "us" },
  });
  const selectedCountry = watch("country");
  const [schema, setSchema] = useState<CountrySchema | null>(null);
  const [countryList, setCountryList] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((list) => {
        setCountryList(list);

        if (!list.find((c: any) => c.value === selectedCountry)) {
          setValue("country", list[0].value);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`/api/countries/${selectedCountry}`)
      .then((r) => r.json())
      .then(setSchema)
      .catch(console.error);
  }, [selectedCountry]);

  return (
    <div className="flex items-center flex-col gap-2" style={{ padding: 20 }}>
      <h1>AcmeCorp Form</h1>
      <div className="flex flex-col gap-3">
        <Select
          label="Select Country"
          options={
            countryList.length > 0
              ? countryList
              : [{ label: "Loading...", value: "" }]
          }
          {...register("country")}
        />
        <AddressAutocomplete setValue={setValue} country={selectedCountry} />
        <button
          onClick={() => setManualEdit((edit) => !edit)}
          className="border"
        >
          Toggle Edit
        </button>
        {manualEdit && schema && (
          <>
            <h2>{schema.formName}</h2>
            {schema.fields.map((field) => {
              if (field.type === "select") {
                return (
                  <Select
                    key={field.name}
                    label={field.label}
                    options={
                      field.options?.map((o) => ({
                        label: o,
                        value: o,
                      })) ?? []
                    }
                    {...register(field.name)}
                  />
                );
              }

              return (
                <Input
                  key={field.name}
                  label={field.label}
                  {...register(field.name)}
                />
              );
            })}
          </>
        )}
        <button
          className="border bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSubmit(onSubmit, (errs) =>
            console.log("RHF blocked submit:", errs),
          )}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
