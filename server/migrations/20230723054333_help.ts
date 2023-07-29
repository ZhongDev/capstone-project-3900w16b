import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("Help", function (table) {
    table.increments("id");
    table
      .integer("restaurantId")
      .references("id")
      .inTable("Restaurant")
      .onDelete("CASCADE");
    table
      .integer("tableId")
      .references("id")
      .inTable("Table")
      .onDelete("CASCADE");
    table.string("status").notNullable().defaultTo("unresolved");
    table.datetime("placedOn").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("Help");
}
