import { OkPacket } from "mysql";
import UserModel from "../3-models/user-model";
import dal from "../2-utils/dal";
import cyber from "../2-utils/cyber";
import { ResourceNotFoundError, UnauthorizedError, ValidationError } from "../3-models/client-errors";
import CredentialsModel from "../3-models/credentials-model";
import RoleModel from "../3-models/role-model";

// Register a new user:
// This function registers a new user, performs validation, and returns a JWT token upon successful registration.
async function register(user: UserModel): Promise<string> {
  // Validation:
  user.validate();

  // Set "User" as role:
  user.roleId = RoleModel.User;

  user.password = cyber.hashPassword(user.password);

  // Check if email is already taken:
  if (await isEmailTaken(user.email)) throw new ValidationError(`Email ${user.email} already taken.`);

  // SQL:
  const sql = `INSERT INTO users(firstName, lastName, email, password, roleId)
    VALUES(?,?,?,?,?)`;

  // Execute:
  const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.email, user.password, user.roleId]);

  // Set the new user's ID:
  user.userId = info.insertId;

  // Get a new token:
  const token = cyber.getNewToken(user);

  // Return the token:
  return token;
}

// Login:
// This function handles user login, performs validation, and returns a JWT token upon successful login.
async function login(credentials: CredentialsModel): Promise<string> {
  // Validation:
  credentials.validate();

  credentials.password = cyber.hashPassword(credentials.password);

  // SQL:
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  // Execute:
  const users = await dal.execute(sql, [credentials.email, credentials.password]);

  // Extract user:
  if (users.length === 0) throw new UnauthorizedError("Incorrect email or password");

  const user = users[0];

  // Get a new token:
  const token = cyber.getNewToken(user);

  // Return the token:
  return token;
}

// Is email taken:
// This function checks if an email address is already registered in the system.
async function isEmailTaken(email: string): Promise<boolean> {
  const sql = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
  const result = await dal.execute(sql, [email]);
  const count = result[0].count;
  return count > 0;
}

// Get one user by ID:
// This function retrieves a user's information based on their user ID.
async function getOneUser(id: number): Promise<UserModel> {
  const sql = "SELECT * FROM users WHERE id = ?";
  const users = await dal.execute(sql, [id]);

  if (users.length === 0) throw new ResourceNotFoundError(id);

  const user = users[0];

  return user;
}

// Update user information:
// This function updates a user's information (first name, last name, email) based on their user ID.
async function updateUser(user: UserModel): Promise<UserModel> {
    const sql = `
      UPDATE users SET
        firstName = ?,
        lastName = ?,
        email = ?
      WHERE id = ?`;
  
    const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.email, user.userId]);

  if (info.affectedRows === 0) throw new ResourceNotFoundError(user.userId);

  return user;
}

export default {
  register,
  login,
  getOneUser,
  updateUser,
};
