-- PrepHQ Seed Data: NECO Sample Questions (50 questions)
-- Subjects: Mathematics, English Language, Physics, Chemistry, Biology

-- NECO exam ID: 33333333-3333-3333-3333-333333333333

-- === MATHEMATICS (10 questions) ===

INSERT INTO public.questions (exam_id, subject, year, question_text, options, correct_option, explanation) VALUES
('33333333-3333-3333-3333-333333333333', 'Mathematics', 2023, 'Simplify: 2/3 + 1/4',
 '[{"label":"A","text":"11/12"},{"label":"B","text":"3/7"},{"label":"C","text":"5/12"},{"label":"D","text":"7/12"}]',
 'A', 'LCM of 3 and 4 is 12. 2/3 = 8/12, 1/4 = 3/12. Sum = 8/12 + 3/12 = 11/12.'),

('33333333-3333-3333-3333-333333333333', 'Mathematics', 2023, 'The next number in the sequence 2, 6, 12, 20, 30, ___ is:',
 '[{"label":"A","text":"40"},{"label":"B","text":"42"},{"label":"C","text":"36"},{"label":"D","text":"44"}]',
 'B', 'Differences: 4, 6, 8, 10 (increasing by 2 each time). Next difference: 12. So 30 + 12 = 42.'),

('33333333-3333-3333-3333-333333333333', 'Mathematics', 2022, 'A triangle with all sides equal is called:',
 '[{"label":"A","text":"Isosceles"},{"label":"B","text":"Scalene"},{"label":"C","text":"Equilateral"},{"label":"D","text":"Right-angled"}]',
 'C', 'An equilateral triangle has all three sides equal and all angles equal (60° each).'),

('33333333-3333-3333-3333-333333333333', 'Mathematics', 2022, 'Calculate: 15% of ₦24,000',
 '[{"label":"A","text":"₦3,600"},{"label":"B","text":"₦3,000"},{"label":"C","text":"₦4,200"},{"label":"D","text":"₦2,400"}]',
 'A', '15/100 × 24000 = 15 × 240 = ₦3,600.'),

('33333333-3333-3333-3333-333333333333', 'Mathematics', 2021, 'The bearing of point B from A is 045°. What is the bearing of A from B?',
 '[{"label":"A","text":"135°"},{"label":"B","text":"225°"},{"label":"C","text":"315°"},{"label":"D","text":"045°"}]',
 'B', 'Back bearing = forward bearing + 180°. 045° + 180° = 225°.'),

('33333333-3333-3333-3333-333333333333', 'Mathematics', 2021, 'Express 72 as a product of prime factors',
 '[{"label":"A","text":"2³ × 3²"},{"label":"B","text":"2² × 3³"},{"label":"C","text":"2⁴ × 3"},{"label":"D","text":"2 × 36"}]',
 'A', '72 = 8 × 9 = 2³ × 3².'),

('33333333-3333-3333-3333-333333333333', 'Mathematics', 2020, 'If the mean of 4, x, 8, 10, 12 is 8, find x',
 '[{"label":"A","text":"6"},{"label":"B","text":"5"},{"label":"C","text":"7"},{"label":"D","text":"4"}]',
 'A', 'Mean = sum/n. 8 = (4 + x + 8 + 10 + 12)/5. 40 = 34 + x. x = 6.'),

('33333333-3333-3333-3333-333333333333', 'Mathematics', 2020, 'The exterior angle of a regular hexagon is:',
 '[{"label":"A","text":"60°"},{"label":"B","text":"120°"},{"label":"C","text":"45°"},{"label":"D","text":"72°"}]',
 'A', 'Exterior angle = 360°/n = 360°/6 = 60°.'),

('33333333-3333-3333-3333-333333333333', 'Mathematics', 2019, 'Find the value of x if 3(x - 2) = 2(x + 1)',
 '[{"label":"A","text":"6"},{"label":"B","text":"8"},{"label":"C","text":"4"},{"label":"D","text":"10"}]',
 'B', '3x - 6 = 2x + 2. 3x - 2x = 2 + 6. x = 8.'),

('33333333-3333-3333-3333-333333333333', 'Mathematics', 2019, 'A die is thrown once. What is the probability of getting an even number?',
 '[{"label":"A","text":"1/6"},{"label":"B","text":"1/3"},{"label":"C","text":"1/2"},{"label":"D","text":"2/3"}]',
 'C', 'Even numbers on a die: 2, 4, 6 = 3 outcomes. Total outcomes: 6. P = 3/6 = 1/2.'),

-- === ENGLISH LANGUAGE (10 questions) ===

('33333333-3333-3333-3333-333333333333', 'English Language', 2023, 'The noun form of the verb "decide" is:',
 '[{"label":"A","text":"Decisive"},{"label":"B","text":"Decision"},{"label":"C","text":"Decidedly"},{"label":"D","text":"Deciding"}]',
 'B', 'Decision is the noun form. Decisive is an adjective, decidedly is an adverb, deciding is a participle/gerund.'),

('33333333-3333-3333-3333-333333333333', 'English Language', 2023, 'Which sentence uses the correct tense? "By next year, I ___ graduated."',
 '[{"label":"A","text":"will"},{"label":"B","text":"shall have"},{"label":"C","text":"would"},{"label":"D","text":"have"}]',
 'B', 'Future perfect tense ("shall/will have + past participle") is used for actions completed before a future time.'),

('33333333-3333-3333-3333-333333333333', 'English Language', 2022, 'The sentence "Despite the rain, we went out" contains:',
 '[{"label":"A","text":"A concessive clause"},{"label":"B","text":"A conditional clause"},{"label":"C","text":"A concessive phrase"},{"label":"D","text":"A relative clause"}]',
 'C', '"Despite the rain" is a concessive prepositional phrase showing contrast — the expected outcome did not happen.'),

('33333333-3333-3333-3333-333333333333', 'English Language', 2022, 'Choose the word with the correct stress pattern (capitalised syllable): photographer',
 '[{"label":"A","text":"PHO-to-gra-pher"},{"label":"B","text":"pho-TO-gra-pher"},{"label":"C","text":"pho-to-GRA-pher"},{"label":"D","text":"pho-to-gra-PHER"}]',
 'B', 'Photographer is stressed on the second syllable: pho-TO-gra-pher (/fəˈtɒɡrəfər/).'),

('33333333-3333-3333-3333-333333333333', 'English Language', 2021, 'A word that sounds the same as another but has a different meaning is called:',
 '[{"label":"A","text":"Synonym"},{"label":"B","text":"Antonym"},{"label":"C","text":"Homophone"},{"label":"D","text":"Homonym"}]',
 'C', 'Homophones sound the same but differ in meaning and often spelling (e.g., "write" and "right").'),

('33333333-3333-3333-3333-333333333333', 'English Language', 2021, 'The collective noun for a group of sheep is:',
 '[{"label":"A","text":"Herd"},{"label":"B","text":"Flock"},{"label":"C","text":"Pack"},{"label":"D","text":"Swarm"}]',
 'B', 'A flock of sheep. Herd is for cattle, pack for wolves, swarm for bees/insects.'),

('33333333-3333-3333-3333-333333333333', 'English Language', 2020, '"The examination was a piece of cake" means the exam was:',
 '[{"label":"A","text":"Delicious"},{"label":"B","text":"Very difficult"},{"label":"C","text":"Very easy"},{"label":"D","text":"Short"}]',
 'C', '"A piece of cake" is an idiom meaning something very easy to do.'),

('33333333-3333-3333-3333-333333333333', 'English Language', 2020, 'Identify the type of clause: "When the bell rang, the students left."',
 '[{"label":"A","text":"Main clause only"},{"label":"B","text":"Subordinate clause + main clause"},{"label":"C","text":"Two main clauses"},{"label":"D","text":"Relative clause + main clause"}]',
 'B', '"When the bell rang" is a subordinate (adverbial) clause of time. "The students left" is the main clause.'),

('33333333-3333-3333-3333-333333333333', 'English Language', 2019, 'The adjective form of "beauty" is:',
 '[{"label":"A","text":"Beautify"},{"label":"B","text":"Beautifully"},{"label":"C","text":"Beautiful"},{"label":"D","text":"Beauteous"}]',
 'C', 'Beautiful is the common adjective form. Beautify is a verb, beautifully is an adverb.'),

('33333333-3333-3333-3333-333333333333', 'English Language', 2019, 'In the sentence "The book which I bought is interesting", the relative pronoun is:',
 '[{"label":"A","text":"The"},{"label":"B","text":"which"},{"label":"C","text":"I"},{"label":"D","text":"is"}]',
 'B', '"Which" is the relative pronoun introducing the relative clause "which I bought".'),

-- === PHYSICS (10 questions) ===

('33333333-3333-3333-3333-333333333333', 'Physics', 2023, 'The unit of capacitance is:',
 '[{"label":"A","text":"Coulomb"},{"label":"B","text":"Farad"},{"label":"C","text":"Henry"},{"label":"D","text":"Tesla"}]',
 'B', 'The SI unit of capacitance is the Farad (F). One farad = one coulomb per volt.'),

('33333333-3333-3333-3333-333333333333', 'Physics', 2023, 'Total internal reflection occurs when light travels from:',
 '[{"label":"A","text":"A less dense to a denser medium"},{"label":"B","text":"A denser to a less dense medium at an angle greater than the critical angle"},{"label":"C","text":"A vacuum to glass"},{"label":"D","text":"Air to water"}]',
 'B', 'Total internal reflection occurs when light moves from a denser to less dense medium and the angle of incidence exceeds the critical angle.'),

('33333333-3333-3333-3333-333333333333', 'Physics', 2022, 'The resistance of a conductor depends on all of the following EXCEPT:',
 '[{"label":"A","text":"Length"},{"label":"B","text":"Cross-sectional area"},{"label":"C","text":"Material"},{"label":"D","text":"Current flowing through it"}]',
 'D', 'Resistance R = ρL/A (depends on resistivity/material, length, and area). It does not depend on the current.'),

('33333333-3333-3333-3333-333333333333', 'Physics', 2022, 'A body moving in a circular path has its velocity directed:',
 '[{"label":"A","text":"Towards the centre"},{"label":"B","text":"Away from the centre"},{"label":"C","text":"Along the tangent to the circle"},{"label":"D","text":"Along the radius"}]',
 'C', 'In circular motion, velocity is always tangent to the circular path at any point.'),

('33333333-3333-3333-3333-333333333333', 'Physics', 2021, 'The principle of conservation of energy states that energy:',
 '[{"label":"A","text":"Can be created"},{"label":"B","text":"Can be destroyed"},{"label":"C","text":"Can neither be created nor destroyed"},{"label":"D","text":"Always increases"}]',
 'C', 'The law of conservation of energy: energy cannot be created or destroyed, only converted from one form to another.'),

('33333333-3333-3333-3333-333333333333', 'Physics', 2021, 'A 60W bulb is used for 5 hours. The energy consumed is:',
 '[{"label":"A","text":"300 Wh"},{"label":"B","text":"12 Wh"},{"label":"C","text":"0.3 kWh"},{"label":"D","text":"Both A and C"}]',
 'D', 'Energy = Power × Time = 60W × 5h = 300 Wh = 0.3 kWh. Both A and C are correct.'),

('33333333-3333-3333-3333-333333333333', 'Physics', 2020, 'The instrument used to measure atmospheric pressure is:',
 '[{"label":"A","text":"Thermometer"},{"label":"B","text":"Barometer"},{"label":"C","text":"Manometer"},{"label":"D","text":"Hydrometer"}]',
 'B', 'A barometer measures atmospheric pressure. Thermometer measures temperature, manometer measures gas pressure, hydrometer measures liquid density.'),

('33333333-3333-3333-3333-333333333333', 'Physics', 2020, 'In a parallel circuit, the quantity that remains the same across all components is:',
 '[{"label":"A","text":"Current"},{"label":"B","text":"Resistance"},{"label":"C","text":"Voltage"},{"label":"D","text":"Power"}]',
 'C', 'In a parallel circuit, voltage (potential difference) is the same across all parallel branches.'),

('33333333-3333-3333-3333-333333333333', 'Physics', 2019, 'The phenomenon where a metal surface emits electrons when light falls on it is called:',
 '[{"label":"A","text":"Thermionic emission"},{"label":"B","text":"Photoelectric effect"},{"label":"C","text":"Electrolysis"},{"label":"D","text":"Electromagnetic induction"}]',
 'B', 'The photoelectric effect is the emission of electrons from a metal surface when light of sufficient frequency strikes it.'),

('33333333-3333-3333-3333-333333333333', 'Physics', 2019, 'The half-life of a radioactive substance is 6 hours. What fraction remains after 18 hours?',
 '[{"label":"A","text":"1/4"},{"label":"B","text":"1/8"},{"label":"C","text":"1/6"},{"label":"D","text":"1/3"}]',
 'B', '18 hours = 3 half-lives. Fraction remaining = (1/2)³ = 1/8.'),

-- === CHEMISTRY (10 questions) ===

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2023, 'The general formula of alkanes is:',
 '[{"label":"A","text":"CnH2n"},{"label":"B","text":"CnH2n+2"},{"label":"C","text":"CnH2n-2"},{"label":"D","text":"CnHn"}]',
 'B', 'Alkanes are saturated hydrocarbons with the general formula CₙH₂ₙ₊₂ (e.g., methane CH₄, ethane C₂H₆).'),

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2023, 'Which of the following is a greenhouse gas?',
 '[{"label":"A","text":"Nitrogen"},{"label":"B","text":"Oxygen"},{"label":"C","text":"Carbon dioxide"},{"label":"D","text":"Argon"}]',
 'C', 'CO₂ is a greenhouse gas that traps heat in the atmosphere. N₂, O₂, and Ar are not greenhouse gases.'),

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2022, 'The process of breaking down large hydrocarbon molecules into smaller ones is called:',
 '[{"label":"A","text":"Polymerisation"},{"label":"B","text":"Cracking"},{"label":"C","text":"Combustion"},{"label":"D","text":"Fermentation"}]',
 'B', 'Cracking breaks large alkane molecules into smaller, more useful alkanes and alkenes using heat or catalysts.'),

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2022, 'The oxidation state of sulphur in H₂SO₄ is:',
 '[{"label":"A","text":"+4"},{"label":"B","text":"+6"},{"label":"C","text":"-2"},{"label":"D","text":"+2"}]',
 'B', 'In H₂SO₄: H is +1 (×2=+2), O is -2 (×4=-8). So S = 0 - (+2) - (-8) = +6.'),

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2021, 'Brass is an alloy of:',
 '[{"label":"A","text":"Iron and carbon"},{"label":"B","text":"Copper and zinc"},{"label":"C","text":"Copper and tin"},{"label":"D","text":"Lead and tin"}]',
 'B', 'Brass is an alloy of copper and zinc. Bronze is copper and tin. Steel is iron and carbon.'),

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2021, 'Le Chatelier''s principle states that a system at equilibrium will:',
 '[{"label":"A","text":"Always shift to the right"},{"label":"B","text":"Not respond to changes"},{"label":"C","text":"Shift to oppose any change imposed on it"},{"label":"D","text":"Always shift to the left"}]',
 'C', 'Le Chatelier''s principle: if a change is imposed on an equilibrium system, it shifts to counteract that change.'),

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2020, 'The indicator that is pink in alkaline solution and colourless in acid is:',
 '[{"label":"A","text":"Litmus"},{"label":"B","text":"Methyl orange"},{"label":"C","text":"Phenolphthalein"},{"label":"D","text":"Universal indicator"}]',
 'C', 'Phenolphthalein is pink/magenta in alkaline solutions and colourless in acidic or neutral solutions.'),

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2020, 'Which law states that equal volumes of gases at the same temperature and pressure contain equal numbers of molecules?',
 '[{"label":"A","text":"Boyle''s law"},{"label":"B","text":"Charles'' law"},{"label":"C","text":"Avogadro''s law"},{"label":"D","text":"Dalton''s law"}]',
 'C', 'Avogadro''s law: equal volumes of all gases at the same T and P contain the same number of molecules.'),

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2019, 'The product of the reaction between an acid and a base is:',
 '[{"label":"A","text":"An acid and water"},{"label":"B","text":"A salt and water"},{"label":"C","text":"A base and water"},{"label":"D","text":"Only water"}]',
 'B', 'Neutralisation: Acid + Base → Salt + Water. E.g., HCl + NaOH → NaCl + H₂O.'),

('33333333-3333-3333-3333-333333333333', 'Chemistry', 2019, 'The electrons in the outermost shell of an atom are called:',
 '[{"label":"A","text":"Core electrons"},{"label":"B","text":"Valence electrons"},{"label":"C","text":"Free electrons"},{"label":"D","text":"Bonding electrons"}]',
 'B', 'Valence electrons are in the outermost shell. They determine chemical properties and bonding behaviour.'),

-- === BIOLOGY (10 questions) ===

('33333333-3333-3333-3333-333333333333', 'Biology', 2023, 'Malaria is caused by:',
 '[{"label":"A","text":"Virus"},{"label":"B","text":"Bacteria"},{"label":"C","text":"Protozoan (Plasmodium)"},{"label":"D","text":"Fungus"}]',
 'C', 'Malaria is caused by Plasmodium parasites (protozoans) transmitted by female Anopheles mosquitoes.'),

('33333333-3333-3333-3333-333333333333', 'Biology', 2023, 'The part of the flower that receives pollen during pollination is the:',
 '[{"label":"A","text":"Anther"},{"label":"B","text":"Stigma"},{"label":"C","text":"Filament"},{"label":"D","text":"Petal"}]',
 'B', 'The stigma is the receptive tip of the pistil where pollen grains land during pollination.'),

('33333333-3333-3333-3333-333333333333', 'Biology', 2022, 'Which of the following is a function of the kidney?',
 '[{"label":"A","text":"Production of bile"},{"label":"B","text":"Filtration of blood"},{"label":"C","text":"Digestion of food"},{"label":"D","text":"Pumping blood"}]',
 'B', 'The kidneys filter blood, removing waste products (urea) and excess water to form urine.'),

('33333333-3333-3333-3333-333333333333', 'Biology', 2022, 'A tapeworm is an example of:',
 '[{"label":"A","text":"Mutualism"},{"label":"B","text":"Commensalism"},{"label":"C","text":"Parasitism"},{"label":"D","text":"Saprophytism"}]',
 'C', 'Tapeworms are parasites — they live inside a host and benefit at the host''s expense.'),

('33333333-3333-3333-3333-333333333333', 'Biology', 2021, 'The enzyme that breaks down starch into maltose is:',
 '[{"label":"A","text":"Pepsin"},{"label":"B","text":"Amylase"},{"label":"C","text":"Lipase"},{"label":"D","text":"Trypsin"}]',
 'B', 'Amylase (in saliva and pancreatic juice) hydrolyses starch into maltose.'),

('33333333-3333-3333-3333-333333333333', 'Biology', 2021, 'Transpiration in plants mainly occurs through:',
 '[{"label":"A","text":"Roots"},{"label":"B","text":"Stems"},{"label":"C","text":"Leaves (stomata)"},{"label":"D","text":"Flowers"}]',
 'C', 'Most transpiration occurs through stomata (tiny pores) on the underside of leaves.'),

('33333333-3333-3333-3333-333333333333', 'Biology', 2020, 'The type of skeleton found in insects is:',
 '[{"label":"A","text":"Endoskeleton"},{"label":"B","text":"Exoskeleton"},{"label":"C","text":"Hydrostatic skeleton"},{"label":"D","text":"Cartilaginous skeleton"}]',
 'B', 'Insects have an exoskeleton — a hard external covering made of chitin that supports and protects their body.'),

('33333333-3333-3333-3333-333333333333', 'Biology', 2020, 'Which of these is an abiotic factor in an ecosystem?',
 '[{"label":"A","text":"Predators"},{"label":"B","text":"Temperature"},{"label":"C","text":"Decomposers"},{"label":"D","text":"Parasites"}]',
 'B', 'Temperature is an abiotic (non-living) factor. Predators, decomposers, and parasites are biotic (living) factors.'),

('33333333-3333-3333-3333-333333333333', 'Biology', 2019, 'The end product of aerobic respiration is:',
 '[{"label":"A","text":"Ethanol and CO₂"},{"label":"B","text":"Lactic acid"},{"label":"C","text":"CO₂ and water"},{"label":"D","text":"Glucose"}]',
 'C', 'Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy (ATP). End products are CO₂ and water.'),

('33333333-3333-3333-3333-333333333333', 'Biology', 2019, 'The sex of a child is determined by:',
 '[{"label":"A","text":"The mother''s chromosome"},{"label":"B","text":"The father''s chromosome"},{"label":"C","text":"Both parents equally"},{"label":"D","text":"Environmental factors"}]',
 'B', 'The father determines sex: he provides either X (girl) or Y (boy) chromosome. Mothers always provide X.');
