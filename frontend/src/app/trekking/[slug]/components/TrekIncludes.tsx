export default function TrekIncludes({ includes }: { includes: string[] }) {
  if (!includes.length) return null;
  return (
    <div className="bg-green-50 rounded-2xl p-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s Included</h2>
      <div className="grid grid-cols-1 gap-0.5">
        {includes.map((item) => (
          <div key={item} className="flex items-center gap-2 px-4 py-1">
            <span className="text-green-600 font-bold shrink-0">✓</span>
            <span className="text-gray-700 text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
