import React from "react";
import Image from "next/image";

const Offer = () => {
    return (
        <section className="px-6 py-12 relative z-0">
            <div className="max-w-[1320px] mx-auto rounded-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
                {/* Left Section */}
                <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative z-10">
                    {/* Decorative Background */}
                    <Image
                        src="/images/home/bg-vector.png"
                        alt="Decorative background"
                        fill
                        className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none z-0"
                    />

                    {/* Text Content */}
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            Grab up to <span className="text-orange-500">35% off</span>
                            <br />
                            on your favorite <br />
                            Destination
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Limited time offer, don’t miss the opportunity
                        </p>
                        <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition">
                            Book Now
                        </button>
                    </div>
                </div>

                {/* Right Section - Optimized Image */}
                <div className="w-full md:w-1/2 relative">
                    <Image
                        src="/images/home/vector.svg"
                        alt="Vector"
                        width={40}
                        height={40}
                        className="absolute top-[0px] left-[0px]"
                    />
                    <Image
                        src="/images/home/offer-image.svg"
                        alt="Offer Banner"
                        width={700}
                        height={500}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default Offer;
