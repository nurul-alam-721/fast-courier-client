import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaQuoteLeft } from "react-icons/fa";

const reviews = [
  {
    name: "Arman Rahman",
    title: "E-commerce Seller",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "Exceptional courier service! My packages always arrive on time and in perfect condition. Highly recommended for small businesses.",
  },
  {
    name: "Tanisha Akter",
    title: "Fashion Store Owner",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "Their live tracking system is a game-changer. My customers stay informed, and I feel confident using their logistics every day.",
  },
  {
    name: "Rafiul Islam",
    title: "Tech Product Reseller",
    img: "https://randomuser.me/api/portraits/men/55.jpg",
    review:
      "Always impressed with their delivery speed. Same-day service in Dhaka is incredibly efficient and helps my business grow.",
  },
  {
    name: "Meherun Nesa",
    title: "Online Boutique Owner",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    review:
      "The team is so professional. From pickup to delivery, the process is seamless. I recommend them to all sellers I know.",
  },
  {
    name: "Zahid Hossain",
    title: "Small Business Owner",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    review:
      "Their cash on delivery system is super reliable. No payment issues ever. I trust them with all my shipments.",
  },
  {
    name: "Farhana Tuli",
    title: "Jewelry Brand Founder",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    review:
      "Secure and fast! That’s what I need in my delivery partner. And they deliver exactly that — every time.",
  },
  {
    name: "Rashed Karim",
    title: "Furniture Seller",
    img: "https://randomuser.me/api/portraits/men/71.jpg",
    review:
      "Handling bulky products is tricky, but this courier service manages it perfectly. Their staff is trained and responsible.",
  },
  {
    name: "Mim Chowdhury",
    title: "Crafts Store Owner",
    img: "https://randomuser.me/api/portraits/women/36.jpg",
    review:
      "My handmade crafts need gentle handling — and I love how carefully their team treats my parcels. Total peace of mind.",
  },
  {
    name: "Sakib Nawaz",
    title: "Digital Store Manager",
    img: "https://randomuser.me/api/portraits/men/11.jpg",
    review:
      "The customer support is fantastic. They respond fast and actually solve problems. Rare to find such service today!",
  },
  {
    name: "Nilufa Yasmin",
    title: "Home Decor Seller",
    img: "https://randomuser.me/api/portraits/women/19.jpg",
    review:
      "Professional, punctual, and polite. They make my delivery experience stress-free. I’m a loyal customer now.",
  },
];

const CustomerReviews = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const getSlideClass = (index) => {
    if (index === current) return "opacity-100 scale-100 z-10";
    if (index === (current + 1) % reviews.length || index === (current - 1 + reviews.length) % reviews.length) {
      return "opacity-40 scale-80 z-0";
    }
    return "hidden";
  };

  return (
    <section className="py-16 bg-base-200 text-base-content">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-primary mb-10">What Our Customers Say</h2>

        <div className="relative flex items-center justify-center">
          <div className="flex gap-6 items-center overflow-hidden w-full">
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`transition-all duration-500 transform bg-white p-6 rounded-xl shadow-md w-full md:w-2/3 mx-auto ${getSlideClass(index)}`}
              >
                <FaQuoteLeft className="text-4xl text-primary mb-4 mx-auto" />
                <p className="text-lg italic mb-6 text-black">"{review.review}"</p>
                <div className="flex items-center justify-center gap-4 border-t-2 pt-4 border-dashed border-primary">
                  <img
                    src={review.img}
                    alt={review.name}
                    className="w-14 h-14 rounded-full border-2 border-primary"
                  />
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-secondary">
                      {review.name}
                    </h4>
                    <p className="text-sm text-gray-500">{review.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows and Dots */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={prevSlide} className="btn btn-circle btn-sm btn-ghost text-black">
            <FaChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  current === i ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => setCurrent(i)}
              ></div>
            ))}
          </div>

          <button onClick={nextSlide} className="btn btn-circle btn-sm btn-ghost text-black">
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;