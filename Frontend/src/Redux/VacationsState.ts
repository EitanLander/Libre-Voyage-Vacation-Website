import { createStore } from "redux";
import VacationModel from "../Models/VacationModel";

// 1. Global State:
export class VacationsState {
  public vacations: VacationModel[] = []; // Init with empty array.
}

// 2. Action Type:
export enum VacationActionType {
  SetVacations = "SetVacations",
  AddVacations = "AddVacations",
  UpdateVacation = "UpdateVacation",
  DeleteVacation = "DeleteVacation",
  ClearAll = "ClearAll",
  UserFollowVacation = "UserFollowVacation",
}

// 3. Action:
export interface VacationsAction {
  type: VacationActionType; // Action Type.
  payload?: any; // The data related to that action.
}

// 4. Reducer (invoked by redux library):
export function vacationsReducer(currentState = new VacationsState(), action: VacationsAction): VacationsState {
  const newState = { ...currentState }; // Duplicate the global state using Spread Operator.

  // Change the duplicated global state according the action:
  switch (action.type) {
    case VacationActionType.SetVacations: // Here the payload is vacation array to set.
      newState.vacations = action.payload; // Save all vacation into global state.
      break;

    case VacationActionType.AddVacations: // Here the payload is a single vacation to add:
      newState.vacations.push(action.payload); // Add that vacation into global state.
      break;

    case VacationActionType.UpdateVacation: // Here the payload is a single vacation to update.
      const indexToUpdate = newState.vacations.findIndex((v) => v.vacationId === action.payload.id);
      if (indexToUpdate >= 0) newState.vacations[indexToUpdate] = action.payload;
      break;

    case VacationActionType.DeleteVacation: // Here the payload is the id of the vacation to delete.
      const indexToDelete = newState.vacations.findIndex((v) => v.vacationId === action.payload);
      if (indexToDelete >= 0) newState.vacations.splice(indexToDelete, 1);
      break;

    case VacationActionType.UserFollowVacation:
      const { vacationId, isFollowing } = action.payload || {};
      const vacationToUpdate = newState.vacations.find((v) => v.vacationId === vacationId);
      if (vacationToUpdate) vacationToUpdate.isFollowing = isFollowing || false;
      break;

    default:
      break;
  }

  return newState; // Return the changed duplicated global state.
}

// 5. Store:
export const vacationsStore = createStore(vacationsReducer);
