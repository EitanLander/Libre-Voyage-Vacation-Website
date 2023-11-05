import Popup from "../../PopUp/PopUp";
import Slideshow from "../ImageSlider/ImageSlider";
import "./Home.css";

function Home(): JSX.Element {
  return (
    <div className="HomePage">
      <Popup />
      <div className="Home">
        <div className="intro-paragraph">
          <h2>Welcome to Libre-Voyage</h2>
          <p>Get ready to explore the world with Us!</p>
          <p> At Libre-Voyage, we're passionate about helping you create unforgettable memories.</p>
          <p> Whether you're dreaming of pristine beaches, </p>
          <p>breathtaking mountains, vibrant cities, or serene countryside escapes, we've got you covered.</p>
          <Slideshow />
          <p>Explore a handpicked selection of the world's most enticing destinations,</p>
          <p>curated by our travel experts. Discover unique experiences, find the perfect tour or package, and access expert advice to make your travel dreams a reality.</p>
          <p>share your experiences, and gain valuable insights from our travel blog. Let's embark on this exciting journey together!</p>
          <br />
        </div>
      </div>
    </div>
  );
}

export default Home;
