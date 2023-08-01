export type ItemAlteration = {
  optionName: string;
  maxChoices: number;
  options: string[];
};

export type UpdateAlteration = { maxChoices?: number; optionName?: string };

export type Item = {
  name: string;
  description: string;
  ingredients: string | null;
  priceCents: number;
  minPrepMins?: number;
  maxPrepMins?: number;
  alterations?: ItemAlteration[];
};

export type UpdateCategory = { name?: string; displayOrder?: number };

export type UpdateItem = {
  name?: string;
  imageMimeType?: string;
  image?: string;
  description?: string;
  ingredients?: string | null;
  priceCents?: number;
  displayOrder?: number;
  minPrepMins?: number;
  maxPrepMins?: number;
};
