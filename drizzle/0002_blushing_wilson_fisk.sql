CREATE TABLE IF NOT EXISTS "quizit_profile" (
	"userId" varchar(255) PRIMARY KEY NOT NULL,
	"gamesWon" integer DEFAULT 0 NOT NULL,
	"gamesPlayed" integer DEFAULT 0 NOT NULL,
	"correctAnswer" integer DEFAULT 0 NOT NULL,
	"wrongAnswer" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
DROP TABLE "quizit_post";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quizit_profile" ADD CONSTRAINT "quizit_profile_userId_quizit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "quizit_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
