import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type ProfileType = "piyush" | "shruti";

export const todos = pgTable("todos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profile: text("profile").notNull().$type<ProfileType>(),
  content: text("content").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTodoSchema = createInsertSchema(todos).omit({ id: true, createdAt: true });
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type Todo = typeof todos.$inferSelect;

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profile: text("profile").notNull().$type<ProfileType>(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertHabitSchema = createInsertSchema(habits).omit({ id: true });
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;

export const habitEntries = pgTable("habit_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  habitId: varchar("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const insertHabitEntrySchema = createInsertSchema(habitEntries).omit({ id: true });
export type InsertHabitEntry = z.infer<typeof insertHabitEntrySchema>;
export type HabitEntry = typeof habitEntries.$inferSelect;

export const dailyLogsPiyush = pgTable("daily_logs_piyush", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull().unique(),
  dsaQuestionsSolved: integer("dsa_questions_solved").notNull().default(0),
  notes: text("notes"),
});

export const insertDailyLogPiyushSchema = createInsertSchema(dailyLogsPiyush).omit({ id: true });
export type InsertDailyLogPiyush = z.infer<typeof insertDailyLogPiyushSchema>;
export type DailyLogPiyush = typeof dailyLogsPiyush.$inferSelect;

export const dailyLogsShruti = pgTable("daily_logs_shruti", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: date("date").notNull().unique(),
  pythonQuestionsSolved: integer("python_questions_solved").notNull().default(0),
  sqlQuestionsSolved: integer("sql_questions_solved").notNull().default(0),
  notes: text("notes"),
});

export const insertDailyLogShrutiSchema = createInsertSchema(dailyLogsShruti).omit({ id: true });
export type InsertDailyLogShruti = z.infer<typeof insertDailyLogShrutiSchema>;
export type DailyLogShruti = typeof dailyLogsShruti.$inferSelect;

export const cpRatings = pgTable("cp_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull().unique(),
  rating: integer("rating").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCpRatingSchema = createInsertSchema(cpRatings).omit({ id: true, updatedAt: true });
export type InsertCpRating = z.infer<typeof insertCpRatingSchema>;
export type CpRating = typeof cpRatings.$inferSelect;

export const contestLogs = pgTable("contest_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(),
  contestName: text("contest_name").notNull(),
  date: date("date").notNull(),
  problemsSolved: integer("problems_solved").notNull().default(0),
  totalProblems: integer("total_problems").notNull().default(0),
  notes: text("notes"),
});

export const insertContestLogSchema = createInsertSchema(contestLogs).omit({ id: true });
export type InsertContestLog = z.infer<typeof insertContestLogSchema>;
export type ContestLog = typeof contestLogs.$inferSelect;

export const a2zProgress = pgTable("a2z_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  easyTotal: integer("easy_total").notNull().default(0),
  easySolved: integer("easy_solved").notNull().default(0),
  mediumTotal: integer("medium_total").notNull().default(0),
  mediumSolved: integer("medium_solved").notNull().default(0),
  hardTotal: integer("hard_total").notNull().default(0),
  hardSolved: integer("hard_solved").notNull().default(0),
});

export const insertA2zProgressSchema = createInsertSchema(a2zProgress).omit({ id: true });
export type InsertA2zProgress = z.infer<typeof insertA2zProgressSchema>;
export type A2zProgress = typeof a2zProgress.$inferSelect;

export const blind75 = pgTable("blind75", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionName: text("question_name").notNull(),
  solutionLink: text("solution_link"),
  completed: boolean("completed").notNull().default(false),
});

export const insertBlind75Schema = createInsertSchema(blind75).omit({ id: true });
export type InsertBlind75 = z.infer<typeof insertBlind75Schema>;
export type Blind75 = typeof blind75.$inferSelect;

export const resumeSections = pgTable("resume_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectionType: text("section_type").notNull(),
  content: text("content").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertResumeSectionSchema = createInsertSchema(resumeSections).omit({ id: true });
export type InsertResumeSection = z.infer<typeof insertResumeSectionSchema>;
export type ResumeSection = typeof resumeSections.$inferSelect;

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profile: text("profile").notNull().$type<ProfileType>(),
  courseName: text("course_name").notNull(),
  platform: text("platform").notNull(),
  totalContent: integer("total_content").notNull().default(100),
  completedContent: integer("completed_content").notNull().default(0),
});

export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profile: text("profile").notNull().$type<ProfileType>(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: date("date").notNull(),
  fileUrl: text("file_url"),
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({ id: true });
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profile: text("profile").notNull().$type<ProfileType>(),
  projectName: text("project_name").notNull(),
  description: text("description"),
  notes: text("notes"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profile: text("profile").notNull().$type<ProfileType>(),
  skillName: text("skill_name").notNull(),
  notes: text("notes"),
});

export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export const caseStudies = pgTable("case_studies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  notes: text("notes"),
  date: date("date").notNull(),
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({ id: true });
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;

export const guesstimates = pgTable("guesstimates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topic: text("topic").notNull(),
  learnings: text("learnings"),
  notes: text("notes"),
});

export const insertGuesstimateSchema = createInsertSchema(guesstimates).omit({ id: true });
export type InsertGuesstimate = z.infer<typeof insertGuesstimateSchema>;
export type Guesstimate = typeof guesstimates.$inferSelect;

export const caseCompetitions = pgTable("case_competitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  competitionName: text("competition_name").notNull(),
  notes: text("notes"),
  documentUrl: text("document_url"),
});

export const insertCaseCompetitionSchema = createInsertSchema(caseCompetitions).omit({ id: true });
export type InsertCaseCompetition = z.infer<typeof insertCaseCompetitionSchema>;
export type CaseCompetition = typeof caseCompetitions.$inferSelect;
