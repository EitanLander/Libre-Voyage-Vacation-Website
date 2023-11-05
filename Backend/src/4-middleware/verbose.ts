import { Request, Response, NextFunction } from "express";

// Console log everything:
function verbose(request: Request, response: Response, next: NextFunction): void {
  const now = new Date();

  console.log("Time: " + now.toLocaleString());
  console.log("Route: " + request.originalUrl);
  console.log("Method: " + request.method);
  console.log("Body: ", request.body);
  console.log("\n-----------------------------\n");

  next(); // Continue Request.
}

export default verbose;
