const { contentMap } = require("../store");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  // contentId from vercel.json route param OR query string fallback
  const contentId = req.query.contentId || "";

  if (!contentId) {
    return res.status(400).json({
      success: false,
      error  : "contentId is required",
      hint   : "Usage: /subject/content/:contentId",
    });
  }

  const subject = contentMap.get(contentId);

  if (!subject) {
    return res.status(404).json({
      success: false,
      error  : `Subject not found: ${contentId}`,
      hint   : "Use /subjects/:courseId to get valid contentIds",
    });
  }

  res.status(200).json({
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
};
