import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { authStore } from "../../../Redux/AuthState";
import notifyService from "../../../Services/NotifyService";
import VacationsService from "../../../Services/VacationsService";
import useTitle from "../../../Utils/UseTitle";
import VacationCard from "../VacationCard/VacationCard";
import upcomingVacations from "../../../Assets/Images/upcomingvacation.png";
import followedVacations from "../../../Assets/Images/followedvacations.png";
import activeVacations from "../../../Assets/Images/activevacations.png";
import "./VacationList.css";
import Spinner from "../../Spinner/Spinner";

function VacationList(): JSX.Element {
  // Set page title
  useTitle("Libre-Voyage");

  // State to hold vacation data
  const [frontendVacations, setFrontendVacations] = useState<VacationModel[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [vacationsPerPage] = useState<number>(3);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc">("asc");
  const [showActive, setShowActive] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showFollowed, setShowFollowed] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    maxPrice: "",
  });

  const navigate = useNavigate();
  const user = authStore.getState().user;
  const userId = user?.userId;

  // State to manage disabled state of filter checkboxes
  const [isUpcomingDisabled, setIsUpcomingDisabled] = useState(false);
  const [isActiveDisabled, setIsActiveDisabled] = useState(false);

  useEffect(() => {
    // Update disabled state of checkboxes when filter options change
    setIsUpcomingDisabled(showActive);
    setIsActiveDisabled(showUpcoming);
  }, [showActive, showUpcoming]);

  useEffect(() => {
    // Fetch vacation data when the component mounts or filters change
    if (!user) {
      notifyService.error("Please Login 🙄");
      navigate("/login");
      return;
    }

    VacationsService.getAllVacations(userId)
      .then((backendVacations) => {
        // Sort vacations based on price
        const sortedVacations = sortOrder === "asc" ? backendVacations.sort((a, b) => a.price - b.price) : backendVacations.sort((a, b) => b.price - a.price);

        // Sort vacations based on start date
        const sortedVacationsByDate =
          dateSortOrder === "asc"
            ? sortedVacations.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            : sortedVacations.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

        setFrontendVacations(sortedVacationsByDate);
        resetPageToFirst(); // Reset the page whenever the filters change
      })
      .catch((err) => notifyService.error(err));
  }, [sortOrder, dateSortOrder, showActive, showUpcoming, showFollowed]);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Function to toggle date sort order
  const toggleDateSortOrder = () => {
    const newDateSortOrder = dateSortOrder === "asc" ? "desc" : "asc";
    setDateSortOrder(newDateSortOrder);
  };

  // Variables to control the display of date sort button
  const buttonDateText = dateSortOrder === "asc" ? "Old to New" : "New to Old";
  const buttonDateIcon = dateSortOrder === "asc" ? "⬇" : "⬆";

  // Filter vacations based on search criteria and filters
  const filteredVacations = frontendVacations.filter((vacation) => {
    const matchesDestination = vacation.destination.toLowerCase().includes(searchCriteria.destination.toLowerCase()) || searchCriteria.destination === "";
    const startDateMatch = vacation.startDate >= searchCriteria.startDate || !searchCriteria.startDate;
    const endDateMatch = vacation.endDate <= searchCriteria.endDate || !searchCriteria.endDate;
    const maxPriceMatch = vacation.price <= +searchCriteria.maxPrice || !searchCriteria.maxPrice;

    const isActiveVacation = vacation.startDate <= new Date().toISOString() && vacation.endDate >= new Date().toISOString();
    const isUpcomingVacation = vacation.startDate > new Date().toISOString();
    const isFollowedVacation = vacation.isFollowing === 1;

    return (
      matchesDestination &&
      startDateMatch &&
      endDateMatch &&
      maxPriceMatch &&
      ((showActive && isActiveVacation) || !showActive) &&
      ((showUpcoming && isUpcomingVacation) || !showUpcoming) &&
      ((showFollowed && isFollowedVacation) || !showFollowed)
    );
  });

  // Pagination variables
  const totalPages = Math.ceil(filteredVacations.length / vacationsPerPage);
  const startIndex = (currentPage - 1) * vacationsPerPage;
  const endIndex = startIndex + vacationsPerPage;
  const visibleVacations = filteredVacations.slice(startIndex, endIndex);

  // Function to remove a vacation
  const removeVacation = (vacationId: number) => {
    const ok = window.confirm("Are you sure you want to delete this vacation?");
    if (!ok) return;

    VacationsService.deleteVacation(vacationId)
      .then(() => {
        setFrontendVacations((prevVacations) => prevVacations.filter((vacation) => vacation.vacationId !== vacationId));
        notifyService.success("Vacation has been deleted.");
      })
      .catch((error) => {
        console.error("Error deleting vacation:", error);
        notifyService.error("Error deleting vacation.");
      });
  };

  // Function to handle follow status change
  const onFollowChange = (vacationId: number, isFollowing: boolean) => {
    const updatedVacations = frontendVacations.map((vacation) =>
      vacation.vacationId === vacationId
        ? {
            ...vacation,
            isFollowing: isFollowing ? 1 : 0,
            followersCount: isFollowing ? vacation.followersCount + 1 : vacation.followersCount - 1,
          }
        : vacation
    );

    setFrontendVacations(updatedVacations);
  };

  // Function to reset page to the first page
  const resetPageToFirst = () => {
    setCurrentPage(1);
  };

  // Display a message if no vacations are available
  if (frontendVacations.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="VacationList">
      {/* Search bar */}
      <div className="search-bar">
        {/* Destination input */}
        <div className="searchBar">
          <input
            type="text"
            placeholder="✈ Where You Travel ?"
            value={searchCriteria.destination}
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                destination: e.target.value,
              })
            }
          />
        </div>

        {/* Start date input */}
        <div className="fromDate">
          <label>From</label>
          <input
            type="date"
            placeholder="Start Date"
            value={searchCriteria.startDate}
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                startDate: e.target.value,
              })
            }
          />
        </div>

        {/* End date input */}
        <div className="untilDate">
          <label>Until</label>
          <input
            type="date"
            placeholder="End Date"
            value={searchCriteria.endDate}
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                endDate: e.target.value,
              })
            }
          />
        </div>

        {/* Price slider input */}
        <div className="price-slider">
          <label htmlFor="maxPrice">Max Price:</label>
          <input
            type="range"
            min="0"
            max="9999"
            value={searchCriteria.maxPrice}
            id="maxPrice"
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                maxPrice: e.target.value,
              })
            }
          />
          <span>${searchCriteria.maxPrice}</span>
        </div>
      </div>

      {/* Button to toggle date sort order */}
      <button onClick={toggleDateSortOrder}>
        {buttonDateIcon}
        {buttonDateText} {buttonDateIcon}
      </button>

      {/* Filter checkboxes */}
      <div className="checkbox-container">
        <div className="checkbox-wrapper-16">
          <label className={`checkbox-wrapper ${isActiveDisabled ? "disabled-checkbox" : ""}`}>
            <input className="checkbox-input" type="checkbox" checked={showActive} onChange={() => setShowActive(!showActive)} />
            <span className="checkbox-tile">
              <img className="iconFilter" src={activeVacations} alt="Active Vacations" />
              <span className="checkbox-label">Active Vacations</span>
            </span>
          </label>
        </div>

        <div className="checkbox-wrapper-16">
          <label className={`checkbox-wrapper ${isUpcomingDisabled ? "disabled-checkbox" : ""}`}>
            <input className="checkbox-input" type="checkbox" checked={showUpcoming} onChange={() => setShowUpcoming(!showUpcoming)} disabled={isUpcomingDisabled} />
            <span className="checkbox-tile">
              <img className="iconFilter" src={upcomingVacations} alt="Upcoming Vacations" />
              <span className="checkbox-label">Upcoming Vacations</span>
            </span>
          </label>
        </div>

        {/* Display the followed vacations checkbox only for regular users */}
        {user && user.roleId === 2 && (
          <div className="checkbox-wrapper-16">
            <label className="checkbox-wrapper">
              <input className="checkbox-input" type="checkbox" checked={showFollowed} onChange={() => setShowFollowed(!showFollowed)} />
              <span className="checkbox-tile">
                <img className="iconFilter" src={followedVacations} alt="Vacations I Follow" />
                <span className="checkbox-label">Followed Vacations</span>
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Display pagination if there are multiple pages */}
      {totalPages > 1 && (
        <div className="pagination">
          <span>Pages: </span>
          <br />
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? "active" : ""}>
              {index + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        </div>
      )}

      {/* Display each vacation card */}
      {visibleVacations.map((v) => (
        <VacationCard key={v.vacationId} vacation={v} userId={userId} onDelete={removeVacation} onFollowChange={(vacationId, isFollowing) => onFollowChange(vacationId, isFollowing)} />
      ))}

      <br />

      {/* Display pagination again at the bottom if there are multiple pages */}
      {totalPages > 1 && (
        <div className="pagination">
          <br />
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button key={index} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? "active" : ""}>
              {index + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default VacationList;
