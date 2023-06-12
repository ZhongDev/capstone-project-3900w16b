import CustomError from "./CustomError";

export default class Unauthorized extends CustomError {
  status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
