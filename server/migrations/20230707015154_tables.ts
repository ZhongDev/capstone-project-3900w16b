import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("Table", function (table) {
    table.increments("id");
    table
      .integer("restaurantId")
      .references("id")
      .inTable("Restaurant")
      .onDelete("CASCADE");
    table.string("name", 255).unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("Table");
}
