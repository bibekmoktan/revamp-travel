'use client';

import Image from 'next/image';
import { Award, Globe, Users, Heart, Mountain, Camera, Compass } from 'lucide-react';

// Team member data
const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "/images/team/sarah.jpg",
    bio: "Adventure enthusiast with 15+ years in travel industry. Led expeditions to 50+ countries.",
    specialties: ["Expedition Planning", "Mountain Climbing"]
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Head of Operations",
    image: "/images/team/michael.jpg",
    bio: "Former mountain rescue specialist. Ensures safety and quality in all our adventures.",
    specialties: ["Safety Management", "Route Planning"]
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Lead Trek Guide",
    image: "/images/team/emma.jpg",
    bio: "Certified mountain guide with expertise in high-altitude trekking and wilderness survival.",
    specialties: ["High Altitude", "Wilderness Survival"]
  },
  {
    id: 4,
    name: "David Park",
    role: "Adventure Photographer",
    image: "/images/team/david.jpg",
    bio: "Award-winning photographer capturing the beauty of our adventures for over a decade.",
    specialties: ["Landscape Photography", "Adventure Documentation"]
  }
];

// Company stats
const stats = [
  {
    number: "10,000+",
    label: "Happy Travelers",
    icon: Users
  },
  {
    number: "50+",
    label: "Countries Visited",
    icon: Globe
  },
  {
    number: "15",
    label: "Years Experience",
    icon: Award
  },
  {
    number: "99%",
    label: "Safety Record",
    icon: Heart
  }
];

// Company values
const values = [
  {
    title: "Sustainable Tourism",
    description: "We believe in responsible travel that preserves natural environments and supports local communities.",
    icon: Globe,
    color: "green"
  },
  {
    title: "Safety First",
    description: "Your safety is our top priority. We maintain the highest safety standards in all our expeditions.",
    icon: Heart,
    color: "red"
  },
  {
    title: "Authentic Experiences",
    description: "We create genuine connections with local cultures and pristine wilderness areas.",
    icon: Mountain,
    color: "blue"
  },
  {
    title: "Expert Guidance",
    description: "Our experienced guides ensure you have the knowledge and support for an amazing adventure.",
    icon: Compass,
    color: "purple"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/about/hero-bg.jpg"
            alt="Mountain adventure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Adventure Begins Here
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              For over 15 years, we&apos;ve been crafting extraordinary mountain adventures 
              that connect you with nature&apos;s most spectacular places and cultures.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Mountain className="w-6 h-6" />
                <span>Expert Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6" />
                <span>50+ Destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                <span>10,000+ Adventurers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Founded in 2009 by adventure enthusiast Sarah Johnson, Viatours began as a 
                  small dream to share the transformative power of mountain adventures with fellow travelers.
                </p>
                <p>
                  What started as weekend hiking trips has grown into a premier adventure travel 
                  company, taking thousands of adventurers to some of the world&apos;s most spectacular 
                  mountain destinations.
                </p>
                <p>
                  Today, we remain committed to our founding principles: sustainable tourism, 
                  authentic cultural experiences, and creating memories that last a lifetime.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="text-2xl font-bold text-gray-900">2009</div>
                  <div className="text-gray-600">Company Founded</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="text-2xl font-bold text-gray-900">2015</div>
                  <div className="text-gray-600">International Expansion</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/about/story-1.jpg"
                    alt="Mountain adventure"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src="/images/about/story-2.jpg"
                    alt="Trekking group"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src="/images/about/story-3.jpg"
                    alt="Local culture"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/images/about/story-4.jpg"
                    alt="Mountain peak"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do, from planning your adventure 
              to ensuring sustainable and meaningful travel experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  value.color === 'green' ? 'bg-green-100' :
                  value.color === 'red' ? 'bg-red-100' :
                  value.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <value.icon className={`w-8 h-8 ${
                    value.color === 'green' ? 'text-green-600' :
                    value.color === 'red' ? 'text-red-600' :
                    value.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet Our Team */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our passionate team of adventure experts, guides, and support staff are here 
              to make your mountain dreams come true.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join thousands of adventurers who have discovered the transformative power 
            of mountain travel with our expert-guided expeditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
              Browse Adventures
            </button>
            <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">
                123 Adventure Street<br />
                Mountain View, CA 94041
              </p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600">
                +1 (555) 123-4567<br />
                hello@viatours.com
              </p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Follow Us</h3>
              <p className="text-gray-600">
                @viatours on all platforms<br />
                #AdventureAwaits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 