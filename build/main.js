"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = getPath;
exports.findPersonById = findPersonById;
exports.updatePerson = updatePerson;
exports.createPerson = createPerson;
exports.deletePerson = deletePerson;
const kysely_1 = require("kysely");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const migration_ts_1 = require("./migration.ts");
function getPath() {
    return "./db.sqlite";
}
if (import.meta.main) {
    const dialect = new kysely_1.SqliteDialect({
        database: new better_sqlite3_1.default(":memory:"),
    });
    const db = new kysely_1.Kysely({ dialect });
    try {
        await (0, migration_ts_1.up)(db);
        console.log("Database initialized successfully");
    }
    catch (error) {
        console.error("Error initializing database:", error);
    }
    const person = {
        first_name: "John",
        gender: "man",
        last_name: "Doe",
        created_at: new Date().toISOString(),
    };
    const createdPerson = await createPerson(db, person);
    console.log("Created Person:", createdPerson);
    const foundPerson = await findPersonById(db, createdPerson.id);
    console.log("Found Person:", foundPerson);
    const updateData = { last_name: "Smith" };
    await updatePerson(db, createdPerson.id, updateData);
    console.log("Updated Person:", await findPersonById(db, createdPerson.id));
    const deletedPerson = await deletePerson(db, createdPerson.id);
    console.log("Deleted Person:", deletedPerson);
    const shouldBeUndefined = await findPersonById(db, createdPerson.id);
    console.log("Should be undefined:", shouldBeUndefined);
    try {
        await (0, migration_ts_1.down)(db);
        console.log("Database rolled back successfully");
    }
    catch (error) {
        console.error("Error rolling back database:", error);
    }
}
function findPersonById(db, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db.selectFrom("person").where("id", "=", id).selectAll()
            .executeTakeFirst();
    });
}
function updatePerson(db, id, updateWith) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.updateTable("person").set(updateWith).where("id", "=", id)
            .execute();
    });
}
function createPerson(db, person) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db.insertInto("person").values(person).returningAll()
            .executeTakeFirstOrThrow();
    });
}
function deletePerson(db, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield db.deleteFrom("person").where("id", "=", id).returningAll()
            .executeTakeFirst();
    });
}
