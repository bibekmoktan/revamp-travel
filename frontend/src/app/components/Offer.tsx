import Link from "next/link";
import Image from "next/image";
import { Gem, Star, ConciergeBell, Plane } from "lucide-react";

const perks = [
  { icon: Gem,           label: "5-Star Accommodation" },
  { icon: ConciergeBell, label: "Private Guide & Butler" },
  { icon: Star,          label: "Exclusive Route Access" },
  { icon: Plane,         label: "Heli Transfers Available" },
];

const Offer = () => {

  return (
    <section className="px-6 md:px-16 py-12">
      <div className="max-w-[1320px] mx-auto space-y-8">

        {/* Banner */}
        <div className="overflow-hidden flex flex-col md:flex-row">
          {/* Left — image */}
          <div className="w-full md:w-1/2 relative min-h-[380px]">
            <Image
              src="/images/treks/bg-1.jpg"
              alt="Luxury Nepal Tour"
              fill
              className="object-cover"
            />
            <div className="absolute top-5 left-5 bg-[#B8860B] text-white text-xs font-bold px-3 py-1.5 uppercase tracking-widest">
              Luxury Collection
            </div>
          </div>

          {/* Right — content */}
          <div className="w-full md:w-1/2 bg-[#0F172A] p-10 flex flex-col justify-center">
            <p className="text-[#B8860B] text-sm font-semibold uppercase tracking-widest mb-3">
              Premium Experience
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Nepal in <span className="text-[#B8860B]">Absolute</span> <br /> Luxury
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[420px]">
              Handcrafted luxury tours with private guides, five-star lodges, and exclusive Himalayan experiences — designed for the discerning traveler.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {perks.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#B8860B]/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#B8860B]" />
                  </div>
                  <span className="text-gray-300 text-[13px]">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/luxury"
                className="px-6 py-3 bg-[#B8860B] hover:bg-[#9a7009] text-white font-semibold text-sm transition"
              >
                Explore Luxury Tours
              </Link>
              <Link
                href="/contact-us"
                className="px-6 py-3 border border-white/20 hover:border-white/50 text-white font-semibold text-sm transition"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;
