import RoleModel from "./RoleModel";

class UserModel {
  public userId: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public roleId: RoleModel;
}

export default UserModel;
