
import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  bannerText: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, bannerText }) => {
  return (
    <section className="text-center py-12 md:py-20 bg-gray-900">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 px-4">
        {title.includes('حلم الوزن') ? (
          <>
            {title.split('حلم الوزن')[0]}
            <span className="text-yellow-400">حلم الوزن</span>
            {title.split('حلم الوزن')[1]}
          </>
        ) : title}
      </h2>
      <p className="max-w-3xl mx-auto text-lg text-gray-300 mb-6 px-4">
        {subtitle}
      </p>
      <div className="bg-gray-800 border-l-4 border-yellow-400 p-6 rounded-lg max-w-2xl mx-auto mx-4">
        <p className="text-xl font-semibold text-white">
          {bannerText}
        </p>
      </div>
    </section>
  );
};

export default Hero;
