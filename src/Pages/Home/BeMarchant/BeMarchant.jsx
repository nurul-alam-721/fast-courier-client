import React from 'react';
import marchantLocationImg from '../../../assets/location-merchant.png'

const BeMarchant = () => {
    return (
        <div data-aos="zoom-in-up" className="bg-no-repeat bg-[#03373D] bg-[url('assets/be-a-merchant-bg.png')]  p-20 rounded-2xl">
  <div className="hero-content flex-col lg:flex-row-reverse">
    <img
      src={marchantLocationImg}
      className="max-w-sm rounded-lg shadow-2xl"
    />
    <div>
      <h1 className="text-4xl font-bold text-white">Marchant and Customer Satisfaction is our First Satisfaction!</h1>
      <p className="py-6 text-white">
       We offer lowest delivery charge with the highest value with the 100% safety of your product.We have a large, well-trained team of delivery agents who operate with discipline and dedication. Dressed in uniforms and equipped with delivery tools, they represent your business with professionalism. 
      </p>
      <button className="btn btn-primary rounded-full text-black">Become a Marchant</button>
      <button className="btn btn-primary rounded-full btn-outline ms-4 text-primary hover:text-black">Become a Marchant</button>
    </div>
  </div>
</div>
    );
};

export default BeMarchant;