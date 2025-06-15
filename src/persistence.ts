import { Kysely } from "kysely";

import { Database, NewPerson, Person, PersonUpdate } from "./types";

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
