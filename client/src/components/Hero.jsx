import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fallbackImage from "../assets/hero.png";
import "./Hero.css";

const SLIDES = [
  {
    id: 1,
    eyebrow: "Whenever, Wherever",

    title: "Future Basket",

    subtitle:
      "Discover premium products, exclusive deals, and a seamless shopping experience designed for modern customers.",

    cta: "Explore Deals",

    link: "/?section=deals",
    image:
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&q=80",
  },
  {
    id: 2,
    eyebrow: "Whenever, Wherever",

    title: "Future Basket",

    subtitle:
      "Explore the latest arrivals — quality you trust, prices you’ll love.",
    cta: "Browse New",

    link: "/?section=latest",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80",
  },
  {
    id: 3,
    eyebrow: "Whenever, Wherever",

    title: "Future Basket",

    subtitle:
      "Everything you need, delivered fast — secure checkout included.",
    cta: "Start Shopping",

    link: "/",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=80",
  },
];

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setActiveIndex(index);
  const prevSlide = () =>
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % SLIDES.length);

  return (
    <section className="hero" aria-label="Promotional banner">
      <div className="hero-carousel">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === activeIndex ? "active" : ""}`}
            aria-hidden={index !== activeIndex}
          >
            <img
              src={slide.image}
              alt=""
              className="hero-slide-bg"
              loading={index === 0 ? "eager" : "lazy"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
            />
            <div className="hero-slide-overlay" />
            <div className="hero-slide-content">
              <span className="hero-eyebrow">{slide.eyebrow}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <Link to={slide.link} className="hero-cta">
                {slide.cta}
              </Link>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="hero-nav hero-nav-prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          className="hero-nav hero-nav-next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="hero-dots" role="tablist" aria-label="Carousel slides">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              className={`hero-dot ${index === activeIndex ? "active" : ""}`}
              aria-selected={index === activeIndex}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
