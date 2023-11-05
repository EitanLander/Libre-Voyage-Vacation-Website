import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import "./Menu.css";

function Menu(): JSX.Element {
  // State to track user login status
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // State to store user information
  const [user, setUser] = useState<UserModel>();

  // Effect to set the user state and subscribe to changes in user state
  useEffect(() => {
    setUser(authStore.getState().user);
    const unsubscribe = authStore.subscribe(() => setUser(authStore.getState().user));
    return unsubscribe;
  }, []);

  // Effect to set the isLoggedIn state and subscribe to changes in token state
  useEffect(() => {
    setIsLoggedIn(authStore.getState().token !== null);
    const unsubscribe = authStore.subscribe(() => {
      setIsLoggedIn(authStore.getState().token !== null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="Menu">
      {/* Home link */}
      <li>
        <NavLink to="/home">Home</NavLink>
      </li>

      {/* Vacation links, displayed for Logged In User Or Admin */}
      {isLoggedIn && (
        <li className="Dropdown">
          <span>Vacations</span>
          {/* Dropdown content for Vacations */}
          <div className="Dropdown-Content">
            <NavLink to="/vacations">All Vacations</NavLink>
            {isLoggedIn && user.roleId === 1 && <NavLink to="/vacations/new">Add Vacation</NavLink>}
          </div>
        </li>
      )}

      {/* Admin Dashboard link, displayed for users with role 1 */}
      {isLoggedIn && user && user.roleId === 1 && (
        <li>
          <NavLink to="/admin-dashboard">Admin Dashboard</NavLink>
        </li>
      )}
    </div>
  );
}

export default Menu;
