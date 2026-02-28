'use client';

import Image from "next/image";
import hero from "../../../public/images/home/hero.svg";

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/images/home/bg-hero.mp4" type="video/mp4" />
        {/* Fallback image if video fails to load */}
        <Image
          src={hero}
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </video>

      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Content */}
      <div className="absolute z-20 inset-0 flex flex-col justify-start top-[200px] items-center text-white text-center px-4">
        <p className="text-sm md:text-base mb-2">
          Search, compare and book 150,000+ worldwide tours all over the world
        </p>
        <h2 className="text-3xl md:text-5xl font-bold">
          Tours and Trip packages,
          <br />
          Globally
        </h2>
        <div className=" w-full max-w-[500px] px-4 z-40 mt-8">
        <div className="bg-white rounded-full shadow-md flex items-center gap-2 px-4 py-2 text-black w-full">
          <input
            type="text"
            placeholder="Search for a destination"
            className="flex-1 px-4 py-2 outline-none rounded-full"
          />
          <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-full font-semibold whitespace-nowrap">
            Search
          </button>
        </div>
      </div>
      </div>

      {/* Search bar */}
    </div>
  );
}
