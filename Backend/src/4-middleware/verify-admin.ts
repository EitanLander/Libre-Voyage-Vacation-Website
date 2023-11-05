import { NextFunction, Request, Response } from "express";
import cyber from "../2-utils/cyber";

// Verify that the user is Admin:
function verifyAdmin(request: Request, response: Response, next: NextFunction): void {
  // Authorization: "Bearer the-token"
  const authorizationHeader = request.header("authorization");

  // Extract the token:
  const token = authorizationHeader?.substring(7);

  // Verify admin:
  cyber.verifyAdmin(token);

  // Continue to next middleware/route:
  next();
}

export default verifyAdmin;
