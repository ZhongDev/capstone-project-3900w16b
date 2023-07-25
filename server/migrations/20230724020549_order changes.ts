import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("OrderGroup", (table) => {
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
      table.string("device");
      table.string("status").notNullable().defaultTo("ordered");
      table.datetime("placedOn").notNullable();
    })
    .table("Order", (table) => {
      table.dropColumn("restaurantId");
      table.dropColumn("tableId");
      table.dropColumn("device");
      table.dropColumn("status");
      table.dropColumn("placedOn");
      table
        .integer("orderGroupId")
        .references("id")
        .inTable("OrderGroup")
        .onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("OrderGroup").table("Order", (table) => {
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
    table.string("device");
    table.string("status").notNullable().defaultTo("ordered");
    table.datetime("placedOn");
    table.dropColumn("orderGroupId");
  });
}
