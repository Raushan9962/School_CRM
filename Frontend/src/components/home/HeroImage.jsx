import React from 'react';
import heroImg from '../../assets/hero.png';

const HeroImage = () => {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-orange-50">
      <img 
        src={heroImg} 
        alt="School Children Illustration" 
        className="w-full h-[300px] md:h-[380px] object-cover"
      />
    </div>
  );
};

export default HeroImage;
