import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("Order", (table) => {
    table.string("itemStatus");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("Order", (table) => {
    table.dropColumn("itemStatus");
  });
}
