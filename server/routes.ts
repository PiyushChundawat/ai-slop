import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertTodoSchema, insertHabitSchema, insertHabitEntrySchema,
  insertDailyLogPiyushSchema, insertDailyLogShrutiSchema,
  insertCpRatingSchema, insertContestLogSchema, insertA2zProgressSchema,
  insertBlind75Schema, insertResumeSectionSchema, insertCourseSchema,
  insertCertificateSchema, insertProjectSchema, insertSkillSchema,
  insertCaseStudySchema, insertGuesstimateSchema, insertCaseCompetitionSchema,
  type ProfileType
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Todos
  app.get("/api/todos/:profile", async (req, res) => {
    const profile = req.params.profile as ProfileType;
    const todos = await storage.getTodos(profile);
    res.json(todos);
  });

  app.post("/api/todos", async (req, res) => {
    const parsed = insertTodoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const todo = await storage.createTodo(parsed.data);
    res.json(todo);
  });

  app.patch("/api/todos/:id", async (req, res) => {
    const todo = await storage.updateTodo(req.params.id, req.body);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  });

  app.delete("/api/todos/:id", async (req, res) => {
    await storage.deleteTodo(req.params.id);
    res.json({ success: true });
  });

  // Habits
  app.get("/api/habits/:profile", async (req, res) => {
    const profile = req.params.profile as ProfileType;
    const habits = await storage.getHabits(profile);
    res.json(habits);
  });

  app.post("/api/habits", async (req, res) => {
    const parsed = insertHabitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const habit = await storage.createHabit(parsed.data);
    res.json(habit);
  });

  app.patch("/api/habits/:id", async (req, res) => {
    const habit = await storage.updateHabit(req.params.id, req.body);
    if (!habit) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.json(habit);
  });

  app.delete("/api/habits/:id", async (req, res) => {
    await storage.deleteHabit(req.params.id);
    res.json({ success: true });
  });

  // Habit Entries
  app.get("/api/habit-entries/:profile", async (req, res) => {
    const profile = req.params.profile as ProfileType;
    const entries = await storage.getHabitEntries(profile);
    res.json(entries);
  });

  app.post("/api/habit-entries", async (req, res) => {
    const parsed = insertHabitEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const entry = await storage.upsertHabitEntry(parsed.data);
    res.json(entry);
  });

  // Daily Logs Piyush
  app.get("/api/daily-logs/piyush", async (req, res) => {
    const logs = await storage.getDailyLogsPiyush();
    res.json(logs);
  });

  app.post("/api/daily-logs/piyush", async (req, res) => {
    const parsed = insertDailyLogPiyushSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const log = await storage.upsertDailyLogPiyush(parsed.data);
    res.json(log);
  });

  // Daily Logs Shruti
  app.get("/api/daily-logs/shruti", async (req, res) => {
    const logs = await storage.getDailyLogsShruti();
    res.json(logs);
  });

  app.post("/api/daily-logs/shruti", async (req, res) => {
    const parsed = insertDailyLogShrutiSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const log = await storage.upsertDailyLogShruti(parsed.data);
    res.json(log);
  });

  // CP Ratings
  app.get("/api/ratings", async (req, res) => {
    const ratings = await storage.getCpRatings();
    res.json(ratings);
  });

  app.post("/api/ratings", async (req, res) => {
    const parsed = insertCpRatingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const rating = await storage.upsertCpRating(parsed.data);
    res.json(rating);
  });

  // Contest Logs
  app.get("/api/contests", async (req, res) => {
    const logs = await storage.getContestLogs();
    res.json(logs);
  });

  app.post("/api/contests", async (req, res) => {
    const parsed = insertContestLogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const log = await storage.createContestLog(parsed.data);
    res.json(log);
  });

  app.patch("/api/contests/:id", async (req, res) => {
    const log = await storage.updateContestLog(req.params.id, req.body);
    if (!log) {
      return res.status(404).json({ error: "Contest log not found" });
    }
    res.json(log);
  });

  app.delete("/api/contests/:id", async (req, res) => {
    await storage.deleteContestLog(req.params.id);
    res.json({ success: true });
  });

  // A2Z Progress
  app.get("/api/a2z-progress", async (req, res) => {
    const progress = await storage.getA2zProgress();
    res.json(progress || { easyTotal: 0, easySolved: 0, mediumTotal: 0, mediumSolved: 0, hardTotal: 0, hardSolved: 0 });
  });

  app.post("/api/a2z-progress", async (req, res) => {
    const parsed = insertA2zProgressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const progress = await storage.upsertA2zProgress(parsed.data);
    res.json(progress);
  });

  // Blind75
  app.get("/api/blind75", async (req, res) => {
    const items = await storage.getBlind75();
    res.json(items);
  });

  app.post("/api/blind75", async (req, res) => {
    const parsed = insertBlind75Schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const item = await storage.createBlind75(parsed.data);
    res.json(item);
  });

  app.patch("/api/blind75/:id", async (req, res) => {
    const item = await storage.updateBlind75(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ error: "Blind75 item not found" });
    }
    res.json(item);
  });

  app.delete("/api/blind75/:id", async (req, res) => {
    await storage.deleteBlind75(req.params.id);
    res.json({ success: true });
  });

  // Resume Sections
  app.get("/api/resume", async (req, res) => {
    const sections = await storage.getResumeSections();
    res.json(sections);
  });

  app.post("/api/resume", async (req, res) => {
    const parsed = insertResumeSectionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const section = await storage.createResumeSection(parsed.data);
    res.json(section);
  });

  app.patch("/api/resume/:id", async (req, res) => {
    const section = await storage.updateResumeSection(req.params.id, req.body);
    if (!section) {
      return res.status(404).json({ error: "Resume section not found" });
    }
    res.json(section);
  });

  app.delete("/api/resume/:id", async (req, res) => {
    await storage.deleteResumeSection(req.params.id);
    res.json({ success: true });
  });

  // Courses
  app.get("/api/courses/:profile", async (req, res) => {
    const profile = req.params.profile as ProfileType;
    const courses = await storage.getCourses(profile);
    res.json(courses);
  });

  app.post("/api/courses", async (req, res) => {
    const parsed = insertCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const course = await storage.createCourse(parsed.data);
    res.json(course);
  });

  app.patch("/api/courses/:id", async (req, res) => {
    const course = await storage.updateCourse(req.params.id, req.body);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  });

  app.delete("/api/courses/:id", async (req, res) => {
    await storage.deleteCourse(req.params.id);
    res.json({ success: true });
  });

  // Certificates
  app.get("/api/certificates/:profile", async (req, res) => {
    const profile = req.params.profile as ProfileType;
    const certs = await storage.getCertificates(profile);
    res.json(certs);
  });

  app.post("/api/certificates", async (req, res) => {
    const parsed = insertCertificateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const cert = await storage.createCertificate(parsed.data);
    res.json(cert);
  });

  app.delete("/api/certificates/:id", async (req, res) => {
    await storage.deleteCertificate(req.params.id);
    res.json({ success: true });
  });

  // Projects
  app.get("/api/projects/:profile", async (req, res) => {
    const profile = req.params.profile as ProfileType;
    const projects = await storage.getProjects(profile);
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const project = await storage.createProject(parsed.data);
    res.json(project);
  });

  app.patch("/api/projects/:id", async (req, res) => {
    const project = await storage.updateProject(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    await storage.deleteProject(req.params.id);
    res.json({ success: true });
  });

  // Skills
  app.get("/api/skills/:profile", async (req, res) => {
    const profile = req.params.profile as ProfileType;
    const skills = await storage.getSkills(profile);
    res.json(skills);
  });

  app.post("/api/skills", async (req, res) => {
    const parsed = insertSkillSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const skill = await storage.createSkill(parsed.data);
    res.json(skill);
  });

  app.patch("/api/skills/:id", async (req, res) => {
    const skill = await storage.updateSkill(req.params.id, req.body);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.json(skill);
  });

  app.delete("/api/skills/:id", async (req, res) => {
    await storage.deleteSkill(req.params.id);
    res.json({ success: true });
  });

  // Case Studies
  app.get("/api/case-studies", async (req, res) => {
    const studies = await storage.getCaseStudies();
    res.json(studies);
  });

  app.post("/api/case-studies", async (req, res) => {
    const parsed = insertCaseStudySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const study = await storage.createCaseStudy(parsed.data);
    res.json(study);
  });

  app.patch("/api/case-studies/:id", async (req, res) => {
    const study = await storage.updateCaseStudy(req.params.id, req.body);
    if (!study) {
      return res.status(404).json({ error: "Case study not found" });
    }
    res.json(study);
  });

  app.delete("/api/case-studies/:id", async (req, res) => {
    await storage.deleteCaseStudy(req.params.id);
    res.json({ success: true });
  });

  // Guesstimates
  app.get("/api/guesstimates", async (req, res) => {
    const items = await storage.getGuesstimates();
    res.json(items);
  });

  app.post("/api/guesstimates", async (req, res) => {
    const parsed = insertGuesstimateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const item = await storage.createGuesstimate(parsed.data);
    res.json(item);
  });

  app.patch("/api/guesstimates/:id", async (req, res) => {
    const item = await storage.updateGuesstimate(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ error: "Guesstimate not found" });
    }
    res.json(item);
  });

  app.delete("/api/guesstimates/:id", async (req, res) => {
    await storage.deleteGuesstimate(req.params.id);
    res.json({ success: true });
  });

  // Case Competitions
  app.get("/api/competitions", async (req, res) => {
    const comps = await storage.getCaseCompetitions();
    res.json(comps);
  });

  app.post("/api/competitions", async (req, res) => {
    const parsed = insertCaseCompetitionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const comp = await storage.createCaseCompetition(parsed.data);
    res.json(comp);
  });

  app.patch("/api/competitions/:id", async (req, res) => {
    const comp = await storage.updateCaseCompetition(req.params.id, req.body);
    if (!comp) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.json(comp);
  });

  app.delete("/api/competitions/:id", async (req, res) => {
    await storage.deleteCaseCompetition(req.params.id);
    res.json({ success: true });
  });

  return httpServer;
}
