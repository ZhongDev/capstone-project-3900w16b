import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("Alteration", (table) => {
      table.increments("id");
      table
        .integer("itemId")
        .references("id")
        .inTable("Item")
        .onDelete("CASCADE");
      table.string("optionName", 255).notNullable();
      table.integer("maxChoices").notNullable().defaultTo(1);
    })
    .createTable("AlterationOption", (table) => {
      table.increments("id");
      table
        .integer("alterationId")
        .references("id")
        .inTable("Alteration")
        .onDelete("CASCADE");
      table.string("choice", 255).notNullable();
    })
    .createTable("OrderAlteration", (table) => {
      table.increments("id");
      table
        .integer("orderId")
        .references("id")
        .inTable("Order")
        .onDelete("CASCADE");
      table
        .integer("alterationId")
        .references("id")
        .inTable("Alteration")
        .onDelete("CASCADE");
      table
        .integer("alterationOptionId")
        .references("id")
        .inTable("AlterationOption")
        .onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("Alteration")
    .dropTable("AlterationOption")
    .dropTable("OrderAlteration");
}
