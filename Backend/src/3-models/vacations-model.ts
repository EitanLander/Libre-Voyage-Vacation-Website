import { UploadedFile } from "express-fileupload";
import Joi from "joi";
import { ValidationError } from "./client-errors";

class VacationsModel {
  public vacationId: number;
  public destination: string;
  public description: string;
  public startDate: Date;
  public endDate: Date;
  public price: number;
  public photoUrl: string;
  public photo: UploadedFile;

  public constructor(vacation: VacationsModel) {
    this.vacationId = vacation.vacationId;
    this.destination = vacation.destination;
    this.description = vacation.description;
    this.startDate = vacation.startDate;
    this.endDate = vacation.endDate;
    this.price = vacation.price;
    this.photoUrl = vacation.photoUrl;
    this.photo = vacation.photo;
  }

  private static validationSchema = Joi.object({
    vacationId: Joi.number().optional().integer().positive(),
    destination: Joi.string().required().min(2).max(40),
    description: Joi.string().required().min(5).max(250),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    price: Joi.number().required().min(0).max(9999),
    photoUrl: Joi.string().optional().min(40).max(250),
    photo: Joi.object().optional(),
  });

  public validate(): void {
    const result = VacationsModel.validationSchema.validate(this);
    if (result.error?.message) throw new ValidationError(result.error.message);
  }
}

export default VacationsModel;
