CREATE TABLE "catering_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"event_date" date NOT NULL,
	"event_type" text NOT NULL,
	"party_size" integer NOT NULL,
	"budget" text,
	"message" text,
	"status" text DEFAULT 'new' NOT NULL,
	"seen_at" timestamp with time zone,
	"client_email_sent" boolean DEFAULT false NOT NULL,
	CONSTRAINT "catering_event_type_check" CHECK ("catering_requests"."event_type" in ('mariage', 'anniversaire', 'entreprise', 'autre')),
	CONSTRAINT "catering_status_check" CHECK ("catering_requests"."status" in ('new', 'seen', 'archived')),
	CONSTRAINT "catering_party_size_check" CHECK ("catering_requests"."party_size" between 10 and 500)
);
--> statement-breakpoint
CREATE INDEX "catering_status_created_at_idx" ON "catering_requests" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "catering_created_at_idx" ON "catering_requests" USING btree ("created_at" DESC NULLS LAST);