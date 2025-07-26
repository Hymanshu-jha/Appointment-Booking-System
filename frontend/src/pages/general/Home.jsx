import React, { useState } from 'react';

export const Home = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen relative bg-black text-white overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/8 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div 
          className="text-center w-full h-screen flex flex-col justify-center px-8 py-16"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
            
            {/* Status Badge */}
            <div className="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-purple-600/20 border border-purple-500/30">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-purple-300">Live Now</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Smart
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-red-400 to-purple-500 bg-clip-text text-transparent">
                Appointments
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              Professional appointment scheduling with intelligent automation and seamless booking experience.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              {[
                { title: "Instant Booking", desc: "Schedule appointments in seconds", color: "purple" },
                { title: "Smart Reminders", desc: "Never miss an appointment", color: "red" },
                { title: "Multi-Device", desc: "Access from anywhere", color: "purple" }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`
                    p-6 rounded-xl border transition-all duration-200
                    ${feature.color === 'purple' ? 'bg-purple-900/20 border-purple-800/30 hover:border-purple-600/50' : 'bg-red-900/20 border-red-800/30 hover:border-red-600/50'}
                    hover:transform hover:scale-105
                  `}
                >
                  <h3 className="text-white font-semibold mb-2 text-lg">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                Get Started Now
              </button>
              
              <button className="px-8 py-4 border-2 border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:bg-purple-600/10">
                View Demo
              </button>
            </div>

            {/* Trust Section */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-red-500">★★★★★</span>
                  <span>4.9/5 Rating</span>
                </div>
                <div>10,000+ Active Users</div>
                <div>99.9% Uptime</div>
                <div>24/7 Support</div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};