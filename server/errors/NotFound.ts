import CustomError from "./CustomError";

export default class NotFound extends CustomError {
  status = 404;
  constructor(message = "Not Found") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
