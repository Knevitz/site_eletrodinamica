require("dotenv").config();

console.log("RAW FRONTEND_URL:", JSON.stringify(process.env.FRONTEND_URL));
console.log(
  "FRONTEND_URL split:",
  process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((s) => s.trim())
    : []
);
