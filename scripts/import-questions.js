/**
 * CrysLearn — Question Import Script
 * 
 * Fetches REAL past questions from the ALOC API (questions.aloc.com.ng)
 * and inserts them into your Supabase database.
 * 
 * USAGE:
 * 1. Replace YOUR_SUPABASE_URL and YOUR_SERVICE_ROLE_KEY below
 * 2. Run: node scripts/import-questions.js
 * 
 * WHAT IT DOES:
 * - Fetches UTME questions for: Mathematics, English, Physics, Chemistry
 * - Fetches WAEC (wassce) questions for: Mathematics, English, Physics, Chemistry
 * - Inserts them into the public.questions table
 * 
 * SOURCE: ALOC API — real past questions from Nigerian exams
 */

// ═══ CONFIGURATION — REPLACE THESE WITH YOUR ACTUAL VALUES ═══
const SUPABASE_URL = "YOUR_SUPABASE_URL"; // e.g. https://abc123.supabase.co
const SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"; // The service_role key (NOT anon key)

// Exam IDs (must match what you seeded in the database)
const EXAM_IDS = {
  utme: "11111111-1111-1111-1111-111111111111",
  wassce: "22222222-2222-2222-2222-222222222222",
};

// Subjects to import
const SUBJECTS = ["mathematics", "english", "physics", "chemistry"];

// Years to fetch
const YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

// ═══ HELPER FUNCTIONS ═══

async function fetchFromALOC(subject, type, year) {
  const url = `https://questions.aloc.com.ng/api/v2/m?subject=${subject}&type=${type}&year=${year}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`  - No data for ${subject} ${type} ${year}`);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(`  x Error: ${subject} ${type} ${year}: ${error.message}`);
    return null;
  }
}

function formatQuestion(alocQuestion, examId, subject, year) {
  if (!alocQuestion || !alocQuestion.question) return null;

  const options = [];
  if (alocQuestion.option) {
    if (alocQuestion.option.a) options.push({ label: "A", text: alocQuestion.option.a });
    if (alocQuestion.option.b) options.push({ label: "B", text: alocQuestion.option.b });
    if (alocQuestion.option.c) options.push({ label: "C", text: alocQuestion.option.c });
    if (alocQuestion.option.d) options.push({ label: "D", text: alocQuestion.option.d });
  }

  if (options.length < 4) return null;

  let correctOption = (alocQuestion.answer || "a").toUpperCase();
  if (!["A", "B", "C", "D"].includes(correctOption)) correctOption = "A";

  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);

  return {
    exam_id: examId,
    subject: subjectName === "English" ? "English Language" : subjectName,
    year: year,
    question_text: alocQuestion.question.trim(),
    options: JSON.stringify(options),
    correct_option: correctOption,
    explanation: alocQuestion.section || "",
  };
}

async function insertIntoSupabase(questions) {
  if (questions.length === 0) return 0;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SERVICE_ROLE_KEY,
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(questions),
  });

  if (!response.ok) {
    const error = await response.text();
    console.log(`  x Insert error: ${error.slice(0, 200)}`);
    return 0;
  }

  return questions.length;
}

// ═══ MAIN ═══

async function importQuestions() {
  console.log("========================================");
  console.log("  CrysLearn — Question Import (ALOC)");
  console.log("========================================");
  console.log("");

  if (SUPABASE_URL === "YOUR_SUPABASE_URL") {
    console.log("ERROR: Replace YOUR_SUPABASE_URL and YOUR_SERVICE_ROLE_KEY first!");
    console.log("Open scripts/import-questions.js and update lines 21-22.");
    process.exit(1);
  }

  let totalImported = 0;

  for (const [examType, examId] of Object.entries(EXAM_IDS)) {
    console.log(`\n--- Importing ${examType.toUpperCase()} questions ---`);

    for (const subject of SUBJECTS) {
      console.log(`\n  Subject: ${subject}`);
      let subjectTotal = 0;

      for (const year of YEARS) {
        const data = await fetchFromALOC(subject, examType, year);

        if (!data || !data.data) continue;

        const rawQuestions = Array.isArray(data.data) ? data.data : [data.data];

        const formatted = rawQuestions
          .map((q) => formatQuestion(q, examId, subject, year))
          .filter((q) => q !== null);

        if (formatted.length > 0) {
          const inserted = await insertIntoSupabase(formatted);
          subjectTotal += inserted;
          totalImported += inserted;
          console.log(`    ${year}: ${inserted} questions`);
        }

        // Rate limit
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      console.log(`  Total ${subject}: ${subjectTotal}`);
    }
  }

  console.log("\n========================================");
  console.log(`  DONE! Total imported: ${totalImported}`);
  console.log("========================================");
}

importQuestions().catch(console.error);
