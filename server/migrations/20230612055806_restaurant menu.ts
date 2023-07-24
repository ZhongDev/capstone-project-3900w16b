import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable("Category", function (table) {
      table.increments("id");
      table
        .integer("restaurantId")
        .references("id")
        .inTable("Restaurant")
        .onDelete("CASCADE");
      table.integer("displayOrder").notNullable();
      table.string("name", 255).notNullable();
    })
    .createTable("Item", function (table) {
      table.increments("id");
      table
        .integer("categoryId")
        .references("id")
        .inTable("Category")
        .onDelete("CASCADE");
      table.integer("displayOrder").notNullable();
      table.integer("name", 255).notNullable();
      table.string("image", 255);
      table.integer("priceCents", 255).notNullable();
      table.integer("minPrepMins", 255);
      table.integer("maxPrepMins", 255);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("Category").dropTable("Item");
}
