CREATE TABLE "a2z_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"easy_total" integer DEFAULT 0 NOT NULL,
	"easy_solved" integer DEFAULT 0 NOT NULL,
	"medium_total" integer DEFAULT 0 NOT NULL,
	"medium_solved" integer DEFAULT 0 NOT NULL,
	"hard_total" integer DEFAULT 0 NOT NULL,
	"hard_solved" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blind75" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_name" text NOT NULL,
	"solution_link" text,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_competitions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_name" text NOT NULL,
	"notes" text,
	"document_url" text
);
--> statement-breakpoint
CREATE TABLE "case_studies" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"notes" text,
	"date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile" text NOT NULL,
	"title" text NOT NULL,
	"issuer" text NOT NULL,
	"date" date NOT NULL,
	"file_url" text
);
--> statement-breakpoint
CREATE TABLE "contest_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"contest_name" text NOT NULL,
	"date" date NOT NULL,
	"problems_solved" integer DEFAULT 0 NOT NULL,
	"total_problems" integer DEFAULT 0 NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile" text NOT NULL,
	"course_name" text NOT NULL,
	"platform" text NOT NULL,
	"total_content" integer DEFAULT 100 NOT NULL,
	"completed_content" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cp_ratings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" text NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cp_ratings_platform_unique" UNIQUE("platform")
);
--> statement-breakpoint
CREATE TABLE "daily_logs_piyush" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"dsa_questions_solved" integer DEFAULT 0 NOT NULL,
	"notes" text,
	CONSTRAINT "daily_logs_piyush_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "daily_logs_shruti" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"python_questions_solved" integer DEFAULT 0 NOT NULL,
	"sql_questions_solved" integer DEFAULT 0 NOT NULL,
	"notes" text,
	CONSTRAINT "daily_logs_shruti_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "guesstimates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic" text NOT NULL,
	"learnings" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "habit_entries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habit_id" varchar NOT NULL,
	"date" date NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile" text NOT NULL,
	"project_name" text NOT NULL,
	"description" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "resume_sections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_type" text NOT NULL,
	"content" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile" text NOT NULL,
	"skill_name" text NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile" text NOT NULL,
	"content" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "habit_entries" ADD CONSTRAINT "habit_entries_habit_id_habits_id_fk" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE cascade ON UPDATE no action;