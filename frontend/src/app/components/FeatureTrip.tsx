import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '@/lib/api';

export default async function FeaturedTrips() {
  let categories: Awaited<ReturnType<typeof getCategories>>['data'] = [];
  try {
    const res = await getCategories();
    categories = res.data ?? [];
  } catch {
    // backend unavailable at build time — render empty
  }

  return (
    <section className="relative z-20 bg-[#F2FAFF] py-8 md:py-16 px-6 md:px-16">
      <div className="max-w-[1366px] mx-auto">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-[24px] md:text-[40px] font-bold text-gray-800">Activities We Offer</h2>
          <Link
            href="/packages"
            className="inline-flex items-center justify-center px-5 h-[40px] text-sm font-semibold bg-sky-700 text-white hover:bg-sky-800 transition whitespace-nowrap shrink-0"
          >
            View all
          </Link>
        </div>
        <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 pb-2 snap-x snap-mandatory md:snap-none scroll-pl-6">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category._id}
              href={`/packages/${category.slug}`}
              className="block flex-shrink-0 md:flex-shrink snap-start"
            >
              <div className="w-[220px] md:w-full bg-white rounded-[12px] overflow-hidden shadow-md group">
                <div className="relative h-[120px] w-full overflow-hidden">
                  <Image
                    src={category.image || '/images/treks/bg-1.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-all duration-600"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-[16px] font-[500] text-black mb-1 leading-tight">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-[12px] text-gray-500 leading-snug line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
