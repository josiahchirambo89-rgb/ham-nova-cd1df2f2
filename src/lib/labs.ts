export type LabParam = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
};

export type LabOutput = {
  label: string;
  unit?: string;
  compute: (p: Record<string, number>) => number;
};

export type LabVisual = "wave" | "projectile" | "orbit" | "bar" | "circuit" | "grid" | "pulse";

export type Lab = {
  slug: string;
  title: string;
  subject: "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Computing" | "Geography";
  level: "primary" | "secondary" | "university";
  summary: string;
  theory: string;
  visual: LabVisual;
  params: LabParam[];
  outputs: LabOutput[];
};

const p = (
  key: string,
  label: string,
  min: number,
  max: number,
  step: number,
  value: number,
  unit?: string,
): LabParam => ({ key, label, min, max, step, value, unit });

export const labs: Lab[] = [
  {
    slug: "simple-pendulum",
    title: "Simple pendulum",
    subject: "Physics",
    level: "secondary",
    summary: "Change length and gravity, watch the swing and read the period.",
    theory: "A pendulum's period depends on length and gravity, not on mass: T = 2π√(L/g).",
    visual: "pulse",
    params: [p("L", "Length", 0.1, 5, 0.1, 1, "m"), p("g", "Gravity", 1, 25, 0.1, 9.81, "m/s²")],
    outputs: [
      { label: "Period", unit: "s", compute: (v) => 2 * Math.PI * Math.sqrt(v.L / v.g) },
      { label: "Frequency", unit: "Hz", compute: (v) => 1 / (2 * Math.PI * Math.sqrt(v.L / v.g)) },
    ],
  },
  {
    slug: "projectile-motion",
    title: "Projectile motion",
    subject: "Physics",
    level: "secondary",
    summary: "Launch a ball and measure range, height and flight time.",
    theory: "Range = v²sin(2θ)/g. Maximum range occurs at 45° when air resistance is ignored.",
    visual: "projectile",
    params: [
      p("v", "Speed", 1, 80, 1, 25, "m/s"),
      p("a", "Angle", 5, 85, 1, 45, "°"),
      p("g", "Gravity", 1, 25, 0.1, 9.81, "m/s²"),
    ],
    outputs: [
      {
        label: "Range",
        unit: "m",
        compute: (v) => (v.v ** 2 * Math.sin((2 * v.a * Math.PI) / 180)) / v.g,
      },
      {
        label: "Max height",
        unit: "m",
        compute: (v) => (v.v * Math.sin((v.a * Math.PI) / 180)) ** 2 / (2 * v.g),
      },
      {
        label: "Flight time",
        unit: "s",
        compute: (v) => (2 * v.v * Math.sin((v.a * Math.PI) / 180)) / v.g,
      },
    ],
  },
  {
    slug: "ohms-law",
    title: "Ohm's law circuit",
    subject: "Physics",
    level: "secondary",
    summary: "Set voltage and resistance to see current and power.",
    theory: "V = IR. Power dissipated is P = VI = I²R.",
    visual: "circuit",
    params: [p("V", "Voltage", 0, 24, 0.5, 12, "V"), p("R", "Resistance", 1, 1000, 1, 100, "Ω")],
    outputs: [
      { label: "Current", unit: "A", compute: (v) => v.V / v.R },
      { label: "Power", unit: "W", compute: (v) => (v.V * v.V) / v.R },
    ],
  },
  {
    slug: "wave-superposition",
    title: "Wave superposition",
    subject: "Physics",
    level: "secondary",
    summary: "Add two waves and watch interference build or cancel.",
    theory: "When waves overlap their displacements add. Equal, opposite waves cancel completely.",
    visual: "wave",
    params: [
      p("a1", "Amplitude A", 0, 2, 0.1, 1),
      p("f1", "Frequency A", 0.5, 8, 0.1, 2, "Hz"),
      p("a2", "Amplitude B", 0, 2, 0.1, 1),
      p("f2", "Frequency B", 0.5, 8, 0.1, 3, "Hz"),
    ],
    outputs: [
      { label: "Beat frequency", unit: "Hz", compute: (v) => Math.abs(v.f1 - v.f2) },
      { label: "Peak amplitude", compute: (v) => v.a1 + v.a2 },
    ],
  },
  {
    slug: "hookes-law",
    title: "Hooke's law spring",
    subject: "Physics",
    level: "secondary",
    summary: "Stretch a spring and read force and stored energy.",
    theory: "F = kx and elastic energy E = ½kx².",
    visual: "bar",
    params: [p("k", "Stiffness", 1, 500, 1, 100, "N/m"), p("x", "Extension", 0, 1, 0.01, 0.2, "m")],
    outputs: [
      { label: "Force", unit: "N", compute: (v) => v.k * v.x },
      { label: "Energy", unit: "J", compute: (v) => 0.5 * v.k * v.x * v.x },
    ],
  },
  {
    slug: "free-fall",
    title: "Free fall",
    subject: "Physics",
    level: "primary",
    summary: "Drop an object and see how fast it lands.",
    theory: "Ignoring air, distance = ½gt² and speed = gt.",
    visual: "projectile",
    params: [p("h", "Height", 1, 200, 1, 20, "m"), p("g", "Gravity", 1, 25, 0.1, 9.81, "m/s²")],
    outputs: [
      { label: "Fall time", unit: "s", compute: (v) => Math.sqrt((2 * v.h) / v.g) },
      { label: "Impact speed", unit: "m/s", compute: (v) => Math.sqrt(2 * v.g * v.h) },
    ],
  },
  {
    slug: "momentum-collision",
    title: "Momentum collision",
    subject: "Physics",
    level: "secondary",
    summary: "Collide two trolleys and find the shared velocity.",
    theory: "In a perfectly inelastic collision, total momentum is conserved.",
    visual: "bar",
    params: [
      p("m1", "Mass A", 0.1, 20, 0.1, 2, "kg"),
      p("u1", "Speed A", -10, 10, 0.1, 4, "m/s"),
      p("m2", "Mass B", 0.1, 20, 0.1, 3, "kg"),
      p("u2", "Speed B", -10, 10, 0.1, -1, "m/s"),
    ],
    outputs: [
      {
        label: "Final speed",
        unit: "m/s",
        compute: (v) => (v.m1 * v.u1 + v.m2 * v.u2) / (v.m1 + v.m2),
      },
      { label: "Total momentum", unit: "kg·m/s", compute: (v) => v.m1 * v.u1 + v.m2 * v.u2 },
    ],
  },
  {
    slug: "density-float",
    title: "Density and floating",
    subject: "Physics",
    level: "primary",
    summary: "Does it float? Compare density with water.",
    theory: "An object floats when its density is lower than the fluid's density.",
    visual: "bar",
    params: [
      p("m", "Mass", 0.01, 50, 0.01, 2, "kg"),
      p("V", "Volume", 0.001, 0.05, 0.001, 0.002, "m³"),
    ],
    outputs: [
      { label: "Density", unit: "kg/m³", compute: (v) => v.m / v.V },
      { label: "Floats (1 = yes)", compute: (v) => (v.m / v.V < 1000 ? 1 : 0) },
    ],
  },
  {
    slug: "lens-equation",
    title: "Thin lens",
    subject: "Physics",
    level: "secondary",
    summary: "Move an object and find the image position and magnification.",
    theory: "1/f = 1/u + 1/v, magnification m = v/u.",
    visual: "grid",
    params: [
      p("f", "Focal length", 0.05, 2, 0.01, 0.2, "m"),
      p("u", "Object distance", 0.06, 4, 0.01, 0.5, "m"),
    ],
    outputs: [
      { label: "Image distance", unit: "m", compute: (v) => 1 / (1 / v.f - 1 / v.u) },
      { label: "Magnification", compute: (v) => 1 / (1 / v.f - 1 / v.u) / v.u },
    ],
  },
  {
    slug: "resistor-network",
    title: "Series & parallel resistors",
    subject: "Physics",
    level: "secondary",
    summary: "Compare two ways of joining resistors.",
    theory: "Series adds resistance; parallel reduces it.",
    visual: "circuit",
    params: [p("R1", "R₁", 1, 500, 1, 100, "Ω"), p("R2", "R₂", 1, 500, 1, 220, "Ω")],
    outputs: [
      { label: "Series", unit: "Ω", compute: (v) => v.R1 + v.R2 },
      { label: "Parallel", unit: "Ω", compute: (v) => (v.R1 * v.R2) / (v.R1 + v.R2) },
    ],
  },
  {
    slug: "doppler-effect",
    title: "Doppler effect",
    subject: "Physics",
    level: "university",
    summary: "Move a siren towards you and hear the pitch rise.",
    theory: "f' = f (c) / (c − vₛ) for a source approaching a still observer.",
    visual: "wave",
    params: [
      p("f", "Source frequency", 50, 2000, 10, 440, "Hz"),
      p("vs", "Source speed", -200, 300, 1, 30, "m/s"),
      p("c", "Sound speed", 300, 400, 1, 343, "m/s"),
    ],
    outputs: [{ label: "Heard frequency", unit: "Hz", compute: (v) => (v.f * v.c) / (v.c - v.vs) }],
  },
  {
    slug: "circular-motion",
    title: "Circular motion",
    subject: "Physics",
    level: "secondary",
    summary: "Spin a mass and measure the centripetal force.",
    theory: "F = mv²/r and the period T = 2πr/v.",
    visual: "orbit",
    params: [
      p("m", "Mass", 0.1, 20, 0.1, 1, "kg"),
      p("v", "Speed", 0.5, 40, 0.5, 10, "m/s"),
      p("r", "Radius", 0.2, 20, 0.1, 2, "m"),
    ],
    outputs: [
      { label: "Force", unit: "N", compute: (v) => (v.m * v.v * v.v) / v.r },
      { label: "Period", unit: "s", compute: (v) => (2 * Math.PI * v.r) / v.v },
    ],
  },
  {
    slug: "kinetic-energy",
    title: "Kinetic energy",
    subject: "Physics",
    level: "primary",
    summary: "How energy grows with speed.",
    theory: "E = ½mv² — doubling speed quadruples energy.",
    visual: "bar",
    params: [p("m", "Mass", 0.1, 100, 0.1, 5, "kg"), p("v", "Speed", 0, 50, 0.5, 10, "m/s")],
    outputs: [{ label: "Energy", unit: "J", compute: (v) => 0.5 * v.m * v.v * v.v }],
  },
  {
    slug: "pressure-depth",
    title: "Pressure under water",
    subject: "Physics",
    level: "secondary",
    summary: "Dive deeper and watch pressure climb.",
    theory: "P = ρgh plus atmospheric pressure.",
    visual: "bar",
    params: [p("h", "Depth", 0, 200, 1, 10, "m"), p("rho", "Density", 800, 1200, 5, 1000, "kg/m³")],
    outputs: [
      { label: "Gauge pressure", unit: "kPa", compute: (v) => (v.rho * 9.81 * v.h) / 1000 },
      { label: "Absolute", unit: "kPa", compute: (v) => (v.rho * 9.81 * v.h) / 1000 + 101.3 },
    ],
  },
  {
    slug: "transformer",
    title: "Transformer turns",
    subject: "Physics",
    level: "secondary",
    summary: "Step voltage up or down with coil turns.",
    theory: "Vs/Vp = Ns/Np for an ideal transformer.",
    visual: "circuit",
    params: [
      p("Vp", "Primary voltage", 1, 400, 1, 240, "V"),
      p("Np", "Primary turns", 10, 2000, 10, 1000),
      p("Ns", "Secondary turns", 10, 2000, 10, 100),
    ],
    outputs: [{ label: "Secondary voltage", unit: "V", compute: (v) => (v.Vp * v.Ns) / v.Np }],
  },
  {
    slug: "radioactive-decay",
    title: "Radioactive decay",
    subject: "Physics",
    level: "university",
    summary: "Watch a sample halve, and halve again.",
    theory: "N = N₀(½)^(t/T½).",
    visual: "pulse",
    params: [
      p("N0", "Start atoms", 100, 10000, 100, 1000),
      p("T", "Half-life", 1, 100, 1, 10, "yr"),
      p("t", "Time", 0, 200, 1, 20, "yr"),
    ],
    outputs: [
      { label: "Remaining", compute: (v) => v.N0 * Math.pow(0.5, v.t / v.T) },
      { label: "Decayed", compute: (v) => v.N0 - v.N0 * Math.pow(0.5, v.t / v.T) },
    ],
  },
  {
    slug: "heat-capacity",
    title: "Specific heat",
    subject: "Physics",
    level: "secondary",
    summary: "How much energy warms a substance?",
    theory: "Q = mcΔT.",
    visual: "bar",
    params: [
      p("m", "Mass", 0.05, 20, 0.05, 1, "kg"),
      p("c", "Specific heat", 100, 5000, 10, 4180, "J/kg·K"),
      p("dT", "Temp rise", 1, 200, 1, 40, "K"),
    ],
    outputs: [{ label: "Heat needed", unit: "kJ", compute: (v) => (v.m * v.c * v.dT) / 1000 }],
  },
  {
    slug: "electric-field",
    title: "Coulomb's law",
    subject: "Physics",
    level: "university",
    summary: "Two charges push or pull — how strongly?",
    theory: "F = kq₁q₂/r² with k = 8.99×10⁹.",
    visual: "grid",
    params: [
      p("q1", "Charge 1", -10, 10, 0.1, 2, "µC"),
      p("q2", "Charge 2", -10, 10, 0.1, -3, "µC"),
      p("r", "Separation", 0.01, 2, 0.01, 0.2, "m"),
    ],
    outputs: [
      {
        label: "Force",
        unit: "N",
        compute: (v) => (8.99e9 * (v.q1 * 1e-6) * (v.q2 * 1e-6)) / (v.r * v.r),
      },
    ],
  },
  {
    slug: "resistivity",
    title: "Wire resistivity",
    subject: "Physics",
    level: "secondary",
    summary: "Longer and thinner wires resist more.",
    theory: "R = ρL/A.",
    visual: "circuit",
    params: [
      p("L", "Length", 0.1, 50, 0.1, 2, "m"),
      p("A", "Area", 0.1, 10, 0.1, 1, "mm²"),
      p("rho", "Resistivity", 1, 200, 1, 17, "nΩ·m×10"),
    ],
    outputs: [
      { label: "Resistance", unit: "Ω", compute: (v) => ((v.rho * 1e-8 * v.L) / (v.A * 1e-6)) * 1 },
    ],
  },
  {
    slug: "power-bill",
    title: "Energy bill calculator",
    subject: "Physics",
    level: "primary",
    summary: "See what an appliance costs to run.",
    theory: "Energy in kWh = power (kW) × hours.",
    visual: "bar",
    params: [
      p("P", "Power", 5, 5000, 5, 1000, "W"),
      p("h", "Hours per day", 0.1, 24, 0.1, 3, "h"),
      p("rate", "Tariff", 0.1, 10, 0.1, 1.5, "K/kWh"),
    ],
    outputs: [
      { label: "Daily energy", unit: "kWh", compute: (v) => (v.P / 1000) * v.h },
      { label: "Monthly cost", compute: (v) => (v.P / 1000) * v.h * 30 * v.rate },
    ],
  },

  // Chemistry
  {
    slug: "ph-scale",
    title: "pH and acidity",
    subject: "Chemistry",
    level: "secondary",
    summary: "Convert hydrogen-ion concentration into pH.",
    theory: "pH = −log₁₀[H⁺]; below 7 is acidic, above 7 is alkaline.",
    visual: "bar",
    params: [p("c", "[H⁺] ×10⁻ⁿ", 1, 14, 0.1, 4)],
    outputs: [
      { label: "pH", compute: (v) => v.c },
      { label: "pOH", compute: (v) => 14 - v.c },
    ],
  },
  {
    slug: "molar-mass",
    title: "Moles and mass",
    subject: "Chemistry",
    level: "secondary",
    summary: "Convert between grams and moles.",
    theory: "n = m / M.",
    visual: "bar",
    params: [p("m", "Mass", 0.1, 500, 0.1, 18, "g"), p("M", "Molar mass", 1, 300, 0.1, 18, "g/mol")],
    outputs: [
      { label: "Moles", unit: "mol", compute: (v) => v.m / v.M },
      { label: "Particles ×10²³", compute: (v) => (v.m / v.M) * 6.022 },
    ],
  },
  {
    slug: "titration",
    title: "Acid–base titration",
    subject: "Chemistry",
    level: "secondary",
    summary: "Find the unknown concentration at the end point.",
    theory: "C₁V₁ = C₂V₂ for a 1:1 reaction.",
    visual: "pulse",
    params: [
      p("Ca", "Acid conc.", 0.01, 2, 0.01, 0.1, "M"),
      p("Va", "Acid volume", 1, 100, 1, 25, "mL"),
      p("Vb", "Base volume", 1, 100, 1, 20, "mL"),
    ],
    outputs: [{ label: "Base conc.", unit: "M", compute: (v) => (v.Ca * v.Va) / v.Vb }],
  },
  {
    slug: "gas-laws",
    title: "Ideal gas law",
    subject: "Chemistry",
    level: "secondary",
    summary: "Squeeze and heat a gas.",
    theory: "PV = nRT with R = 8.314 J/mol·K.",
    visual: "grid",
    params: [
      p("n", "Moles", 0.1, 10, 0.1, 1, "mol"),
      p("T", "Temperature", 100, 800, 1, 298, "K"),
      p("V", "Volume", 0.001, 0.5, 0.001, 0.0224, "m³"),
    ],
    outputs: [{ label: "Pressure", unit: "kPa", compute: (v) => (v.n * 8.314 * v.T) / v.V / 1000 }],
  },
  {
    slug: "dilution",
    title: "Dilution",
    subject: "Chemistry",
    level: "secondary",
    summary: "Water down a stock solution.",
    theory: "C₁V₁ = C₂V₂.",
    visual: "bar",
    params: [
      p("C1", "Stock conc.", 0.1, 10, 0.1, 2, "M"),
      p("V1", "Stock volume", 1, 500, 1, 50, "mL"),
      p("V2", "Final volume", 1, 2000, 1, 250, "mL"),
    ],
    outputs: [{ label: "Final conc.", unit: "M", compute: (v) => (v.C1 * v.V1) / v.V2 }],
  },
  {
    slug: "reaction-rate",
    title: "Reaction rate",
    subject: "Chemistry",
    level: "secondary",
    summary: "Temperature speeds reactions up.",
    theory: "Roughly, rate doubles for every 10 K rise.",
    visual: "pulse",
    params: [
      p("r0", "Base rate", 0.1, 10, 0.1, 1, "mol/s"),
      p("dT", "Temp rise", 0, 100, 1, 20, "K"),
    ],
    outputs: [{ label: "New rate", unit: "mol/s", compute: (v) => v.r0 * Math.pow(2, v.dT / 10) }],
  },
  {
    slug: "electrolysis",
    title: "Electrolysis",
    subject: "Chemistry",
    level: "university",
    summary: "How much metal is deposited?",
    theory: "Faraday's law: m = (QM)/(nF), F = 96485 C/mol.",
    visual: "circuit",
    params: [
      p("I", "Current", 0.1, 20, 0.1, 2, "A"),
      p("t", "Time", 10, 7200, 10, 600, "s"),
      p("M", "Molar mass", 1, 250, 0.5, 63.5, "g/mol"),
      p("n", "Electrons", 1, 4, 1, 2),
    ],
    outputs: [
      { label: "Charge", unit: "C", compute: (v) => v.I * v.t },
      { label: "Mass deposited", unit: "g", compute: (v) => (v.I * v.t * v.M) / (v.n * 96485) },
    ],
  },
  {
    slug: "percentage-yield",
    title: "Percentage yield",
    subject: "Chemistry",
    level: "secondary",
    summary: "Compare what you got with what you should have.",
    theory: "Yield % = actual / theoretical × 100.",
    visual: "bar",
    params: [
      p("a", "Actual", 0, 500, 0.5, 32, "g"),
      p("t", "Theoretical", 0.5, 500, 0.5, 40, "g"),
    ],
    outputs: [{ label: "Yield", unit: "%", compute: (v) => (v.a / v.t) * 100 }],
  },
  {
    slug: "atom-builder",
    title: "Atom builder",
    subject: "Chemistry",
    level: "primary",
    summary: "Add protons, neutrons and electrons.",
    theory: "Mass number = protons + neutrons. Charge = protons − electrons.",
    visual: "orbit",
    params: [
      p("p", "Protons", 1, 30, 1, 6),
      p("n", "Neutrons", 0, 40, 1, 6),
      p("e", "Electrons", 0, 30, 1, 6),
    ],
    outputs: [
      { label: "Mass number", compute: (v) => v.p + v.n },
      { label: "Charge", compute: (v) => v.p - v.e },
    ],
  },
  {
    slug: "solubility",
    title: "Solubility curve",
    subject: "Chemistry",
    level: "secondary",
    summary: "Warm water dissolves more salt.",
    theory: "Solubility of most solids increases with temperature.",
    visual: "wave",
    params: [
      p("T", "Temperature", 0, 100, 1, 25, "°C"),
      p("k", "Solute factor", 0.1, 3, 0.1, 1),
    ],
    outputs: [{ label: "Solubility", unit: "g/100 mL", compute: (v) => v.k * (13 + 0.9 * v.T) }],
  },
  {
    slug: "empirical-formula",
    title: "Empirical formula",
    subject: "Chemistry",
    level: "secondary",
    summary: "Turn percentages into a formula ratio.",
    theory: "Divide each percentage by its molar mass, then by the smallest result.",
    visual: "bar",
    params: [
      p("pc", "% carbon", 1, 99, 1, 40),
      p("ph", "% hydrogen", 1, 30, 1, 6.7),
      p("po", "% oxygen", 1, 99, 1, 53.3),
    ],
    outputs: [
      { label: "C ratio", compute: (v) => v.pc / 12 / Math.min(v.pc / 12, v.ph / 1, v.po / 16) },
      { label: "H ratio", compute: (v) => v.ph / 1 / Math.min(v.pc / 12, v.ph / 1, v.po / 16) },
      { label: "O ratio", compute: (v) => v.po / 16 / Math.min(v.pc / 12, v.ph / 1, v.po / 16) },
    ],
  },
  {
    slug: "energy-change",
    title: "Enthalpy change",
    subject: "Chemistry",
    level: "university",
    summary: "Measure heat released in solution.",
    theory: "ΔH = −mcΔT / n.",
    visual: "bar",
    params: [
      p("m", "Solution mass", 10, 500, 1, 100, "g"),
      p("dT", "Temp change", 0.1, 60, 0.1, 8, "K"),
      p("n", "Moles", 0.01, 5, 0.01, 0.05, "mol"),
    ],
    outputs: [
      { label: "ΔH", unit: "kJ/mol", compute: (v) => -(v.m * 4.18 * v.dT) / 1000 / v.n },
    ],
  },

  // Biology
  {
    slug: "photosynthesis-rate",
    title: "Photosynthesis rate",
    subject: "Biology",
    level: "secondary",
    summary: "Light and CO₂ limit how fast a plant works.",
    theory: "The rate rises with light until another factor becomes limiting.",
    visual: "pulse",
    params: [
      p("light", "Light intensity", 0, 100, 1, 50, "%"),
      p("co2", "CO₂", 0, 100, 1, 60, "%"),
      p("T", "Temperature", 0, 50, 1, 25, "°C"),
    ],
    outputs: [
      {
        label: "Relative rate",
        compute: (v) =>
          Math.min(v.light, v.co2) * (v.T > 40 ? 0.2 : Math.max(0.1, 1 - Math.abs(v.T - 30) / 40)),
      },
    ],
  },
  {
    slug: "punnett-square",
    title: "Punnett square",
    subject: "Biology",
    level: "secondary",
    summary: "Cross two parents and predict offspring.",
    theory: "A monohybrid cross of Aa × Aa gives 3:1 dominant to recessive.",
    visual: "grid",
    params: [
      p("a", "Dominant alleles parent 1", 0, 2, 1, 1),
      p("b", "Dominant alleles parent 2", 0, 2, 1, 1),
    ],
    outputs: [
      {
        label: "Dominant phenotype %",
        compute: (v) => 100 * (1 - ((2 - v.a) / 2) * ((2 - v.b) / 2)),
      },
      { label: "Recessive %", compute: (v) => 100 * (((2 - v.a) / 2) * ((2 - v.b) / 2)) },
    ],
  },
  {
    slug: "population-growth",
    title: "Population growth",
    subject: "Biology",
    level: "university",
    summary: "Exponential vs limited growth.",
    theory: "Logistic growth slows as the population nears carrying capacity.",
    visual: "wave",
    params: [
      p("N0", "Start", 1, 1000, 1, 50),
      p("r", "Growth rate", 0.01, 1, 0.01, 0.3),
      p("K", "Carrying capacity", 10, 5000, 10, 1000),
      p("t", "Time", 0, 50, 1, 10),
    ],
    outputs: [
      {
        label: "Population",
        compute: (v) => v.K / (1 + ((v.K - v.N0) / v.N0) * Math.exp(-v.r * v.t)),
      },
    ],
  },
  {
    slug: "heart-output",
    title: "Cardiac output",
    subject: "Biology",
    level: "secondary",
    summary: "How much blood does the heart move?",
    theory: "Cardiac output = stroke volume × heart rate.",
    visual: "pulse",
    params: [
      p("sv", "Stroke volume", 20, 150, 1, 70, "mL"),
      p("hr", "Heart rate", 30, 200, 1, 72, "bpm"),
    ],
    outputs: [{ label: "Output", unit: "L/min", compute: (v) => (v.sv * v.hr) / 1000 }],
  },
  {
    slug: "bmi-calculator",
    title: "Body mass index",
    subject: "Biology",
    level: "primary",
    summary: "A simple health indicator.",
    theory: "BMI = mass / height².",
    visual: "bar",
    params: [p("m", "Mass", 20, 200, 0.5, 65, "kg"), p("h", "Height", 1, 2.2, 0.01, 1.7, "m")],
    outputs: [{ label: "BMI", compute: (v) => v.m / (v.h * v.h) }],
  },
  {
    slug: "enzyme-activity",
    title: "Enzyme activity",
    subject: "Biology",
    level: "secondary",
    summary: "Enzymes have a best temperature and pH.",
    theory: "Activity peaks at the optimum and collapses when the enzyme denatures.",
    visual: "wave",
    params: [
      p("T", "Temperature", 0, 80, 1, 37, "°C"),
      p("pH", "pH", 1, 14, 0.1, 7),
    ],
    outputs: [
      {
        label: "Activity %",
        compute: (v) =>
          Math.max(
            0,
            100 * Math.exp(-((v.T - 37) ** 2) / 200) * Math.exp(-((v.pH - 7) ** 2) / 4) -
              (v.T > 60 ? 60 : 0),
          ),
      },
    ],
  },
  {
    slug: "osmosis",
    title: "Osmosis in cells",
    subject: "Biology",
    level: "secondary",
    summary: "Watch a cell swell or shrink.",
    theory: "Water moves from dilute to concentrated solutions across a membrane.",
    visual: "orbit",
    params: [
      p("inside", "Inside conc.", 0, 2, 0.05, 0.9, "M"),
      p("outside", "Outside conc.", 0, 2, 0.05, 0.3, "M"),
    ],
    outputs: [
      { label: "Net water in (+)", compute: (v) => v.inside - v.outside },
      { label: "Cell volume change %", compute: (v) => (v.inside - v.outside) * 40 },
    ],
  },
  {
    slug: "breathing-rate",
    title: "Breathing and exercise",
    subject: "Biology",
    level: "primary",
    summary: "Exercise makes you breathe faster.",
    theory: "More activity means more oxygen demand.",
    visual: "pulse",
    params: [
      p("effort", "Effort", 0, 10, 1, 3),
      p("age", "Age", 5, 80, 1, 15, "yr"),
    ],
    outputs: [
      { label: "Breaths/min", compute: (v) => 12 + v.effort * 3 + (v.age < 12 ? 6 : 0) },
      { label: "Est. heart rate", compute: (v) => 70 + v.effort * 12 },
    ],
  },
  {
    slug: "food-chain",
    title: "Energy in food chains",
    subject: "Biology",
    level: "secondary",
    summary: "Only a tenth of energy passes on.",
    theory: "Roughly 10% of energy transfers between trophic levels.",
    visual: "bar",
    params: [
      p("E", "Producer energy", 100, 100000, 100, 10000, "kJ"),
      p("lvl", "Levels up", 1, 5, 1, 2),
    ],
    outputs: [{ label: "Energy left", unit: "kJ", compute: (v) => v.E * Math.pow(0.1, v.lvl) }],
  },
  {
    slug: "microscope-magnification",
    title: "Microscope magnification",
    subject: "Biology",
    level: "primary",
    summary: "Combine eyepiece and objective lenses.",
    theory: "Total magnification = eyepiece × objective.",
    visual: "grid",
    params: [
      p("e", "Eyepiece", 5, 25, 1, 10, "×"),
      p("o", "Objective", 4, 100, 1, 40, "×"),
      p("size", "Image size", 1, 200, 1, 40, "mm"),
    ],
    outputs: [
      { label: "Magnification", unit: "×", compute: (v) => v.e * v.o },
      { label: "Real size", unit: "µm", compute: (v) => (v.size * 1000) / (v.e * v.o) },
    ],
  },
  {
    slug: "genetic-drift",
    title: "Allele frequency",
    subject: "Biology",
    level: "university",
    summary: "Hardy–Weinberg genotype frequencies.",
    theory: "p² + 2pq + q² = 1.",
    visual: "bar",
    params: [p("p", "Allele p", 0, 1, 0.01, 0.6)],
    outputs: [
      { label: "Homozygous dominant %", compute: (v) => v.p * v.p * 100 },
      { label: "Heterozygous %", compute: (v) => 2 * v.p * (1 - v.p) * 100 },
      { label: "Homozygous recessive %", compute: (v) => (1 - v.p) ** 2 * 100 },
    ],
  },

  // Mathematics
  {
    slug: "quadratic-explorer",
    title: "Quadratic explorer",
    subject: "Mathematics",
    level: "secondary",
    summary: "Shape a parabola and find its roots.",
    theory: "Roots come from x = (−b ± √(b²−4ac)) / 2a.",
    visual: "wave",
    params: [
      p("a", "a", -5, 5, 0.1, 1),
      p("b", "b", -10, 10, 0.1, -3),
      p("c", "c", -10, 10, 0.1, 2),
    ],
    outputs: [
      { label: "Discriminant", compute: (v) => v.b * v.b - 4 * v.a * v.c },
      {
        label: "Root 1",
        compute: (v) => (-v.b + Math.sqrt(Math.max(0, v.b ** 2 - 4 * v.a * v.c))) / (2 * v.a),
      },
      {
        label: "Root 2",
        compute: (v) => (-v.b - Math.sqrt(Math.max(0, v.b ** 2 - 4 * v.a * v.c))) / (2 * v.a),
      },
    ],
  },
  {
    slug: "trig-circle",
    title: "Trigonometry circle",
    subject: "Mathematics",
    level: "secondary",
    summary: "Spin an angle and read sine, cosine, tangent.",
    theory: "On the unit circle, cos is the x-coordinate and sin the y-coordinate.",
    visual: "orbit",
    params: [p("a", "Angle", 0, 360, 1, 30, "°")],
    outputs: [
      { label: "sin", compute: (v) => Math.sin((v.a * Math.PI) / 180) },
      { label: "cos", compute: (v) => Math.cos((v.a * Math.PI) / 180) },
      { label: "tan", compute: (v) => Math.tan((v.a * Math.PI) / 180) },
    ],
  },
  {
    slug: "compound-interest",
    title: "Compound interest",
    subject: "Mathematics",
    level: "secondary",
    summary: "Money growing on itself.",
    theory: "A = P(1 + r/n)^(nt).",
    visual: "bar",
    params: [
      p("P", "Principal", 100, 100000, 100, 5000),
      p("r", "Rate", 0.1, 40, 0.1, 8, "%"),
      p("t", "Years", 1, 40, 1, 5),
      p("n", "Times/year", 1, 12, 1, 12),
    ],
    outputs: [
      {
        label: "Amount",
        compute: (v) => v.P * Math.pow(1 + v.r / 100 / v.n, v.n * v.t),
      },
      {
        label: "Interest earned",
        compute: (v) => v.P * Math.pow(1 + v.r / 100 / v.n, v.n * v.t) - v.P,
      },
    ],
  },
  {
    slug: "pythagoras",
    title: "Pythagoras",
    subject: "Mathematics",
    level: "primary",
    summary: "Find the missing side of a right triangle.",
    theory: "a² + b² = c².",
    visual: "grid",
    params: [p("a", "Side a", 1, 50, 0.5, 3), p("b", "Side b", 1, 50, 0.5, 4)],
    outputs: [
      { label: "Hypotenuse", compute: (v) => Math.hypot(v.a, v.b) },
      { label: "Area", compute: (v) => 0.5 * v.a * v.b },
    ],
  },
  {
    slug: "statistics-spread",
    title: "Mean and spread",
    subject: "Mathematics",
    level: "secondary",
    summary: "See how outliers move the mean.",
    theory: "The mean is pulled by extremes; the median is not.",
    visual: "bar",
    params: [
      p("x1", "Value 1", 0, 100, 1, 10),
      p("x2", "Value 2", 0, 100, 1, 20),
      p("x3", "Value 3", 0, 100, 1, 30),
      p("x4", "Value 4", 0, 100, 1, 90),
    ],
    outputs: [
      { label: "Mean", compute: (v) => (v.x1 + v.x2 + v.x3 + v.x4) / 4 },
      {
        label: "Range",
        compute: (v) =>
          Math.max(v.x1, v.x2, v.x3, v.x4) - Math.min(v.x1, v.x2, v.x3, v.x4),
      },
      {
        label: "Std deviation",
        compute: (v) => {
          const xs = [v.x1, v.x2, v.x3, v.x4];
          const m = xs.reduce((a, b) => a + b, 0) / 4;
          return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / 4);
        },
      },
    ],
  },
  {
    slug: "linear-graph",
    title: "Straight line graph",
    subject: "Mathematics",
    level: "primary",
    summary: "Gradient and intercept, live.",
    theory: "y = mx + c.",
    visual: "wave",
    params: [
      p("m", "Gradient", -5, 5, 0.1, 2),
      p("c", "Intercept", -10, 10, 0.5, 1),
      p("x", "x", -10, 10, 0.5, 3),
    ],
    outputs: [
      { label: "y", compute: (v) => v.m * v.x + v.c },
      { label: "x-intercept", compute: (v) => -v.c / v.m },
    ],
  },
  {
    slug: "probability-dice",
    title: "Dice probability",
    subject: "Mathematics",
    level: "primary",
    summary: "Chances over repeated rolls.",
    theory: "P(at least one) = 1 − (1 − p)ⁿ.",
    visual: "pulse",
    params: [p("faces", "Faces", 2, 20, 1, 6), p("rolls", "Rolls", 1, 50, 1, 4)],
    outputs: [
      { label: "P(single) %", compute: (v) => (1 / v.faces) * 100 },
      {
        label: "P(at least one) %",
        compute: (v) => (1 - Math.pow(1 - 1 / v.faces, v.rolls)) * 100,
      },
    ],
  },
  {
    slug: "calculus-derivative",
    title: "Derivative explorer",
    subject: "Mathematics",
    level: "university",
    summary: "Gradient of a curve at a point.",
    theory: "For y = ax^n, dy/dx = anx^(n−1).",
    visual: "wave",
    params: [
      p("a", "a", -5, 5, 0.1, 1),
      p("n", "power n", 0, 5, 1, 3),
      p("x", "x", -5, 5, 0.1, 2),
    ],
    outputs: [
      { label: "y", compute: (v) => v.a * Math.pow(v.x, v.n) },
      { label: "dy/dx", compute: (v) => v.a * v.n * Math.pow(v.x, v.n - 1) },
    ],
  },
  {
    slug: "matrix-2x2",
    title: "2×2 matrices",
    subject: "Mathematics",
    level: "university",
    summary: "Determinant and inverse of a matrix.",
    theory: "det = ad − bc; the inverse exists when det ≠ 0.",
    visual: "grid",
    params: [
      p("a", "a", -10, 10, 1, 2),
      p("b", "b", -10, 10, 1, 1),
      p("c", "c", -10, 10, 1, 3),
      p("d", "d", -10, 10, 1, 4),
    ],
    outputs: [
      { label: "Determinant", compute: (v) => v.a * v.d - v.b * v.c },
      { label: "Trace", compute: (v) => v.a + v.d },
    ],
  },
  {
    slug: "percentages",
    title: "Percentage playground",
    subject: "Mathematics",
    level: "primary",
    summary: "Discounts, increases and shares.",
    theory: "Percent means 'per hundred'.",
    visual: "bar",
    params: [p("value", "Amount", 1, 10000, 1, 250), p("pct", "Percent", 0, 200, 1, 15, "%")],
    outputs: [
      { label: "Percent of amount", compute: (v) => (v.value * v.pct) / 100 },
      { label: "After increase", compute: (v) => v.value * (1 + v.pct / 100) },
      { label: "After discount", compute: (v) => v.value * (1 - v.pct / 100) },
    ],
  },
  {
    slug: "circle-geometry",
    title: "Circle geometry",
    subject: "Mathematics",
    level: "primary",
    summary: "Circumference, area and arc length.",
    theory: "C = 2πr, A = πr².",
    visual: "orbit",
    params: [p("r", "Radius", 0.1, 20, 0.1, 5), p("a", "Arc angle", 0, 360, 1, 90, "°")],
    outputs: [
      { label: "Circumference", compute: (v) => 2 * Math.PI * v.r },
      { label: "Area", compute: (v) => Math.PI * v.r * v.r },
      { label: "Arc length", compute: (v) => 2 * Math.PI * v.r * (v.a / 360) },
    ],
  },
  {
    slug: "sequences",
    title: "Sequences",
    subject: "Mathematics",
    level: "secondary",
    summary: "Arithmetic and geometric terms.",
    theory: "aₙ = a + (n−1)d for arithmetic, arⁿ⁻¹ for geometric.",
    visual: "bar",
    params: [
      p("a", "First term", -20, 50, 1, 3),
      p("d", "Difference", -10, 10, 0.5, 4),
      p("r", "Ratio", 0.1, 5, 0.1, 2),
      p("n", "Term n", 1, 30, 1, 8),
    ],
    outputs: [
      { label: "Arithmetic term", compute: (v) => v.a + (v.n - 1) * v.d },
      { label: "Geometric term", compute: (v) => v.a * Math.pow(v.r, v.n - 1) },
      {
        label: "Arithmetic sum",
        compute: (v) => (v.n / 2) * (2 * v.a + (v.n - 1) * v.d),
      },
    ],
  },

  // Computing
  {
    slug: "binary-converter",
    title: "Binary converter",
    subject: "Computing",
    level: "secondary",
    summary: "Decimal to binary and hexadecimal.",
    theory: "Computers store numbers in base 2; hexadecimal groups four bits.",
    visual: "grid",
    params: [p("n", "Decimal", 0, 255, 1, 42)],
    outputs: [
      { label: "Binary (as number)", compute: (v) => Number(Math.round(v.n).toString(2)) },
      { label: "Hex (as number)", compute: (v) => Number(Math.round(v.n).toString(16)) },
      { label: "Bits needed", compute: (v) => Math.max(1, Math.ceil(Math.log2(v.n + 1))) },
    ],
  },
  {
    slug: "logic-gates",
    title: "Logic gates",
    subject: "Computing",
    level: "secondary",
    summary: "Flip two inputs and read every gate.",
    theory: "AND needs both, OR needs one, XOR needs exactly one.",
    visual: "circuit",
    params: [p("a", "Input A", 0, 1, 1, 1), p("b", "Input B", 0, 1, 1, 0)],
    outputs: [
      { label: "AND", compute: (v) => (v.a && v.b ? 1 : 0) },
      { label: "OR", compute: (v) => (v.a || v.b ? 1 : 0) },
      { label: "XOR", compute: (v) => (v.a !== v.b ? 1 : 0) },
      { label: "NAND", compute: (v) => (v.a && v.b ? 0 : 1) },
    ],
  },
  {
    slug: "algorithm-complexity",
    title: "Algorithm complexity",
    subject: "Computing",
    level: "university",
    summary: "Compare how algorithms scale.",
    theory: "O(n²) explodes long before O(n log n) does.",
    visual: "wave",
    params: [p("n", "Input size", 1, 1000, 1, 100)],
    outputs: [
      { label: "O(n)", compute: (v) => v.n },
      { label: "O(n log n)", compute: (v) => v.n * Math.log2(v.n || 1) },
      { label: "O(n²)", compute: (v) => v.n * v.n },
    ],
  },
  {
    slug: "network-speed",
    title: "Download time",
    subject: "Computing",
    level: "primary",
    summary: "How long will that file take?",
    theory: "Time = size / speed, remembering 8 bits per byte.",
    visual: "bar",
    params: [
      p("size", "File size", 1, 5000, 1, 700, "MB"),
      p("speed", "Speed", 0.5, 200, 0.5, 10, "Mbps"),
    ],
    outputs: [
      { label: "Time", unit: "min", compute: (v) => (v.size * 8) / v.speed / 60 },
      { label: "Time", unit: "s", compute: (v) => (v.size * 8) / v.speed },
    ],
  },
  {
    slug: "colour-mixer",
    title: "RGB colour mixer",
    subject: "Computing",
    level: "primary",
    summary: "Mix red, green and blue channels.",
    theory: "Screens create colour by adding light in three channels.",
    visual: "grid",
    params: [
      p("r", "Red", 0, 255, 1, 120),
      p("g", "Green", 0, 255, 1, 180),
      p("b", "Blue", 0, 255, 1, 240),
    ],
    outputs: [
      { label: "Brightness %", compute: (v) => ((v.r + v.g + v.b) / 765) * 100 },
      { label: "Greyscale", compute: (v) => 0.299 * v.r + 0.587 * v.g + 0.114 * v.b },
    ],
  },
  {
    slug: "storage-units",
    title: "Storage units",
    subject: "Computing",
    level: "primary",
    summary: "Bits, bytes, megabytes and gigabytes.",
    theory: "1 byte = 8 bits, 1 GB = 1024 MB.",
    visual: "bar",
    params: [p("gb", "Gigabytes", 0.1, 2000, 0.1, 16)],
    outputs: [
      { label: "Megabytes", compute: (v) => v.gb * 1024 },
      { label: "Photos (4MB)", compute: (v) => (v.gb * 1024) / 4 },
      { label: "Songs (5MB)", compute: (v) => (v.gb * 1024) / 5 },
    ],
  },
  {
    slug: "encryption-shift",
    title: "Caesar cipher strength",
    subject: "Computing",
    level: "secondary",
    summary: "Why simple ciphers break.",
    theory: "A shift cipher has only 25 keys — trivial to brute force.",
    visual: "pulse",
    params: [
      p("alpha", "Alphabet size", 10, 90, 1, 26),
      p("len", "Key length", 1, 12, 1, 1),
    ],
    outputs: [
      { label: "Possible keys", compute: (v) => Math.pow(v.alpha, v.len) },
      {
        label: "Crack time (s at 1M/s)",
        compute: (v) => Math.pow(v.alpha, v.len) / 1e6,
      },
    ],
  },
  {
    slug: "sorting-steps",
    title: "Sorting comparison",
    subject: "Computing",
    level: "secondary",
    summary: "Bubble sort vs merge sort work.",
    theory: "Bubble sort does about n² comparisons, merge sort n log n.",
    visual: "bar",
    params: [p("n", "Items", 2, 500, 1, 50)],
    outputs: [
      { label: "Bubble comparisons", compute: (v) => (v.n * (v.n - 1)) / 2 },
      { label: "Merge comparisons", compute: (v) => v.n * Math.log2(v.n) },
      { label: "Speed-up ×", compute: (v) => (v.n * (v.n - 1)) / 2 / (v.n * Math.log2(v.n)) },
    ],
  },

  // Geography
  {
    slug: "map-scale",
    title: "Map scale",
    subject: "Geography",
    level: "primary",
    summary: "Turn map centimetres into real kilometres.",
    theory: "A 1:50 000 map means 1 cm equals 500 m on the ground.",
    visual: "grid",
    params: [
      p("cm", "Distance on map", 0.1, 100, 0.1, 4, "cm"),
      p("scale", "Scale 1:", 1000, 250000, 1000, 50000),
    ],
    outputs: [{ label: "Real distance", unit: "km", compute: (v) => (v.cm * v.scale) / 100000 }],
  },
  {
    slug: "rainfall-runoff",
    title: "Rainfall and runoff",
    subject: "Geography",
    level: "secondary",
    summary: "How much water leaves a catchment?",
    theory: "Runoff = rainfall × area × runoff coefficient.",
    visual: "wave",
    params: [
      p("rain", "Rainfall", 1, 400, 1, 80, "mm"),
      p("area", "Area", 0.1, 500, 0.1, 12, "km²"),
      p("c", "Runoff coefficient", 0.05, 1, 0.05, 0.4),
    ],
    outputs: [
      {
        label: "Runoff volume",
        unit: "million m³",
        compute: (v) => (v.rain / 1000) * v.area * 1e6 * v.c * 1e-6,
      },
    ],
  },
  {
    slug: "population-density",
    title: "Population density",
    subject: "Geography",
    level: "primary",
    summary: "People per square kilometre.",
    theory: "Density = population / area.",
    visual: "bar",
    params: [
      p("pop", "Population", 100, 5000000, 100, 250000),
      p("area", "Area", 1, 100000, 1, 1200, "km²"),
    ],
    outputs: [{ label: "Density", unit: "people/km²", compute: (v) => v.pop / v.area }],
  },
  {
    slug: "climate-graph",
    title: "Temperature and altitude",
    subject: "Geography",
    level: "secondary",
    summary: "It gets colder as you climb.",
    theory: "Air cools about 6.5 °C per 1000 m (the lapse rate).",
    visual: "wave",
    params: [
      p("t0", "Sea-level temp", -10, 45, 0.5, 28, "°C"),
      p("alt", "Altitude", 0, 6000, 10, 1200, "m"),
    ],
    outputs: [
      { label: "Temperature", unit: "°C", compute: (v) => v.t0 - (6.5 * v.alt) / 1000 },
    ],
  },
];

export const labSubjects = Array.from(new Set(labs.map((l) => l.subject)));
export const getLab = (slug: string) => labs.find((l) => l.slug === slug);
