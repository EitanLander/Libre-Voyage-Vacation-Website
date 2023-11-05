import "./PageNotFound.css";
import gif404 from "../../../Assets/Images/404Gif.gif";
import { useNavigate } from "react-router-dom";

function PageNotFound(): JSX.Element {
  const navigate = useNavigate();

  const photoClick = () => {
    navigate("/home");
  };

  return (
    <div className="PageNotFound">
      <img onClick={photoClick} src={gif404} alt="Go to Home" />
    </div>
  );
}

export default PageNotFound;
