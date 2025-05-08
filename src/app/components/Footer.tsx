import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#fdf8f6] text-[#111] text-sm px-4 md:px-[96px] pt-10 pb-6">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 border-b border-gray-200 pb-6">
        <p>
          Speak to our expert at{" "}
          <a href="tel:1-800-453-6744" className="text-orange-500 font-medium">
            1-800-453-6744
          </a>
        </p>
        <p className="text-gray-700">Follow Us</p>
      </div>

      {/* Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
        {/* Contact */}
        <div>
          <h4 className="font-medium mb-3">Contact</h4>
          <p>328 Queensberry Street, North Melbourne VIC3051, Australia.</p>
          <p className="mt-2">hi@viatours.com</p>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-medium mb-3">Company</h4>
          <ul className="space-y-2 text-gray-700">
            <li>About Us</li>
            <li>Tourz Reviews</li>
            <li>Contact Us</li>
            <li>Travel Guides</li>
            <li>Data Policy</li>
            <li>Cookie Policy</li>
            <li>Legal</li>
            <li>Sitemap</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-medium mb-3">Support</h4>
          <ul className="space-y-2 text-gray-700">
            <li>Get in Touch</li>
            <li>Help center</li>
            <li>Live chat</li>
            <li>How it works</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-medium mb-3">Newsletter</h4>
          <p className="text-gray-700 mb-3">
            Subscribe to the free newsletter and stay up to date
          </p>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-2 text-sm flex-grow outline-none bg-white"
            />
            <button className="bg-gray-100 text-sm px-4 py-2">Send</button>
          </div>
        </div>

        {/* Mobile Apps */}
        <div>
          <h4 className="font-medium mb-3">Mobile Apps</h4>
          <ul className="space-y-2 text-gray-700">
            <li>iOS App</li>
            <li>Android App</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-200 pt-4">
        <p className="text-gray-600">© Copyright Viatours 2024</p>
        {/* Payment Icons */}
        <div className="flex items-center gap-2">
          <Image src="/images/visa.svg" alt="Visa" width={40} height={24} />
          <Image src="/images/applepay.svg" alt="Apple Pay" width={40} height={24} />
          <Image src="/images/mastercard.svg" alt="Mastercard" width={40} height={24} />
          <Image src="/images/amex.svg" alt="Amex" width={40} height={24} />
        </div>
      </div>
    </footer>
  );
}
