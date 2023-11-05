import "./WelcomeLoading.css";
import loadingAirplane from "../../Assets/Images/airplaneWelcome.gif";

function WelcomeLoading(): JSX.Element {
  return (
    <div className="loadingContainer">
      <div className="preparingYour">Preparing Your</div>
      <img className="loadingAirplane" src={loadingAirplane} />
      <div className="vacation">Vacation</div>
    </div>
  );
}

export default WelcomeLoading;
