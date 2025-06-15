import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";

import { down, up } from "./migration";
import { Database, NewPerson, PersonUpdate } from "./types";
import {
  findPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} from "./persistence";

export function getPath(): string {
  return "./db.sqlite";
}

main();

async function main() {
  const dialect = new SqliteDialect({
    database: new SQLite("./db.sqlite"),
  });
  const db = new Kysely<Database>({ dialect });

  try {
    await up(db);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
  const person: NewPerson = {
    first_name: "John",
    gender: "man",
    last_name: "Doe",
    created_at: new Date().toISOString(),
  };
  const createdPerson = await createPerson(db, person);
  console.log("Created Person:", createdPerson);

  const foundPerson = await findPersonById(db, createdPerson.id);
  console.log("Found Person:", foundPerson);

  const updateData: PersonUpdate = { last_name: "Smith" };
  await updatePerson(db, createdPerson.id, updateData);

  console.log("Updated Person:", await findPersonById(db, createdPerson.id));

  const deletedPerson = await deletePerson(db, createdPerson.id);
  console.log("Deleted Person:", deletedPerson);

  const shouldBeUndefined = await findPersonById(db, createdPerson.id);
  console.log("Should be undefined:", shouldBeUndefined);

  try {
    await down(db);
    console.log("Database rolled back successfully");
  } catch (error) {
    console.error("Error rolling back database:", error);
  }
}
