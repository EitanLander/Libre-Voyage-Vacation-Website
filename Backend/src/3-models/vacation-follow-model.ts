import Joi from "joi";
import { ValidationError } from "./client-errors";

class VacationFollowModel {
  public userId: number;
  public vacationId: number;

  public constructor(follow: VacationFollowModel) {
    this.userId = follow.userId;
    this.vacationId = follow.vacationId;
  }

  // Validation schema - build once:
  private static validationSchema = Joi.object({
    userId: Joi.number().required().integer().positive(),
    vacationId: Joi.number().required().integer().positive(),
  });

  // Instead of the validate method, you can directly validate an object like this:
  public static validate(follow: VacationFollowModel): void {
    const result = VacationFollowModel.validationSchema.validate(follow);
    if (result.error?.message) {
      throw new ValidationError(result.error.message);
    }
  }
}

export default VacationFollowModel;
