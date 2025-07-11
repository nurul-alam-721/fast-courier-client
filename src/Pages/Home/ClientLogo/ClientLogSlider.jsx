import React from "react";
import Marquee from "react-fast-marquee";
import logo1 from '../../../assets/brands/amazon.png';
import logo2 from '../../../assets/brands/amazon_vector.png';
import logo3 from '../../../assets/brands/casio.png';
import logo4 from '../../../assets/brands/moonstar.png';
import logo5 from '../../../assets/brands/randstad.png';
import logo6 from '../../../assets/brands/start-people 1.png';
import logo7 from '../../../assets/brands/start.png';

const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const ClientLogoSlider = () => {
  return (
    <section className="py-12 bg-white my-8">
      <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-12">
        Trusted by Leading Brands
      </h2>

      <Marquee
        direction="right"
        speed={50}
        gradient={true}
        className="flex gap-32"
      >
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index}`}
            className="h-6 w-auto mx-8 object-contain"
          />
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogoSlider;
