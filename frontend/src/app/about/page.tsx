"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Users,
  Mountain,
  Globe,
} from "lucide-react";

const teamMembers = [
  {
    name: "Bibek Moktan",
    role: "Founder & Trek Leader",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    description:
      "Passionate about creating unforgettable Himalayan adventures.",
  },
  {
    name: "Suman Gurung",
    role: "Adventure Guide",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
    description:
      "Expert trekking guide with deep knowledge of Nepal trails.",
  },
  {
    name: "Nima Sherpa",
    role: "Mountain Expert",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    description:
      "Helping travelers explore the Himalayas safely and confidently.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop",
    feedback:
      "The Everest Base Camp trek was the best experience of my life. Amazing guides and perfect organization.",
  },
  {
    name: "Daniel Lee",
    country: "Singapore",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=1200&auto=format&fit=crop",
    feedback:
      "Professional team, breathtaking landscapes, and unforgettable memories.",
  },
];

const articles = [
  {
    title: "Top 10 Treks in Nepal",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    description:
      "Discover the most iconic trekking destinations across Nepal.",
  },
  {
    title: "Essential Gear for Himalayan Treks",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1200&auto=format&fit=crop",
    description:
      "Everything you need before starting your mountain adventure.",
  },
  {
    title: "Best Time to Visit Nepal",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop",
    description:
      "Learn the ideal seasons for trekking and cultural experiences.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-800 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2400&auto=format&fit=crop"
          alt="Nepal Mountains"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-5xl px-6 text-center text-white">
          <p className="uppercase tracking-[5px] text-sm mb-4 text-slate-200">
            Explore Nepal
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Discover The Heart Of The Himalayas
          </h1>

          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto mb-8">
            Experience unforgettable trekking journeys, cultural adventures,
            and breathtaking mountain landscapes across Nepal.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/treks"
              className="bg-white text-black px-7 py-4 rounded-full font-medium hover:scale-105 transition duration-300"
            >
              Explore Treks
            </Link>

            <Link
              href="/contact"
              className="border border-white px-7 py-4 rounded-full font-medium hover:bg-white hover:text-black transition duration-300"
            >
              Book Your Adventure
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
              alt="Trekking"
              width={700}
              height={900}
              className="rounded-3xl object-cover shadow-2xl"
            />

            <div className="absolute -bottom-8 -right-8 bg-white shadow-xl rounded-2xl p-6 w-64">
              <div className="flex items-center gap-3 mb-3">
                <Mountain className="text-sky-600" />
                <h3 className="font-semibold">10+ Years Experience</h3>
              </div>

              <p className="text-sm text-slate-600">
                Guiding adventurers through Nepal’s most iconic trekking routes.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sky-600 uppercase tracking-[4px] text-sm mb-4">
              About Us
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Creating Meaningful Himalayan Adventures
            </h2>

            <div className="space-y-6 text-slate-600 leading-8">
              <p>
                We are a passionate trekking and travel company dedicated to
                showcasing the beauty, culture, and spirit of Nepal. From
                high-altitude Himalayan expeditions to peaceful cultural tours,
                we craft experiences that connect travelers with nature and
                local communities.
              </p>

              <p>
                Our journey started with a mission to make authentic adventure
                travel accessible while promoting responsible tourism and local
                employment. Every trek is designed with safety, comfort, and
                unforgettable memories in mind.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              <div className="p-6 rounded-2xl bg-slate-50">
                <Users className="mb-4 text-sky-600" />
                <h3 className="font-semibold mb-2">Our Story</h3>
                <p className="text-sm text-slate-600">
                  Started by passionate trekkers who wanted to share Nepal’s
                  beauty with the world.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50">
                <Mountain className="mb-4 text-sky-600" />
                <h3 className="font-semibold mb-2">Our Mission</h3>
                <p className="text-sm text-slate-600">
                  Deliver safe, authentic, and unforgettable trekking
                  experiences.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50">
                <Globe className="mb-4 text-sky-600" />
                <h3 className="font-semibold mb-2">Our Vision</h3>
                <p className="text-sm text-slate-600">
                  Become Nepal’s most trusted adventure travel platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[4px] text-sm text-sky-600 mb-4">
              Meet Our Team
            </p>

            <h2 className="text-4xl font-bold">
              The People Behind The Adventure
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-500"
              >
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">
                    {member.name}
                  </h3>

                  <p className="text-sky-600 mb-4">{member.role}</p>

                  <p className="text-slate-600 leading-7 text-sm">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[4px] text-sm text-sky-600 mb-4">
              Testimonials
            </p>

            <h2 className="text-4xl font-bold">
              What Our Clients Say About Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-3xl p-8 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-slate-500">
                      {testimonial.country}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-slate-600 leading-8">
                  {testimonial.feedback}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <p className="uppercase tracking-[4px] text-sm text-sky-600 mb-4">
                Latest Articles
              </p>

              <h2 className="text-4xl font-bold">
                Read Our Travel Stories
              </h2>
            </div>

            <Link
              href="/blog"
              className="flex items-center gap-2 font-medium hover:gap-4 transition-all"
            >
              View All Articles <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-500"
              >
                <div className="relative h-64">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">
                    {article.title}
                  </h3>

                  <p className="text-slate-600 leading-7 mb-6">
                    {article.description}
                  </p>

                  <button className="flex items-center gap-2 font-medium text-sky-600 hover:gap-4 transition-all">
                    Read More <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative py-32 px-6">
        <Image
          src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2400&auto=format&fit=crop"
          alt="CTA Banner"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <p className="uppercase tracking-[4px] text-sm mb-4 text-slate-300">
            Start Your Journey
          </p>

          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Ready For Your Next Himalayan Adventure?
          </h2>

          <p className="text-lg text-slate-200 mb-10 leading-8">
            Explore breathtaking trekking trails, rich culture, and unforgettable
            mountain experiences with our expert team.
          </p>

          <Link
            href="/contact"
            className="bg-white text-black px-8 py-4 rounded-full font-medium hover:scale-105 transition duration-300 inline-block"
          >
            Book Your Trip Now
          </Link>
        </div>
      </section>
    </main>
  );
}