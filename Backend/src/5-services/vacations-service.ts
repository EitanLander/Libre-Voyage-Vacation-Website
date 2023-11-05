import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import imageHelper from "../2-utils/image-helper";
import { ResourceNotFoundError } from "../3-models/client-errors";
import VacationsModel from "../3-models/vacations-model";
import appConfig from "../2-utils/app-config";

// Get all vacations with optional sorting:
async function getAllVacations(sortOrder: "asc" | "desc" = "asc"): Promise<VacationsModel[]> {
  try {
    // Create SQL query with optional ORDER BY clause and COUNT for followers:
    const sql = `
        SELECT 
          V.*,
          COUNT(F.userId) AS followersCount,
          CONCAT('http://localhost:4000/api/vacations/', V.photoUrl) as photoUrl
        FROM vacations as V
        LEFT JOIN vacationfollowers as F ON V.vacationId = F.vacationId
        GROUP BY V.vacationId
        ORDER BY price ${sortOrder}`; // ASC or DESC based on sortOrder

    // Get vacations from the database:
    const vacations = await dal.execute(sql); // Returns array

    // Return vacations:
    return vacations;
  } catch (err) {
    throw err;
  }
}

// Get one vacation:
async function getOneVacation(vacationId: number): Promise<VacationsModel> {
  try {
    // Create sql:
    const sql = `SELECT 
    vacationId,
    destination,
    description,
    startDate,
    endDate,
    price,
    CONCAT('http://localhost:4000/api/vacations/', photoUrl) as photoUrl
    FROM vacations
                WHERE vacationId = ${vacationId}`;

    // Get vacations from database containing one vacation:
    const vacations = await dal.execute(sql); // Returns array

    // Extract the single vacation:
    const vacation = vacations[0];

    // If no such vacation:
    if (!vacation) throw new ResourceNotFoundError(vacationId);

    // Return vacations:
    return vacation;
  } catch (err) {
    throw err;
  }
}

// Add vacation:
async function addVacation(vacation: VacationsModel): Promise<VacationsModel> {
  // Check validity for all model properties:
  vacation.validate();

  const imageName = await imageHelper.saveImage(vacation.photo);
  const sql = `INSERT INTO vacations VALUES(DEFAULT, ?, ?, ?, ?, ?, ?)`; // Defend sql injection.
  const info: OkPacket = await dal.execute(sql, [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, imageName]);
  vacation.vacationId = info.insertId; // Generate unique id.

  vacation.photoUrl = `http://localhost:4000/api/vacations/${imageName}`; // Create reference for the image file.
  delete vacation.photo; // Remove the image object from the new vacation.
  return vacation;
}

// Update vacation:
async function updateVacation(vacation: VacationsModel): Promise<VacationsModel> {
  try {
    // Validate:
    vacation.validate();

    let sql = "",
      photoUrl = "";

    const oldImage = await getOldImage(vacation.vacationId);
    photoUrl = oldImage;

    if (vacation.photo) {
      photoUrl = await imageHelper.updateImage(vacation.photo, oldImage);
    }

    // Create sql:
    sql = `UPDATE vacations SET 
    destination = ?,
    description = ?,
    startDate = ?,
    endDate = ?,
    price = ?,
    photoUrl = ?
    WHERE vacationId = ?`;

    // Values for parameterized query:
    const values = [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, photoUrl, vacation.vacationId];

    // Execute sql with values array, get back info object:
    const info: OkPacket = await dal.execute(sql, values);

    // If vacation does not exist:
    if (info.affectedRows === 0) throw new ResourceNotFoundError(vacation.vacationId);

    // Get image URL:
    vacation.photoUrl = `http://localhost:4000/api/vacations/${photoUrl}`;

    // Remove image from the vacation object because we don't include it in the response:
    delete vacation.photo;

    // Return updated vacation:
    return vacation;
  } catch (err) {
    throw err;
  }
}

// Delete vacation:
async function deleteVacation(vacationId: number): Promise<void> {
  try {
    // Take old image:
    const oldImage = await getOldImage(vacationId);

    // Delete that image:
    await imageHelper.deleteImage(oldImage);

    // Create sql:
    const sql = `DELETE FROM vacations WHERE vacationID = ${vacationId}`;

    // Execute sql, get back info object:
    const info: OkPacket = await dal.execute(sql);

    // If vacation not exist (can also ignore this case):
    if (info.affectedRows === 0) throw new ResourceNotFoundError(vacationId);
  } catch (err) {
    throw err;
  }
}

// Get image name:
async function getOldImage(vacationId: number): Promise<string> {
  try {
    const sql = `SELECT photoUrl FROM vacations WHERE vacationId = ${vacationId}`;
    const vacations = await dal.execute(sql);
    const vacation = vacations[0];
    if (!vacation) return null;
    const photoUrl = vacation.photoUrl;
    return photoUrl;
  } catch (err) {
    throw err;
  }
}

export default {
  getAllVacations,
  getOneVacation,
  addVacation,
  updateVacation,
  deleteVacation,
};
