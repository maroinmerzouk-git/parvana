CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"date" date NOT NULL,
	"service" text NOT NULL,
	"arrival_time" time NOT NULL,
	"party_size" integer NOT NULL,
	"message" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"status_changed_at" timestamp with time zone,
	"rejection_message" text,
	"seen_at" timestamp with time zone,
	"client_email_sent" boolean DEFAULT false NOT NULL,
	"confirmation_email_sent" boolean DEFAULT false NOT NULL,
	"rejection_email_sent" boolean DEFAULT false NOT NULL,
	CONSTRAINT "service_check" CHECK ("reservations"."service" in ('midi', 'soir')),
	CONSTRAINT "status_check" CHECK ("reservations"."status" in ('pending', 'confirmed', 'rejected', 'cancelled')),
	CONSTRAINT "party_size_check" CHECK ("reservations"."party_size" between 1 and 10)
);
--> statement-breakpoint
CREATE INDEX "reservations_status_date_idx" ON "reservations" USING btree ("status","date");--> statement-breakpoint
CREATE INDEX "reservations_created_at_idx" ON "reservations" USING btree ("created_at" DESC NULLS LAST);