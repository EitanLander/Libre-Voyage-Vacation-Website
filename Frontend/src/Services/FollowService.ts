import axios from "axios";
import FollowModel from "../Models/FollowModel";
import { authStore } from "../Redux/AuthState";
import appConfig from "../Utils/AppConfig";
import notifyService from "./NotifyService";

class FollowService {
  public async follow(userId: number, vacationId: number): Promise<void> {
    try {
      const options = {
        headers: { Authorization: "Bearer " + authStore.getState().token },
      };

      await axios.post(appConfig.followUrl, { userId, vacationId }, options);
      notifyService.success(`Followed Vacation ${vacationId} Successfully`);
    } catch (err: any) {
      console.error("Error following vacation:", err.message);
      // You can handle the error here, display an error message, or perform any other necessary actions.
    }
  }

  public async unFollow(userId: number, vacationId: number): Promise<void> {
    try {
      const options = {
        headers: { Authorization: "Bearer " + authStore.getState().token },
      };

      await axios.delete(appConfig.unfollowUrl + userId + "/" + vacationId, options);
      notifyService.error(`Unfollowed Vacation ${vacationId} Successfully`);
    } catch (err: any) {
      console.error("Error unfollowing vacation:", err.message);
    }
  }
}
const followService = new FollowService();

export default followService;
