import { notFound } from 'next/navigation';
import { getPackageBySlug } from '@/lib/api';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `Itinerary — ${slug}` };
}

export default async function PrintItineraryPage({ params }: Props) {
  const { slug } = await params;

  let pkg;
  try {
    const res = await getPackageBySlug(slug);
    pkg = res.data;
  } catch {
    notFound();
  }

  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-[820px] mx-auto px-10 py-10">

        {/* Brand header */}
        <header className="flex items-start justify-between border-b-2 border-sky-700 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-sky-800 leading-none">Travel Nepal</h1>
            <p className="text-xs text-gray-500 mt-1">Trusted adventures since 2005</p>
          </div>
          <div className="text-right text-[11px] text-gray-500 leading-tight">
            <p>www.travelnepal.com</p>
            <p>info@travelnepal.com</p>
            <p>+977 1 4123456</p>
          </div>
        </header>

        {/* Trip title */}
        <section className="mb-6">
          <h2 className="text-[26px] font-bold leading-tight mb-2">{pkg.title}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
            <span><strong>Location:</strong> {pkg.location}</span>
            <span><strong>Duration:</strong> {pkg.duration}</span>
            {pkg.altitude && <span><strong>Max altitude:</strong> {pkg.altitude}</span>}
            {pkg.difficulty && <span><strong>Difficulty:</strong> <span className="capitalize">{pkg.difficulty}</span></span>}
            {pkg.groupSize && <span><strong>Group size:</strong> {pkg.groupSize}</span>}
          </div>
        </section>

        {/* Overview */}
        <section className="mb-6 break-inside-avoid">
          <h3 className="text-base font-bold text-sky-800 mb-1.5">Overview</h3>
          <p className="text-[13px] leading-relaxed text-gray-700">{pkg.description}</p>
        </section>

        {/* Highlights */}
        {pkg.highlights?.length > 0 && (
          <section className="mb-6 break-inside-avoid">
            <h3 className="text-base font-bold text-sky-800 mb-1.5">Highlights</h3>
            <ul className="text-[13px] leading-relaxed text-gray-700 space-y-0.5">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex gap-2"><span className="text-sky-700">•</span><span>{h}</span></li>
              ))}
            </ul>
          </section>
        )}

        {/* Day-by-day */}
        <section className="mb-6">
          <h3 className="text-base font-bold text-sky-800 mb-3">Day-by-Day Itinerary</h3>
          <div className="space-y-4">
            {pkg.itinerary.map((day) => (
              <div key={day.day} className="break-inside-avoid">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="bg-sky-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    DAY {day.day}
                  </span>
                  <h4 className="text-sm font-bold">{day.title}</h4>
                </div>
                <p className="text-[12px] leading-relaxed text-gray-700">{day.description}</p>
                {day.images && day.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {day.images.map((img, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={img.url}
                        alt={img.alt ?? `Day ${day.day} photo ${i + 1}`}
                        className="w-full h-20 object-cover rounded"
                        crossOrigin="anonymous"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Includes / Excludes */}
        <section className="mb-6 grid grid-cols-2 gap-6 break-inside-avoid">
          {pkg.includes?.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-sky-800 mb-1.5">What&apos;s Included</h3>
              <ul className="text-[12px] leading-relaxed text-gray-700 space-y-0.5">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex gap-1.5"><span className="text-green-600 font-bold">✓</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          )}
          {pkg.notIncluded && pkg.notIncluded.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-sky-800 mb-1.5">What&apos;s Not Included</h3>
              <ul className="text-[12px] leading-relaxed text-gray-700 space-y-0.5">
                {pkg.notIncluded.map((item) => (
                  <li key={item} className="flex gap-1.5"><span className="text-red-500 font-bold">✗</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-3 mt-6 text-center text-[10px] text-gray-500">
          <p>Travel Nepal • www.travelnepal.com • info@travelnepal.com • +977 1 4123456</p>
          <p className="mt-0.5">This itinerary is indicative; final program is tailored to your dates and group.</p>
        </footer>

      </div>
    </div>
  );
}
