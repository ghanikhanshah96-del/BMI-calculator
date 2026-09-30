type Schema = { "@type": string } & Record<string, unknown>;

/** Renders each schema as its own typed JSON-LD block (validators reject top-level @graph without @type). */
export default function JsonLd({ items }: { items: Schema[] }) {
  return (
    <>
      {items.map((item) => (
        <script
          key={`${item["@type"]}-${String(item["@id"] ?? "")}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...item }) }}
        />
      ))}
    </>
  );
}
