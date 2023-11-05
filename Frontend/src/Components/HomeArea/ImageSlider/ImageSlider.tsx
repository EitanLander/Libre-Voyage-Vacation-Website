import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import image1 from "../../../Assets/Images/image1.jpg";
import image2 from "../../../Assets/Images/image2.jpg";
import image3 from "../../../Assets/Images/image3.jpeg";
import "./ImageSlider.css";

// Array containing the images and captions for the slideshow
const slideImages = [
  {
    url: image1,
    caption: "Escape the Ordinary, Embrace the Extraordinary.",
  },
  {
    url: image2,
    caption: '"Discover, Dream, and Dive into Adventure!',
  },
  {
    url: image3,
    caption: "Your Journey, Your Adventure, Our Commitment.",
  },
];

// Slideshow component
const Slideshow = () => {
  return (
    <div className="slide-container">
      {/* React-slideshow-image component for sliding images */}
      <Slide>
        {/* Mapping through slideImages array to create individual slides */}
        {slideImages.map((slideImage, index) => (
          <div key={index}>
            {/* Individual slide with image and caption */}
            <div className="slide-image" style={{ backgroundImage: `url(${slideImage.url})` }}>
              <span className="slide-caption">{slideImage.caption}</span>
            </div>
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default Slideshow;