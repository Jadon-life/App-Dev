/**
 * WAEC Subject Registry — Core subjects prioritized first.
 * Used by the Past Questions section to display available subjects.
 * Source: Official WAEC Nigeria e-Learning Index (waeconline.org.ng)
 */

export interface WaecSubject {
  id: string;
  displayName: string;
  category: string;
  sourceUrl: string;
  priority: number; // Lower = higher priority (core subjects first)
}

// Core subjects that most WASSCE candidates take (priority 1-10)
// Then secondary subjects (priority 11-30)
// Then vocational/trade subjects (priority 31+)
export const WAEC_SUBJECTS: WaecSubject[] = [
  // ═══ CORE SUBJECTS (Priority 1-10) ═══
  { id: "english_language", displayName: "English Language", category: "languages", sourceUrl: "https://www.waeconline.org.ng/e-Learning/English/Englmain.html", priority: 1 },
  { id: "general_mathematics", displayName: "General Mathematics", category: "mathematics_and_applied_science", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Mathematics/mathsmain.html", priority: 2 },
  { id: "physics", displayName: "Physics", category: "sciences", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Physics/physmain.html", priority: 3 },
  { id: "chemistry", displayName: "Chemistry", category: "sciences", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Chemistry/chemmain.html", priority: 4 },
  { id: "biology", displayName: "Biology", category: "sciences", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Biology/Biomain.html", priority: 5 },
  { id: "economics", displayName: "Economics", category: "general", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Economics/econsmain.html", priority: 6 },
  { id: "government", displayName: "Government", category: "general", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Government/Govtmain.html", priority: 7 },
  { id: "literature_in_english", displayName: "Literature-In-English", category: "languages", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Literature/litEmain.html", priority: 8 },
  { id: "civic_education", displayName: "Civic Education", category: "general", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Civic/Civicmain.html", priority: 9 },
  { id: "commerce", displayName: "Commerce", category: "business", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Commerce/Commmain.html", priority: 10 },

  // ═══ SECONDARY SUBJECTS (Priority 11-25) ═══
  { id: "financial_accounting", displayName: "Financial Accounting", category: "business", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Financial/FAmain.html", priority: 11 },
  { id: "further_mathematics", displayName: "Further Mathematics", category: "mathematics_and_applied_science", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Further/Furthmain.html", priority: 12 },
  { id: "agricultural_science", displayName: "Agricultural Science", category: "sciences", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Agriculture/Agricmain.html", priority: 13 },
  { id: "geography", displayName: "Geography", category: "general", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Geography/Geomain.html", priority: 14 },
  { id: "christian_religious_studies", displayName: "Christian Religious Studies", category: "general", sourceUrl: "https://www.waeconline.org.ng/e-Learning/CRK/CRSmain.html", priority: 15 },
  { id: "islamic_studies", displayName: "Islamic Studies", category: "general", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Islamic/IRKmain.html", priority: 16 },
  { id: "computer_studies", displayName: "Computer Studies", category: "mathematics_and_applied_science", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Computer/Compmain.html", priority: 17 },
  { id: "data_processing", displayName: "Data Processing", category: "mathematics_and_applied_science", sourceUrl: "https://www.waeconline.org.ng/e-Learning/DataProcessing/Datapmain.html", priority: 18 },
  { id: "food_and_nutrition", displayName: "Food and Nutrition", category: "home_economics", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Food/foodsmain.html", priority: 19 },
  { id: "history", displayName: "History", category: "general", sourceUrl: "https://www.waeconline.org.ng/e-Learning/History/histmain.html", priority: 20 },
  { id: "marketing", displayName: "Marketing", category: "business", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Marketing/Marketmain.html", priority: 21 },
  { id: "yoruba", displayName: "Yoruba", category: "languages", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Yoruba/Yormain.html", priority: 22 },
  { id: "igbo", displayName: "Igbo", category: "languages", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Igbo/Igbomain.html", priority: 23 },
  { id: "hausa", displayName: "Hausa", category: "languages", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Hausa/Hausamain.html", priority: 24 },
  { id: "french", displayName: "French", category: "languages", sourceUrl: "https://www.waeconline.org.ng/e-Learning/French/Frechmain.html", priority: 25 },

  // ═══ VOCATIONAL/TRADE SUBJECTS (Priority 26+) ═══
  { id: "technical_drawing", displayName: "Technical Drawing", category: "civil_and_mechanical", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Technical/TDmain.html", priority: 26 },
  { id: "basic_electricity", displayName: "Basic Electricity", category: "mathematics_and_applied_science", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Applied/Applmain.html", priority: 27 },
  { id: "basic_electronics", displayName: "Basic Electronics", category: "mathematics_and_applied_science", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Electronics/electmain.html", priority: 28 },
  { id: "health_education", displayName: "Health Education", category: "sciences", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Health/HScmain.html", priority: 29 },
  { id: "physical_education", displayName: "Physical Education", category: "sciences", sourceUrl: "https://www.waeconline.org.ng/e-Learning/Physical/PhEdmain.html", priority: 30 },
];

// Get only core subjects (priority 1-10)
export const WAEC_CORE_SUBJECTS = WAEC_SUBJECTS.filter(s => s.priority <= 10);

// Get subjects sorted by priority
export const getSubjectsByPriority = () => [...WAEC_SUBJECTS].sort((a, b) => a.priority - b.priority);

// Get subjects by category
export const getSubjectsByCategory = (category: string) => WAEC_SUBJECTS.filter(s => s.category === category);
