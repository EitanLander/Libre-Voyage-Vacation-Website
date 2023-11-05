import { useEffect, useState } from "react";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import VacationsService from "../../../Services/VacationsService";
import AdminGraph from "../AdminGraph/AdminGraph";
import "./AdminDashboard.css";
import { authStore } from "../../../Redux/AuthState";
import { useNavigate } from "react-router-dom";

function AdminDashboard(): JSX.Element {
  // State to store the vacation data
  const [vacation, setVacation] = useState<VacationModel | null>(null);
  const navigate = useNavigate();
  const user = authStore.getState().user;

  useEffect(() => {
    if (user?.roleId !== 1) {
      notifyService.error("You Are Not Admin !");
      navigate("/home");
    }
    // Fetch data for the most followed vacation
    VacationsService.getAllVacationsFollowers()
      .then((data) => {
        if (data.length > 0) {
          // Set the vacation data if available
          setVacation(data[0]);
        }
      })
      .catch((err) => {
        // Handle errors and display notifications
        notifyService.error(err);
      });
  }, []);

  return (
    <div className="AdminDashboard">
      {/* Render the AdminGraph component if vacation data is available */}
      {vacation && <AdminGraph vacation={vacation} />}
    </div>
  );
}

export default AdminDashboard;
