-- CrysLearn Seed Data: JAMB Sample Questions (50 questions)
-- Subjects: Mathematics, English Language, Physics, Chemistry, Biology

-- JAMB exam ID: 11111111-1111-1111-1111-111111111111

-- === MATHEMATICS (10 questions) ===

INSERT INTO public.questions (exam_id, subject, year, question_text, options, correct_option, explanation) VALUES
('11111111-1111-1111-1111-111111111111', 'Mathematics', 2023, 'Solve for x: 2x + 5 = 13',
 '[{"label":"A","text":"3"},{"label":"B","text":"4"},{"label":"C","text":"5"},{"label":"D","text":"6"}]',
 'B', 'Subtract 5 from both sides: 2x = 8. Divide by 2: x = 4.'),

('11111111-1111-1111-1111-111111111111', 'Mathematics', 2023, 'Find the value of log₂ 16',
 '[{"label":"A","text":"2"},{"label":"B","text":"3"},{"label":"C","text":"4"},{"label":"D","text":"8"}]',
 'C', '2⁴ = 16, therefore log₂ 16 = 4.'),

('11111111-1111-1111-1111-111111111111', 'Mathematics', 2022, 'The sum of the first 10 terms of an AP with first term 3 and common difference 2 is:',
 '[{"label":"A","text":"100"},{"label":"B","text":"120"},{"label":"C","text":"110"},{"label":"D","text":"130"}]',
 'B', 'S₁₀ = n/2[2a + (n-1)d] = 10/2[2(3) + 9(2)] = 5[6 + 18] = 5 × 24 = 120.'),

('11111111-1111-1111-1111-111111111111', 'Mathematics', 2022, 'If P = {1, 2, 3, 4, 5} and Q = {2, 4, 6, 8}, find P ∩ Q',
 '[{"label":"A","text":"{2, 4}"},{"label":"B","text":"{1, 3, 5}"},{"label":"C","text":"{6, 8}"},{"label":"D","text":"{1, 2, 3, 4, 5, 6, 8}"}]',
 'A', 'P ∩ Q contains elements common to both sets: {2, 4}.'),

('11111111-1111-1111-1111-111111111111', 'Mathematics', 2021, 'Simplify: (3√2)²',
 '[{"label":"A","text":"6"},{"label":"B","text":"18"},{"label":"C","text":"12"},{"label":"D","text":"9"}]',
 'B', '(3√2)² = 3² × (√2)² = 9 × 2 = 18.'),

('11111111-1111-1111-1111-111111111111', 'Mathematics', 2021, 'Find the gradient of the line 3y + 2x = 6',
 '[{"label":"A","text":"-2/3"},{"label":"B","text":"2/3"},{"label":"C","text":"-3/2"},{"label":"D","text":"3/2"}]',
 'A', 'Rearrange to y = mx + c form: 3y = -2x + 6, y = -2x/3 + 2. Gradient m = -2/3.'),

('11111111-1111-1111-1111-111111111111', 'Mathematics', 2020, 'The probability of picking a red ball from a bag containing 3 red and 7 blue balls is:',
 '[{"label":"A","text":"3/7"},{"label":"B","text":"3/10"},{"label":"C","text":"7/10"},{"label":"D","text":"1/3"}]',
 'B', 'P(red) = number of red balls / total balls = 3/(3+7) = 3/10.'),

('11111111-1111-1111-1111-111111111111', 'Mathematics', 2020, 'If f(x) = 3x² - 2x + 1, find f(2)',
 '[{"label":"A","text":"9"},{"label":"B","text":"11"},{"label":"C","text":"13"},{"label":"D","text":"7"}]',
 'A', 'f(2) = 3(2²) - 2(2) + 1 = 3(4) - 4 + 1 = 12 - 4 + 1 = 9.'),

('11111111-1111-1111-1111-111111111111', 'Mathematics', 2019, 'Convert 110₂ to base 10',
 '[{"label":"A","text":"5"},{"label":"B","text":"6"},{"label":"C","text":"7"},{"label":"D","text":"8"}]',
 'B', '110₂ = 1×2² + 1×2¹ + 0×2⁰ = 4 + 2 + 0 = 6.'),

('11111111-1111-1111-1111-111111111111', 'Mathematics', 2019, 'Find the area of a circle with radius 7cm (take π = 22/7)',
 '[{"label":"A","text":"154 cm²"},{"label":"B","text":"44 cm²"},{"label":"C","text":"77 cm²"},{"label":"D","text":"308 cm²"}]',
 'A', 'Area = πr² = 22/7 × 7² = 22/7 × 49 = 22 × 7 = 154 cm².'),

-- === ENGLISH LANGUAGE (10 questions) ===

('11111111-1111-1111-1111-111111111111', 'English Language', 2023, 'Choose the word that is nearest in meaning to "ephemeral":',
 '[{"label":"A","text":"Permanent"},{"label":"B","text":"Transient"},{"label":"C","text":"Beautiful"},{"label":"D","text":"Ancient"}]',
 'B', 'Ephemeral means lasting for a very short time, which is the same as transient.'),

('11111111-1111-1111-1111-111111111111', 'English Language', 2023, 'Select the correct option: The committee ___ divided in their opinion.',
 '[{"label":"A","text":"is"},{"label":"B","text":"are"},{"label":"C","text":"was"},{"label":"D","text":"were"}]',
 'B', 'When committee members have different opinions, we use the plural verb "are" to show they act as individuals.'),

('11111111-1111-1111-1111-111111111111', 'English Language', 2022, 'Which figure of speech is used in: "The wind whispered through the trees"?',
 '[{"label":"A","text":"Simile"},{"label":"B","text":"Metaphor"},{"label":"C","text":"Personification"},{"label":"D","text":"Hyperbole"}]',
 'C', 'Personification gives human qualities to non-human things. Wind cannot literally whisper.'),

('11111111-1111-1111-1111-111111111111', 'English Language', 2022, 'Choose the word that is opposite in meaning to "benevolent":',
 '[{"label":"A","text":"Generous"},{"label":"B","text":"Malevolent"},{"label":"C","text":"Kind"},{"label":"D","text":"Wealthy"}]',
 'B', 'Benevolent means well-meaning and kindly. Its opposite is malevolent (wishing harm).'),

('11111111-1111-1111-1111-111111111111', 'English Language', 2021, 'Identify the correct sentence:',
 '[{"label":"A","text":"Me and him went to the market"},{"label":"B","text":"He and I went to the market"},{"label":"C","text":"Him and I went to the market"},{"label":"D","text":"Me and he went to the market"}]',
 'B', 'Subject pronouns (He, I) are used as subjects of verbs. "He and I" is correct when used as the subject.'),

('11111111-1111-1111-1111-111111111111', 'English Language', 2021, 'The passive form of "The dog bit the man" is:',
 '[{"label":"A","text":"The man was bitten by the dog"},{"label":"B","text":"The man is bitten by the dog"},{"label":"C","text":"The man has been bitten by the dog"},{"label":"D","text":"The man had been bitten by the dog"}]',
 'A', 'The passive voice uses object + was/were + past participle + by + subject. Past tense "bit" becomes "was bitten".'),

('11111111-1111-1111-1111-111111111111', 'English Language', 2020, 'A "monologue" is a long speech by:',
 '[{"label":"A","text":"Two people"},{"label":"B","text":"A group"},{"label":"C","text":"One person"},{"label":"D","text":"A narrator only"}]',
 'C', 'The prefix "mono-" means one. A monologue is a long speech by one person.'),

('11111111-1111-1111-1111-111111111111', 'English Language', 2020, 'Choose the correctly punctuated sentence:',
 '[{"label":"A","text":"Its a beautiful day isnt it"},{"label":"B","text":"Its a beautiful day, isnt it?"},{"label":"C","text":"It''s a beautiful day, isn''t it?"},{"label":"D","text":"Its'' a beautiful day isn''t it"}]',
 'C', 'Contractions use apostrophes: It''s (it is), isn''t (is not). Tag questions end with question marks.'),

('11111111-1111-1111-1111-111111111111', 'English Language', 2019, 'Which of these is a compound sentence?',
 '[{"label":"A","text":"The boy ran fast"},{"label":"B","text":"Running is good exercise"},{"label":"C","text":"The boy ran fast, but he missed the bus"},{"label":"D","text":"The boy who ran fast missed the bus"}]',
 'C', 'A compound sentence joins two independent clauses with a coordinating conjunction (but, and, or, etc.).'),

('11111111-1111-1111-1111-111111111111', 'English Language', 2019, 'The word "unbelievable" has how many morphemes?',
 '[{"label":"A","text":"2"},{"label":"B","text":"3"},{"label":"C","text":"4"},{"label":"D","text":"1"}]',
 'B', 'un- (prefix) + believe (root) + -able (suffix) = 3 morphemes.'),

-- === PHYSICS (10 questions) ===

('11111111-1111-1111-1111-111111111111', 'Physics', 2023, 'A body of mass 5kg is moving with a velocity of 10 m/s. Its kinetic energy is:',
 '[{"label":"A","text":"250 J"},{"label":"B","text":"100 J"},{"label":"C","text":"500 J"},{"label":"D","text":"50 J"}]',
 'A', 'KE = ½mv² = ½ × 5 × 10² = ½ × 5 × 100 = 250 J.'),

('11111111-1111-1111-1111-111111111111', 'Physics', 2023, 'Which of the following is a vector quantity?',
 '[{"label":"A","text":"Speed"},{"label":"B","text":"Mass"},{"label":"C","text":"Velocity"},{"label":"D","text":"Temperature"}]',
 'C', 'Velocity has both magnitude and direction, making it a vector quantity. Speed, mass, and temperature are scalars.'),

('11111111-1111-1111-1111-111111111111', 'Physics', 2022, 'The SI unit of electric current is:',
 '[{"label":"A","text":"Volt"},{"label":"B","text":"Ohm"},{"label":"C","text":"Ampere"},{"label":"D","text":"Watt"}]',
 'C', 'The ampere (A) is the SI base unit of electric current, named after André-Marie Ampère.'),

('11111111-1111-1111-1111-111111111111', 'Physics', 2022, 'A car travels 100m in 10 seconds. Its average speed is:',
 '[{"label":"A","text":"5 m/s"},{"label":"B","text":"10 m/s"},{"label":"C","text":"100 m/s"},{"label":"D","text":"1000 m/s"}]',
 'B', 'Average speed = total distance / total time = 100m / 10s = 10 m/s.'),

('11111111-1111-1111-1111-111111111111', 'Physics', 2021, 'The law that states "every action has an equal and opposite reaction" is Newton''s:',
 '[{"label":"A","text":"First law"},{"label":"B","text":"Second law"},{"label":"C","text":"Third law"},{"label":"D","text":"Law of gravitation"}]',
 'C', 'Newton''s Third Law states that for every action, there is an equal and opposite reaction.'),

('11111111-1111-1111-1111-111111111111', 'Physics', 2021, 'The frequency of a wave is 50 Hz and its wavelength is 2m. The velocity of the wave is:',
 '[{"label":"A","text":"25 m/s"},{"label":"B","text":"100 m/s"},{"label":"C","text":"52 m/s"},{"label":"D","text":"48 m/s"}]',
 'B', 'v = fλ = 50 × 2 = 100 m/s.'),

('11111111-1111-1111-1111-111111111111', 'Physics', 2020, 'A 2kΩ resistor and a 3kΩ resistor connected in series have a total resistance of:',
 '[{"label":"A","text":"5 kΩ"},{"label":"B","text":"1.2 kΩ"},{"label":"C","text":"6 kΩ"},{"label":"D","text":"2.5 kΩ"}]',
 'A', 'In series: R_total = R₁ + R₂ = 2kΩ + 3kΩ = 5kΩ.'),

('11111111-1111-1111-1111-111111111111', 'Physics', 2020, 'The boiling point of water at standard atmospheric pressure is:',
 '[{"label":"A","text":"0°C"},{"label":"B","text":"100°C"},{"label":"C","text":"212°C"},{"label":"D","text":"373°C"}]',
 'B', 'Water boils at 100°C (373K or 212°F) at standard atmospheric pressure (1 atm).'),

('11111111-1111-1111-1111-111111111111', 'Physics', 2019, 'A force of 20N acts on a mass of 4kg. The acceleration produced is:',
 '[{"label":"A","text":"80 m/s²"},{"label":"B","text":"5 m/s²"},{"label":"C","text":"24 m/s²"},{"label":"D","text":"16 m/s²"}]',
 'B', 'From F = ma: a = F/m = 20/4 = 5 m/s².'),

('11111111-1111-1111-1111-111111111111', 'Physics', 2019, 'Which of the following is an example of a longitudinal wave?',
 '[{"label":"A","text":"Light wave"},{"label":"B","text":"Water wave"},{"label":"C","text":"Sound wave"},{"label":"D","text":"Radio wave"}]',
 'C', 'Sound waves are longitudinal — particles vibrate parallel to the direction of wave propagation.'),

-- === CHEMISTRY (10 questions) ===

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2023, 'The atomic number of an element is determined by the number of:',
 '[{"label":"A","text":"Neutrons"},{"label":"B","text":"Protons"},{"label":"C","text":"Electrons"},{"label":"D","text":"Nucleons"}]',
 'B', 'Atomic number (Z) equals the number of protons in the nucleus of an atom.'),

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2023, 'Which of the following is a noble gas?',
 '[{"label":"A","text":"Nitrogen"},{"label":"B","text":"Oxygen"},{"label":"C","text":"Neon"},{"label":"D","text":"Chlorine"}]',
 'C', 'Neon (Ne) is a noble gas in Group 18 of the periodic table. Noble gases have full outer electron shells.'),

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2022, 'The chemical formula for calcium hydroxide is:',
 '[{"label":"A","text":"CaO"},{"label":"B","text":"Ca(OH)₂"},{"label":"C","text":"CaCO₃"},{"label":"D","text":"CaCl₂"}]',
 'B', 'Calcium hydroxide is Ca(OH)₂ — calcium (Ca²⁺) combined with two hydroxide ions (OH⁻).'),

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2022, 'What type of bond is formed between sodium and chlorine?',
 '[{"label":"A","text":"Covalent bond"},{"label":"B","text":"Ionic bond"},{"label":"C","text":"Metallic bond"},{"label":"D","text":"Hydrogen bond"}]',
 'B', 'Sodium (metal) transfers an electron to chlorine (non-metal), forming an ionic bond (NaCl).'),

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2021, 'The pH of a neutral solution at 25°C is:',
 '[{"label":"A","text":"0"},{"label":"B","text":"7"},{"label":"C","text":"14"},{"label":"D","text":"1"}]',
 'B', 'A neutral solution has equal concentrations of H⁺ and OH⁻ ions, giving pH = 7 at 25°C.'),

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2021, 'The process of converting a solid directly to gas is called:',
 '[{"label":"A","text":"Evaporation"},{"label":"B","text":"Condensation"},{"label":"C","text":"Sublimation"},{"label":"D","text":"Distillation"}]',
 'C', 'Sublimation is the phase transition from solid directly to gas without passing through liquid state.'),

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2020, 'Avogadro''s number is approximately:',
 '[{"label":"A","text":"6.02 × 10²³"},{"label":"B","text":"6.02 × 10²²"},{"label":"C","text":"3.14 × 10²³"},{"label":"D","text":"6.02 × 10²⁴"}]',
 'A', 'Avogadro''s constant is 6.022 × 10²³ mol⁻¹ — the number of particles in one mole of a substance.'),

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2020, 'Which gas is produced when hydrochloric acid reacts with zinc?',
 '[{"label":"A","text":"Oxygen"},{"label":"B","text":"Carbon dioxide"},{"label":"C","text":"Hydrogen"},{"label":"D","text":"Chlorine"}]',
 'C', 'Zn + 2HCl → ZnCl₂ + H₂. Zinc displaces hydrogen from the acid, producing hydrogen gas.'),

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2019, 'The IUPAC name for CH₃CH₂OH is:',
 '[{"label":"A","text":"Methanol"},{"label":"B","text":"Ethanol"},{"label":"C","text":"Propanol"},{"label":"D","text":"Butanol"}]',
 'B', 'CH₃CH₂OH has 2 carbon atoms (eth-) with an -OH group (-anol), so it is ethanol.'),

('11111111-1111-1111-1111-111111111111', 'Chemistry', 2019, 'The percentage of oxygen in water (H₂O) is approximately:',
 '[{"label":"A","text":"11%"},{"label":"B","text":"89%"},{"label":"C","text":"50%"},{"label":"D","text":"33%"}]',
 'B', 'Molar mass of H₂O = 2(1) + 16 = 18 g/mol. % of O = 16/18 × 100 ≈ 89%.'),

-- === BIOLOGY (10 questions) ===

('11111111-1111-1111-1111-111111111111', 'Biology', 2023, 'The powerhouse of the cell is:',
 '[{"label":"A","text":"Nucleus"},{"label":"B","text":"Ribosome"},{"label":"C","text":"Mitochondria"},{"label":"D","text":"Golgi body"}]',
 'C', 'Mitochondria generate ATP through cellular respiration, earning the title "powerhouse of the cell".'),

('11111111-1111-1111-1111-111111111111', 'Biology', 2023, 'Which blood group is the universal donor?',
 '[{"label":"A","text":"A"},{"label":"B","text":"B"},{"label":"C","text":"AB"},{"label":"D","text":"O"}]',
 'D', 'Blood group O has no A or B antigens, so it can be donated to any blood type (universal donor).'),

('11111111-1111-1111-1111-111111111111', 'Biology', 2022, 'Photosynthesis takes place in the:',
 '[{"label":"A","text":"Mitochondria"},{"label":"B","text":"Chloroplast"},{"label":"C","text":"Ribosome"},{"label":"D","text":"Nucleus"}]',
 'B', 'Chloroplasts contain chlorophyll and are the site of photosynthesis in plant cells.'),

('11111111-1111-1111-1111-111111111111', 'Biology', 2022, 'The genotype of a carrier of sickle cell trait is:',
 '[{"label":"A","text":"HbAA"},{"label":"B","text":"HbAS"},{"label":"C","text":"HbSS"},{"label":"D","text":"HbAC"}]',
 'B', 'HbAS is the heterozygous genotype for sickle cell — the person carries one normal (A) and one sickle (S) allele.'),

('11111111-1111-1111-1111-111111111111', 'Biology', 2021, 'Which of the following is NOT a function of the liver?',
 '[{"label":"A","text":"Production of bile"},{"label":"B","text":"Detoxification"},{"label":"C","text":"Production of insulin"},{"label":"D","text":"Storage of glycogen"}]',
 'C', 'Insulin is produced by the pancreas (beta cells of Islets of Langerhans), not the liver.'),

('11111111-1111-1111-1111-111111111111', 'Biology', 2021, 'The process by which organisms produce offspring of the same species is called:',
 '[{"label":"A","text":"Growth"},{"label":"B","text":"Respiration"},{"label":"C","text":"Reproduction"},{"label":"D","text":"Excretion"}]',
 'C', 'Reproduction is the biological process by which organisms produce new individuals of the same species.'),

('11111111-1111-1111-1111-111111111111', 'Biology', 2020, 'DNA stands for:',
 '[{"label":"A","text":"Deoxyribonucleic acid"},{"label":"B","text":"Dinucleic acid"},{"label":"C","text":"Deoxyribose nucleic acid"},{"label":"D","text":"Dinitrogen acid"}]',
 'A', 'DNA is Deoxyribonucleic Acid — the molecule that carries genetic information in cells.'),

('11111111-1111-1111-1111-111111111111', 'Biology', 2020, 'An ecosystem consists of:',
 '[{"label":"A","text":"Only living organisms"},{"label":"B","text":"Only non-living things"},{"label":"C","text":"Living organisms and their physical environment"},{"label":"D","text":"Only plants and animals"}]',
 'C', 'An ecosystem is a community of living organisms interacting with their non-living (abiotic) environment.'),

('11111111-1111-1111-1111-111111111111', 'Biology', 2019, 'The chromosome number in human body cells is:',
 '[{"label":"A","text":"23"},{"label":"B","text":"46"},{"label":"C","text":"44"},{"label":"D","text":"48"}]',
 'B', 'Human somatic (body) cells have 46 chromosomes (23 pairs). Gametes have 23 (haploid).'),

('11111111-1111-1111-1111-111111111111', 'Biology', 2019, 'Which vitamin is produced when the skin is exposed to sunlight?',
 '[{"label":"A","text":"Vitamin A"},{"label":"B","text":"Vitamin B"},{"label":"C","text":"Vitamin C"},{"label":"D","text":"Vitamin D"}]',
 'D', 'Vitamin D is synthesized in the skin when exposed to ultraviolet B (UVB) radiation from sunlight.');
