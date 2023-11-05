import { NextFunction, Request, Response } from "express";

function catchAll(err: any, request: Request, response: Response, next: NextFunction) {
  // Display error:
  console.log(err);

  // Find status code:
  const statusCode = err.status || 500; // Short Circuit

  // Send back error details to frontend:
  response.status(statusCode).send(err.message);
}

export default catchAll;
