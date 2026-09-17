// Curated vocabulary and English n-gram statistics for cryptography & analysis

export const WORDS: string[] = [
  "abandonment", "abdication", "aberration", "abomination", "absenteeism", "absolution", "absorption", "abstinence",
  "acceleration", "acclimatization", "accomplishment", "accumulation", "accreditation", "adaptation", "addiction",
  "adhesion", "admiration", "adolescence", "adventurism", "advocacy", "aerodynamics", "affirmation", "aggregation",
  "agriculture", "alienation", "alleviation", "allocation", "alteration", "amalgamation", "amazement", "ambidextrous",
  "amelioration", "amusement", "analysis", "anatomy", "anarchism", "animosity", "annihilation", "anticipation",
  "appreciation", "apprehension", "arbitration", "architecture", "argumentation", "articulation", "assimilation",
  "assumption", "assurance", "astonishment", "attainment", "attraction", "attribution", "augmentation", "authenticity",
  "authorization", "automation", "availability", "awakening", "backtracking", "balancing", "beautification",
  "benevolent", "bifurcation", "biodiversity", "calculation", "calibration", "cancellation", "capitalization",
  "categorization", "celebration", "centralization", "certification", "challenge", "characterization", "civilization",
  "clarification", "classification", "collaboration", "combination", "comfortableness", "commemoration", "communication",
  "compartmentalization", "compensation", "competition", "complication", "concentration", "conceptually", "condensation",
  "configuration", "confirmation", "confrontation", "conglomeration", "congratulation", "consideration", "consolidation",
  "contemplation", "continuation", "contribution", "conversation", "cooperation", "coordination", "correction",
  "corroboration", "cultivation", "customization", "declaration", "dedication", "deduction", "defamation", "defibrillation",
  "definition", "degradation", "delegation", "deliberation", "demonstration", "denaturation", "denunciation",
  "depreciation", "deregulation", "determination", "detoxification", "deviation", "dexterousness", "diagnostic",
  "dichotomy", "digitization", "dilapidation", "dimension", "diminution", "diplomacy", "direction", "disambiguation",
  "disapproval", "disarmament", "disbandment", "disbelief", "disciplinary", "discoloration", "discrimination", "discussion",
  "disengagement", "disintegration", "dislocation", "disorientation", "disqualification", "dissatisfaction", "dissension",
  "dissertation", "distinction", "distribution", "documentation", "domination", "dramatization", "duality", "duplication",
  "duration", "dynamism", "dyslexia", "eagerness", "eclecticism", "economical", "ecosystem", "education", "efficiency",
  "elaboration", "elevation", "elimination", "eloquence", "elucidation", "embankment", "embellishment", "emergence",
  "emission", "emotionality", "empathy", "empowerment", "enactment", "encouragement", "endangerment", "endorsement",
  "endurance", "enforcement", "engagement", "enlightenment", "enjoyment", "enlargement", "enrichment", "entertainment",
  "enthusiasm", "environment", "envision", "equality", "eradication", "escalation", "establishment", "estimation",
  "etherealness", "evaluation", "examination", "exaggeration", "excellence", "exceptional", "exhilaration", "existence",
  "expansion", "expectation", "experimentation", "explanation", "exploration", "extrapolation", "extraordinary",
  "fabrication", "fertilization", "flourishing", "fortification", "gastrointestinal", "globalization", "gratification",
  "harmoniously", "humanitarian", "hypothetical", "illumination", "improvisation", "independence", "inspiration",
  "juxtaposition", "juxtaposed", "knowledgeable", "knowledgeably", "labyrinthine", "legalization", "legislation",
  "lexicography", "luminescence", "manifestation", "normalization", "negotiation", "optimization", "opportunistic",
  "participation", "perseverance", "productivity", "qualification", "quantification", "quintessential", "recombination",
  "recognition", "rejuvenation", "reconciliation", "reconnaissance", "rehabilitation", "sophistication", "simplification",
  "standardization", "sustainability", "transcendence", "transcendental", "transformation", "unfamiliar", "unification",
  "utilization", "verification", "vulnerability", "waterfront", "weatherproof", "xenial", "xenogenesis", "xenophobic",
  "yearning", "youthful", "youthfulness", "zoological", "zoology", "zoologist", "apple", "banana", "orange", "mango",
  "grape", "peach", "cherry", "papaya", "lemon", "lime", "strawberry", "blueberry", "blackberry", "raspberry",
  "pineapple", "watermelon", "melon", "kiwi", "apricot", "plum", "fig", "date", "coconut", "guava", "lychee",
  "pomegranate", "nectarine", "cantaloupe", "tangerine", "mandarin", "cranberry", "passionfruit", "dragonfruit",
  "jackfruit", "persimmon", "elderberry", "gooseberry", "olive", "quince", "grapefruit", "avocado", "carrot",
  "broccoli", "spinach", "kale", "lettuce", "cucumber", "tomato", "potato", "onion", "garlic", "ginger", "radish",
  "turnip", "beet", "pepper", "chilli", "celery", "zucchini", "squash", "eggplant", "mushroom", "pea", "bean",
  "lentil", "cabbage", "brussels", "cauliflower", "artichoke", "asparagus", "fennel", "parsnip", "rhubarb", "okra",
  "tomatillo", "applesauce", "breadfruit", "basil", "thyme", "oregano", "rosemary", "mint", "cilantro", "dill",
  "saffron", "turmeric", "paprika", "cumin", "coriander", "nutmeg", "cinnamon", "clove", "cardamom", "anise",
  "fennelseed", "chives", "lemongrass", "tarragon", "marjoram", "sage", "bayleaf", "cherryblossom", "hibiscus",
  "jasmine", "lavender", "rose", "daisy", "sunflower", "orchid", "tulip", "daffodil", "lily", "dahlia", "petunia",
  "iris", "violet", "peony", "camellia", "geranium", "marigold", "almond", "walnut", "cashew", "pecan", "pistachio",
  "hazelnut", "macadamia", "coffee", "tea", "chocolate", "honey", "sugar", "salt", "vinegar", "butter", "milk",
  "cheese", "yogurt", "bread", "pasta", "rice", "noodle", "soup", "steak", "chicken", "beef", "pork", "lamb", "fish",
  "salmon", "tuna", "cod", "shrimp", "lobster", "crab", "oyster", "mussel", "squid", "bagel", "biscuit", "cupcake",
  "donut", "muffin", "cookie", "pie", "cake", "tart", "cherrypie", "brownie", "candy", "chocolatebar", "jelly",
  "caramel", "toffee", "licorice", "sofa", "chair", "table", "bed", "desk", "cabinet", "bookshelf", "dresser",
  "couch", "armchair", "lamp", "clock", "mirror", "rug", "carpet", "curtain", "blind", "picture", "painting",
  "vase", "window", "door", "floor", "ceiling", "wall", "stool", "bench", "cupboard", "wardrobe", "trunk", "bicycle",
  "motorcycle", "car", "truck", "bus", "train", "boat", "ship", "airplane", "helicopter", "submarine", "skateboard",
  "scooter", "tram", "railway", "metro", "ferry", "canoe", "pyramid", "bridge", "tower", "castle", "palace",
  "security", "crypto", "cipher", "secret", "algorithm", "network", "system", "matrix", "vector", "binary"
];

// Standard English letter frequencies (percentages)
export const ENGLISH_LETTER_FREQ: Record<string, number> = {
  A: 8.167, B: 1.492, C: 2.782, D: 4.253, E: 12.702,
  F: 2.228, G: 2.015, H: 6.094, I: 6.966, J: 0.153,
  K: 0.772, L: 4.025, M: 2.406, N: 6.749, O: 7.507,
  P: 1.929, Q: 0.095, R: 5.987, S: 6.327, T: 9.056,
  U: 2.758, V: 0.978, W: 2.360, X: 0.150, Y: 1.974, Z: 0.074
};

// Common English Digraphs ordered by frequency
export const ENGLISH_DIGRAPHS: string[] = [
  "TH", "HE", "IN", "ER", "AN", "RE", "ON", "AT", "EN", "ND",
  "TI", "ES", "OR", "TE", "OF", "ED", "IS", "IT", "AL", "AR",
  "ST", "TO", "NT", "NG", "SE", "HA", "AS", "OU", "IO", "LE"
];

// Common English Trigraphs ordered by frequency
export const ENGLISH_TRIGRAPHS: string[] = [
  "THE", "AND", "THA", "ENT", "ING", "ION", "TIO", "FOR",
  "NDE", "HAS", "NCE", "EDT", "TIS", "OFT", "STH", "MEN"
];

// Reference Index of Coincidence for standard English text
export const ENGLISH_IOC = 0.0667;

export default WORDS;
