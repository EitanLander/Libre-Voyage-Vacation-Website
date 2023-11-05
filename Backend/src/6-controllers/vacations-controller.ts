import express, { NextFunction, Request, Response } from "express";
import path from "path";
import StatusCode from "../3-models/status-code";
import VacationsModel from "../3-models/vacations-model";
import verifyAdmin from "../4-middleware/verify-admin";
import verifyToken from "../4-middleware/verify-token";
import vacationService from "../5-services/vacations-service";

// Create the router part of express:
const router = express.Router();

// GET http://localhost:4000/api/vacations
router.get("/vacations",verifyToken, async (request: Request, response: Response, next: NextFunction) => {
  try {
    // Get all vacations from database:
    const vacations = await vacationService.getAllVacations();

    // Response back all vacations:
    response.json(vacations);
  } catch (err: any) {
    next(err);
  }
});

// GET http://localhost:4000/api/vacations/:vacationId
router.get("/vacations/:vacationId([0-9]+)",verifyToken, async (request: Request, response: Response, next: NextFunction) => {
  try {
    // Get route id:
    const vacationId = +request.params.vacationId;

    // Get one vacation from database:
    const vacation = await vacationService.getOneVacation(vacationId);

    // Response back desired vacation:
    response.json(vacation);
  } catch (err: any) {
    next(err);
  }
});

// POST http://localhost:4000/api/vacations
router.post("/vacations", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
  try {
    // Add image from request.files into request.body:
    request.body.photo = request.files?.photo;

    // Get vacation sent from frontend:
    const vacation = new VacationsModel(request.body);

    // Add vacation to database:
    const addedVacation = await vacationService.addVacation(vacation);

    // Response back the added vacation:
    response.status(StatusCode.Created).json(addedVacation);

    console.log(addedVacation);
  } catch (err: any) {
    next(err);
  }
});

// PUT http://localhost:4000/api/vacations/:vacationId
router.put("/vacations/:vacationId([0-9]+)", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
  try {
    // Extract route id into body:
    request.body.vacationId = +request.params.vacationId;

    // Add image from request.files into request.body:
    request.body.photo = request.files?.photo;

    // Get vacation sent from frontend:
    const vacation = new VacationsModel(request.body);

    // Update vacation in database:
    const updatedVacation = await vacationService.updateVacation(vacation);

    // Response back the updated vacation:
    response.json(updatedVacation);
  } catch (err: any) {
    next(err);
  }
});

// DELETE http://localhost:4000/api/vacations/:vacationId
router.delete("/vacations/:vacationId([0-9]+)", verifyAdmin, async (request: Request, response: Response, next: NextFunction) => {
  try {
    // Get route vacationId:
    const vacationId = +request.params.vacationId;

    // Delete vacation from database:
    await vacationService.deleteVacation(vacationId);

    // Response back:
    response.sendStatus(StatusCode.NoContent);
  } catch (err: any) {
    next(err);
  }
});

// GET http://localhost:4000/api/vacations/:photoUrl
router.get("/vacations/:photoUrl", async (request: Request, response: Response, next: NextFunction) => {
  try {
    // Get image name:
    const photoUrl = request.params.photoUrl;

    // Get image absolute path:
    const absolutePath = path.join(__dirname, "..", "1-assets", "images", photoUrl);

    // Response back the image file:
    response.sendFile(absolutePath);
  } catch (err: any) {
    next(err);
  }
});

// Export the above router:
export default router;
