/**
 * store.js — Shared in-memory data store
 * Loaded once at cold-start, reused across all API functions.
 */

const crypto = require("crypto");
const path   = require("path");
const RAW    = require(path.join(process.cwd(), "data.json"));

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex").slice(0, 8);
}

const courseMap  = new Map();
const contentMap = new Map();

let totalClasses = 0;

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

module.exports = { courseMap, contentMap, totalClasses };
