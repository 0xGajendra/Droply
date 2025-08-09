import {pgTable, text, uuid, integer, boolean, timestamp} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';


export const files = pgTable("files",{
    id: uuid("id").defaultRandom().primaryKey(),

    //basic file/folder information
    name: text("name").notNull(),
    path: text("path").notNull(), // /document/project/resume
    size: integer("size").notNull(),
    type: text("type").notNull() , //"folder"


    //storage information
    fileUrl: text("file_url").notNull(), //url to access file
    thumbnailUrl: text("thumbnail_url"),

    //ownernship
    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"), //parent folder id (null -> root items)

    // file/foler flags
    isFolder: boolean("is_folder").default(false).notNull(),
    isStarred: boolean("is_starred").default(false).notNull(),
    isTrashed: boolean("is_trashed").default(false).notNull(),

    //Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

/**
 * Relationships between files (self-referencing table)
 * This is how we connect files and folders together in a hierarchy.
 * 
 * Think of it like this:
 * - A folder can have many items inside it (children).
 * - A file/folder can be inside one folder (parent).
 */
export const fileRelations = relations(files, ({ one, many }) => ({
    // The "parent" relation means:
    // This file/folder is inside ONE other folder.
    // We match our `parentId` with the `id` of another file/folder.
    parent: one(files, {
        fields: [files.parentId],  // our column that stores the parent folder ID
        references: [files.id],    // the column in "files" table that we're linking to
    }),

    // The "children" relation means:
    // This file/folder contains MANY other files/folders inside it.
    // (Reverse of parent)
    children: many(files)
}));

//Type definitions

export const File = typeof files.$inferSelect