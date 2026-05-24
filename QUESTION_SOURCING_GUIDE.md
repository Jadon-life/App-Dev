# CrysLearn — Question Sourcing Guide

> How to get REAL past questions to populate your app with quality content.

---

## FREE API Sources (Best for getting started fast)

### 1. ALOC Questions API (RECOMMENDED — FREE)
- **URL:** https://questions.aloc.com.ng/
- **GitHub:** https://github.com/Seunope/aloc-endpoints
- **What it has:** 6,000+ questions for JAMB (UTME), WAEC (WASSCE), NECO, and Post-UTME
- **Format:** JSON API — perfect for importing directly into your database
- **Subjects:** Mathematics, English, Physics, Chemistry, Biology, Economics, Government, etc.
- **How to use:**
  ```
  GET https://questions.aloc.com.ng/api/v2/q/1  (single question by ID)
  GET https://questions.aloc.com.ng/api/v2/m?subject=mathematics&type=utme&year=2023
  ```
- **Exam types:** `utme` (JAMB), `wassce` (WAEC), `neco`, `post-utme`

### 2. MySchool.ng Classroom (FREE, Manual)
- **URL:** https://myschool.ng/classroom
- **What it has:** Thousands of JAMB and WAEC questions organized by subject
- **Format:** Web pages — you'd need to manually copy or scrape
- **Subjects:** All major subjects available
- **Notes:** Great for verifying question accuracy and getting explanations

### 3. Passnownow (FREE, Manual)
- **URL:** https://passnownow.com
- **What it has:** JSCE, WAEC, NECO, and JAMB past questions
- **Format:** Web-based, organized by class level and subject

---

## PAID / Premium Sources

### 4. RapidAPI — Nigeria University Past Questions
- **URL:** https://rapidapi.com/curlyzik/api/nigeria-university-past-questions/
- **What it has:** University-specific Post-UTME questions
- **Cost:** Free tier available, paid plans for high volume
- **Best for:** Post-UTME content (university-specific)

### 5. Physical Past Question Booklets
- **Where to buy:** Any bookshop near secondary schools (₦500-₦1,500 each)
- **Brands:** Longman, JUPEB, Zionite, Exam Success, Sylvanus
- **What to do:** Buy the booklet → manually type questions into the database
- **Best for:** Getting very accurate and well-formatted questions

---

## How to Import ALOC API Data into CrysLearn

Here's a script you can run to fetch questions from ALOC and insert them into your Supabase database:

```javascript
// scripts/import-aloc-questions.js
// Run with: node scripts/import-aloc-questions.js

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SERVICE_ROLE_KEY'
);

// Exam IDs in your database
const EXAM_IDS = {
  utme: '11111111-1111-1111-1111-111111111111',   // JAMB
  wassce: '22222222-2222-2222-2222-222222222222',  // WAEC
  neco: '33333333-3333-3333-3333-333333333333',    // NECO
  'post-utme': '44444444-4444-4444-4444-444444444444', // Post-UTME
};

const SUBJECTS = [
  'mathematics', 'english', 'physics', 'chemistry',
  'biology', 'economics', 'government', 'literature'
];

async function fetchFromALOC(subject, type, year) {
  try {
    const url = `https://questions.aloc.com.ng/api/v2/m?subject=${subject}&type=${type}&year=${year}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${subject} ${type} ${year}:`, error.message);
    return null;
  }
}

function formatQuestion(alocQuestion, examId, subject, year) {
  // ALOC format: { id, question, optionA, optionB, optionC, optionD, answer, explanation }
  return {
    exam_id: examId,
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    year: year,
    question_text: alocQuestion.question || '',
    options: [
      { label: 'A', text: alocQuestion.option?.a || '' },
      { label: 'B', text: alocQuestion.option?.b || '' },
      { label: 'C', text: alocQuestion.option?.c || '' },
      { label: 'D', text: alocQuestion.option?.d || '' },
    ],
    correct_option: (alocQuestion.answer || 'A').toUpperCase(),
    explanation: alocQuestion.section || '',
  };
}

async function importQuestions() {
  let totalImported = 0;

  for (const [type, examId] of Object.entries(EXAM_IDS)) {
    for (const subject of SUBJECTS) {
      for (let year = 2015; year <= 2024; year++) {
        const data = await fetchFromALOC(subject, type, year);
        if (!data || !data.data) continue;

        const questions = Array.isArray(data.data) ? data.data : [data.data];
        const formatted = questions
          .filter(q => q.question)
          .map(q => formatQuestion(q, examId, subject, year));

        if (formatted.length > 0) {
          const { error } = await supabase
            .from('questions')
            .insert(formatted);

          if (error) {
            console.error(`Error inserting ${subject} ${type} ${year}:`, error.message);
          } else {
            totalImported += formatted.length;
            console.log(`Imported ${formatted.length} ${subject} questions for ${type} ${year}`);
          }
        }

        // Rate limiting — wait 500ms between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  console.log(`\nDone! Total questions imported: ${totalImported}`);
}

importQuestions();
```

---

## Manual Entry Method (For highest quality)

If you want the BEST quality questions with perfect explanations, manually add them:

1. Buy a past question booklet from a bookshop (₦500-₦1,500)
2. Open Supabase Dashboard → SQL Editor
3. Insert questions one by one using this template:

```sql
INSERT INTO public.questions (exam_id, subject, year, question_text, options, correct_option, explanation)
VALUES (
  '11111111-1111-1111-1111-111111111111',  -- JAMB
  'Mathematics',
  2024,
  'If 2^x = 8, find the value of x',
  '[{"label":"A","text":"2"},{"label":"B","text":"3"},{"label":"C","text":"4"},{"label":"D","text":"8"}]',
  'B',
  '2^x = 8. Since 2^3 = 8, therefore x = 3.'
);
```

---

## Content Strategy (How many questions you need)

| Milestone | Questions needed | How to get them |
|-----------|-----------------|-----------------|
| Beta launch | 200 (50 per exam) | Already seeded! Use the sample data |
| Soft launch | 500 per exam | Import from ALOC API |
| Full launch | 1,000+ per exam | ALOC + manual entry from booklets |
| Growth | 2,000+ per exam | Hire content creators (₦50-₦100 per question) |

---

## Quality Checklist

Before adding any question, verify:
- [ ] Question text is clear and grammatically correct
- [ ] All 4 options are present and different
- [ ] Correct answer is actually correct (verify!)
- [ ] Explanation is helpful and teaches the concept
- [ ] Subject and year are accurate
- [ ] No duplicate questions in the database

---

## Important Legal Notes

- Past questions from JAMB, WAEC, and NECO are widely published and shared in Nigeria
- They are available in commercial booklets sold in every bookshop
- Multiple apps and websites publish them freely (MySchool.ng, ALOC, Passnownow)
- You are not breaking any law by providing past questions — this is standard practice
- However, do NOT claim the questions are "official" from JAMB/WAEC directly
- Word it as "practice questions based on past examination patterns"

---

## Next Steps

1. **Right now:** Your app already has 200 sample questions (seeded in Phase 1)
2. **This week:** Run the ALOC import script to get 2,000-5,000 real questions
3. **Before launch:** Manually review 100 questions for quality
4. **After launch:** Add 50 new questions per week from booklets
