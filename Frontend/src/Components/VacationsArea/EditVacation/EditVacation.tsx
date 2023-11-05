import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import VacationsService from "../../../Services/VacationsService";
import notifyService from "../../../Services/NotifyService";
import "./EditVacation.css";
import { authStore } from "../../../Redux/AuthState";

function EditVacation(): JSX.Element {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VacationModel>();

  // Navigation hook
  const navigate = useNavigate();

  // Extracting vacationId from route params
  const params = useParams();
  const vacationId = +params.vacationId;

  // Initialize state variables
  const [photoDisplay, setPhotoDisplay] = useState<string | undefined>("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  // Function to handle image upload

  // Handle image change event
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      setSelectedPhoto(imageFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoDisplay(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  // Validation function to check if a string is not empty or contains only tabs
  const isNotEmptyOrTabs = (value: string) => {
    const regex = /^[^\s\t]+(\s[^\s\t]+)*$/;
    return regex.test(value);
  };

  // Effect to fetch vacation data and populate the form fields
  useEffect(() => {
    // Get the user from the Redux store
    const user = authStore.getState().user;

    // Check if the user is an admin
    if (user?.roleId !== 1) {
      notifyService.error("You Are Not Admin !");
      navigate("/vacations");
    }

    // Fetch the vacation data to populate the form fields
    VacationsService.getOneVacation(vacationId)
      .then((backendVacation) => {
        setValue("destination", backendVacation.destination);
        setValue("description", backendVacation.description);

        // Format and set the "Start Date" and "End Date"
        const startDate = new Date(backendVacation.startDate);
        const endDate = new Date(backendVacation.endDate);

        // Format dates as strings in the "yyyy-MM-dd" format
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        setValue("startDate", formattedStartDate);
        setValue("endDate", formattedEndDate);
        setValue("price", backendVacation.price);

        // Set the photo URL in the state
        setPhotoDisplay(`${backendVacation.photoUrl}`);
      })
      .catch((err) => notifyService.error(err));
  }, [vacationId, setValue]);

  // Function to check if the end date is valid
  const isEndDateValid = (endDate: string, startDate: string) => {
    const startDateValue = new Date(startDate + "T00:00:00Z");
    const endDateValue = new Date(endDate + "T00:00:00Z");
    return endDateValue >= startDateValue;
  };

  // Watch for changes in the start date
  const startDateValue = watch("startDate");

  // Function to handle form submission
  async function send(vacation: VacationModel) {
    try {
      vacation.vacationId = vacationId;
      vacation.photo = (vacation.photo as unknown as FileList)[0];

      if (selectedPhoto) {
        vacation.photo = selectedPhoto;
      } else {
        vacation.photoUrl = photoDisplay || "";
      }

      await VacationsService.updateVacation(vacation);

      notifyService.success("Vacation has been updated.");
      navigate("/vacations");
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  return (
    <div className="EditVacation">
      <h2>Edit Vacation</h2>
      <form onSubmit={handleSubmit(send)}>
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
            <input type="date" id="startDate" {...register("startDate", { required: "Start Date Is Required" })} />
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

        <input type="file" id="photo" accept="image/*" {...register("photo")} onChange={handleImageChange} className="custom-file-input" />
        {photoDisplay && (
          <div className="upload-container">
            <label htmlFor="photo" className="custom-file-label">
              Change Photo
            </label>

            {/* Display the selected photo URL */}
            <img src={photoDisplay} alt="Vacation" className="existing-photo" />
          </div>
        )}
        {/* Display error message if there is an error with the photo field */}
        {errors.photo && <p className="error">{errors.photo.message}</p>}

        {/* Submit Button */}
        <br />
        <div>
          <button>
            <NavLink to={"/vacations"}>Back</NavLink>
          </button>
          <button>Update</button>
        </div>
      </form>
    </div>
  );
}

export default EditVacation;
