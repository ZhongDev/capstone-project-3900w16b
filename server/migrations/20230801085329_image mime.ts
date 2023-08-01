import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("Item", (table) => {
    table.string("imageMimeType");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("Item", (table) => {
    table.dropColumn("imageMimeType");
  });
}
