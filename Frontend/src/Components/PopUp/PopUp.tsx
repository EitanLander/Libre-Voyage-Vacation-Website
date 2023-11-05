import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import notifyService from "../../Services/NotifyService";

const Popup = () => {
  // State to control the visibility of the popup
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if the popup has been shown before
    const hasPopupBeenShown = localStorage.getItem("popupShown");

    if (!hasPopupBeenShown) {
      // Set a timer to show the popup after 3000 milliseconds (3 seconds)
      const timer = setTimeout(() => {
        // Show the popup and mark it as shown in local storage
        setShowPopup(true);
        localStorage.setItem("popupShown", "true");
      }, 3000);

      // Cleanup function to clear the timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, []);

  // Function to close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Function to display when user try to close popup
  function hateAds() {
    notifyService.error("But I Liked You ... 😞");
  }

  return (
    // Render the popup only if showPopup is true
    showPopup && (
      <div className="popup">
        {/* Close button for the popup */}
        <span className="close-popup" onClick={closePopup}>
          ❌
        </span>
        {/* Popup content */}
        <h2>🌴 Welcome to Libre Voyage 🌴</h2>
        <p>Thank you for visiting our website. We have an exciting offer just for you:</p>
        <p>
          Book your dream vacation now and enjoy a <strong>15% discount</strong> for this month only!
        </p>
        <p>Hurry up, this special offer won't last long. Don't miss the chance to create unforgettable memories.</p>
        ✈
        <br />
        {/* Button to explore vacation packages */}
        <button>
          <NavLink to="/vacations" onClick={closePopup}>
            Explore Our Vacation Packages
          </NavLink>
        </button>
        <br />
        {/* Span to trigger an event when the user hovers over or clicks on it */}
        <span className="hateAds" onMouseEnter={hateAds} onClick={closePopup}>
          😡 Click Here If You Hate Ads 😡
        </span>
      </div>
    )
  );
};

export default Popup;
