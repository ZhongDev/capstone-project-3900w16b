declare namespace Express {
  export interface Request {
    restaurant?: {
      restaurantId: number;
    };
  }
}
