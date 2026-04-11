CREATE TABLE "book_keyword" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"keyword_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_keyword_book" UNIQUE("book_id","keyword_id")
);
--> statement-breakpoint
ALTER TABLE "book_keyword" ADD CONSTRAINT "book_keyword_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_keyword" ADD CONSTRAINT "book_keyword_keyword_id_keyword_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."keyword"("id") ON DELETE no action ON UPDATE no action;