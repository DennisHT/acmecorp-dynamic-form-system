type ByType = Record<string, { long: string; short: string }>;

function buildByType(components: any[]): ByType {
  const byType: ByType = {};
  components?.forEach((c) => {
    c.types.forEach((t: string) => {
      byType[t] = { long: c.longText, short: c.shortText };
    });
  });
  return byType;
}

export function mapAddress(country: string, components: any[]): Record<string, string> {
  const t = buildByType(components);
  const streetAddress = [t.street_number?.long, t.route?.long].filter(Boolean).join(" ");
  console.log({t});
  switch (country) {
    case "us":
      return {
        addressLine1: streetAddress,
        city: t.locality?.long ?? "",
        state: t.administrative_area_level_1?.short ?? "", // "CA"
        zipCode: t.postal_code?.long ?? "",
      };
    case "au":
      return {
        addressLine1: streetAddress,
        suburb: t.locality?.long ?? "",
        state: t.administrative_area_level_1?.short ?? "", // "NSW"
        postcode: t.postal_code?.long ?? "",
      };
    case "id":
      return {
        streetAddress,
        province: t.administrative_area_level_1?.long ?? "",
        city: t.administrative_area_level_2?.long ?? "",
        district: t.administrative_area_level_3?.long ?? "",
        village: t.administrative_area_level_4?.long ?? "",
        postalCode: t.postal_code?.long ?? "",
      };
    default:
      return {};
  }
}