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
        <div className="mb-8 text-center">
          <h2 className="text-[24px] md:text-[40px] font-bold text-gray-800 mb-2">Activities We Offer</h2>
          <p className="text-gray-800 text-[14px] md:text-[16px] max-w-[480px] mx-auto">
            Discover Nepal your way from high-altitude treks and cultural tours to thrilling helicopter rides.
          </p>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-6 px-6 md:-mx-16 md:px-16 pb-2 snap-x snap-mandatory scroll-pl-6 md:scroll-pl-16">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/packages/${category.slug}`}
              className="block flex-shrink-0 snap-start"
            >
              <div className="w-[220px] md:w-[250px] bg-white rounded-[0px] overflow-hidden shadow-md group">
                <div className="relative h-[120px] w-full overflow-hidden">
                  <Image
                    src={category.image || '/images/treks/bg-1.jpg'}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-all duration-600"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-[16px] font-[500] text-black mb-1 leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
