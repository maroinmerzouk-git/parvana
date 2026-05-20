CREATE TABLE "menus" (
	"version" serial PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text
);
--> statement-breakpoint
CREATE INDEX "menus_created_at_idx" ON "menus" USING btree ("created_at" DESC NULLS LAST);