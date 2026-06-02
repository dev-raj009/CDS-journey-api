const { courseMap } = require("../store");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  // courseId comes from vercel.json route param OR query string fallback
  const courseId = req.query.courseId || "";

  if (!courseId) {
    return res.status(400).json({
      success: false,
      error  : "courseId is required",
      hint   : "Usage: /subjects/:courseId",
    });
  }

  const course = courseMap.get(courseId);

  if (!course) {
    return res.status(404).json({
      success: false,
      error  : `Course not found: ${courseId}`,
      hint   : "Use /all-batches to get valid courseIds",
    });
  }

  const subjects = course.subjects.map((s) => ({
    contentId   : s.contentId,
    name        : s.name,
    icon        : s.icon,
    totalClasses: s.classes.length,
  }));

  res.status(200).json({
    success : true,
    courseId: course.courseId,
    course  : course.name,
    count   : subjects.length,
    data    : subjects,
  });
};
