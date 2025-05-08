import React from "react";

const destinations = [
  { title: "Cruises", image: "/images/home/top1.svg" },
  { title: "Beach Tours", image: "/images/home/top2.svg" },
  { title: "City Tours", image: "/images/home/top3.svg" },
  { title: "Museum Tour", image: "/images/home/top4.svg" },
  { title: "Food", image: "/images/home/top5.svg" },
  { title: "Hiking", image: "/images/home/top6.svg" },
];

const TrendingDestinations = () => {
  return (
    <section className="px-6 py-10">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending Destinations</h2>
          <a href="#" className="text-sm text-blaxk-600 px-4">See all</a>
        </div>

        {/* Layout Grid */}
        <div className="flex gap-4">
          {/* Left Column (2/3 width) */}
          <div className="w-2/3 h-[500px] flex flex-col gap-4">
            {/* Top Row */}
            <div className="flex gap-4 h-1/2">
              {/* Box 1 - Cruises */}
              <div className="w-1/3 relative overflow-hidden rounded-xl">
                <img
                  src={destinations[0].image}
                  alt={destinations[0].title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute bottom-3 left-3 text-white font-semibold drop-shadow">{destinations[0].title}</div>
              </div>

              {/* Box 2 - Beach Tours */}
              <div className="w-2/3 relative overflow-hidden rounded-xl">
                <img
                  src={destinations[1].image}
                  alt={destinations[1].title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute bottom-3 left-3 text-white font-semibold drop-shadow">{destinations[1].title}</div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex gap-4 h-1/2">
              {/* Box 3 - Museum Tour */}
              <div className="w-1/3 relative overflow-hidden rounded-xl">
                <img
                  src={destinations[3].image}
                  alt={destinations[3].title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute bottom-3 left-3 text-white font-semibold drop-shadow">{destinations[3].title}</div>
              </div>

              {/* Nested Box 4 & 5 */}
              <div className="w-2/3 flex gap-4">
                {/* Box 4 - Food */}
                <div className="w-1/3 relative overflow-hidden rounded-xl">
                  <img
                    src={destinations[4].image}
                    alt={destinations[4].title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 text-white font-semibold drop-shadow">{destinations[4].title}</div>
                </div>

                {/* Box 5 - Hiking */}
                <div className="w-2/3 relative overflow-hidden rounded-xl">
                  <img
                    src={destinations[5].image}
                    alt={destinations[5].title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute bottom-3 left-3 text-white font-semibold drop-shadow">{destinations[5].title}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - City Tours */}
          <div className="w-1/3 h-[515px] relative overflow-hidden rounded-xl">
            <img
              src={destinations[2].image}
              alt={destinations[2].title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute bottom-3 left-3 text-white font-semibold drop-shadow">{destinations[2].title}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingDestinations;
