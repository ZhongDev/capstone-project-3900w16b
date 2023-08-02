import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("OrderGroup", (table) => {
    table.boolean("paid").notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("OrderGroup", (table) => {
    table.dropColumn("paid");
  });
}
