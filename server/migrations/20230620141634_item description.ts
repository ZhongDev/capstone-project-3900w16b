import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("Item", (table) => {
    table.string("description", 255);
    table.string("ingredients", 255);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("Item", (table) => {
    table.dropColumns("description", "ingredients");
  });
}
