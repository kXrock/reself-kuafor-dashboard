import { getServices } from "@/lib/data/services";
import { AirtableConfigError } from "@/lib/airtable";
import { PageHeader } from "@/components/ui/primitives";
import { DataError } from "@/components/ui/DataError";
import { ServicesClient } from "@/components/services/ServicesClient";

export const dynamic = "force-dynamic";

export default async function HizmetlerPage() {
  let services;
  try {
    services = await getServices();
  } catch (e) {
    return (
      <DataError
        message={
          e instanceof AirtableConfigError
            ? e.message
            : e instanceof Error
              ? e.message
              : "Hizmet verisi alınamadı."
        }
      />
    );
  }

  return (
    <div>
      <PageHeader eyebrow="Hizmet kataloğu" title="Hizmetler" />
      <ServicesClient
        services={services.map((s) => ({
          id: s.id,
          name: s.name,
          durationMin: s.durationMin,
          price: s.price,
          category: s.category,
        }))}
      />
    </div>
  );
}
