const express = require("express");
const crypto  = require("crypto");
const path    = require("path");

const app = express();

// ─── CORS ────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

// ─── Load & Build Store ───────────────────────────────────────
const RAW = require("./data.json");

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex").slice(0, 8);
}

const courseMap  = new Map();
const contentMap = new Map();
let   totalClasses = 0;

Object.entries(RAW).forEach(([key, batch]) => {
  const courseId = md5(key);
  const subjects = (batch.subjects || []).map((subj) => {
    const contentId = courseId + "_" + subj.id;
    const entry = {
      contentId,
      name      : subj.name,
      icon      : subj.icon || "fas fa-book",
      courseId,
      courseName: batch.batchName,
      classes   : subj.classes || [],
    };
    contentMap.set(contentId, entry);
    totalClasses += entry.classes.length;
    return { contentId, name: subj.name, icon: subj.icon || "fas fa-book", classes: subj.classes || [] };
  });
  courseMap.set(courseId, {
    courseId,
    name    : batch.batchName,
    theme   : batch.theme || "general",
    subjects,
  });
});

// ─── ROUTES ───────────────────────────────────────────────────

// GET /
app.get("/", (req, res) => {
  const host = req.headers.host;
  const base = "https://" + host;
  res.json({
    success : true,
    api     : "CDS Study API",
    version : "1.0.0",
    stats: {
      total_courses : courseMap.size,
      total_subjects: contentMap.size,
      total_classes : totalClasses,
    },
    endpoints: [
      { method: "GET", path: "/all-batches",                   example: base + "/all-batches" },
      { method: "GET", path: "/subjects/:courseId",            example: base + "/subjects/3e4c5cb1" },
      { method: "GET", path: "/subject/content/:contentId",    example: base + "/subject/content/3e4c5cb1_maths" },
    ],
  });
});

// GET /all-batches
app.get("/all-batches", (req, res) => {
  const courses = [];
  courseMap.forEach((course) => {
    courses.push({
      courseId     : course.courseId,
      name         : course.name,
      theme        : course.theme,
      totalSubjects: course.subjects.length,
      subjectNames : course.subjects.map((s) => s.name),
    });
  });
  res.json({ success: true, count: courses.length, data: courses });
});

// GET /subjects/:courseId
app.get("/subjects/:courseId", (req, res) => {
  const course = courseMap.get(req.params.courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      error  : "Course not found: " + req.params.courseId,
      hint   : "Use /all-batches to get valid courseIds",
    });
  }
  res.json({
    success : true,
    courseId: course.courseId,
    course  : course.name,
    count   : course.subjects.length,
    data    : course.subjects.map((s) => ({
      contentId   : s.contentId,
      name        : s.name,
      icon        : s.icon,
      totalClasses: s.classes.length,
    })),
  });
});

// GET /subject/content/:contentId
app.get("/subject/content/:contentId", (req, res) => {
  const subject = contentMap.get(req.params.contentId);
  if (!subject) {
    return res.status(404).json({
      success: false,
      error  : "Subject not found: " + req.params.contentId,
      hint   : "Use /subjects/:courseId to get valid contentIds",
    });
  }
  res.json({
    success    : true,
    contentId  : subject.contentId,
    subject    : subject.name,
    courseId   : subject.courseId,
    course     : subject.courseName,
    totalVideos: subject.classes.length,
    data       : subject.classes.map((cls, i) => ({
      index: i + 1,
      name : cls.name,
      link : cls.link,
    })),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found: " + req.originalUrl });
});

module.exports = app;
