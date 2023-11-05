import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "../../AdminArea/AdminDashboard/AdminDashboard";
import Login from "../../AuthArea/Login/Login";
import Register from "../../AuthArea/Register/Register";
import Home from "../../HomeArea/Home/Home";
import AddVacation from "../../VacationsArea/AddVacation/AddVacation";
import EditVacation from "../../VacationsArea/EditVacation/EditVacation";
import VacationDetails from "../../VacationsArea/VacationDetails/VacationDetails";
import VacationList from "../../VacationsArea/VacationList/VacationList";
import PageNotFound from "../PageNotFound/PageNotFound";

function Routing(): JSX.Element {
  return (
    <Routes>
      {/* Register: */}
      <Route path="/register" element={<Register />} />

      {/* Login: */}
      <Route path="/login" element={<Login />} />

      {/* Home Route: */}
      <Route path="/home" element={<Home />} />

      {/* Vacations Route: */}
      <Route path="/vacations" element={<VacationList />} />

      {/* Vacation Details: */}
      <Route path="/vacations/details/:vacationId" element={<VacationDetails />} />

      {/* Add Vacation: */}
      <Route path="/vacations/new" element={<AddVacation />} />

      {/* Edit Vacation: */}
      <Route path="/vacations/edit/:vacationId" element={<EditVacation />} />

      {/* Admin Dashboard */}

      <Route path="/admin-dashboard" element={<AdminDashboard />} />

      {/* Default Route: */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Page not found: */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Routing;
