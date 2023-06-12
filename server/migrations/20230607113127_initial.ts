import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("Restaurant", function (table) {
    table.increments("id");
    table.string("email", 255).unique().notNullable();
    table.string("name", 255).notNullable();
    table.string("password", 255).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("Restaurant");
}