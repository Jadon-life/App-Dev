-- PrepHQ Seed Data: Post-UTME Sample Questions (50 questions)
-- Subjects: Mathematics, English Language, Physics, Chemistry, Biology, Economics, General Knowledge

-- Post-UTME exam ID: 44444444-4444-4444-4444-444444444444

-- === MATHEMATICS (8 questions) ===

INSERT INTO public.questions (exam_id, subject, year, question_text, options, correct_option, explanation) VALUES
('44444444-4444-4444-4444-444444444444', 'Mathematics', 2023, 'Differentiate y = 3x³ + 2x² - 5x + 1',
 '[{"label":"A","text":"9x² + 4x - 5"},{"label":"B","text":"9x² + 2x - 5"},{"label":"C","text":"3x² + 4x - 5"},{"label":"D","text":"9x² + 4x + 5"}]',
 'A', 'dy/dx = 3(3x²) + 2(2x) - 5(1) + 0 = 9x² + 4x - 5.'),

('44444444-4444-4444-4444-444444444444', 'Mathematics', 2023, 'If the roots of x² - 7x + k = 0 are 3 and 4, find k',
 '[{"label":"A","text":"7"},{"label":"B","text":"12"},{"label":"C","text":"10"},{"label":"D","text":"14"}]',
 'B', 'Product of roots = c/a = k/1 = k. Product of 3 and 4 = 12. So k = 12.'),

('44444444-4444-4444-4444-444444444444', 'Mathematics', 2022, 'Evaluate: ∫(2x + 3)dx from 0 to 2',
 '[{"label":"A","text":"10"},{"label":"B","text":"8"},{"label":"C","text":"12"},{"label":"D","text":"6"}]',
 'A', '∫(2x+3)dx = x² + 3x. At x=2: 4+6=10. At x=0: 0. Answer = 10 - 0 = 10.'),

('44444444-4444-4444-4444-444444444444', 'Mathematics', 2022, 'The distance between points (1, 2) and (4, 6) is:',
 '[{"label":"A","text":"5"},{"label":"B","text":"7"},{"label":"C","text":"4"},{"label":"D","text":"25"}]',
 'A', 'd = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5.'),

('44444444-4444-4444-4444-444444444444', 'Mathematics', 2021, 'The matrix [2 1; 3 4] has a determinant of:',
 '[{"label":"A","text":"5"},{"label":"B","text":"8"},{"label":"C","text":"11"},{"label":"D","text":"-5"}]',
 'A', 'det = (2×4) - (1×3) = 8 - 3 = 5.'),

('44444444-4444-4444-4444-444444444444', 'Mathematics', 2021, 'If log₁₀ 2 = 0.3010, find log₁₀ 8',
 '[{"label":"A","text":"0.6020"},{"label":"B","text":"0.9030"},{"label":"C","text":"2.4080"},{"label":"D","text":"0.3010"}]',
 'B', 'log₁₀ 8 = log₁₀ 2³ = 3 log₁₀ 2 = 3 × 0.3010 = 0.9030.'),

('44444444-4444-4444-4444-444444444444', 'Mathematics', 2020, 'Find the equation of the line passing through (2, 3) with gradient 4',
 '[{"label":"A","text":"y = 4x - 5"},{"label":"B","text":"y = 4x + 5"},{"label":"C","text":"y = 4x - 3"},{"label":"D","text":"y = 4x + 3"}]',
 'A', 'y - y₁ = m(x - x₁). y - 3 = 4(x - 2). y = 4x - 8 + 3 = 4x - 5.'),

('44444444-4444-4444-4444-444444444444', 'Mathematics', 2020, 'In how many ways can 5 students be arranged in a row?',
 '[{"label":"A","text":"120"},{"label":"B","text":"25"},{"label":"C","text":"60"},{"label":"D","text":"720"}]',
 'A', '5! = 5 × 4 × 3 × 2 × 1 = 120 arrangements (permutations).'),

-- === ENGLISH LANGUAGE (8 questions) ===

('44444444-4444-4444-4444-444444444444', 'English Language', 2023, 'Choose the word closest in meaning to "ubiquitous":',
 '[{"label":"A","text":"Rare"},{"label":"B","text":"Everywhere"},{"label":"C","text":"Unique"},{"label":"D","text":"Invisible"}]',
 'B', 'Ubiquitous means present, appearing, or found everywhere.'),

('44444444-4444-4444-4444-444444444444', 'English Language', 2023, 'Identify the sentence with correct subject-verb agreement:',
 '[{"label":"A","text":"The team are playing well"},{"label":"B","text":"Every student have submitted"},{"label":"C","text":"Neither of the boys was present"},{"label":"D","text":"The news are bad"}]',
 'C', '"Neither of" takes a singular verb. "Neither of the boys was present" is correct.'),

('44444444-4444-4444-4444-444444444444', 'English Language', 2022, 'The literary device in "O Death, where is thy sting?" is:',
 '[{"label":"A","text":"Rhetorical question + apostrophe"},{"label":"B","text":"Simile"},{"label":"C","text":"Irony"},{"label":"D","text":"Alliteration"}]',
 'A', 'It is both a rhetorical question (not expecting an answer) and apostrophe (addressing Death directly as if present).'),

('44444444-4444-4444-4444-444444444444', 'English Language', 2022, 'Which of these is a complex sentence?',
 '[{"label":"A","text":"I ate and I slept"},{"label":"B","text":"She cried because she was hurt"},{"label":"C","text":"The boy ran fast"},{"label":"D","text":"Run now!"}]',
 'B', 'A complex sentence has one independent clause and at least one dependent clause. "Because she was hurt" is dependent.'),

('44444444-4444-4444-4444-444444444444', 'English Language', 2021, 'The word "antecedent" means:',
 '[{"label":"A","text":"Something that comes after"},{"label":"B","text":"Something that comes before"},{"label":"C","text":"Something that is simultaneous"},{"label":"D","text":"Something that is opposite"}]',
 'B', 'Antecedent (ante = before) means something that comes before or precedes. In grammar, it is the noun a pronoun refers to.'),

('44444444-4444-4444-4444-444444444444', 'English Language', 2021, 'Choose the option with the correct spelling:',
 '[{"label":"A","text":"Accomodation"},{"label":"B","text":"Accommodation"},{"label":"C","text":"Acommodation"},{"label":"D","text":"Acomodation"}]',
 'B', 'Accommodation has two c''s and two m''s. This is one of the most commonly misspelled words.'),

('44444444-4444-4444-4444-444444444444', 'English Language', 2020, 'A eulogy is:',
 '[{"label":"A","text":"A speech criticising someone"},{"label":"B","text":"A speech praising someone, especially at a funeral"},{"label":"C","text":"A song"},{"label":"D","text":"A type of poem"}]',
 'B', 'A eulogy is a speech or piece of writing that praises someone highly, typically delivered at a funeral or memorial service.'),

('44444444-4444-4444-4444-444444444444', 'English Language', 2020, 'The sentence "Had I known, I would not have gone" is an example of:',
 '[{"label":"A","text":"Third conditional"},{"label":"B","text":"First conditional"},{"label":"C","text":"Second conditional"},{"label":"D","text":"Zero conditional"}]',
 'A', 'Third conditional (past unreal): If + past perfect, would have + past participle. It expresses regret about the past.'),

-- === PHYSICS (8 questions) ===

('44444444-4444-4444-4444-444444444444', 'Physics', 2023, 'The dimension of force is:',
 '[{"label":"A","text":"MLT⁻¹"},{"label":"B","text":"MLT⁻²"},{"label":"C","text":"ML²T⁻²"},{"label":"D","text":"ML⁻¹T⁻²"}]',
 'B', 'Force = mass × acceleration. Dimension = [M][LT⁻²] = MLT⁻².'),

('44444444-4444-4444-4444-444444444444', 'Physics', 2023, 'A projectile is launched at 30° to the horizontal with velocity 20 m/s. The horizontal component is:',
 '[{"label":"A","text":"10 m/s"},{"label":"B","text":"17.3 m/s"},{"label":"C","text":"20 m/s"},{"label":"D","text":"14.1 m/s"}]',
 'B', 'Horizontal component = v cos θ = 20 cos 30° = 20 × (√3/2) = 10√3 ≈ 17.3 m/s.'),

('44444444-4444-4444-4444-444444444444', 'Physics', 2022, 'The escape velocity from the Earth''s surface depends on:',
 '[{"label":"A","text":"Mass of the escaping body"},{"label":"B","text":"Mass and radius of the Earth"},{"label":"C","text":"Direction of launch"},{"label":"D","text":"Time of launch"}]',
 'B', 'Escape velocity vₑ = √(2GM/R) depends only on the mass (M) and radius (R) of the planet, not the escaping body''s mass.'),

('44444444-4444-4444-4444-444444444444', 'Physics', 2022, 'In a step-up transformer, the secondary voltage is:',
 '[{"label":"A","text":"Less than the primary voltage"},{"label":"B","text":"Equal to the primary voltage"},{"label":"C","text":"Greater than the primary voltage"},{"label":"D","text":"Zero"}]',
 'C', 'A step-up transformer has more turns in the secondary coil, producing a higher output voltage than input.'),

('44444444-4444-4444-4444-444444444444', 'Physics', 2021, 'The work function of a metal is the:',
 '[{"label":"A","text":"Maximum energy of emitted electrons"},{"label":"B","text":"Minimum energy needed to free an electron from the surface"},{"label":"C","text":"Energy of the incident photon"},{"label":"D","text":"Kinetic energy of the metal"}]',
 'B', 'The work function (φ) is the minimum energy required to remove an electron from the surface of a metal.'),

('44444444-4444-4444-4444-444444444444', 'Physics', 2021, 'The moment of a force is maximum when the force is applied:',
 '[{"label":"A","text":"Parallel to the lever arm"},{"label":"B","text":"At 45° to the lever arm"},{"label":"C","text":"Perpendicular to the lever arm"},{"label":"D","text":"At the pivot point"}]',
 'C', 'Moment = F × d × sin θ. Maximum when sin θ = 1, i.e., θ = 90° (force perpendicular to lever arm).'),

('44444444-4444-4444-4444-444444444444', 'Physics', 2020, 'The efficiency of a machine is always less than 100% because of:',
 '[{"label":"A","text":"Gravity"},{"label":"B","text":"Friction"},{"label":"C","text":"Inertia"},{"label":"D","text":"Momentum"}]',
 'B', 'Friction converts some input energy to heat, so output work is always less than input work. Efficiency < 100%.'),

('44444444-4444-4444-4444-444444444444', 'Physics', 2020, 'The refractive index of a medium is 1.5. The speed of light in that medium is (c = 3 × 10⁸ m/s):',
 '[{"label":"A","text":"2 × 10⁸ m/s"},{"label":"B","text":"4.5 × 10⁸ m/s"},{"label":"C","text":"1.5 × 10⁸ m/s"},{"label":"D","text":"3 × 10⁸ m/s"}]',
 'A', 'n = c/v. v = c/n = 3×10⁸/1.5 = 2×10⁸ m/s.'),

-- === CHEMISTRY (8 questions) ===

('44444444-4444-4444-4444-444444444444', 'Chemistry', 2023, 'Which of the following is a strong acid?',
 '[{"label":"A","text":"Ethanoic acid"},{"label":"B","text":"Citric acid"},{"label":"C","text":"Hydrochloric acid"},{"label":"D","text":"Carbonic acid"}]',
 'C', 'HCl (hydrochloric acid) is a strong acid — it fully dissociates in water. Ethanoic and citric acids are weak acids.'),

('44444444-4444-4444-4444-444444444444', 'Chemistry', 2023, 'The shape of a methane molecule (CH₄) is:',
 '[{"label":"A","text":"Linear"},{"label":"B","text":"Trigonal planar"},{"label":"C","text":"Tetrahedral"},{"label":"D","text":"Octahedral"}]',
 'C', 'CH₄ has 4 bonding pairs around carbon with no lone pairs, giving a tetrahedral shape (bond angle 109.5°).'),

('44444444-4444-4444-4444-444444444444', 'Chemistry', 2022, 'The molar mass of CaCO₃ is (Ca=40, C=12, O=16):',
 '[{"label":"A","text":"84 g/mol"},{"label":"B","text":"100 g/mol"},{"label":"C","text":"68 g/mol"},{"label":"D","text":"112 g/mol"}]',
 'B', 'CaCO₃ = 40 + 12 + 3(16) = 40 + 12 + 48 = 100 g/mol.'),

('44444444-4444-4444-4444-444444444444', 'Chemistry', 2022, 'An exothermic reaction is one that:',
 '[{"label":"A","text":"Absorbs heat from surroundings"},{"label":"B","text":"Releases heat to surroundings"},{"label":"C","text":"Has no heat change"},{"label":"D","text":"Only occurs at high temperature"}]',
 'B', 'Exothermic reactions release energy (heat) to the surroundings. ΔH is negative.'),

('44444444-4444-4444-4444-444444444444', 'Chemistry', 2021, 'The number of moles in 11.2 litres of gas at STP is:',
 '[{"label":"A","text":"1.0"},{"label":"B","text":"0.5"},{"label":"C","text":"2.0"},{"label":"D","text":"0.25"}]',
 'B', 'At STP, 1 mole of gas = 22.4 L. Moles = 11.2/22.4 = 0.5 moles.'),

('44444444-4444-4444-4444-444444444444', 'Chemistry', 2021, 'Electronegativity increases across a period because:',
 '[{"label":"A","text":"Atomic radius increases"},{"label":"B","text":"Nuclear charge increases with constant shielding"},{"label":"C","text":"Number of electron shells increases"},{"label":"D","text":"Ionisation energy decreases"}]',
 'B', 'Across a period, nuclear charge increases but shielding stays similar, so electrons are attracted more strongly.'),

('44444444-4444-4444-4444-444444444444', 'Chemistry', 2020, 'The functional group in carboxylic acids is:',
 '[{"label":"A","text":"-OH"},{"label":"B","text":"-COOH"},{"label":"C","text":"-CHO"},{"label":"D","text":"-CO-"}]',
 'B', 'Carboxylic acids contain the -COOH (carboxyl) group. -OH is alcohols, -CHO is aldehydes, -CO- is ketones.'),

('44444444-4444-4444-4444-444444444444', 'Chemistry', 2020, 'Which gas is collected over water?',
 '[{"label":"A","text":"Ammonia"},{"label":"B","text":"Hydrogen chloride"},{"label":"C","text":"Oxygen"},{"label":"D","text":"Sulphur dioxide"}]',
 'C', 'Oxygen is only slightly soluble in water, so it can be collected over water. NH₃ and HCl are very soluble.'),

-- === BIOLOGY (8 questions) ===

('44444444-4444-4444-4444-444444444444', 'Biology', 2023, 'The Watson-Crick model of DNA describes it as:',
 '[{"label":"A","text":"A single helix"},{"label":"B","text":"A double helix"},{"label":"C","text":"A triple helix"},{"label":"D","text":"A linear molecule"}]',
 'B', 'Watson and Crick discovered that DNA has a double helix structure — two complementary strands wound around each other.'),

('44444444-4444-4444-4444-444444444444', 'Biology', 2023, 'Sickle cell disease is an example of:',
 '[{"label":"A","text":"A sex-linked disorder"},{"label":"B","text":"A chromosomal mutation"},{"label":"C","text":"A point mutation (gene mutation)"},{"label":"D","text":"An environmental disease"}]',
 'C', 'Sickle cell is caused by a point mutation in the haemoglobin gene — a single base substitution (GAG → GTG).'),

('44444444-4444-4444-4444-444444444444', 'Biology', 2022, 'The sequence of energy flow in a food chain is:',
 '[{"label":"A","text":"Consumer → Producer → Decomposer"},{"label":"B","text":"Producer → Consumer → Decomposer"},{"label":"C","text":"Decomposer → Producer → Consumer"},{"label":"D","text":"Consumer → Decomposer → Producer"}]',
 'B', 'Energy flows: Producers (plants) → Primary consumers → Secondary consumers → Decomposers.'),

('44444444-4444-4444-4444-444444444444', 'Biology', 2022, 'Which of the following is a vestigial organ in humans?',
 '[{"label":"A","text":"Heart"},{"label":"B","text":"Appendix"},{"label":"C","text":"Liver"},{"label":"D","text":"Kidney"}]',
 'B', 'The appendix is a vestigial organ — it had a function in ancestors (digesting cellulose) but has little function now in humans.'),

('44444444-4444-4444-4444-444444444444', 'Biology', 2021, 'Mendel''s law of segregation states that:',
 '[{"label":"A","text":"Genes blend together"},{"label":"B","text":"Alleles separate during gamete formation"},{"label":"C","text":"All traits are linked"},{"label":"D","text":"Dominant always masks recessive"}]',
 'B', 'Law of Segregation: during gamete formation, the two alleles for each gene separate so each gamete gets only one allele.'),

('44444444-4444-4444-4444-444444444444', 'Biology', 2021, 'The process by which white blood cells engulf bacteria is called:',
 '[{"label":"A","text":"Osmosis"},{"label":"B","text":"Pinocytosis"},{"label":"C","text":"Phagocytosis"},{"label":"D","text":"Exocytosis"}]',
 'C', 'Phagocytosis ("cell eating") is the process by which white blood cells (phagocytes) engulf and destroy pathogens.'),

-- === ECONOMICS (5 questions) ===

('44444444-4444-4444-4444-444444444444', 'Economics', 2023, 'Inflation refers to:',
 '[{"label":"A","text":"A decrease in prices"},{"label":"B","text":"A sustained increase in the general price level"},{"label":"C","text":"An increase in money supply only"},{"label":"D","text":"A decrease in production"}]',
 'B', 'Inflation is a sustained increase in the general price level of goods and services over time, reducing purchasing power.'),

('44444444-4444-4444-4444-444444444444', 'Economics', 2022, 'The law of demand states that:',
 '[{"label":"A","text":"As price increases, quantity demanded increases"},{"label":"B","text":"As price increases, quantity demanded decreases"},{"label":"C","text":"Price and demand are not related"},{"label":"D","text":"Supply determines demand"}]',
 'B', 'Law of demand: ceteris paribus, as the price of a good increases, the quantity demanded decreases (inverse relationship).'),

('44444444-4444-4444-4444-444444444444', 'Economics', 2021, 'GDP stands for:',
 '[{"label":"A","text":"Gross Domestic Price"},{"label":"B","text":"Gross Domestic Product"},{"label":"C","text":"General Development Plan"},{"label":"D","text":"Global Domestic Production"}]',
 'B', 'GDP (Gross Domestic Product) is the total value of all goods and services produced within a country in a given period.'),

('44444444-4444-4444-4444-444444444444', 'Economics', 2020, 'Which of the following is NOT a factor of production?',
 '[{"label":"A","text":"Land"},{"label":"B","text":"Money"},{"label":"C","text":"Labour"},{"label":"D","text":"Capital"}]',
 'B', 'The four factors of production are Land, Labour, Capital, and Entrepreneurship. Money itself is not a factor — it is a medium.'),

('44444444-4444-4444-4444-444444444444', 'Economics', 2019, 'A market structure with many sellers selling identical products is called:',
 '[{"label":"A","text":"Monopoly"},{"label":"B","text":"Oligopoly"},{"label":"C","text":"Perfect competition"},{"label":"D","text":"Monopolistic competition"}]',
 'C', 'Perfect competition: many buyers/sellers, homogeneous products, free entry/exit, perfect information.'),

-- === GENERAL KNOWLEDGE (5 questions) ===

('44444444-4444-4444-4444-444444444444', 'General Knowledge', 2023, 'The current capital of Nigeria is:',
 '[{"label":"A","text":"Lagos"},{"label":"B","text":"Abuja"},{"label":"C","text":"Kaduna"},{"label":"D","text":"Port Harcourt"}]',
 'B', 'Abuja has been the capital of Nigeria since 1991, replacing Lagos.'),

('44444444-4444-4444-4444-444444444444', 'General Knowledge', 2022, 'Nigeria gained independence in:',
 '[{"label":"A","text":"1957"},{"label":"B","text":"1960"},{"label":"C","text":"1963"},{"label":"D","text":"1966"}]',
 'B', 'Nigeria gained independence from Britain on October 1, 1960.'),

('44444444-4444-4444-4444-444444444444', 'General Knowledge', 2021, 'The largest river in Africa is:',
 '[{"label":"A","text":"Niger"},{"label":"B","text":"Congo"},{"label":"C","text":"Nile"},{"label":"D","text":"Zambezi"}]',
 'C', 'The Nile is the longest river in Africa (approximately 6,650 km). The Congo is the second longest.'),

('44444444-4444-4444-4444-444444444444', 'General Knowledge', 2020, 'How many states does Nigeria have?',
 '[{"label":"A","text":"30"},{"label":"B","text":"36"},{"label":"C","text":"37"},{"label":"D","text":"24"}]',
 'B', 'Nigeria has 36 states plus the Federal Capital Territory (FCT), Abuja.'),

('44444444-4444-4444-4444-444444444444', 'General Knowledge', 2019, 'The United Nations was established in:',
 '[{"label":"A","text":"1942"},{"label":"B","text":"1945"},{"label":"C","text":"1948"},{"label":"D","text":"1950"}]',
 'B', 'The United Nations was established on October 24, 1945, after World War II ended.');
