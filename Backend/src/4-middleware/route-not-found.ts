import { NextFunction, Request, Response } from "express";
import { RouteNotFoundError } from "../3-models/client-errors";
import paths from "../2-utils/paths";

function routeNotFound(request: Request, response: Response, next: NextFunction) {
  const err = new RouteNotFoundError(request.originalUrl);
  next(err);
}

export function pageNotFound(request: Request, response: Response, next: NextFunction) {
    response.sendFile(paths.frontendIndexHtml);
}

export default routeNotFound;
