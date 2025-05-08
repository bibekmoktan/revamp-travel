import Image from "next/image";

export default function AppPromo() {
  return (
    <section className="px-6 py-10 md:py-16 md:px-20 overflow-hidden">
      <div className="relative w-full max-w-[1320px] h-auto md:h-[400px] mx-auto flex flex-col md:flex-row items-end justify-between gap-8 rounded-xl overflow-hidden md:px-[100px]">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/home/bg-promo.svg"
            alt="Background Image"
            fill
            className="object-cover"
          />
        </div>

        {/* Left Text Area */}
        <div className="text-white max-w-md z-10 flex items-center justify-center md:pb-[100px]">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Get 5% off your 1st <br /> app booking
            </h2>
            <p className="text-sm mb-6">
              Booking’s better on the app. Use promo code <br />
              <span className="font-medium">“TourBooking”</span> to save!
            </p>
            <p className="text-sm mb-2">Get a magic link sent to your email</p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Email"
                className="rounded-md px-4 py-2 text-black text-sm w-full max-w-xs"
              />
              <button className="bg-white text-[#dd6937] px-4 py-2 rounded-md text-sm font-semibold">
                Send
              </button>
            </div>
          </div>
        </div>
        {/* Right Mobile Screenshot */}
        <div className="relative z-10 flex items-end">
          <Image
            src="/images/home/bg-mobile.svg"
            alt="Mobile Screenshot"
            width={500}
            height={500}
            className="rounded-md"
          />
        </div>
      </div>
    </section>
  );
}
