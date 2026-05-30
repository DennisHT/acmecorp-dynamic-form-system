import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { UseFormSetValue } from "react-hook-form";
import { mapAddress } from "../utils/googleAutocompleteMap";

setOptions({
  key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  v: "weekly",
});

type Props = { setValue: UseFormSetValue<any>; country: string };
type Prediction = { placeId: string; text: string; prediction: any };

export function AddressAutocomplete({ setValue, country }: Props) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);

  const placesLib = useRef<any>(null);
  // One session token groups all keystrokes + the final selection into a single
  // billing session. Reset after each pick so the next search starts fresh.
  const sessionToken = useRef<any>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  // Set when a suggestion is picked so the resulting input change doesn't re-search.
  const skipNextSearch = useRef(false);

  // Load the Places library once and open the first session.
  useEffect(() => {
    let cancelled = false;
    importLibrary("places").then((lib: any) => {
      if (cancelled) return;
      placesLib.current = lib;
      sessionToken.current = new lib.AutocompleteSessionToken();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Reset the field when the country changes.
  useEffect(() => {
    setInput("");
    setSuggestions([]);
    setOpen(false);
  }, [country]);

  // Debounced, min-length suggestion fetch — this is what controls request volume.
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);

    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    if (input.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounce.current = setTimeout(async () => {
      const lib = placesLib.current;
      if (!lib) return;

      const { suggestions: results } =
        await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          includedRegionCodes: [country.toLowerCase()],
          sessionToken: sessionToken.current,
        });

      const preds: Prediction[] = (results ?? [])
        .map((s: any) => s.placePrediction)
        .filter(Boolean)
        .map((p: any) => ({
          placeId: p.placeId,
          text: p.text?.text ?? "",
          prediction: p,
        }));

      setSuggestions(preds);
      setOpen(true);
    }, 300);

    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [input, country]);

  // Clean up the blur timer on unmount.
  useEffect(() => {
    return () => {
      if (blurTimeout.current) clearTimeout(blurTimeout.current);
    };
  }, []);

  async function choose(pred: Prediction) {
    skipNextSearch.current = true;
    setInput(pred.text);
    setSuggestions([]);
    setOpen(false);

    const place = pred.prediction.toPlace();
    await place.fetchFields({
      fields: ["addressComponents", "formattedAddress"],
    });

    const mapped = mapAddress(country, place.addressComponents ?? []);
    Object.entries(mapped).forEach(([key, value]) =>
      setValue(key, value as string),
    );
    setValue("address", place.formattedAddress ?? "");

    // The Place Details fetch closes the billing session — start a new one.
    const lib = placesLib.current;
    if (lib) sessionToken.current = new lib.AutocompleteSessionToken();
  }

  return (
    <div className="relative">
      <input
        className="border px-2 py-1 w-full"
        value={input}
        placeholder="Start typing an address…"
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => {
          if (blurTimeout.current) clearTimeout(blurTimeout.current);
          if (suggestions.length > 0) setOpen(true);
        }}
        onBlur={() => {
          // Delay so a click on a suggestion lands before the list closes.
          blurTimeout.current = setTimeout(() => setOpen(false), 150);
        }}
      />

      {open && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full max-h-72 divide-y divide-gray-100 overflow-auto rounded-md border bg-white shadow-lg">
          {suggestions.map((s) => (
            <li key={s.placeId}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm leading-snug hover:bg-gray-100"
                onClick={() => choose(s)}
              >
                {s.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
