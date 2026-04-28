import Link from "next/link";
import Image from "next/image";

const regions = [
  {
    name: "Nepal",
    trips: 84,
    image: "/images/treks/bg-1.jpg",
    href: "/destinations/everest-region",
  },
  {
    name: "Bhutan",
    trips: 20,
    image: "/images/treks/bg-2.jpg",
    href: "/destinations/annapurna-region",
  },
  {
    name: "Tibet",
    trips: 8,
    image: "/images/treks/bg-1.jpg",
    href: "/destinations/langtang-region",
  },
];

export default function PopularTrips() {
  return (
    <section className="px-6 md:px-16 py-12">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center gap-10">

        {/* Left — text */}
        <div className="w-full md:w-[240px] shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3">
            Journey to the <br /> Himalayan Lands
          </h2>
          <div className="w-10 h-0.5 bg-[#F59E0B] mb-4" />
          <p className="text-gray-500 text-sm leading-relaxed">
            Unveiling Hidden Wonders: Nepal, Bhutan, Tibet, and Beyond — Inspire Your Journey!
          </p>
        </div>

        {/* Right — destination cards */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          {regions.map((region) => (
            <Link
              key={region.name}
              href={region.href}
              className="group relative overflow-hidden rounded-2xl h-[280px] block"
            >
              <Image
                src={region.image}
                alt={region.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

              {/* Trip count badge */}
              <div className="absolute top-4 left-4 bg-[#F59E0B] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                {region.trips} Trips
              </div>

              {/* Country name */}
              <div className="absolute bottom-5 left-5">
                <p className="text-white text-2xl font-bold drop-shadow-md">{region.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
