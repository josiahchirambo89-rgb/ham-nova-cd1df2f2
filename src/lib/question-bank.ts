export type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  subject: string;
  level: "primary" | "secondary" | "university";
};

export const questionBank: Question[] = [
  { subject: "Mathematics", level: "primary", question: "What is 7 × 8?", options: ["54", "56", "58", "64"], answer: 1, explanation: "7 × 8 = 56." },
  { subject: "Mathematics", level: "primary", question: "Which fraction is largest?", options: ["1/2", "1/3", "2/5", "3/8"], answer: 0, explanation: "1/2 = 0.5, the largest of the four." },
  { subject: "Mathematics", level: "primary", question: "A rectangle is 6 cm by 4 cm. Its area is:", options: ["10 cm²", "20 cm²", "24 cm²", "28 cm²"], answer: 2, explanation: "Area = length × width = 24 cm²." },
  { subject: "Mathematics", level: "primary", question: "Round 4 678 to the nearest hundred.", options: ["4 600", "4 680", "4 700", "5 000"], answer: 2, explanation: "78 rounds up, giving 4 700." },
  { subject: "Mathematics", level: "secondary", question: "Solve 3x − 7 = 14.", options: ["x = 5", "x = 7", "x = 21", "x = 3"], answer: 1, explanation: "3x = 21 so x = 7." },
  { subject: "Mathematics", level: "secondary", question: "The gradient of y = 4x − 3 is:", options: ["−3", "3", "4", "1/4"], answer: 2, explanation: "In y = mx + c the gradient m is 4." },
  { subject: "Mathematics", level: "secondary", question: "The discriminant of x² − 4x + 4 is:", options: ["0", "4", "8", "16"], answer: 0, explanation: "b² − 4ac = 16 − 16 = 0, so there is one repeated root." },
  { subject: "Mathematics", level: "secondary", question: "sin 30° equals:", options: ["0.5", "0.87", "1", "0.71"], answer: 0, explanation: "sin 30° = 1/2." },
  { subject: "Mathematics", level: "university", question: "d/dx of 5x³ is:", options: ["15x²", "5x²", "3x²", "15x³"], answer: 0, explanation: "Multiply by the power then reduce it: 15x²." },
  { subject: "Mathematics", level: "university", question: "∫2x dx equals:", options: ["x² + C", "2x² + C", "2 + C", "x + C"], answer: 0, explanation: "Integrating 2x gives x² + C." },
  { subject: "Mathematics", level: "university", question: "The determinant of [[2,1],[3,4]] is:", options: ["5", "8", "11", "2"], answer: 0, explanation: "ad − bc = 8 − 3 = 5." },

  { subject: "Physics", level: "primary", question: "Which of these is a source of light?", options: ["The Moon", "A mirror", "The Sun", "A window"], answer: 2, explanation: "The Sun produces its own light; the others reflect it." },
  { subject: "Physics", level: "secondary", question: "The SI unit of force is the:", options: ["joule", "newton", "watt", "pascal"], answer: 1, explanation: "Force is measured in newtons (N)." },
  { subject: "Physics", level: "secondary", question: "A 12 V supply drives 0.5 A. The resistance is:", options: ["6 Ω", "12 Ω", "24 Ω", "0.04 Ω"], answer: 2, explanation: "R = V/I = 12/0.5 = 24 Ω." },
  { subject: "Physics", level: "secondary", question: "Which quantity is a vector?", options: ["Speed", "Mass", "Velocity", "Energy"], answer: 2, explanation: "Velocity has both size and direction." },
  { subject: "Physics", level: "secondary", question: "Doubling the speed of a moving body multiplies its kinetic energy by:", options: ["2", "3", "4", "8"], answer: 2, explanation: "E = ½mv², so energy scales with v²." },
  { subject: "Physics", level: "secondary", question: "The period of a pendulum depends on:", options: ["Mass", "Amplitude only", "Length and gravity", "Colour"], answer: 2, explanation: "T = 2π√(L/g)." },
  { subject: "Physics", level: "university", question: "Centripetal force is given by:", options: ["mv²/r", "mgh", "½mv²", "mv"], answer: 0, explanation: "F = mv²/r points toward the centre." },
  { subject: "Physics", level: "university", question: "After two half-lives, the fraction of nuclei remaining is:", options: ["1/2", "1/3", "1/4", "0"], answer: 2, explanation: "Each half-life halves the sample: ½ × ½ = ¼." },

  { subject: "Chemistry", level: "primary", question: "Water freezes at:", options: ["0 °C", "10 °C", "100 °C", "−10 °C"], answer: 0, explanation: "Pure water freezes at 0 °C." },
  { subject: "Chemistry", level: "secondary", question: "The pH of a strong acid is closest to:", options: ["1", "7", "10", "14"], answer: 0, explanation: "Strong acids have very low pH values." },
  { subject: "Chemistry", level: "secondary", question: "How many electrons fill the first shell?", options: ["2", "8", "18", "1"], answer: 0, explanation: "The first shell holds a maximum of 2 electrons." },
  { subject: "Chemistry", level: "secondary", question: "NaCl is formed by which bonding?", options: ["Covalent", "Ionic", "Metallic", "Hydrogen"], answer: 1, explanation: "Sodium transfers an electron to chlorine, forming ions." },
  { subject: "Chemistry", level: "secondary", question: "Which gas turns limewater milky?", options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"], answer: 2, explanation: "CO₂ forms insoluble calcium carbonate." },
  { subject: "Chemistry", level: "university", question: "Faraday's constant is approximately:", options: ["6.02×10²³", "96 485 C/mol", "8.314 J/mol·K", "3×10⁸ m/s"], answer: 1, explanation: "One mole of electrons carries 96 485 coulombs." },
  { subject: "Chemistry", level: "university", question: "In PV = nRT, R equals:", options: ["8.314 J/mol·K", "9.81", "1.6×10⁻¹⁹", "0.082 only"], answer: 0, explanation: "R = 8.314 J/mol·K in SI units." },

  { subject: "Biology", level: "primary", question: "Which organ pumps blood?", options: ["Lungs", "Heart", "Liver", "Kidney"], answer: 1, explanation: "The heart pumps blood around the body." },
  { subject: "Biology", level: "primary", question: "Plants make food using:", options: ["Respiration", "Photosynthesis", "Digestion", "Excretion"], answer: 1, explanation: "Photosynthesis uses light, water and carbon dioxide." },
  { subject: "Biology", level: "secondary", question: "Where does photosynthesis mainly occur?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"], answer: 2, explanation: "Chloroplasts contain chlorophyll." },
  { subject: "Biology", level: "secondary", question: "Osmosis is the movement of:", options: ["Solutes", "Water across a membrane", "Gases only", "Proteins"], answer: 1, explanation: "Water moves down its concentration gradient through a partially permeable membrane." },
  { subject: "Biology", level: "secondary", question: "A cross of Aa × Aa gives what ratio of phenotypes?", options: ["1:1", "3:1", "9:3:3:1", "2:1"], answer: 1, explanation: "Three dominant to one recessive." },
  { subject: "Biology", level: "secondary", question: "Enzymes are:", options: ["Carbohydrates", "Lipids", "Proteins", "Minerals"], answer: 2, explanation: "Enzymes are protein catalysts." },
  { subject: "Biology", level: "university", question: "In Hardy–Weinberg, p² + 2pq + q² equals:", options: ["0", "0.5", "1", "2"], answer: 2, explanation: "Genotype frequencies must sum to 1." },

  { subject: "Computing", level: "primary", question: "Which is an input device?", options: ["Printer", "Monitor", "Keyboard", "Speaker"], answer: 2, explanation: "A keyboard sends data into the computer." },
  { subject: "Computing", level: "secondary", question: "Binary 1010 in decimal is:", options: ["8", "10", "12", "20"], answer: 1, explanation: "8 + 0 + 2 + 0 = 10." },
  { subject: "Computing", level: "secondary", question: "1 byte equals how many bits?", options: ["4", "8", "16", "1024"], answer: 1, explanation: "A byte is 8 bits." },
  { subject: "Computing", level: "secondary", question: "An AND gate outputs 1 when:", options: ["Either input is 1", "Both inputs are 1", "Both inputs are 0", "Inputs differ"], answer: 1, explanation: "AND requires all inputs to be true." },
  { subject: "Computing", level: "university", question: "Merge sort's average complexity is:", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 1, explanation: "Merge sort divides and merges in n log n time." },
  { subject: "Computing", level: "university", question: "A stack is:", options: ["FIFO", "LIFO", "Random access", "Sorted"], answer: 1, explanation: "Last in, first out." },

  { subject: "Geography", level: "primary", question: "The capital city of Zambia is:", options: ["Ndola", "Kitwe", "Lusaka", "Livingstone"], answer: 2, explanation: "Lusaka is Zambia's capital." },
  { subject: "Geography", level: "secondary", question: "On a 1:50 000 map, 1 cm represents:", options: ["50 m", "500 m", "5 km", "50 km"], answer: 1, explanation: "50 000 cm = 500 m." },
  { subject: "Geography", level: "secondary", question: "Air temperature falls roughly how much per 1 000 m?", options: ["1 °C", "3.5 °C", "6.5 °C", "12 °C"], answer: 2, explanation: "The environmental lapse rate is about 6.5 °C per km." },
  { subject: "Geography", level: "secondary", question: "The Zambezi's famous waterfall is:", options: ["Kalambo Falls", "Victoria Falls", "Ngonye Falls", "Chishimba Falls"], answer: 1, explanation: "Victoria Falls lies on the Zambezi at Livingstone." },

  { subject: "English", level: "primary", question: "Choose the correct plural of 'child'.", options: ["childs", "childes", "children", "childrens"], answer: 2, explanation: "'Children' is an irregular plural." },
  { subject: "English", level: "secondary", question: "Which word is an adverb?", options: ["quick", "quickly", "quickness", "quicken"], answer: 1, explanation: "Adverbs often end in -ly and modify verbs." },
  { subject: "English", level: "secondary", question: "A simile always uses:", options: ["'like' or 'as'", "rhyme", "alliteration", "a question"], answer: 0, explanation: "Similes compare using 'like' or 'as'." },
];

export function pickOfflineQuestions(count: number, subject?: string, level?: string) {
  let pool = questionBank.slice();
  if (subject && subject !== "Any") pool = pool.filter((q) => q.subject === subject);
  if (level && level !== "Any") pool = pool.filter((q) => q.level === level);
  if (pool.length === 0) pool = questionBank.slice();
  const shuffled = pool.sort(() => Math.random() - 0.5);
  const out: Question[] = [];
  while (out.length < count) {
    const next = shuffled[out.length % shuffled.length];
    if (!next) break;
    out.push(next);
  }
  return out.slice(0, count);
}

export const bankSubjects = Array.from(new Set(questionBank.map((q) => q.subject)));
