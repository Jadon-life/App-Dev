/**
 * CrysLearn — Bulk Question Import (ALOC API with Access Token)
 * 
 * USAGE:
 * 1. Replace YOUR_SUPABASE_URL and YOUR_SERVICE_ROLE_KEY below
 * 2. Run: node scripts/import-questions.js
 */

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY";
const ALOC_TOKEN = "QB-0daf56beaa7f8ed2b698";

const EXAM_IDS = {
  utme: "11111111-1111-1111-1111-111111111111",
  wassce: "22222222-2222-2222-2222-222222222222",
};

const SUBJECTS = ["mathematics", "english", "physics", "chemistry"];
const YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010];

async function fetchQuestions(subject, type, year) {
  const url = `https://questions.aloc.com.ng/api/v2/m?subject=${subject}&type=${type}&year=${year}&token=${ALOC_TOKEN}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.data) return Array.isArray(data.data) ? data.data : [data.data];
    return [];
  } catch (e) { return []; }
}

function formatQuestion(q, examId, subject, year) {
  if (!q || !q.question) return null;
  const options = [];
  if (q.option) {
    if (q.option.a) options.push({ label: "A", text: q.option.a });
    if (q.option.b) options.push({ label: "B", text: q.option.b });
    if (q.option.c) options.push({ label: "C", text: q.option.c });
    if (q.option.d) options.push({ label: "D", text: q.option.d });
  }
  if (options.length < 4) return null;
  let correctOption = (q.answer || "a").toUpperCase();
  if (!["A", "B", "C", "D"].includes(correctOption)) correctOption = "A";
  const subjectMap = { mathematics: "Mathematics", english: "English Language", physics: "Physics", chemistry: "Chemistry" };
  return {
    exam_id: examId,
    subject: subjectMap[subject] || subject,
    year: q.examYear || year,
    question_text: (q.question || "").replace(/<[^>]*>/g, "").trim(),
    options: JSON.stringify(options.slice(0, 4)),
    correct_option: correctOption,
    explanation: q.section || "",
  };
}

async function insertBatch(questions) {
  if (questions.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < questions.length; i += 50) {
    const batch = questions.slice(i, i + 50);
    const response = await fetch(SUPABASE_URL + "/rest/v1/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SERVICE_ROLE_KEY, "Authorization": "Bearer " + SERVICE_ROLE_KEY, "Prefer": "return=minimal" },
      body: JSON.stringify(batch),
    });
    if (response.ok) total += batch.length;
    else console.log("  x Insert error:", (await response.text()).slice(0, 100));
  }
  return total;
}

async function main() {
  console.log("CrysLearn — Bulk Question Import (ALOC API)");
  console.log("Token:", ALOC_TOKEN);
  if (SUPABASE_URL === "YOUR_SUPABASE_URL") { console.log("ERROR: Replace YOUR_SUPABASE_URL first!"); process.exit(1); }
  let grandTotal = 0;
  for (const [examType, examId] of Object.entries(EXAM_IDS)) {
    console.log("\\n--- " + (examType === "utme" ? "UTME" : "WAEC") + " ---");
    for (const subject of SUBJECTS) {
      console.log("  " + subject);
      let all = [];
      for (const year of YEARS) {
        const raw = await fetchQuestions(subject, examType, year);
        const formatted = raw.map(q => formatQuestion(q, examId, subject, year)).filter(Boolean);
        if (formatted.length > 0) { all.push(...formatted); console.log("    " + year + ": " + formatted.length); }
        await new Promise(r => setTimeout(r, 300));
      }
      if (all.length > 0) { const n = await insertBatch(all); grandTotal += n; console.log("  Total: " + n); }
    }
  }
  console.log("\\nDONE! Total imported: " + grandTotal);
}

main().catch(console.error);
