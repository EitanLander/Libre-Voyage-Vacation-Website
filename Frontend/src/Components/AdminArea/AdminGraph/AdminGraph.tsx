import Chart from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import VacationsService from "../../../Services/VacationsService";
import "./AdminGraph.css";

interface AdminGraphProps {
  vacation: VacationModel;
}

function AdminGraph(props: AdminGraphProps): JSX.Element {
  // State to store vacation destinations with follower counts
  const [vacationDestinations, setVacationDestinations] = useState([]);
  const { vacation } = props;

  // Reference for the chart canvas
  const chartRef = useRef(null);

  useEffect(() => {
    // Fetch vacation destinations with follower counts
    VacationsService.getAllVacationsFollowers()
      .then((data) => {
        // Set the state with the retrieved data
        setVacationDestinations(data);

        // Create a chart
        if (chartRef.current) {
          const ctx = chartRef.current.getContext("2d");
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: data.map((vacation) => vacation.destination),
              datasets: [
                {
                  label: "Followers",
                  data: data.map((vacation) => vacation.followersCount),
                  backgroundColor: "#FFC900",
                  borderColor: "#5C2D1C",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Followers",
                    font: {
                      size: 35,
                    },
                  },
                  ticks: {
                    stepSize: 1,
                    color: "black",
                    font: {
                      size: 10,
                    },
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Admin Followers Count",
                    font: {
                      size: 35,
                    },
                  },
                  ticks: {
                    color: "black",
                    font: {
                      size: 15,
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 15,
                    },
                  },
                },
              },
              elements: {
                bar: {
                  borderWidth: 1,
                  backgroundColor: "#FFC900",
                  borderColor: "#5C2D1C",
                },
              },
            },
          });
        }
      })
      .catch((err) => {
        // Handle errors and display notifications
        notifyService.error(err);
      });
  }, []);

  // Prepare data for CSV export
  const csvData = vacationDestinations.map((item) => ({
    destination: item.destination,
    followersCount: item.followersCount,
  }));

  return (
    <div className="AdminGraph">
      <button className="glow-on-hover" type="button">
        {/* Create a CSV download link */}
        <CSVLink className="CSVButton" data={csvData} filename={"vacation_followers.csv"}>
          Download To CSV File
        </CSVLink>
      </button>
      {/* Render the chart canvas */}
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default AdminGraph;
