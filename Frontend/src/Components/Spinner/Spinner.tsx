import "./Spinner.css";
import imageSource from "../../../src/Assets/Images/loading.webp";

function Spinner(): JSX.Element {
  return (
    <div className="Spinner">
      <img src={imageSource} />
    </div>
  );
}

export default Spinner;
