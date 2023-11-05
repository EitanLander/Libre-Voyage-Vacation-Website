import airPlaneGif from "../../../Assets/Images/airplane.gif";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import "./Header.css";

function Header(): JSX.Element {
  return (
    <div className="Header">
      <AuthMenu />
      <h1>
        <img className="airPlaneGif" src={airPlaneGif} />
        Libre Voyage
        <img className="airPlaneGif2" src={airPlaneGif} />
      </h1>
      <div className="Popup"></div>
    </div>
  );
}

export default Header;
