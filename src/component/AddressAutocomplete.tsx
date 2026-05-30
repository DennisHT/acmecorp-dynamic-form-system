import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { UseFormSetValue } from "react-hook-form";
import { mapAddress } from "../utils/googleAutocompleteMap";

setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  v: "weekly",
});

type Props = { setValue: UseFormSetValue<any>; country: string };

export function AddressAutocomplete({ setValue, country }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef(country);

  // keep the ref current without re-running the main effect
  useEffect(() => { countryRef.current = country; }, [country]);

  useEffect(() => {
    let element: any;
    let cancelled = false;

    importLibrary("places").then(({ PlaceAutocompleteElement }) => {
      if (cancelled) return;
      element = new PlaceAutocompleteElement({
        componentRestrictions: { country: countryRef.current.toLowerCase() }, // "us", "au", "id"
      });
      containerRef.current?.appendChild(element);

      element.addEventListener("gmp-select", async ({ placePrediction }: any) => {
        const place = placePrediction.toPlace();
        await place.fetchFields({ fields: ["addressComponents", "formattedAddress"] });

        const mapped = mapAddress(countryRef.current, place.addressComponents ?? []);
        console.log({mapped})
        Object.entries(mapped).forEach(([key, value]) => setValue(key, value));
        setValue("address", place.formattedAddress ?? "");
      });
    });

    return () => { cancelled = true; element?.remove(); };
  }, [setValue]);

  return <div ref={containerRef} className="border" />;
}