import { Notyf } from "notyf";

class NotifyService {
  private notyf = new Notyf({
    duration: 3000,
    position: { x: "center", y: "top" },
  });

  public success(message: string, customClass?: string): void {
    this.notyf.success({
      message: message,
      className: customClass || "my-success-notification",
    });
  }

  public error(err: any, customClass?: string): void {
    const message = this.extractErrorMessage(err);
    this.notyf.error({
      message: message,
      className: customClass || "my-error-notification",
    });
  }

  private extractErrorMessage(err: any): string {
    // If error is the message string:
    if (typeof err === "string") return err;

    // If error thrown by axios:
    if (err.response?.data) return err.response.data;

    // Unknown error (JIC = Just in Case)
    return "Some error, please try again";
  }
}

const notifyService = new NotifyService();

export default notifyService;
