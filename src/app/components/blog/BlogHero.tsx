import Image from 'next/image';
import bg from '../../../../public/images/blog/bg-2.jpg';


export default function BlogHero() {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={bg}
          alt="Travel blog background"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Travel Stories
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Expert guides, inspiring stories, and insider tips from our adventures around the world
          </p>
          <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 hover:shadow-lg">
            Explore Articles
          </button>
        </div>
      </div>
    </div>
  );
} 