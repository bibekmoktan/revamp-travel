export default function PackageGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-[8px] overflow-hidden shadow-sm animate-pulse">
          <div className="h-64 bg-[#E3F2FD]" />
          <div className="p-6 space-y-3">
            <div className="h-3 bg-[#E3F2FD] rounded w-1/3" />
            <div className="h-4 bg-[#E3F2FD] rounded w-3/4" />
            <div className="h-3 bg-[#E3F2FD] rounded w-1/2" />
            <div className="h-10 bg-[#E3F2FD] rounded mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
