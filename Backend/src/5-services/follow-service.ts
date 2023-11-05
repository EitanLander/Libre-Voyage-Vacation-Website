import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import VacationFollowModel from "../3-models/vacation-follow-model";
import VacationsModel from "../3-models/vacations-model";

async function userFollow(followed: VacationFollowModel): Promise<void> {
  try {
    const sql = `INSERT INTO vacationfollowers (userId,vacationId)
      VALUES (?,?)`;

    await dal.execute(sql, [followed.userId, followed.vacationId]);
  } catch (err) {
    throw err;
  }
}

async function userUnfollow(userId: number, vacationId: number): Promise<void> {
  try {
    const sql = `DELETE FROM vacationfollowers WHERE userId= ? AND vacationId= ?`;

    const info: OkPacket = await dal.execute(sql, [userId, vacationId]);

    if (info.affectedRows === 0) {
      throw new Error("User Don't Follow.");
    }
  } catch (err) {
    throw err;
  }
}

async function getAllFollowedVacations(userId: number, sortOrder: "asc" | "desc" = "asc"): Promise<VacationsModel[]> {
  try {
    // Create SQL query with optional ORDER BY clause and CONCAT for photoUrl:
    const sql = `
        SELECT DISTINCT
            V.*,
            EXISTS(SELECT * FROM vacationfollowers WHERE vacationId = F.vacationId AND userId = ?) AS isFollowing,
            COUNT(F.userId) AS followersCount,
            CONCAT('http://localhost:4000/api/vacations/', V.photoUrl) as photoUrl
        FROM vacations as V LEFT JOIN vacationfollowers as F
        ON V.vacationId = F.vacationId
        GROUP BY vacationId
        ORDER BY startDate ${sortOrder}
        `;

    const vacations = await dal.execute(sql, [userId]);

    return vacations;
  } catch (err) {
    throw err;
  }
}

export default {
  userFollow,
  userUnfollow,
  getAllFollowedVacations,
};
