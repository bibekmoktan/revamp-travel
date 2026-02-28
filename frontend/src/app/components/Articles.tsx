import Image from "next/image";

const articles = [
  {
    title: "Kenya vs Tanzania Safari: The Better African Safari Experience",
    date: "April 06 2023",
    author: "Ali Tufan",
    image: "/images/home/article1.svg",
  },
  {
    title: "Exploring the Serengeti: A Wildlife Adventure",
    date: "April 07 2023",
    author: "Emily Johnson",
    image: "/images/home/article2.svg",
  },
  {
    title: "Into the Wild: An Unforgettable Safari Journey",
    date: "April 08 2023",
    author: "Maxwell Rhodes",
    image: "/images/home/article3.svg",
  },
];

export default function Articles() {
  return (
    <section className="py-12">
      <div className="max-w-[1320px] px-[96px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Travel Articles</h2>
          <a href="#" className="text-sm text-gray-600 hover:underline">
            See all
          </a>
        </div>

        {/* Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-sm bg-white">
              {/* Image Section */}
              <div className="relative w-full h-48">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
                <span className="absolute top-2 left-2 bg-white text-xs text-gray-800 px-2 py-1 rounded-md shadow-sm">
                  Trips
                </span>
              </div>

              {/* Text Content */}
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">
                  {article.date} &nbsp; By {article.author}
                </p>
                <h3 className="text-sm font-medium text-gray-900">
                  {article.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
