import StatusCode from "./status-code";

// Base client error:
abstract class ClientError {
  public status: number;
  public message: string;

  public constructor(status: number, message: string) {
    this.status = status;
    this.message = message;
  }
}

export class UnauthorizedError extends ClientError {
  constructor(message: string) {
    super(StatusCode.Unauthorized, message);
  }
}

export class ForbiddenError extends ClientError {
  constructor(message: string) {
    super(StatusCode.Forbidden, message);
  }
}

// Route not found error:
export class RouteNotFoundError extends ClientError {
  public constructor(route: string) {
    super(404, `Route ${route} not found`);
  }
}

// Resource not found error:
export class ResourceNotFoundError extends ClientError {
  public constructor(id: number) {
    super(404, `id ${id} not found`);
  }
}

// Validation error:
export class ValidationError extends ClientError {
  public constructor(message: string) {
    super(400, message);
  }
}
