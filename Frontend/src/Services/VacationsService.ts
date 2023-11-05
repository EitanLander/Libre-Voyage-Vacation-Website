import axios from "axios";
import appConfig from "../Utils/AppConfig";
import { VacationActionType, VacationsAction, vacationsStore } from "../Redux/VacationsState";
import VacationModel from "../Models/VacationModel";
import { authStore } from "../Redux/AuthState";

class VacationService {
  // Get all vacations
  public async getAllVacations(userId: number): Promise<VacationModel[]> {
    try {
      const options = {
        headers: { Authorization: "Bearer " + authStore.getState().token },
      };
      const response = await axios.get(appConfig.isUserFollowUrl + userId, options);
      const vacations = response.data;
      return vacations;
    } catch (error) {
      console.log("Error while getting all vacations.\n Please Try Again Later");
    }
  }

  // Get all vacations for followers
  public async getAllVacationsFollowers(): Promise<VacationModel[]> {
    try {
      const options = {
        headers: { Authorization: "Bearer " + authStore.getState().token },
      };
      const response = await axios.get(appConfig.vacationUrl, options);
      const vacations = response.data;
      return vacations;
    } catch (error) {
      console.log("Error while getting all vacations.\n Please Try Again Later");
    }
  }

  // Get details of a specific vacation
  public async getOneVacation(vacationId: number): Promise<VacationModel> {
    try {
      const options = {
        headers: { Authorization: "Bearer " + authStore.getState().token },
      };
      let vacations = vacationsStore.getState().vacations;
      let vacation = vacations.find((v) => v.vacationId === vacationId);

      if (!vacation) {
        const response = await axios.get<VacationModel>(appConfig.vacationUrl + vacationId, options);
        vacation = response.data;
      }
      return vacation;
    } catch (error) {
      console.log("Error while getting one vacation.\n Please Try Again Later");
    }
  }

  // Add a new vacation
  public async addVacation(vacation: VacationModel): Promise<void> {
    try {
      const authToken = authStore.getState().token;
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.post<VacationModel>(appConfig.vacationUrl, vacation, options);
      const addedVacation = response.data;

      const action: VacationsAction = { type: VacationActionType.AddVacations, payload: addedVacation };
      vacationsStore.dispatch(action);
    } catch (error) {
      console.log("Error while adding vacation.\n Please Try Again Later");
    }
  }

  // Update an existing vacation
  public async updateVacation(vacation: VacationModel): Promise<void> {
    try {
      const authToken = authStore.getState().token;
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.put<VacationModel>(appConfig.vacationUrl + vacation.vacationId, vacation, options);
      const updatedVacation = response.data;

      const action: VacationsAction = { type: VacationActionType.UpdateVacation, payload: updatedVacation };
      vacationsStore.dispatch(action);
    } catch (error) {
      console.log("Error while updating vacation.\n Please Try Again Later");
    }
  }

  // Delete a vacation
  public async deleteVacation(vacationId: number): Promise<void> {
    try {
      const authToken = authStore.getState().token;
      const options = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      };

      await axios.delete(appConfig.vacationUrl + vacationId, options);

      const action: VacationsAction = { type: VacationActionType.DeleteVacation, payload: vacationId };
      vacationsStore.dispatch(action);
    } catch (error) {
      console.log("Error while deleting vacation.\n Please Try Again Later");
    }
  }
}

const vacationService = new VacationService(); // Singleton
export default vacationService;
