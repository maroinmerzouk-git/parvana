CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"phone" text NOT NULL,
	"customer_name" text NOT NULL,
	"items" jsonb NOT NULL,
	"pickup_time" text NOT NULL,
	"total_cents" integer,
	"menu_version" integer,
	"note" text,
	"status" text DEFAULT 'new' NOT NULL,
	"seen_at" timestamp with time zone,
	CONSTRAINT "orders_status_check" CHECK ("orders"."status" in ('new', 'seen', 'archived'))
);
--> statement-breakpoint
CREATE TABLE "wa_conversations" (
	"wa_id" text PRIMARY KEY NOT NULL,
	"step" text DEFAULT 'greet' NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wa_processed_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "orders_status_created_at_idx" ON "orders" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at" DESC NULLS LAST);