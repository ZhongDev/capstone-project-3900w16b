import CustomError from "./CustomError";

export default class BadRequest extends CustomError {
  status = 400;
  constructor(message = "Bad Request") {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
