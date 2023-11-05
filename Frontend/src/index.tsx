import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Layout from "./Components/LayoutArea/Layout/Layout";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import WelcomeLoading from "./Components/WelcomeLoading/WelcomeLoading";
import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { vacationsStore } from "./Redux/VacationsState";

function App(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <BrowserRouter>
      <Provider store={vacationsStore}>
        {isLoading ? (
          <div className={isLoading ? "fade-out" : ""}>
            <WelcomeLoading />
          </div>
        ) : (
          <Layout />
        )}
      </Provider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);


reportWebVitals();
