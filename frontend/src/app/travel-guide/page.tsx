
export default function TravelGuidePage() {
  const destinations = [
    {
      id: 1,
      title: 'Everest Base Camp',
      location: 'Solukhumbu, Nepal',
      image:
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=1200&auto=format&fit=crop',
      days: '14 Days',
      difficulty: 'Hard',
    },
    {
      id: 2,
      title: 'Annapurna Circuit',
      location: 'Pokhara, Nepal',
      image:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
      days: '10 Days',
      difficulty: 'Medium',
    },
    {
      id: 3,
      title: 'Langtang Valley',
      location: 'Rasuwa, Nepal',
      image:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      days: '7 Days',
      difficulty: 'Easy',
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop"
          alt="Travel Guide"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm uppercase tracking-[6px] text-orange-300">
              Explore Nepal
            </p>

            <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
              Your Ultimate Travel Guide
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">
              Discover breathtaking mountains, hidden trails, local culture,
              and unforgettable adventures.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button className="rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                Explore Treks
              </button>

              <button className="rounded-full border border-white px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-black">
                View Packages
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative z-20 mx-auto -mt-16 max-w-6xl px-6">
        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <div className="grid gap-4 md:grid-cols-4">
            <input
              type="text"
              placeholder="Destination"
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            />

            <input
              type="date"
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400"
            />

            <select className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-400">
              <option>Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <button className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800">
              Search Trips
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[4px] text-orange-500">
              Top Destinations
            </p>
            <h2 className="text-4xl font-bold">Popular Travel Guides</h2>
          </div>

          <button className="hidden rounded-full border border-gray-300 px-5 py-2 text-sm font-medium transition hover:bg-black hover:text-white md:block">
            View All
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-[320px] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold">
                  {item.days}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-gray-500">{item.location}</p>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                    {item.difficulty}
                  </span>
                </div>

                <h3 className="text-2xl font-bold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Experience the beauty of Nepal with expert guides, scenic
                  mountain views, and unforgettable trekking adventures.
                </p>

                <button className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-orange-500">
                Why Choose Us
              </p>

              <h2 className="text-4xl font-bold leading-tight">
                Trusted Travel Partner For Your Adventures
              </h2>

              <p className="mt-6 text-gray-600 leading-7">
                We provide curated trekking experiences, experienced guides,
                flexible itineraries, and 24/7 support to make your journey
                smooth and memorable.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold">Expert Guides</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Local experts with years of trekking experience.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold">Custom Packages</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Personalized trips based on your travel style.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold">Affordable Pricing</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Best value packages without hidden costs.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold">24/7 Support</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Dedicated travel support throughout your journey.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[40px]">
              <img
                src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1400&auto=format&fit=crop"
                alt="Travel"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-sm uppercase tracking-[5px] text-orange-400">
            Start Your Journey
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Ready For Your Next Adventure?
          </h2>

          <p className="mt-6 text-gray-300 leading-7">
            Explore Nepal with hand-crafted trekking experiences and trusted
            local travel experts.
          </p>

          <button className="mt-10 rounded-full bg-orange-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-orange-600">
            Book Your Trip
          </button>
        </div>
      </section>
    </main>
  );
}
