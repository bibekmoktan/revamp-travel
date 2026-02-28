import Image from 'next/image';

const attractions = [
  {
    name: 'Colosseum',
    image: '/images/home/link1.svg',
  },
  {
    name: 'Eiffel Tower',
    image: '/images/home/link2.svg',
  },
  {
    name: 'Stonehenge',
    image: '/images/home/link3.svg',
  },
  {
    name: 'Statue of Liberty',
    image: '/images/home/link4.svg',
  },
  {
    name: 'Tower of London',
    image: '/images/home/link5.svg',
  },
  {
    name: 'Antelope Canyon',
    image: '/images/home/link6.svg',
  },
  {
    name: 'Vatican Museums',
    image: '/images/home/link7.svg',
  },
  {
    name: 'National September 11 Memorial',
    image: '/images/home/link1.svg',
  },
  {
    name: 'Louvre',
    image: '/images/home/link2.svg',
  },
];

export default function TopAttractions() {
  return (
    <section className="py-10 px-4 max-w-[1320px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Top Attractions</h2>
        <a href="#" className="text-sm text-gray-500 hover:underline">See all</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-10">
        {attractions.map((attraction) => (
          <div key={attraction.name} className="flex items-center gap-4">
            <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={attraction.image}
                alt={attraction.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{attraction.name}</h3>
              <p className="text-xs text-gray-500">100+ Tours</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
