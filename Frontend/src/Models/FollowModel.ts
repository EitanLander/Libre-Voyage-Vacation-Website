class FollowModel {
  public userId: number;
  public vacationId: number;

  public constructor(follow: FollowModel) {
    this.userId = follow.userId;
    this.vacationId = follow.vacationId;
  }
}

export default FollowModel;
