export default function AboutPage() {
  const stats = [
    {
      number: '10+',
      label: 'Years Experience',
    },
    {
      number: '15K+',
      label: 'Happy Travelers',
    },
    {
      number: '120+',
      label: 'Adventure Packages',
    },
    {
      number: '24/7',
      label: 'Customer Support',
    },
  ];

  const team = [
    {
      id: 1,
      name: 'Bibek Moktan',
      role: 'Founder & Trek Guide',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Sanjay Sherpa',
      role: 'Mountain Expert',
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Nima Tamang',
      role: 'Travel Consultant',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop"
          alt="About Us"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm uppercase tracking-[6px] text-orange-300">
              About Our Journey
            </p>

            <h1 className="text-5xl font-bold text-white md:text-7xl">
              Explore The World With Us
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-200">
              We create unforgettable trekking and travel experiences across
              Nepal with passion, safety, and local expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-[40px]">
            <img
              src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1400&auto=format&fit=crop"
              alt="Travel Story"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[5px] text-orange-500">
              Who We Are
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              Passionate About Adventure & Travel
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              We are a dedicated travel and trekking company focused on
              delivering authentic experiences in Nepal. From the Himalayas to
              hidden villages, our mission is to connect travelers with nature,
              culture, and adventure.
            </p>

            <p className="mt-6 leading-8 text-gray-600">
              Our expert guides, carefully designed itineraries, and commitment
              to safety ensure every journey becomes a lifetime memory.
            </p>

            <button className="mt-10 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-orange-500">
              Discover More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl bg-white p-10 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <h3 className="text-5xl font-bold text-orange-500">
                  {item.number}
                </h3>

                <p className="mt-4 text-lg font-medium text-gray-700">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-[32px] bg-black p-10 text-white">
            <p className="mb-3 text-sm uppercase tracking-[5px] text-orange-400">
              Our Mission
            </p>

            <h2 className="text-4xl font-bold">
              Inspiring Travelers Through Authentic Experiences
            </h2>

            <p className="mt-6 leading-8 text-gray-300">
              Our mission is to make adventure travel accessible, safe, and
              meaningful while supporting local communities and sustainable
              tourism.
            </p>
          </div>

          <div className="rounded-[32px] bg-orange-500 p-10 text-white">
            <p className="mb-3 text-sm uppercase tracking-[5px] text-orange-100">
              Our Vision
            </p>

            <h2 className="text-4xl font-bold">
              Becoming Nepal’s Most Trusted Travel Brand
            </h2>

            <p className="mt-6 leading-8 text-orange-50">
              We envision creating world-class trekking and travel experiences
              that inspire people to explore the beauty of Nepal and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[5px] text-orange-500">
              Meet Our Team
            </p>

            <h2 className="text-4xl font-bold md:text-5xl">
              Expert Guides & Travel Specialists
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.id}
                className="group overflow-hidden rounded-[32px] bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-[420px] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold">{member.name}</h3>

                  <p className="mt-2 text-orange-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-sm uppercase tracking-[5px] text-orange-400">
            Start Your Adventure
          </p>

          <h2 className="text-4xl font-bold md:text-6xl">
            Let’s Explore Nepal Together
          </h2>

          <p className="mt-6 leading-8 text-gray-300">
            Join thousands of travelers who trusted us to create unforgettable
            trekking and travel memories.
          </p>

          <button className="mt-10 rounded-full bg-orange-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-orange-600">
            Contact Us
          </button>
        </div>
      </section>
    </main>
  );
}
