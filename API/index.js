const { courseMap, contentMap, totalClasses } = require("../store");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const host = req.headers.host || "your-app.vercel.app";
  const base = "https://" + host;

  res.status(200).json({
    success : true,
    api     : "CDS Study API",
    version : "1.0.0",
    base_url: base,
    stats: {
      total_courses : courseMap.size,
      total_subjects: contentMap.size,
      total_classes : totalClasses,
    },
    endpoints: [
      {
        method     : "GET",
        path       : "/all-batches",
        description: "List all courses / batches",
        example    : base + "/all-batches",
      },
      {
        method     : "GET",
        path       : "/subjects/:courseId",
        description: "Get subjects of a course",
        example    : base + "/subjects/3e4c5cb1",
      },
      {
        method     : "GET",
        path       : "/subject/content/:contentId",
        description: "Get all video classes inside a subject",
        example    : base + "/subject/content/3e4c5cb1_maths",
      },
    ],
    quick_reference: {
      "3e4c5cb1": "Alpha MATH Batch (CDS-1 2026)",
      "45ea157a": "Alpha OTA Batch (CDS-1 2026)",
      "6faeae5b": "Bravo GAT Batch (NDA-1 2026)",
      "75418a3e": "Bravo MATH Batch (NDA-1 2026)",
      "168364b7": "CAPF Paper 1+2 Delta Batch 2026",
      "ee54ab8f": "CDS-2 2025",
      "205c0d7a": "NDA-2 2025",
      "03585164": "AFCAT-2 2025",
      "c6ba8182": "CDS-2 Maths 2025",
      "64199056": "CAPF P1+P2 Delta Batch 2026 v2",
      "3c29db95": "CAPF P2 Delta Batch 2026",
      "dfa81d5f": "Echo Batch AFCAT-2 2026",
    },
  });
};
