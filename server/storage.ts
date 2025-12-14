import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  todos, habits, habitEntries, dailyLogsPiyush, dailyLogsShruti,
  cpRatings, contestLogs, a2zProgress, blind75, resumeSections,
  courses, certificates, projects, skills, caseStudies, guesstimates, caseCompetitions,
  type InsertTodo, type Todo,
  type InsertHabit, type Habit,
  type InsertHabitEntry, type HabitEntry,
  type InsertDailyLogPiyush, type DailyLogPiyush,
  type InsertDailyLogShruti, type DailyLogShruti,
  type InsertCpRating, type CpRating,
  type InsertContestLog, type ContestLog,
  type InsertA2zProgress, type A2zProgress,
  type InsertBlind75, type Blind75,
  type InsertResumeSection, type ResumeSection,
  type InsertCourse, type Course,
  type InsertCertificate, type Certificate,
  type InsertProject, type Project,
  type InsertSkill, type Skill,
  type InsertCaseStudy, type CaseStudy,
  type InsertGuesstimate, type Guesstimate,
  type InsertCaseCompetition, type CaseCompetition,
  type ProfileType,
} from "@shared/schema";

export interface IStorage {
  getTodos(profile: ProfileType): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: string, updates: Partial<InsertTodo>): Promise<Todo | undefined>;
  deleteTodo(id: string): Promise<void>;

  getHabits(profile: ProfileType): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, updates: Partial<InsertHabit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<void>;

  getHabitEntries(profile: ProfileType): Promise<HabitEntry[]>;
  upsertHabitEntry(entry: InsertHabitEntry): Promise<HabitEntry>;

  getDailyLogsPiyush(): Promise<DailyLogPiyush[]>;
  upsertDailyLogPiyush(log: InsertDailyLogPiyush): Promise<DailyLogPiyush>;

  getDailyLogsShruti(): Promise<DailyLogShruti[]>;
  upsertDailyLogShruti(log: InsertDailyLogShruti): Promise<DailyLogShruti>;

  getCpRatings(): Promise<CpRating[]>;
  upsertCpRating(rating: InsertCpRating): Promise<CpRating>;

  getContestLogs(): Promise<ContestLog[]>;
  createContestLog(log: InsertContestLog): Promise<ContestLog>;
  updateContestLog(id: string, updates: Partial<InsertContestLog>): Promise<ContestLog | undefined>;
  deleteContestLog(id: string): Promise<void>;

  getA2zProgress(): Promise<A2zProgress | undefined>;
  upsertA2zProgress(progress: InsertA2zProgress): Promise<A2zProgress>;

  getBlind75(): Promise<Blind75[]>;
  createBlind75(item: InsertBlind75): Promise<Blind75>;
  updateBlind75(id: string, updates: Partial<InsertBlind75>): Promise<Blind75 | undefined>;
  deleteBlind75(id: string): Promise<void>;

  getResumeSections(): Promise<ResumeSection[]>;
  createResumeSection(section: InsertResumeSection): Promise<ResumeSection>;
  updateResumeSection(id: string, updates: Partial<InsertResumeSection>): Promise<ResumeSection | undefined>;
  deleteResumeSection(id: string): Promise<void>;

  getCourses(profile: ProfileType): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, updates: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<void>;

  getCertificates(profile: ProfileType): Promise<Certificate[]>;
  createCertificate(cert: InsertCertificate): Promise<Certificate>;
  deleteCertificate(id: string): Promise<void>;

  getProjects(profile: ProfileType): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<void>;

  getSkills(profile: ProfileType): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, updates: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<void>;

  getCaseStudies(): Promise<CaseStudy[]>;
  createCaseStudy(study: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: string, updates: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined>;
  deleteCaseStudy(id: string): Promise<void>;

  getGuesstimates(): Promise<Guesstimate[]>;
  createGuesstimate(item: InsertGuesstimate): Promise<Guesstimate>;
  updateGuesstimate(id: string, updates: Partial<InsertGuesstimate>): Promise<Guesstimate | undefined>;
  deleteGuesstimate(id: string): Promise<void>;

  getCaseCompetitions(): Promise<CaseCompetition[]>;
  createCaseCompetition(comp: InsertCaseCompetition): Promise<CaseCompetition>;
  updateCaseCompetition(id: string, updates: Partial<InsertCaseCompetition>): Promise<CaseCompetition | undefined>;
  deleteCaseCompetition(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTodos(profile: ProfileType): Promise<Todo[]> {
    return db.select().from(todos).where(eq(todos.profile, profile)).orderBy(desc(todos.createdAt));
  }

  async createTodo(todo: InsertTodo): Promise<Todo> {
    const [result] = await db.insert(todos).values(todo).returning();
    return result;
  }

  async updateTodo(id: string, updates: Partial<InsertTodo>): Promise<Todo | undefined> {
    const [result] = await db.update(todos).set(updates).where(eq(todos.id, id)).returning();
    return result;
  }

  async deleteTodo(id: string): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }

  async getHabits(profile: ProfileType): Promise<Habit[]> {
    return db.select().from(habits).where(eq(habits.profile, profile)).orderBy(habits.sortOrder);
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const [result] = await db.insert(habits).values(habit).returning();
    return result;
  }

  async updateHabit(id: string, updates: Partial<InsertHabit>): Promise<Habit | undefined> {
    const [result] = await db.update(habits).set(updates).where(eq(habits.id, id)).returning();
    return result;
  }

  async deleteHabit(id: string): Promise<void> {
    await db.delete(habits).where(eq(habits.id, id));
  }

  async getHabitEntries(profile: ProfileType): Promise<HabitEntry[]> {
    const profileHabits = await this.getHabits(profile);
    const habitIds = profileHabits.map(h => h.id);
    if (habitIds.length === 0) return [];
    const allEntries = await db.select().from(habitEntries);
    return allEntries.filter(e => habitIds.includes(e.habitId));
  }

  async upsertHabitEntry(entry: InsertHabitEntry): Promise<HabitEntry> {
    const existing = await db.select().from(habitEntries)
      .where(and(eq(habitEntries.habitId, entry.habitId), eq(habitEntries.date, entry.date)));
    if (existing.length > 0) {
      const [result] = await db.update(habitEntries)
        .set({ completed: entry.completed })
        .where(eq(habitEntries.id, existing[0].id))
        .returning();
      return result;
    }
    const [result] = await db.insert(habitEntries).values(entry).returning();
    return result;
  }

  async getDailyLogsPiyush(): Promise<DailyLogPiyush[]> {
    return db.select().from(dailyLogsPiyush).orderBy(desc(dailyLogsPiyush.date));
  }

  async upsertDailyLogPiyush(log: InsertDailyLogPiyush): Promise<DailyLogPiyush> {
    const existing = await db.select().from(dailyLogsPiyush).where(eq(dailyLogsPiyush.date, log.date));
    if (existing.length > 0) {
      const [result] = await db.update(dailyLogsPiyush)
        .set(log)
        .where(eq(dailyLogsPiyush.id, existing[0].id))
        .returning();
      return result;
    }
    const [result] = await db.insert(dailyLogsPiyush).values(log).returning();
    return result;
  }

  async getDailyLogsShruti(): Promise<DailyLogShruti[]> {
    return db.select().from(dailyLogsShruti).orderBy(desc(dailyLogsShruti.date));
  }

  async upsertDailyLogShruti(log: InsertDailyLogShruti): Promise<DailyLogShruti> {
    const existing = await db.select().from(dailyLogsShruti).where(eq(dailyLogsShruti.date, log.date));
    if (existing.length > 0) {
      const [result] = await db.update(dailyLogsShruti)
        .set(log)
        .where(eq(dailyLogsShruti.id, existing[0].id))
        .returning();
      return result;
    }
    const [result] = await db.insert(dailyLogsShruti).values(log).returning();
    return result;
  }

  async getCpRatings(): Promise<CpRating[]> {
    return db.select().from(cpRatings);
  }

  async upsertCpRating(rating: InsertCpRating): Promise<CpRating> {
    const existing = await db.select().from(cpRatings).where(eq(cpRatings.platform, rating.platform));
    if (existing.length > 0) {
      const [result] = await db.update(cpRatings)
        .set({ rating: rating.rating, updatedAt: new Date() })
        .where(eq(cpRatings.id, existing[0].id))
        .returning();
      return result;
    }
    const [result] = await db.insert(cpRatings).values(rating).returning();
    return result;
  }

  async getContestLogs(): Promise<ContestLog[]> {
    return db.select().from(contestLogs).orderBy(desc(contestLogs.date));
  }

  async createContestLog(log: InsertContestLog): Promise<ContestLog> {
    const [result] = await db.insert(contestLogs).values(log).returning();
    return result;
  }

  async updateContestLog(id: string, updates: Partial<InsertContestLog>): Promise<ContestLog | undefined> {
    const [result] = await db.update(contestLogs).set(updates).where(eq(contestLogs.id, id)).returning();
    return result;
  }

  async deleteContestLog(id: string): Promise<void> {
    await db.delete(contestLogs).where(eq(contestLogs.id, id));
  }

  async getA2zProgress(): Promise<A2zProgress | undefined> {
    const [result] = await db.select().from(a2zProgress).limit(1);
    return result;
  }

  async upsertA2zProgress(progress: InsertA2zProgress): Promise<A2zProgress> {
    const existing = await db.select().from(a2zProgress).limit(1);
    if (existing.length > 0) {
      const [result] = await db.update(a2zProgress)
        .set(progress)
        .where(eq(a2zProgress.id, existing[0].id))
        .returning();
      return result;
    }
    const [result] = await db.insert(a2zProgress).values(progress).returning();
    return result;
  }

  async getBlind75(): Promise<Blind75[]> {
    return db.select().from(blind75);
  }

  async createBlind75(item: InsertBlind75): Promise<Blind75> {
    const [result] = await db.insert(blind75).values(item).returning();
    return result;
  }

  async updateBlind75(id: string, updates: Partial<InsertBlind75>): Promise<Blind75 | undefined> {
    const [result] = await db.update(blind75).set(updates).where(eq(blind75.id, id)).returning();
    return result;
  }

  async deleteBlind75(id: string): Promise<void> {
    await db.delete(blind75).where(eq(blind75.id, id));
  }

  async getResumeSections(): Promise<ResumeSection[]> {
    return db.select().from(resumeSections).orderBy(resumeSections.sortOrder);
  }

  async createResumeSection(section: InsertResumeSection): Promise<ResumeSection> {
    const [result] = await db.insert(resumeSections).values(section).returning();
    return result;
  }

  async updateResumeSection(id: string, updates: Partial<InsertResumeSection>): Promise<ResumeSection | undefined> {
    const [result] = await db.update(resumeSections).set(updates).where(eq(resumeSections.id, id)).returning();
    return result;
  }

  async deleteResumeSection(id: string): Promise<void> {
    await db.delete(resumeSections).where(eq(resumeSections.id, id));
  }

  async getCourses(profile: ProfileType): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.profile, profile));
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [result] = await db.insert(courses).values(course).returning();
    return result;
  }

  async updateCourse(id: string, updates: Partial<InsertCourse>): Promise<Course | undefined> {
    const [result] = await db.update(courses).set(updates).where(eq(courses.id, id)).returning();
    return result;
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  async getCertificates(profile: ProfileType): Promise<Certificate[]> {
    return db.select().from(certificates).where(eq(certificates.profile, profile)).orderBy(desc(certificates.date));
  }

  async createCertificate(cert: InsertCertificate): Promise<Certificate> {
    const [result] = await db.insert(certificates).values(cert).returning();
    return result;
  }

  async deleteCertificate(id: string): Promise<void> {
    await db.delete(certificates).where(eq(certificates.id, id));
  }

  async getProjects(profile: ProfileType): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.profile, profile));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [result] = await db.insert(projects).values(project).returning();
    return result;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [result] = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return result;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getSkills(profile: ProfileType): Promise<Skill[]> {
    return db.select().from(skills).where(eq(skills.profile, profile));
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [result] = await db.insert(skills).values(skill).returning();
    return result;
  }

  async updateSkill(id: string, updates: Partial<InsertSkill>): Promise<Skill | undefined> {
    const [result] = await db.update(skills).set(updates).where(eq(skills.id, id)).returning();
    return result;
  }

  async deleteSkill(id: string): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  async getCaseStudies(): Promise<CaseStudy[]> {
    return db.select().from(caseStudies).orderBy(desc(caseStudies.date));
  }

  async createCaseStudy(study: InsertCaseStudy): Promise<CaseStudy> {
    const [result] = await db.insert(caseStudies).values(study).returning();
    return result;
  }

  async updateCaseStudy(id: string, updates: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined> {
    const [result] = await db.update(caseStudies).set(updates).where(eq(caseStudies.id, id)).returning();
    return result;
  }

  async deleteCaseStudy(id: string): Promise<void> {
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
  }

  async getGuesstimates(): Promise<Guesstimate[]> {
    return db.select().from(guesstimates);
  }

  async createGuesstimate(item: InsertGuesstimate): Promise<Guesstimate> {
    const [result] = await db.insert(guesstimates).values(item).returning();
    return result;
  }

  async updateGuesstimate(id: string, updates: Partial<InsertGuesstimate>): Promise<Guesstimate | undefined> {
    const [result] = await db.update(guesstimates).set(updates).where(eq(guesstimates.id, id)).returning();
    return result;
  }

  async deleteGuesstimate(id: string): Promise<void> {
    await db.delete(guesstimates).where(eq(guesstimates.id, id));
  }

  async getCaseCompetitions(): Promise<CaseCompetition[]> {
    return db.select().from(caseCompetitions);
  }

  async createCaseCompetition(comp: InsertCaseCompetition): Promise<CaseCompetition> {
    const [result] = await db.insert(caseCompetitions).values(comp).returning();
    return result;
  }

  async updateCaseCompetition(id: string, updates: Partial<InsertCaseCompetition>): Promise<CaseCompetition | undefined> {
    const [result] = await db.update(caseCompetitions).set(updates).where(eq(caseCompetitions.id, id)).returning();
    return result;
  }

  async deleteCaseCompetition(id: string): Promise<void> {
    await db.delete(caseCompetitions).where(eq(caseCompetitions.id, id));
  }
}

export const storage = new DatabaseStorage();
