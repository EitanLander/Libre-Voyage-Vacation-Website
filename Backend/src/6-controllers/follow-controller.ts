import express, { NextFunction, Request, Response } from "express";
import StatusCode from "../3-models/status-code";
import VacationFollowModel from "../3-models/vacation-follow-model";
import verifyToken from "../4-middleware/verify-token";
import followService from "../5-services/follow-service";
import verifyAdmin from "../4-middleware/verify-admin";

// Create the router part of express:
const router = express.Router();

// POST http://localhost:4000/api/vacations/follow
router.post("/vacations/follow", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
  const followed = new VacationFollowModel(request.body);

  try {
    VacationFollowModel.validate(followed);

    await followService.userFollow(followed);
    response.status(StatusCode.Created).json({ message: `${followed.userId}"Vacation followed successfully.` });
  } catch (err: any) {
    next(err);
  }
});

// DELETE http://localhost:4000/api/vacations/unfollow
router.delete("/vacations/unfollow/:userId([0-9]+)/:vacationId([0-9]+)", verifyToken, async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = +request.params.userId;
    const vacationId = +request.params.vacationId;

    // Call the userUnfollow method with the validated instance
    await followService.userUnfollow(userId, vacationId);

    response.sendStatus(StatusCode.NoContent);
  } catch (err: any) {
    next(err);
  }
});

// GET http://localhost:4000/api/vacations/followed-vacations/:userId
router.get("/vacations/followed-vacations/:userId",verifyToken, async (request: Request, response: Response, next: NextFunction) => {
  try {
    const userId = +request.params.userId;
    const vacations = await followService.getAllFollowedVacations(userId);
    response.json(vacations);
  } catch (err: any) {
    next(err);
  }
});

// Export the above router:
export default router;
