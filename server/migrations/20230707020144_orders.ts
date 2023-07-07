import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("Order", function (table) {
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
    table
      .integer("itemId")
      .references("id")
      .inTable("Item")
      .onDelete("CASCADE");
    table.integer("units").notNullable().defaultTo(1);
    table.string("status").notNullable().defaultTo("ordered");
    table.string("device");
    table.datetime("placedOn").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("Order");
}
