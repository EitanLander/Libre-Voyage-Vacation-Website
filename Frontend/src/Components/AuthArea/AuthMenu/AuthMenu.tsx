import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./AuthMenu.css";

function AuthMenu(): JSX.Element {
  // State to store the user data
  const [user, setUser] = useState<UserModel>();

  useEffect(() => {
    // Initialize the user state with the current user data from Redux
    setUser(authStore.getState().user);

    // Subscribe to changes in the Redux store to update the user state
    const unsubscribe = authStore.subscribe(() => setUser(authStore.getState().user));

    // Unsubscribe from Redux store changes when the component unmounts
    return unsubscribe;
  }, []);

  // Function to handle user logout
  function logoutMe(): void {
    authService.logout();
    notifyService.success(`Bye ${user.firstName} Have A Nice Day !`);
  }

  return (
    <div className="AuthMenu">
      {/* Render the menu based on user authentication */}
      {!user && ( // Display if the user is not logged in
        <div>
          <span>Hello Guest </span>
          <NavLink to="/login">
            <button>Login</button>
          </NavLink>
          <NavLink to="/register">
            <button>Register</button>
          </NavLink>
        </div>
      )}

      {user && ( // Display if the user is logged in
        <div>
          <span>
            Hello {user.firstName} {user.lastName}{" "}
          </span>
          <NavLink to="/home" onClick={logoutMe}>
            <button>Logout</button>
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default AuthMenu;
