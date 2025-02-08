import { searchInvestors } from "@/lib/search";

export async function SearchResults({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q;
  const results = query ? await searchInvestors(query) : [];

  return (
    <div>
      {results.length > 0 && (
        <ul className="space-y-4">
          {results.map(
            (result: { id: number; name: string; description: string }) => (
              <li key={result.id} className="border p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{result.name}</h2>
                <p>{result.description}</p>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
