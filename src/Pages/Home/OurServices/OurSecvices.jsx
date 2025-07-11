import React from "react";
import {
  FaShippingFast,
  FaMapMarkedAlt,
  FaWarehouse,
  FaMoneyBillWave,
  FaBuilding,
  FaUndoAlt,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const servicesData = [
  {
    icon: FaShippingFast,
    title: "Express & Standard Delivery",
    description:
      "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
  },
  {
    icon: FaMapMarkedAlt,
    title: "Nationwide Delivery",
    description:
      "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
  },
  {
    icon: FaWarehouse,
    title: "Fulfillment Solution",
    description:
      "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
  },
  {
    icon: FaMoneyBillWave,
    title: "Cash on Home Delivery",
    description:
      "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
  },
  {
    icon: FaBuilding,
    title: "Corporate Service / Contract In Logistics",
    description:
      "Customized corporate services which includes warehouse and inventory management support.",
  },
  {
    icon: FaUndoAlt,
    title: "Parcel Return",
    description:
      "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
  },
];

const OurServices = () => {
  return (
    <section className="px-4 py-16 max-w-7xl mx-auto bg-white my-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-primary">Our Services</h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-base">
          Fast, reliable, and nationwide — explore our wide range of courier solutions tailored for individuals and businesses alike.
        </p>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        pagination={{ clickable: true }}
        className="group"
      >
        {servicesData.map((service, index) => {
          const Icon = service.icon;
          return (
            <SwiperSlide key={index}>
              <div className="card bg-slate-100 border border-gray-100 shadow-sm hover:shadow-lg hover:bg-blue-100 transition duration-300 p-6 rounded-2xl h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="text-3xl text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style>
        {`
          .swiper-button-prev,
          .swiper-button-next {
            color: #2563eb; /* Tailwind primary */
            top: 50%;
            transform: translateY(-50%);
          }

          .swiper-pagination-bullets {
            bottom: -30px;
          }

          .swiper-button-prev {
            left: 0;
          }

          .swiper-button-next {
            right: 0;
          }
        `}
      </style>
    </section>
  );
};

export default OurServices;
