import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
    path:".env.local"
})

if(!process.env.DATABASE_URL){
    throw new Error("Database url is not set in .env.local");
}

export default defineConfig({
  out: './drizzle',                 // folder where migration files will be stored
  schema: './lib/db/schema.ts',     // path to DB schema
  dialect: 'postgresql',            // database type
  dbCredentials: {
    url: process.env.DATABASE_URL!, // connection string
  },
  migrations:{
    table: "__drizzle_migration",   // table to track applied migrations
    schema: "public"                // DB schema where migration table lives
  },
  verbose: true,                    // log migration details in console
  strict: true,                     // fail if schema/migration has issues
});
