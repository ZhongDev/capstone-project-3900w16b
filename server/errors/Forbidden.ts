import CustomError from "./CustomError";

export default class Forbidden extends CustomError {
  status = 403;
  constructor(message = "Forbidden") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
