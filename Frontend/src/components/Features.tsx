import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import feature1 from "../assets/heroImg.png";
import feature2 from "../assets/heroImg.png";
import feature3 from "../assets/heroImg.png";
import feature4 from "../assets/heroImg.png";

interface FeatureItem {
  id: number;
  image: string;
  title: string;
  des: string;
}

const Features: React.FC = () => {
  const settings: Settings = {
    dots: false,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false, // 🚀 **This removes the previous & next buttons**
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          autoplay: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const featureList: FeatureItem[] = [
    {
      id: 0,
      image: feature1,
      title: "Discover the possibilities",
      des: "With nearly half a million attractions, hotels & more, you're sure to find joy.",
    },
    {
      id: 1,
      image: feature2,
      title: "Enjoy deals & delights",
      des: "Quality activities. Great prices. Plus, earn credits to save more.",
    },
    {
      id: 2,
      image: feature3,
      title: "Exploring made easy",
      des: "Book last minute, skip lines & get free cancellation for easier exploring.",
    },
    {
      id: 3,
      image: feature4,
      title: "Travel you can trust",
      des: "Read reviews & get reliable customer support. We're with you at every step.",
    },
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-5">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Why Choose Us?
        </h2>
        <Slider {...settings}>
          {featureList.map((feature) => (
            <div key={feature.id} className="px-3">
              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.des}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Features;
