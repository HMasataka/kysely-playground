import { Kysely, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";

import { down, up } from "./migration";
import { Database, NewPerson, Person, PersonUpdate } from "./types";

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

export async function findPersonById(
  db: Kysely<Database>,
  id: number,
): Promise<Person | undefined> {
  return await db
    .selectFrom("person")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function updatePerson(
  db: Kysely<Database>,
  id: number,
  updateWith: PersonUpdate,
) {
  await db.updateTable("person").set(updateWith).where("id", "=", id).execute();
}

export async function createPerson(db: Kysely<Database>, person: NewPerson) {
  return await db
    .insertInto("person")
    .values(person)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deletePerson(db: Kysely<Database>, id: number) {
  return await db
    .deleteFrom("person")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
