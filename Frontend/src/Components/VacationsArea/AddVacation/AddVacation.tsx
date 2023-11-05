import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import { authStore } from "../../../Redux/AuthState";
import notifyService from "../../../Services/NotifyService";
import VacationsService from "../../../Services/VacationsService";
import "./AddVacation.css";

function AddVacation(): JSX.Element {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VacationModel>();

  // State to manage the uploaded image URL
  const [uploadedPhoto, setUploadedImageUrl] = useState<string | null>(null);

  // Navigation hook
  const navigate = useNavigate();

  // Get the values of the "Start Date" and "End Date" fields
  const startDateValue = watch("startDate");

  // Function to check if the "Start Date" is in the past
  const isStartDateValid = (startDate: string) => {
    const currentDate = new Date();
    const selectedDate = new Date(startDate + "T00:00:00Z");
    return selectedDate >= currentDate;
  };

  // Function to check if the "End Date" is valid
  const isEndDateValid = (endDate: string, startDate: string) => {
    const startDateValue = new Date(startDate + "T00:00:00Z");
    const endDateValue = new Date(endDate + "T00:00:00Z");
    return endDateValue >= startDateValue;
  };

  // Function to handle form submission
  const onSubmit = async (vacation: VacationModel) => {
    try {
      // Extract the photo from the form data
      vacation.photo = (vacation.photo as unknown as FileList)[0];

      // Call the service to add the vacation
      await VacationsService.addVacation(vacation);

      // Display success notification
      notifyService.success("Vacation has been added.");

      // Redirect to the vacations page
      navigate("/vacations");
    } catch (err: any) {
      // Display error notification
      notifyService.error(err);
    }
  };

  // Function to handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    if (file) {
      // Use FileReader to read the selected file and set its URL in the state
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedImage = e.target?.result as string; // Ensure you cast it as a string
        setUploadedImageUrl(uploadedImage);
      };

      reader.readAsDataURL(file);
    }
  };

  // Validation function to check if a string is not empty or contains only tabs
  const isNotEmptyOrTabs = (value: string) => {
    const regex = /^[^\s\t]+(\s[^\s\t]+)*$/;
    return regex.test(value);
  };

  const todayDate = new Date().toISOString().split("T")[0];

  // Get user information from Redux store
  const user = authStore.getState().user;

  // Effect to check if the user is an admin
  useEffect(() => {
    if (user?.roleId !== 1) {
      // Redirect to the login page
      notifyService.error("You Are Not Admin !😡");
      navigate("/vacations");
    }
  }, []);

  return (
    <div className="AddVacation">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Destination Input */}
        <label htmlFor="destination">Destination:</label>
        <input
          type="text"
          id="destination"
          placeholder="✈"
          {...register("destination", {
            required: "Destination is required",
            minLength: {
              value: 2,
              message: "Destination must be at least 2 characters",
            },
            maxLength: {
              value: 40,
              message: "Destination cannot exceed 40 characters",
            },
            validate: (value) => isNotEmptyOrTabs(value) || "Destination cannot be empty or contain only spaces or tabs",
          })}
        />
        {errors.destination && <p className="error">{errors.destination.message}</p>}

        {/* Description Textarea */}
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 5,
              message: "Description must be at least 5 characters",
            },
            maxLength: {
              value: 250,
              message: "Description cannot exceed 250 characters",
            },
            validate: (value) => isNotEmptyOrTabs(value) || "Description cannot be empty or contain only spaces or tabs",
          })}
        />
        {errors.description && <p className="error">{errors.description.message}</p>}

        <div className="date-container">
          {/* Start Date Input */}
          <div className="date-input">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              {...register("startDate", {
                required: "Start Date is required",
                validate: (value) => isStartDateValid(value) || "Start Date cannot be in the past",
              })}
              min={todayDate}
            />
            {errors.startDate && <p className="error">{errors.startDate.message}</p>}
          </div>

          {/* End Date Input */}
          <div className="date-input">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              {...register("endDate", {
                required: "End Date is required",
                validate: (value) => isEndDateValid(value, startDateValue) || "End Date cannot be before Start Date",
              })}
            />
            {errors.endDate && <p className="error">{errors.endDate.message}</p>}
          </div>
        </div>

        {/* Price Input */}
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          placeholder="💸"
          {...register("price", {
            required: "Price is required",
            min: {
              value: 0,
              message: "Price cannot be negative",
            },
            max: {
              value: 9999,
              message: "Price cannot be more than 10,000",
            },
          })}
        />
        {errors.price && <p className="error">{errors.price.message}</p>}

        {/* Photo Upload */}
        <div className="upload-container">
          <label htmlFor="photo" className="custom-file-label"></label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            {...register("photo", {
              required: "Photo is required",
              onChange: (e) => {
                handleImageUpload(e);
                register("photo");
              },
            })}
            className="custom-file-input"
          />
        </div>

        {/* Display the selected image */}
        {uploadedPhoto && <img src={uploadedPhoto} alt="Uploaded" className="existing-photo" />}
        {errors.photo && <p className="error">{errors.photo.message}</p>}

        {/* Submit Button */}
        <button type="submit">Add Vacation</button>
      </form>
    </div>
  );
}

export default AddVacation;
