import { ForbiddenError, UnauthorizedError } from "../3-models/client-errors";
import RoleModel from "../3-models/role-model";
import UserModel from "../3-models/user-model";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Token secret key:
const tokenSecretKey = "Libre-Voyage-Website";

// Create JWT token:
function getNewToken(user: UserModel): string {
  // Container for user object inside the token:

  const container = { user };

  // Expiration:
  const options = { expiresIn: "3h" };

  // Create token:
  const token = jwt.sign(container, tokenSecretKey, options);

  // Return token:
  return token;
}

// Verify legal token:
function verifyToken(token: string): void {
  if (!token) throw new UnauthorizedError("Missing JWT token.");

  try {
    jwt.verify(token, tokenSecretKey);
  } catch (err: any) {
    throw new UnauthorizedError(err.message);
  }
}

// Verify admin role:
function verifyAdmin(token: string): void {
  // Verify legal token:
  verifyToken(token);

  // Get container:
  const container = jwt.verify(token, tokenSecretKey) as { user: UserModel };

  // Extract user:
  const user = container.user;

  // If not admin:
  if (user.roleId !== RoleModel.Admin) throw new ForbiddenError("You are not admin.");
}

// Hash salt :

const hashSalt = "TheMeToVacation";

function hashPassword(plainText: string): string {
  if (!plainText) return null;

  const hashedPassword = crypto.createHmac("sha512", hashSalt).update(plainText).digest("hex");

  return hashedPassword;
}

export default {
  getNewToken,
  verifyToken,
  verifyAdmin,
  hashPassword,
};
