export type SyllabusTopic = {
  title: string;
  outcomes: string[];
};

export type SyllabusSubject = {
  subject: string;
  topics: SyllabusTopic[];
};

export type Curriculum = {
  id: string;
  name: string;
  region: string;
  levels: {
    level: "primary" | "secondary" | "university";
    label: string;
    subjects: SyllabusSubject[];
  }[];
};

export const curricula: Curriculum[] = [
  {
    id: "ecz",
    name: "Zambian ECZ",
    region: "Zambia · Examinations Council of Zambia",
    levels: [
      {
        level: "primary",
        label: "Grades 1–7",
        subjects: [
          {
            subject: "Mathematics",
            topics: [
              { title: "Numbers and place value", outcomes: ["Count and order to 10 000", "Add and subtract with carrying", "Multiplication tables to 12"] },
              { title: "Fractions and decimals", outcomes: ["Compare simple fractions", "Add fractions with the same denominator", "Convert tenths to decimals"] },
              { title: "Measures", outcomes: ["Length, mass and capacity", "Reading time and calendars", "Money and change in kwacha"] },
              { title: "Shape and space", outcomes: ["Name 2D and 3D shapes", "Perimeter and area of rectangles", "Symmetry"] },
            ],
          },
          {
            subject: "Integrated Science",
            topics: [
              { title: "Living things", outcomes: ["Characteristics of living things", "Plant and animal parts", "Simple food chains"] },
              { title: "Matter and energy", outcomes: ["Solids, liquids and gases", "Heat and light sources", "Simple circuits"] },
              { title: "Health", outcomes: ["Balanced diet", "Hygiene and disease prevention", "Safe water"] },
            ],
          },
          {
            subject: "English",
            topics: [
              { title: "Reading", outcomes: ["Comprehension of short passages", "Vocabulary in context"] },
              { title: "Writing", outcomes: ["Sentence construction", "Simple compositions and letters"] },
            ],
          },
          {
            subject: "Social Studies",
            topics: [
              { title: "Zambia", outcomes: ["Provinces and major towns", "Rivers, lakes and relief", "National symbols"] },
              { title: "Citizenship", outcomes: ["Rights and responsibilities", "Community services"] },
            ],
          },
        ],
      },
      {
        level: "secondary",
        label: "Grades 8–12",
        subjects: [
          {
            subject: "Mathematics",
            topics: [
              { title: "Algebra", outcomes: ["Linear and quadratic equations", "Simultaneous equations", "Indices and surds"] },
              { title: "Geometry & trigonometry", outcomes: ["Circle theorems", "Sine and cosine rules", "Bearings"] },
              { title: "Statistics & probability", outcomes: ["Mean, median, mode", "Cumulative frequency", "Probability trees"] },
              { title: "Calculus (Grade 12)", outcomes: ["Differentiation of polynomials", "Simple integration", "Rates of change"] },
            ],
          },
          {
            subject: "Physics",
            topics: [
              { title: "Mechanics", outcomes: ["Motion graphs", "Newton's laws", "Momentum and energy"] },
              { title: "Electricity", outcomes: ["Ohm's law", "Series and parallel circuits", "Electromagnetism"] },
              { title: "Waves", outcomes: ["Reflection and refraction", "Sound", "The electromagnetic spectrum"] },
            ],
          },
          {
            subject: "Chemistry",
            topics: [
              { title: "Atomic structure", outcomes: ["Electron arrangement", "The periodic table", "Bonding"] },
              { title: "Reactions", outcomes: ["Acids, bases and salts", "Rates of reaction", "Redox and electrolysis"] },
              { title: "Organic chemistry", outcomes: ["Alkanes and alkenes", "Alcohols", "Polymers"] },
            ],
          },
          {
            subject: "Biology",
            topics: [
              { title: "Cells and transport", outcomes: ["Cell structure", "Diffusion and osmosis", "Enzymes"] },
              { title: "Human systems", outcomes: ["Digestion", "Circulation and respiration", "Reproduction"] },
              { title: "Ecology & genetics", outcomes: ["Food webs and cycles", "Inheritance", "Natural selection"] },
            ],
          },
          {
            subject: "Computer Studies",
            topics: [
              { title: "Hardware and software", outcomes: ["Input, output and storage", "Operating systems"] },
              { title: "Programming", outcomes: ["Flowcharts and pseudocode", "Loops and conditionals"] },
              { title: "Data and society", outcomes: ["Databases", "Networks and the internet", "Cyber safety"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "cambridge",
    name: "Cambridge IGCSE / A-Level",
    region: "International",
    levels: [
      {
        level: "secondary",
        label: "IGCSE",
        subjects: [
          {
            subject: "Mathematics (0580)",
            topics: [
              { title: "Number", outcomes: ["Standard form", "Ratio and proportion", "Percentages and interest"] },
              { title: "Algebra", outcomes: ["Sequences", "Functions", "Inequalities"] },
              { title: "Geometry", outcomes: ["Transformations", "Vectors", "Mensuration"] },
            ],
          },
          {
            subject: "Combined Science (0653)",
            topics: [
              { title: "Biology", outcomes: ["Characteristics of organisms", "Plant nutrition", "Coordination"] },
              { title: "Chemistry", outcomes: ["Stoichiometry", "Energetics", "Metals"] },
              { title: "Physics", outcomes: ["Thermal physics", "Electricity", "Nuclear physics"] },
            ],
          },
        ],
      },
      {
        level: "university",
        label: "A-Level",
        subjects: [
          {
            subject: "Physics (9702)",
            topics: [
              { title: "Further mechanics", outcomes: ["Circular motion", "Gravitational fields", "Oscillations"] },
              { title: "Fields & particles", outcomes: ["Capacitance", "Magnetic fields", "Quantum physics"] },
            ],
          },
          {
            subject: "Mathematics (9709)",
            topics: [
              { title: "Pure", outcomes: ["Differentiation and integration", "Series", "Complex numbers"] },
              { title: "Statistics & mechanics", outcomes: ["Normal distribution", "Hypothesis testing", "Kinematics"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ib",
    name: "International Baccalaureate",
    region: "IB Diploma Programme",
    levels: [
      {
        level: "secondary",
        label: "MYP",
        subjects: [
          {
            subject: "Sciences",
            topics: [
              { title: "Inquiry skills", outcomes: ["Designing investigations", "Processing data", "Evaluating methods"] },
              { title: "Systems", outcomes: ["Energy transfers", "Interdependence", "Models"] },
            ],
          },
        ],
      },
      {
        level: "university",
        label: "Diploma Programme",
        subjects: [
          {
            subject: "Analysis & Approaches",
            topics: [
              { title: "Calculus", outcomes: ["Limits and continuity", "Optimisation", "Differential equations (HL)"] },
              { title: "Statistics", outcomes: ["Regression", "Distributions", "Bayes (HL)"] },
            ],
          },
          {
            subject: "Theory of Knowledge",
            topics: [{ title: "Ways of knowing", outcomes: ["Reason and emotion", "Knowledge questions", "Perspectives"] }],
          },
        ],
      },
    ],
  },
  {
    id: "university",
    name: "University foundation",
    region: "First-year undergraduate",
    levels: [
      {
        level: "university",
        label: "Year 1",
        subjects: [
          {
            subject: "Engineering Mathematics",
            topics: [
              { title: "Linear algebra", outcomes: ["Matrices and determinants", "Eigenvalues", "Vector spaces"] },
              { title: "Differential equations", outcomes: ["First order ODEs", "Second order ODEs", "Laplace transforms"] },
            ],
          },
          {
            subject: "Computer Science",
            topics: [
              { title: "Data structures", outcomes: ["Lists, stacks, queues", "Trees and graphs", "Hashing"] },
              { title: "Algorithms", outcomes: ["Complexity analysis", "Sorting and searching", "Dynamic programming"] },
            ],
          },
          {
            subject: "Academic skills",
            topics: [
              { title: "Research & writing", outcomes: ["Referencing", "Literature review", "Academic integrity"] },
            ],
          },
        ],
      },
    ],
  },
];

export const getCurriculum = (id: string) => curricula.find((c) => c.id === id);
