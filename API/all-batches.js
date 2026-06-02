const { courseMap } = require("../store");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

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

  res.status(200).json({
    success: true,
    count  : courses.length,
    data   : courses,
  });
};
