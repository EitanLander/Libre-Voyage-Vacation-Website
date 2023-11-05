import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import { authStore } from "../../../Redux/AuthState";
import notifyService from "../../../Services/NotifyService";
import VacationsService from "../../../Services/VacationsService";
import Spinner from "../../Spinner/Spinner";
import "./VacationDetails.css";

function VacationDetails(): JSX.Element {
  // State to hold the current user
  const [user, setUser] = useState<UserModel>();

  // Get vacationId from route parameters
  const params = useParams<{ vacationId: string }>();
  const vacationId = parseInt(params.vacationId, 10);

  // State to hold vacation details
  const [frontendVacation, setFrontendVacation] = useState<VacationModel>();

  // Navigation hook
  const navigate = useNavigate();

  // Subscribe to the Redux store to get the user
  useEffect(() => {
    setUser(authStore.getState().user);
    const unsubscribe = authStore.subscribe(() => setUser(authStore.getState().user));
    return unsubscribe;
  }, []);

  // Fetch vacation details when the component mounts
  useEffect(() => {
    VacationsService.getOneVacation(vacationId)
      .then((backendVacations) => setFrontendVacation(backendVacations))
      .catch((err) => notifyService.error(err));
  }, [vacationId]); // Added dependency to rerun effect when vacationId changes

  // Function to delete a vacation
  async function deleteMe(): Promise<void> {
    try {
      const ok = window.confirm("Are you sure?");
      if (!ok) return;
      await VacationsService.deleteVacation(vacationId);
      notifyService.success("Vacation has been deleted.");
      navigate("/vacations");
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  // Conditional rendering: Show a spinner while loading the vacation details
  if (!frontendVacation) return <Spinner />;

  return (
    <div className="VacationDetails">
      <h1>Vacation Details</h1>

      {/* Display Vacation Details */}
      <h3>Destination: {frontendVacation?.destination}</h3>
      <h3>Description: <p>{frontendVacation?.description}</p></h3>
      <h3>Start Date: {frontendVacation?.startDate && new Date(frontendVacation?.startDate).toLocaleDateString("he-IL")}</h3>
      <h3>End Date: {frontendVacation?.endDate && new Date(frontendVacation?.endDate).toLocaleDateString("he-IL")}</h3>
      <h3>Price: {frontendVacation?.price}$</h3>
      <img className="photo" src={frontendVacation?.photoUrl} alt="Vacation" />

      <br />

      {/* Navigation Buttons */}
      <button>
        <NavLink to="/vacations">Back</NavLink>
      </button>

      {/* Admin Actions */}
      {user && user.roleId === 1 && (
        <>
          <span> | </span>
          <button>
            <NavLink to={"/vacations/edit/" + (frontendVacation?.vacationId || "")}>Edit</NavLink>
          </button>
          <span> | </span>
          <button>
            <NavLink to="#" onClick={deleteMe}>
              Delete
            </NavLink>
          </button>
        </>
      )}
    </div>
  );
}

export default VacationDetails;
