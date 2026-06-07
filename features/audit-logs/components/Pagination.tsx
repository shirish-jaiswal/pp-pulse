export default function Pagination({ page, setPage, totalPages }: any) {
  return (
    <div className="flex justify-between px-4 py-2 text-sm text-gray-500 border-t">
      <span>Page {page} / {totalPages}</span>

      <div className="flex gap-2">
        <button onClick={() => setPage((p: number) => Math.max(p - 1, 1))}>
          Prev
        </button>
        <button onClick={() => setPage((p: number) => Math.min(p + 1, totalPages))}>
          Next
        </button>
      </div>
    </div>
  );
}