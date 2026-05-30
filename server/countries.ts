export const COUNTRIES: Record<
  string,
  {
    formName: string;
    label: string;
    fields: {
      name: string;
      label: string;
      type: "text" | "select";
      required: boolean;
      options?: string[];
      pattern?: string;
    }[];
  }
> = {
  us: {
    formName: "Form USA",
    label: "United States",
    fields: [
      {
        name: "addressLine1",
        label: "Address Line 1",
        type: "text",
        required: true,
      },
      {
        name: "addressLine2",
        label: "Address Line 2",
        type: "text",
        required: false,
      },
      { name: "city", label: "City", type: "text", required: true },
      {
        name: "state",
        label: "State",
        type: "select",
        required: true,
        options: ["CA", "NY", "TX"],
      },
      {
        name: "zipCode",
        label: "ZIP Code",
        type: "text",
        required: true,
        pattern: "^\\d{5}$",
      },
    ],
  },
  au: {
    formName: "Form Australia",
    label: "Australia",
    fields: [
      {
        name: "addressLine1",
        label: "Address Line 1",
        type: "text",
        required: true,
      },
      {
        name: "addressLine2",
        label: "Address Line 2",
        type: "text",
        required: false,
      },
      { name: "suburb", label: "Suburb", type: "text", required: true },
      {
        name: "state",
        label: "State",
        type: "select",
        required: true,
        options: ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"],
      },
      {
        name: "postcode",
        label: "Postcode",
        type: "text",
        required: true,
        pattern: "^\\d{4}$",
      },
    ],
  },
  id: {
    formName: "Form Indonesia",
    label: "Indonesia",
    fields: [
      {
        name: "province",
        label: "Province",
        type: "select",
        required: true,
        options: [
          "Jakarta",
          "Jawa Barat",
          "Jawa Tengah",
          "Jawa Timur",
          "Sulawesi Selatan",
          "Sulawesi Utara",
        ],
      },
      { name: "city", label: "City", type: "text", required: true },
      { name: "district", label: "District", type: "text", required: true },
      { name: "village", label: "Village", type: "text", required: false },
      {
        name: "postalCode",
        label: "Postal Code",
        type: "text",
        required: true,
        pattern: "^\\d{5}$",
      },
      {
        name: "streetAddress",
        label: "Street Address",
        type: "text",
        required: true,
      },
    ],
  },
};
