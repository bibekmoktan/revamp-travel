interface NewsletterSignupProps {
  title?: string;
  description?: string;
}

export default function NewsletterSignup({ 
  title = "Stay Updated with Our Latest Adventures",
  description = "Get travel tips, destination guides, and exclusive offers delivered to your inbox"
}: NewsletterSignupProps) {
  
  // Handle newsletter submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter submission logic here
    console.log('Newsletter signup submitted');
  };

  return (
    <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-12 text-center">
      <h2 className="text-3xl font-bold mb-4">
        {title}
      </h2>
      <p className="text-xl mb-8 text-blue-100">
        {description}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button 
          type="submit"
          className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
} 