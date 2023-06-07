import { config as dot } from "dotenv";
dot();

import Knex from "knex";
import config from "./knexfile";

import { Model } from "objection";

const knex = Knex(config[process.env.NODE_ENV || "development"]);
Model.knex(knex);

export { knex };
