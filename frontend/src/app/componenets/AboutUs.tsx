'use client'
import { useState, useEffect } from 'react';
import { 
  Heart, 
  Shield, 
  Leaf, 
  Users, 
  Award, 
  Play
} from 'lucide-react';

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Award, value: '150+', label: 'Products' },
    { icon: Leaf, value: '100%', label: 'Natural Ingredients' },
    { icon: Shield, value: '5 Years', label: 'Trusted Brand' }
  ];

  return (
    <div className="min-h-screen pt-[40px]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f6cfca] via-white to-[#f2bcb5] py-20 lg:py-28">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80')] opacity-5 mix-blend-multiply"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className=" gap-12 items-center">
            {/* Left Section */}
            <div className={`space-y-6 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f6cfca]/40 border border-[#f2bcb5]/50">
                <span className="w-2 h-2 bg-[#e88c80] rounded-full mr-2 animate-pulse"></span>
                <span className="text-[#e88c80] font-medium text-sm">Our Story</span>
              </div>
              
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Beautifully Natural,{' '}
                <span className="bg-gradient-to-r from-[#f2bcb5] to-[#f6cfca] bg-clip-text text-transparent">
                  Naturally Beautiful
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {"For over 5 years, we've been dedicated to creating premium beauty products that enhance your natural radiance while respecting our planet. Our journey began with a simple belief: beauty should be pure, sustainable, and accessible to all."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* <button className="group relative overflow-hidden bg-gradient-to-r from-[#f2bcb5] to-[#f6cfca] text-white px-8 py-4 rounded-xl font-semibold text-center transition-all duration-300 hover:shadow-2xl hover:scale-105">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Our Story <Play className="w-4 h-4" />
                  </span>
                </button>
                
                <button className="group border-2 border-[#f2bcb5] text-[#e88c80] px-8 py-4 rounded-xl font-semibold text-center transition-all duration-300 hover:bg-[#f6cfca]/30 hover:shadow-lg">
                  Meet Our Team
                </button> */}
              </div>
            </div>

            {/* Right Section - Images */}
            {/* <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80" 
                      alt="Natural Ingredients" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" 
                      alt="Product Making" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80" 
                      alt="Laboratory" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=80" 
                      alt="Finished Products" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
              
             
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}
