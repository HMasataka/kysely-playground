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
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
function up(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema
            .createTable("person")
            .addColumn("id", "integer", (col) => col.primaryKey())
            .addColumn("first_name", "text", (col) => col.notNull())
            .addColumn("last_name", "text")
            .addColumn("gender", "text", (col) => col.notNull())
            .addColumn("created_at", "text", (col) => col.defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`).notNull())
            .execute();
        yield db.schema
            .createTable("pet")
            .addColumn("id", "integer", (col) => col.primaryKey())
            .addColumn("name", "text", (col) => col.notNull().unique())
            .addColumn("owner_id", "integer", (col) => col.references("person.id").onDelete("cascade").notNull())
            .addColumn("species", "text", (col) => col.notNull())
            .execute();
        yield db.schema.createIndex("pet_owner_id_index").on("pet").column("owner_id")
            .execute();
    });
}
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("pet").execute();
        yield db.schema.dropTable("person").execute();
    });
}
