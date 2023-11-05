import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./Login.css";

function Login(): JSX.Element {
  // Destructuring hooks from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CredentialsModel>();
  // Using the react-router-dom hook for navigation
  const navigate = useNavigate();

  // Function to handle form submission
  async function send(credentials: CredentialsModel) {
    try {
      // Call the login function from authService
      await authService.login(credentials);
      notifyService.success("You have been successfully logged-in.");
      navigate("/vacations");
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  return (
    <div className="LoginPage">
      <div className="Login">
        <h2>Login</h2>
        {/* Form for user login */}
        <form onSubmit={handleSubmit(send)}>
          {/* Email input field */}
          <label>Email:</label>
          <input
            type="text"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Please enter a valid email address.",
              },
            })}
            required
          />
          {errors.email && <span className="error">{errors.email.message}</span>}

          {/* Password input field */}
          <label>Password:</label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long.",
              },
            })}
            required
          />
          {errors.password && <span className="error">{errors.password.message}</span>}

          <br />
          {/* Login button */}
          <button>Login</button>
          <br />
          {/* Link to register page */}
          <label>
            Don't have an account? <NavLink to="/register">Create an Account</NavLink>
          </label>

          {/* Social login buttons */}
          <div className="social">
            <div className="go">
              {/* Google login button */}
              <i className="google"></i>
              <button>
                <GoogleIcon /> &nbsp;Google&nbsp;
              </button>
            </div>
            <div className="">
              {/* Facebook login button */}
              <i className="facebook"></i>{" "}
              <button>
                <FacebookIcon /> &nbsp;Facebook&nbsp;
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
