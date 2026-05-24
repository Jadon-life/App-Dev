-- PrepHQ Seed Data: WAEC Sample Questions (50 questions)
-- Subjects: Mathematics, English Language, Physics, Chemistry, Biology

-- WAEC exam ID: 22222222-2222-2222-2222-222222222222

-- === MATHEMATICS (10 questions) ===

INSERT INTO public.questions (exam_id, subject, year, question_text, options, correct_option, explanation) VALUES
('22222222-2222-2222-2222-222222222222', 'Mathematics', 2023, 'Evaluate: 3⁰ + 3¹ + 3²',
 '[{"label":"A","text":"12"},{"label":"B","text":"13"},{"label":"C","text":"10"},{"label":"D","text":"9"}]',
 'B', '3⁰ = 1, 3¹ = 3, 3² = 9. Sum = 1 + 3 + 9 = 13.'),

('22222222-2222-2222-2222-222222222222', 'Mathematics', 2023, 'If the interior angle of a regular polygon is 120°, how many sides does it have?',
 '[{"label":"A","text":"5"},{"label":"B","text":"6"},{"label":"C","text":"8"},{"label":"D","text":"10"}]',
 'B', 'Interior angle = (n-2)×180/n. 120 = (n-2)×180/n. 120n = 180n - 360. 60n = 360. n = 6.'),

('22222222-2222-2222-2222-222222222222', 'Mathematics', 2022, 'Express 0.000045 in standard form',
 '[{"label":"A","text":"4.5 × 10⁻⁵"},{"label":"B","text":"4.5 × 10⁻⁴"},{"label":"C","text":"45 × 10⁻⁶"},{"label":"D","text":"4.5 × 10⁻³"}]',
 'A', 'Move decimal 5 places right: 0.000045 = 4.5 × 10⁻⁵.'),

('22222222-2222-2222-2222-222222222222', 'Mathematics', 2022, 'Find the median of: 3, 7, 1, 8, 4, 6, 2',
 '[{"label":"A","text":"3"},{"label":"B","text":"4"},{"label":"C","text":"5"},{"label":"D","text":"6"}]',
 'B', 'Arranged: 1, 2, 3, 4, 6, 7, 8. Middle value (4th of 7) = 4.'),

('22222222-2222-2222-2222-222222222222', 'Mathematics', 2021, 'Solve: x² - 5x + 6 = 0',
 '[{"label":"A","text":"x = 2 or 3"},{"label":"B","text":"x = -2 or -3"},{"label":"C","text":"x = 1 or 6"},{"label":"D","text":"x = -1 or -6"}]',
 'A', 'Factoring: (x-2)(x-3) = 0. Therefore x = 2 or x = 3.'),

('22222222-2222-2222-2222-222222222222', 'Mathematics', 2021, 'If sin θ = 3/5, find cos θ',
 '[{"label":"A","text":"4/5"},{"label":"B","text":"3/4"},{"label":"C","text":"5/4"},{"label":"D","text":"5/3"}]',
 'A', 'Using sin²θ + cos²θ = 1: cos²θ = 1 - 9/25 = 16/25. cos θ = 4/5.'),

('22222222-2222-2222-2222-222222222222', 'Mathematics', 2020, 'The volume of a cylinder with radius 3cm and height 7cm is (take π = 22/7):',
 '[{"label":"A","text":"198 cm³"},{"label":"B","text":"66 cm³"},{"label":"C","text":"132 cm³"},{"label":"D","text":"594 cm³"}]',
 'A', 'V = πr²h = 22/7 × 9 × 7 = 22 × 9 = 198 cm³.'),

('22222222-2222-2222-2222-222222222222', 'Mathematics', 2020, 'If 2ⁿ = 32, find n',
 '[{"label":"A","text":"4"},{"label":"B","text":"5"},{"label":"C","text":"6"},{"label":"D","text":"3"}]',
 'B', '2⁵ = 32, therefore n = 5.'),

('22222222-2222-2222-2222-222222222222', 'Mathematics', 2019, 'Find the simple interest on ₦50,000 at 5% per annum for 3 years',
 '[{"label":"A","text":"₦7,500"},{"label":"B","text":"₦2,500"},{"label":"C","text":"₦15,000"},{"label":"D","text":"₦5,000"}]',
 'A', 'SI = PRT/100 = 50000 × 5 × 3 / 100 = ₦7,500.'),

('22222222-2222-2222-2222-222222222222', 'Mathematics', 2019, 'What is the HCF of 12, 18, and 24?',
 '[{"label":"A","text":"4"},{"label":"B","text":"6"},{"label":"C","text":"3"},{"label":"D","text":"12"}]',
 'B', '12 = 2² × 3, 18 = 2 × 3², 24 = 2³ × 3. HCF = 2 × 3 = 6.'),

-- === ENGLISH LANGUAGE (10 questions) ===

('22222222-2222-2222-2222-222222222222', 'English Language', 2023, 'Choose the word that best completes: The teacher asked the students to ___ their essays.',
 '[{"label":"A","text":"submit"},{"label":"B","text":"summit"},{"label":"C","text":"summon"},{"label":"D","text":"summarise"}]',
 'A', 'Submit means to present for consideration. Summit is a peak, summon means to call, summarise means to give a brief version.'),

('22222222-2222-2222-2222-222222222222', 'English Language', 2023, 'The plural of "criterion" is:',
 '[{"label":"A","text":"criterions"},{"label":"B","text":"criterias"},{"label":"C","text":"criteria"},{"label":"D","text":"criterium"}]',
 'C', 'Criterion is Greek in origin. Its correct plural form is "criteria" (not criterions or criterias).'),

('22222222-2222-2222-2222-222222222222', 'English Language', 2022, 'Which sentence contains an adverb?',
 '[{"label":"A","text":"She is a beautiful girl"},{"label":"B","text":"The car is red"},{"label":"C","text":"He runs quickly"},{"label":"D","text":"They ate rice"}]',
 'C', '"Quickly" is an adverb modifying the verb "runs" — it tells us how he runs.'),

('22222222-2222-2222-2222-222222222222', 'English Language', 2022, 'An autobiography is:',
 '[{"label":"A","text":"A story about someone else"},{"label":"B","text":"A story about oneself written by oneself"},{"label":"C","text":"A work of fiction"},{"label":"D","text":"A biography written by a friend"}]',
 'B', 'Auto- means self, bio- means life, -graphy means writing. An autobiography is one''s own life story written by oneself.'),

('22222222-2222-2222-2222-222222222222', 'English Language', 2021, 'Choose the correct preposition: She arrived ___ the airport at 6am.',
 '[{"label":"A","text":"in"},{"label":"B","text":"on"},{"label":"C","text":"at"},{"label":"D","text":"to"}]',
 'C', 'We use "at" with specific locations/buildings (at the airport, at school, at the station).'),

('22222222-2222-2222-2222-222222222222', 'English Language', 2021, '"Break a leg" is an example of:',
 '[{"label":"A","text":"A simile"},{"label":"B","text":"A proverb"},{"label":"C","text":"An idiom"},{"label":"D","text":"A metaphor"}]',
 'C', 'An idiom is a phrase whose meaning cannot be deduced from the individual words. "Break a leg" means "good luck".'),

('22222222-2222-2222-2222-222222222222', 'English Language', 2020, 'The word "unhappiness" is formed by:',
 '[{"label":"A","text":"Compounding"},{"label":"B","text":"Blending"},{"label":"C","text":"Affixation"},{"label":"D","text":"Clipping"}]',
 'C', 'Affixation adds prefixes/suffixes to a root word: un- (prefix) + happy (root) + -ness (suffix).'),

('22222222-2222-2222-2222-222222222222', 'English Language', 2020, 'Which is a correct use of the apostrophe?',
 '[{"label":"A","text":"The dog''s are barking"},{"label":"B","text":"Its cold today"},{"label":"C","text":"The children''s toys"},{"label":"D","text":"The boy''s went home"}]',
 'C', 'The apostrophe shows possession. "Children''s toys" = the toys belonging to the children.'),

('22222222-2222-2222-2222-222222222222', 'English Language', 2019, 'A speech delivered without preparation is called:',
 '[{"label":"A","text":"Manuscript speech"},{"label":"B","text":"Impromptu speech"},{"label":"C","text":"Memorised speech"},{"label":"D","text":"Extemporaneous speech"}]',
 'B', 'Impromptu means done without preparation. An impromptu speech is delivered spontaneously.'),

('22222222-2222-2222-2222-222222222222', 'English Language', 2019, 'The underlined word in "She sang SWEETLY" functions as:',
 '[{"label":"A","text":"Adjective"},{"label":"B","text":"Noun"},{"label":"C","text":"Adverb"},{"label":"D","text":"Verb"}]',
 'C', 'Sweetly modifies the verb "sang" (how she sang), making it an adverb of manner.'),

-- === PHYSICS (10 questions) ===

('22222222-2222-2222-2222-222222222222', 'Physics', 2023, 'The image formed by a plane mirror is:',
 '[{"label":"A","text":"Real and inverted"},{"label":"B","text":"Virtual and erect"},{"label":"C","text":"Real and erect"},{"label":"D","text":"Virtual and inverted"}]',
 'B', 'A plane mirror forms a virtual, erect, laterally inverted image that is the same size as the object.'),

('22222222-2222-2222-2222-222222222222', 'Physics', 2023, 'The unit of power is:',
 '[{"label":"A","text":"Joule"},{"label":"B","text":"Newton"},{"label":"C","text":"Watt"},{"label":"D","text":"Pascal"}]',
 'C', 'Power is the rate of doing work. Its SI unit is the Watt (W) = Joule per second.'),

('22222222-2222-2222-2222-222222222222', 'Physics', 2022, 'Which colour of light has the longest wavelength?',
 '[{"label":"A","text":"Violet"},{"label":"B","text":"Blue"},{"label":"C","text":"Green"},{"label":"D","text":"Red"}]',
 'D', 'In the visible spectrum, red has the longest wavelength (~700nm) and violet has the shortest (~400nm).'),

('22222222-2222-2222-2222-222222222222', 'Physics', 2022, 'A transformer works on the principle of:',
 '[{"label":"A","text":"Electrostatics"},{"label":"B","text":"Electromagnetic induction"},{"label":"C","text":"Nuclear fission"},{"label":"D","text":"Photoelectric effect"}]',
 'B', 'Transformers work on electromagnetic induction — a changing magnetic field induces an EMF in a nearby coil.'),

('22222222-2222-2222-2222-222222222222', 'Physics', 2021, 'An object is in equilibrium when:',
 '[{"label":"A","text":"It is at rest only"},{"label":"B","text":"It moves with constant velocity"},{"label":"C","text":"The net force on it is zero"},{"label":"D","text":"It accelerates uniformly"}]',
 'C', 'An object is in equilibrium when the net (resultant) force acting on it is zero. It may be at rest or moving at constant velocity.'),

('22222222-2222-2222-2222-222222222222', 'Physics', 2021, 'The potential energy of a 3kg object at a height of 10m is (g = 10 m/s²):',
 '[{"label":"A","text":"30 J"},{"label":"B","text":"300 J"},{"label":"C","text":"33 J"},{"label":"D","text":"130 J"}]',
 'B', 'PE = mgh = 3 × 10 × 10 = 300 J.'),

('22222222-2222-2222-2222-222222222222', 'Physics', 2020, 'The specific heat capacity of water is:',
 '[{"label":"A","text":"4200 J/kg°C"},{"label":"B","text":"2100 J/kg°C"},{"label":"C","text":"420 J/kg°C"},{"label":"D","text":"42000 J/kg°C"}]',
 'A', 'The specific heat capacity of water is 4200 J/kg°C (or 4.2 kJ/kg°C).'),

('22222222-2222-2222-2222-222222222222', 'Physics', 2020, 'A body floats when its weight equals:',
 '[{"label":"A","text":"The volume of fluid displaced"},{"label":"B","text":"The weight of fluid displaced"},{"label":"C","text":"The density of the fluid"},{"label":"D","text":"The pressure of the fluid"}]',
 'B', 'Archimedes'' principle: a floating body displaces a weight of fluid equal to its own weight.'),

('22222222-2222-2222-2222-222222222222', 'Physics', 2019, 'The phenomenon of light bending when it passes from one medium to another is called:',
 '[{"label":"A","text":"Reflection"},{"label":"B","text":"Diffraction"},{"label":"C","text":"Refraction"},{"label":"D","text":"Dispersion"}]',
 'C', 'Refraction is the bending of light as it passes from one medium to another due to a change in speed.'),

('22222222-2222-2222-2222-222222222222', 'Physics', 2019, 'The pressure exerted by a liquid increases with:',
 '[{"label":"A","text":"Decreasing depth"},{"label":"B","text":"Increasing depth"},{"label":"C","text":"Decreasing density"},{"label":"D","text":"The shape of the container"}]',
 'B', 'Liquid pressure = ρgh. Pressure increases with depth (h) and density (ρ) of the liquid.'),

-- === CHEMISTRY (10 questions) ===

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2023, 'Which of these elements belongs to Group 1 of the periodic table?',
 '[{"label":"A","text":"Calcium"},{"label":"B","text":"Sodium"},{"label":"C","text":"Aluminium"},{"label":"D","text":"Iron"}]',
 'B', 'Sodium (Na) is in Group 1 (alkali metals). Calcium is Group 2, Aluminium is Group 13, Iron is a transition metal.'),

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2023, 'Rusting of iron requires:',
 '[{"label":"A","text":"Oxygen only"},{"label":"B","text":"Water only"},{"label":"C","text":"Both oxygen and water"},{"label":"D","text":"Carbon dioxide"}]',
 'C', 'Rusting (oxidation of iron) requires both oxygen and water (moisture). Fe → Fe₂O₃·xH₂O.'),

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2022, 'The empirical formula of a compound with 40% carbon, 6.7% hydrogen, and 53.3% oxygen is:',
 '[{"label":"A","text":"CHO"},{"label":"B","text":"CH₂O"},{"label":"C","text":"C₂H₄O₂"},{"label":"D","text":"CO₂"}]',
 'B', 'C: 40/12 = 3.33, H: 6.7/1 = 6.7, O: 53.3/16 = 3.33. Ratio = 1:2:1 → CH₂O.'),

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2022, 'Which of the following is an electrolyte?',
 '[{"label":"A","text":"Sugar solution"},{"label":"B","text":"Kerosene"},{"label":"C","text":"Dilute H₂SO₄"},{"label":"D","text":"Pure water"}]',
 'C', 'Dilute sulphuric acid (H₂SO₄) dissociates into ions in solution, making it an electrolyte that conducts electricity.'),

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2021, 'The gas produced when marble chips react with dilute HCl is:',
 '[{"label":"A","text":"Hydrogen"},{"label":"B","text":"Oxygen"},{"label":"C","text":"Carbon dioxide"},{"label":"D","text":"Chlorine"}]',
 'C', 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂. Marble (calcium carbonate) produces CO₂ with acid.'),

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2021, 'The separation technique for a mixture of oil and water is:',
 '[{"label":"A","text":"Filtration"},{"label":"B","text":"Distillation"},{"label":"C","text":"Using a separating funnel"},{"label":"D","text":"Evaporation"}]',
 'C', 'Oil and water are immiscible liquids of different densities. A separating funnel separates them based on density.'),

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2020, 'An isotope of carbon-12 has:',
 '[{"label":"A","text":"6 protons and 6 neutrons"},{"label":"B","text":"6 protons and 8 neutrons"},{"label":"C","text":"12 protons and 6 neutrons"},{"label":"D","text":"6 protons and 12 neutrons"}]',
 'A', 'Carbon-12 has atomic number 6 (6 protons) and mass number 12 (6 protons + 6 neutrons).'),

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2020, 'Catalysts work by:',
 '[{"label":"A","text":"Increasing the temperature"},{"label":"B","text":"Providing an alternative pathway with lower activation energy"},{"label":"C","text":"Increasing the concentration of reactants"},{"label":"D","text":"Changing the products formed"}]',
 'B', 'Catalysts lower the activation energy by providing an alternative reaction pathway, speeding up the reaction.'),

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2019, 'Hardness of water is caused by:',
 '[{"label":"A","text":"Sodium chloride"},{"label":"B","text":"Calcium and magnesium ions"},{"label":"C","text":"Iron filings"},{"label":"D","text":"Carbon dioxide"}]',
 'B', 'Hard water contains dissolved Ca²⁺ and Mg²⁺ ions which prevent soap from lathering.'),

('22222222-2222-2222-2222-222222222222', 'Chemistry', 2019, 'The process of obtaining pure crystals from a solution is called:',
 '[{"label":"A","text":"Distillation"},{"label":"B","text":"Crystallisation"},{"label":"C","text":"Sublimation"},{"label":"D","text":"Filtration"}]',
 'B', 'Crystallisation is the process of forming pure solid crystals from a saturated solution by cooling or evaporation.'),

-- === BIOLOGY (10 questions) ===

('22222222-2222-2222-2222-222222222222', 'Biology', 2023, 'The largest organ in the human body is the:',
 '[{"label":"A","text":"Liver"},{"label":"B","text":"Heart"},{"label":"C","text":"Skin"},{"label":"D","text":"Brain"}]',
 'C', 'The skin is the largest organ in the human body by surface area and weight.'),

('22222222-2222-2222-2222-222222222222', 'Biology', 2023, 'The hormone responsible for the fight-or-flight response is:',
 '[{"label":"A","text":"Insulin"},{"label":"B","text":"Adrenaline"},{"label":"C","text":"Thyroxine"},{"label":"D","text":"Oestrogen"}]',
 'B', 'Adrenaline (epinephrine) is secreted by the adrenal glands during stress, triggering the fight-or-flight response.'),

('22222222-2222-2222-2222-222222222222', 'Biology', 2022, 'Which organelle is responsible for protein synthesis?',
 '[{"label":"A","text":"Mitochondria"},{"label":"B","text":"Ribosome"},{"label":"C","text":"Lysosome"},{"label":"D","text":"Vacuole"}]',
 'B', 'Ribosomes are the cellular organelles that translate mRNA into proteins (protein synthesis).'),

('22222222-2222-2222-2222-222222222222', 'Biology', 2022, 'Osmosis is the movement of water molecules from:',
 '[{"label":"A","text":"A region of high concentration to low concentration"},{"label":"B","text":"A region of low concentration to high concentration"},{"label":"C","text":"A region of high water potential to low water potential through a semi-permeable membrane"},{"label":"D","text":"Any direction randomly"}]',
 'C', 'Osmosis is the net movement of water from a region of higher water potential to lower water potential across a semi-permeable membrane.'),

('22222222-2222-2222-2222-222222222222', 'Biology', 2021, 'The excretory organ of an insect is:',
 '[{"label":"A","text":"Kidney"},{"label":"B","text":"Malpighian tubule"},{"label":"C","text":"Nephridium"},{"label":"D","text":"Flame cell"}]',
 'B', 'Insects excrete waste through Malpighian tubules. Kidneys are for mammals, nephridia for earthworms, flame cells for flatworms.'),

('22222222-2222-2222-2222-222222222222', 'Biology', 2021, 'Crossing over occurs during:',
 '[{"label":"A","text":"Mitosis"},{"label":"B","text":"Meiosis I"},{"label":"C","text":"Meiosis II"},{"label":"D","text":"Interphase"}]',
 'B', 'Crossing over occurs during prophase I of meiosis, when homologous chromosomes exchange genetic material.'),

('22222222-2222-2222-2222-222222222222', 'Biology', 2020, 'The part of the brain responsible for balance and coordination is:',
 '[{"label":"A","text":"Cerebrum"},{"label":"B","text":"Cerebellum"},{"label":"C","text":"Medulla oblongata"},{"label":"D","text":"Hypothalamus"}]',
 'B', 'The cerebellum coordinates voluntary movements, balance, and posture.'),

('22222222-2222-2222-2222-222222222222', 'Biology', 2020, 'An example of a sexually transmitted infection is:',
 '[{"label":"A","text":"Malaria"},{"label":"B","text":"Tuberculosis"},{"label":"C","text":"Gonorrhoea"},{"label":"D","text":"Cholera"}]',
 'C', 'Gonorrhoea is a bacterial STI caused by Neisseria gonorrhoeae. Malaria, TB, and cholera are not sexually transmitted.'),

('22222222-2222-2222-2222-222222222222', 'Biology', 2019, 'The nitrogen cycle involves:',
 '[{"label":"A","text":"Conversion of nitrogen gas to usable forms by organisms"},{"label":"B","text":"Only decomposition of organisms"},{"label":"C","text":"Only the action of lightning"},{"label":"D","text":"Photosynthesis only"}]',
 'A', 'The nitrogen cycle includes nitrogen fixation, nitrification, denitrification, and assimilation — converting N₂ to usable forms.'),

('22222222-2222-2222-2222-222222222222', 'Biology', 2019, 'The type of nutrition in fungi is:',
 '[{"label":"A","text":"Autotrophic"},{"label":"B","text":"Holozoic"},{"label":"C","text":"Saprophytic"},{"label":"D","text":"Parasitic only"}]',
 'C', 'Most fungi are saprophytes — they obtain nutrition by decomposing dead organic matter using extracellular enzymes.');
