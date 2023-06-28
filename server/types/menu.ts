export type Item = {
  name: string;
  description: string;
  ingredients: string | null;
  priceCents: number;
};

export type UpdateCategory = { name?: string; displayOrder?: number };

export type UpdateItem = {
  name?: string;
  description?: string;
  ingredients?: string | null;
  priceCents?: number;
  displayOrder?: number;
};
