class VacationModel {
  public vacationId: number;
  public destination: string;
  public description: string;
  public startDate: string;
  public endDate: string;
  public price: number;
  public photoUrl: string;
  public photo: File;
  public followersCount = 0;
  public isFollowing = 0;
}

export default VacationModel;
