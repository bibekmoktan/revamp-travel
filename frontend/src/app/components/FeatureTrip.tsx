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
    <section className="relative z-20 bg-sky-50 py-8 md:py-16 px-6 md:px-16 md:mt-[-150px]">
      <div className="max-w-[1366px] mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activities We Offer</h2>
          <p className="text-gray-500 text-sm max-w-[480px] mx-auto">
            From high-altitude treks to cultural tours and thrilling heli rides — explore Nepal your way.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/packages/${category.slug}`}
              className="block flex-shrink-0"
            >
              <div className="w-full max-w-[250px] max-h-[200px] bg-white rounded-[0px] overflow-hidden shadow-md group">
                <div className="relative min-h-[120px] w-full overflow-hidden">
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
