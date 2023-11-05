import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { authStore } from "../../../Redux/AuthState";
import followService from "../../../Services/FollowService";
import notifyService from "../../../Services/NotifyService";
import "./VacationCard.css";

interface VacationCardProps {
  vacation: VacationModel;
  userId: number;
  onDelete: (vacationId: number) => void;
  onFollowChange: (vacationId: number, isFollowing: boolean) => void;
}

function VacationCard(props: VacationCardProps): JSX.Element {
  // State to track whether the user is following the vacation
  const [isFollowing, setIsFollowing] = useState(props.vacation.isFollowing);

  // Extracting properties for easier access
  const vacation = props.vacation;
  const user = authStore.getState().user;
  const userId = user.userId;

  // Update isFollowing state when the vacation prop changes
  useEffect(() => {
    setIsFollowing(props.vacation.isFollowing);
  }, [props.vacation.isFollowing]);

  // Function to handle following a vacation
  const follow = () => {
    followService
      .follow(userId, vacation.vacationId)
      .then(() => {
        props.onFollowChange(vacation.vacationId, true);
      })
      .catch((error) => {
        console.error("Error following vacation:", error);
        notifyService.error("Error following vacation.");
      });
  };

  // Function to handle unfollowing a vacation
  const unfollow = () => {
    followService
      .unFollow(userId, vacation.vacationId)
      .then(() => {
        props.onFollowChange(vacation.vacationId, false);
      })
      .catch((error) => {
        console.error("Error unfollowing vacation:", error);
        notifyService.error("Error unfollowing vacation.");
      });
  };

  // Function to format price with a dollar sign
  function formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
  
  // Parse the start date and end date
  const startDate = new Date(vacation.startDate);
  const endDate = new Date(vacation.endDate);

  // Format the start date and end date in Hebrew style
  const formattedStartDate = startDate.toLocaleDateString("he-IL");
  const formattedEndDate = endDate.toLocaleDateString("he-IL");

  return (
    <div className="VacationCard">
      {/* Display follow/unfollow button for non-admin users */}
      {user.roleId !== 1 && isFollowing === 0 && (
        <span className="followVacation" onClick={follow} title="follow">
          Follow
        </span>
      )}

      {user.roleId !== 1 && isFollowing === 1 && (
        <span className="followVacation" onClick={unfollow} title="unfollow">
          UnFollow
        </span>
      )}

      {/* Display followers count */}
      <span className="followersCount">♥ {vacation.followersCount}</span>

      {/* Display vacation details */}
      <div className="card">
        <br />
        <NavLink to={"/vacations/details/" + vacation.vacationId}>{vacation.photoUrl && <img className="VacationImage" src={vacation.photoUrl} alt="Vacation" />}</NavLink>
        <br />

        {/* Display formatted start and end dates */}
        <span className="date">
          {formattedStartDate} - {formattedEndDate}
        </span>
        <br />

        {/* Display destination */}
        <span className="Destination">{vacation.destination}</span>
        <span className="DestinationTo">{vacation.destination}</span>
        <br />

        {/* Display description */}
        <span className="Description">{vacation.description}</span>
        <br />

        {/* Display formatted price */}
        <button className="Price">{formatPrice(+vacation.price)}</button>

        {/* Display edit button for admin users */}
        {user && user.roleId === 1 && (
          <button className="EditButton">
            <NavLink to={"/vacations/edit/" + vacation.vacationId}>Edit</NavLink>
          </button>
        )}

        {/* Display delete button for admin users */}
        {user && user.roleId === 1 && (
          <button className="DeleteButton" onClick={() => props.onDelete(vacation.vacationId)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default VacationCard;
