export default function SearchBar({ search, setSearch }: any) {
  return (
    <input
      placeholder="Search logs..."
      className="border px-3 py-2 rounded-md w-full text-sm mb-4"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}