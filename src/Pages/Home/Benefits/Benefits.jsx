import React from "react";
import { CheckCircle, Truck, MapPin, Users } from "lucide-react";
import safeDelivery from "../../../assets/safe-delivery.png";
import liveTracking from "../../../assets/live-tracking.png";
import deliverMan from "../../../assets/big-deliveryman.png";

const benefitsData = [
  {
    img: safeDelivery,
    icon: CheckCircle,
    title: "Safe & Reliable Delivery",
    desc: "Our courier network ensures safe and reliable delivery across Bangladesh. Every parcel is handled with care and tracked throughout the journey. From sensitive electronics to personal gifts, we treat your package with professionalism, minimizing damage risks and ensuring it reaches its destination intact and on time.",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
  },
  {
    img: liveTracking,
    icon: MapPin,
    title: "Live Tracking System",
    desc: "Stay informed with our real-time parcel tracking. Our system allows both merchants and customers to see the current location and status of each delivery. This transparency builds trust, reduces inquiry calls, and ensures smooth logistics from dispatch to successful delivery or return.",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
  },
  {
    img: deliverMan,
    icon: Users,
    title: "Professional Delivery Agents",
    desc: "We have a large, well-trained team of delivery agents who operate with discipline and dedication. Dressed in uniforms and equipped with delivery tools, they represent your business with professionalism. Their local knowledge and punctuality help us maintain high delivery success rates across urban and rural areas.",
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50",
  },
];

const Benefits = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Why Choose Our Courier Service?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience the difference with our premium delivery solutions designed for modern businesses
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="flex flex-col gap-8">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl ${benefit.bgColor} hover:shadow-2xl transition-all duration-700 hover:-translate-y-2`}
            >
              
              <div className="flex flex-col md:flex-row items-center md:items-start p-8 gap-6 md:gap-8">
                {/* Image Section */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                    <img
                      src={benefit.img}
                      alt={benefit.title}
                      className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Icon overlay */}
                    <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-48 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

                {/* Content Section */}
                <div className="w-full md:w-2/3 space-y-4 text-center md:text-left">
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <div className={`w-16 h-1 bg-gradient-to-r ${benefit.color} rounded-full mx-auto md:mx-0 group-hover:w-24 transition-all duration-500`}></div>
                  </div>
                  
                  <p className="text-gray-600 text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {benefit.desc}
                  </p>
                  
                  {/* Feature highlights */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {index === 0 && (
                      <>
                        <span className="px-3 py-1 bg-white bg-opacity-70 text-emerald-700 text-xs rounded-full">Secure Handling</span>
                        <span className="px-3 py-1 bg-white bg-opacity-70 text-emerald-700 text-xs rounded-full">Damage Protection</span>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <span className="px-3 py-1 bg-white bg-opacity-70 text-blue-700 text-xs rounded-full">Real-time Updates</span>
                        <span className="px-3 py-1 bg-white bg-opacity-70 text-blue-700 text-xs rounded-full">Full Transparency</span>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <span className="px-3 py-1 bg-white bg-opacity-70 text-purple-700 text-xs rounded-full">Trained Professionals</span>
                        <span className="px-3 py-1 bg-white bg-opacity-70 text-purple-700 text-xs rounded-full">Local Expertise</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;