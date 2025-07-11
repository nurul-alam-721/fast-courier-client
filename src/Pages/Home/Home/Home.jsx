import React from 'react';
import Benefits from '../Benefits/Benefits';
import Banner from '../Banner/Banner';
import OurServices from '../OurServices/OurSecvices';
import ClientLogoSlider from '../ClientLogo/ClientLogSlider';
import BeMarchant from '../BeMarchant/BeMarchant';
import CustomerReviews from '../Reviews/CustomerReviews';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <OurServices></OurServices>
            <ClientLogoSlider></ClientLogoSlider>
            <Benefits></Benefits>
            <BeMarchant></BeMarchant>
            <CustomerReviews></CustomerReviews>
        </div>
    );
};

export default Home;