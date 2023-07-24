export type Item = {
  name: string;
  description: string;
  ingredients: string | null;
  priceCents: number;
  minPrepMins?: number;
  maxPrepMins?: number;
};

export type UpdateCategory = { name?: string; displayOrder?: number };

export type UpdateItem = {
  name?: string;
  description?: string;
  ingredients?: string | null;
  priceCents?: number;
  displayOrder?: number;
  minPrepMins?: number;
  maxPrepMins?: number;
};
