import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const images = [
  "https://i.postimg.cc/C5zMKv25/HKFL07m-XQAAj-EBU.jpg",
  "https://i.postimg.cc/mrkHvG3z/ghostofyoteireview-featuredpic.avif",
  "https://i.postimg.cc/qvrJ82MX/playstation-5-pro-next-to-controller.avif",
  "https://i.postimg.cc/Y0qGzfys/gta6.avif",
  "https://i.postimg.cc/RhDFQrty/god-of-war-laufey-playstation-5-playstation-store-cover.jpg",
  "https://i.postimg.cc/MZCXTwW6/marvelswolverine-lob-mas-mob-02-1.webp",
  "https://i.postimg.cc/xTGj1bxk/30972495c4d1b567dcd015b80c0d3af9c946efc8822944d7.avif",
  "https://i.postimg.cc/66rxrxrC/re-requiem-scaled.webp",
  "https://i.postimg.cc/sDbPsqL0/4946bed5501a4bd352f905bf4dc11bdda4de0871cf0255ab.jpg",
  "https://i.postimg.cc/sgRBnr8W/Spider-Man-2-Limited-Edition-PS5-Feature-Image-scaled.jpg",
  "https://i.postimg.cc/66yMdDD7/a8a333f1f9225ee76776b43765a31ca3a0c584db.webp",

];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full shadow-lg overflow-hidden rounded-2xl">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            src={image}
            key={index}
            className="w-full h-auto object-contain shrink-0 "
            alt={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Previous button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
      >
        <ChevronLeft />
      </button>

      {/* Next button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
      >
        <ChevronRight />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((__, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${current === index ? "w-6 bg-white" : "w-2 bg-white/50"}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;