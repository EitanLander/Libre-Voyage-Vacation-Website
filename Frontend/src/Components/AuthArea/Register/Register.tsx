import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./Register.css";

function Register(): JSX.Element {
  // Destructuring hooks from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserModel>();
  // Using the react-router-dom hook for navigation
  const navigate = useNavigate();

  // Validation rules
  const emailRegex = /^\S+@\S+$/i;
  const inputValidationRegex = /^[a-zA-Z\u0590-\u05FF]{2,50}$/;

  // Function to handle form submission
  async function send(user: UserModel) {
    try {
      // Call the register function from authService
      await authService.register(user);
      notifyService.success("You have been successfully registered.");
      navigate("/vacations");
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  return (
    <div className="RegisterPage">
      <div className="Register">
        <h2>Register</h2>

        {/* Form for user registration */}
        <form onSubmit={handleSubmit(send)}>
          {/* First name input field */}
          <label>First name: </label>
          <input type="text" {...register("firstName", { required: true, pattern: inputValidationRegex })} />
          {errors.firstName && <p className="error">First name is required.</p>}

          {/* Last name input field */}
          <label>Last name: </label>
          <input type="text" {...register("lastName", { required: true, pattern: inputValidationRegex })} />
          {errors.lastName && <p className="error">Last name is required.</p>}

          {/* Email input field */}
          <label>Email: </label>
          <input type="text" {...register("email", { required: true, pattern: emailRegex })} />
          {errors.email && <p className="error">Please enter a valid email address.</p>}

          {/* Password input field */}
          <label>Password: </label>
          <input type="password" {...register("password", { required: true, minLength: 8 })} />
          {errors.password && <p className="error">Password must be at least 8 characters long.</p>}

          {/* Terms of Use & Privacy Policy checkbox */}
          <span>
            <input type="checkbox" required />
            <label>I accept the Terms of Use & Privacy Policy</label>
          </span>
          <br />
          {/* Register button */}
          <button>Register</button>
          <br />
          {/* Link to login page */}
          <label>
            Already a member? <NavLink to="/login">Login</NavLink>
          </label>
        </form>
      </div>
    </div>
  );
}

export default Register;
