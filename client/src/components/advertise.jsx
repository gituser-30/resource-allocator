import React from "react";
import Slider from "react-slick";
import "../components/advertise.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner2 from "../image/banner2.jpg";
import banner3 from "../image/banner3.jpg";


const Advertise = () => {
  const slides = [
    {
      img: "https://kce.ac.in/new/wp-content/uploads/2023/05/College-students-reveal-the-best-ways-to-get-ahead-in-engineering-1-1024x536.jpg",
      title: "We are the Engineers",
      subtitle: "The Future of the World",
    },
    {
      img: banner2,
      title: "Learn. Build. Innovate.",
      subtitle: "Shaping Tomorrow’s Technology",
    },
    {
      img: banner3,
      title: "DBATU Scholar Hub",
      subtitle: "Empowering Students with Knowledge",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <Slider {...settings} className="advertise-slider">
      {slides.map((slide, idx) => (
        <div key={idx} className="advertise-slide">
          <img src={slide.img} alt={slide.title} className="advertise-img" />
          <div className="advertise-overlay">
            <h1 className="fw-bold">{slide.title}</h1>
            <h4 className="fw-light">{slide.subtitle}</h4>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Advertise;
