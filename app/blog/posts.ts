export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  toolId: "bmi" | "tdee" | "body-fat" | "macro" | "pregnancy" | "ovulation";
  toolLabel: string;
  toolHref: string;
  publishedAt: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  keywords: string[];
  sections: { heading: string; paragraphs: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "bmi",
    title: "BMI Calculator Guide: What Body Mass Index Really Means",
    excerpt:
      "Learn how BMI is calculated, what the categories mean, and how to use our free BMI calculator as a starting point, not a diagnosis.",
    description:
      "Complete guide to Body Mass Index (BMI): formula, adult categories, healthy weight ranges, limits of BMI, and how to use the BMI Wellness Pro calculator.",
    toolId: "bmi",
    toolLabel: "BMI Calculator",
    toolHref: "/#bmi",
    publishedAt: "2026-01-15",
    updatedAt: "2026-09-25",
    image: "/blog/bmi.jpg",
    imageAlt: "Person standing on a bathroom scale measuring weight for BMI",
    keywords: [
      "BMI calculator",
      "body mass index",
      "BMI categories",
      "healthy weight range",
    ],
    sections: [
      {
        heading: "What is BMI?",
        paragraphs: [
          "Body Mass Index (BMI) is a simple screening number that relates your weight to your height. Health organizations use it to estimate whether someone falls into underweight, normal weight, overweight, or obesity categories for adults.",
          "BMI is not a direct measure of body fat or health. It is a fast, standardized starting point that you can combine with waist size, fitness, lab results, and clinical advice.",
        ],
      },
      {
        heading: "How the BMI formula works",
        paragraphs: [
          "The standard metric formula is: BMI = weight (kg) divided by height (m) squared. For example, 72 kg at 1.75 m gives BMI about 23.5, which sits in the normal weight range for most adults.",
          "Our BMI calculator converts your height from centimeters, shows your category, and estimates a healthy weight range for your height (BMI 18.5 to 24.9).",
        ],
      },
      {
        heading: "Who this tool helps",
        paragraphs: [
          "Adults who want a quick baseline before setting nutrition or activity goals. It is especially useful when you need a shared reference with a coach or clinician.",
          "BMI is less reliable for athletes with high muscle mass, pregnant people, older adults with changing body composition, and children (who need age specific charts).",
        ],
      },
      {
        heading: "Limits and responsible use",
        paragraphs: [
          "Treat BMI as one signal among many. Two people with the same BMI can have very different health profiles. Prefer trends over single readings, and seek professional care for personal medical decisions.",
        ],
      },
    ],
  },
  {
    slug: "tdee",
    title: "TDEE & BMR Explained: Mifflin–St Jeor & Katch–McArdle",
    excerpt:
      "Understand basal metabolic rate (BMR), total daily energy expenditure (TDEE), macros, and when our calculator switches from Mifflin–St Jeor to Katch–McArdle.",
    description:
      "Learn BMR and TDEE using Mifflin–St Jeor or Katch–McArdle, activity multipliers, macros, ideal weight, BMI, and muscular potential estimates.",
    toolId: "tdee",
    toolLabel: "TDEE Calculator",
    toolHref: "/#tdee",
    publishedAt: "2026-02-02",
    updatedAt: "2026-09-26",
    image: "/blog/tdee.jpg",
    imageAlt: "Healthy meal prep bowls representing daily calorie planning",
    keywords: [
      "TDEE calculator",
      "BMR calculator",
      "Mifflin St Jeor",
      "Katch McArdle",
      "daily calorie needs",
      "macro calculator",
    ],
    sections: [
      {
        heading: "BMR vs TDEE",
        paragraphs: [
          "BMR (basal metabolic rate) estimates the calories your body needs at complete rest. TDEE multiplies BMR by an activity factor to estimate total daily burn including movement and exercise.",
          "Accurate calorie planning starts with a trusted BMR equation, then adjusts for how active you actually are, not how active you wish you were.",
        ],
      },
      {
        heading: "Mifflin–St Jeor (default)",
        paragraphs: [
          "Men: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5. Women: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161.",
          "When body fat is not entered, we use Mifflin–St Jeor, then apply standard activity multipliers (sedentary 1.2 through athlete 1.9).",
        ],
      },
      {
        heading: "Katch–McArdle (with body fat %)",
        paragraphs: [
          "When you enter body fat percentage, we switch to Katch–McArdle: BMR = 370 + 21.6 × lean body mass (kg). Lean mass = weight × (1 − body fat ÷ 100).",
          "This is often more accurate for people who know their body composition. We also show Revised Harris–Benedict as a secondary reference.",
        ],
      },
      {
        heading: "What else the TDEE tool shows",
        paragraphs: [
          "Maintenance calories (daily and weekly), calories at every activity level, cut/maintain/bulk targets with macronutrient splits, ideal weight from Hamwi/Devine/Robinson/Miller, BMI category, and Martin Berkhan muscular potential estimates.",
        ],
      },
      {
        heading: "Practical targets",
        paragraphs: [
          "Use maintenance TDEE as your baseline. A modest deficit or surplus is usually more sustainable than aggressive cuts. Recalculate when weight, age, or activity changes meaningfully.",
        ],
      },
      {
        heading: "Limits",
        paragraphs: [
          "Equations are estimates. Hormones, medications, illness, and measurement error all matter. If you have a medical condition affecting metabolism, work with a qualified clinician or dietitian.",
        ],
      },
    ],
  },
  {
    slug: "body-fat",
    title: "Body Fat Percentage: U.S. Navy Circumference Method",
    excerpt:
      "See how the DoD/U.S. Navy circumference method estimates body fat from waist, neck, height (and hips for women), and when tape measurements help.",
    description:
      "Guide to estimating body fat percentage with the official U.S. Navy / DoD circumference formulas, measurement tips, and how our body fat calculator works.",
    toolId: "body-fat",
    toolLabel: "Body Fat Calculator",
    toolHref: "/#body-fat",
    publishedAt: "2026-02-20",
    updatedAt: "2026-09-25",
    image: "/blog/body-fat.jpg",
    imageAlt: "Measuring tape used for waist circumference body composition",
    keywords: [
      "body fat calculator",
      "US Navy body fat",
      "body composition",
      "circumference method",
    ],
    sections: [
      {
        heading: "Why estimate body fat?",
        paragraphs: [
          "Scale weight alone does not show how much of your mass is fat versus lean tissue. Body fat estimates help explain progress when the scale is slow to move.",
          "Tape based methods are accessible at home. They are estimates, not lab grade DXA, but they are useful for tracking consistent measurements over time.",
        ],
      },
      {
        heading: "Official U.S. Navy / DoD method",
        paragraphs: [
          "Our calculator uses the DoD circumference equations. Measurements are entered in centimeters and converted to inches (the units those coefficients require).",
          "Men use abdomen (waist) and neck with height. Women also include hip circumference. Results are rounded to one decimal place and mapped to rough adult categories.",
        ],
      },
      {
        heading: "Measurement tips",
        paragraphs: [
          "Measure at the same time of day, stand relaxed, and keep the tape level. For men, measure waist at the navel level (or as instructed by your protocol). Consistency beats perfection.",
        ],
      },
      {
        heading: "Limits",
        paragraphs: [
          "Circumference formulas can misclassify some body shapes. They are educational tools. For clinical decisions, use professional assessment methods.",
        ],
      },
    ],
  },
  {
    slug: "macro",
    title: "Macro Planner: Calories, Protein, Carbs, and Fat",
    excerpt:
      "Estimate daily calories from Mifflin–St Jeor or Katch–McArdle, adjust for your goal, then split carbs, protein, and fat with clear ratio presets.",
    description:
      "How our macro calculator builds daily calories from BMR and activity, applies weight goals, and assigns protein, carbs, and fat using balanced, low-carb, high-carb, or high-protein splits.",
    toolId: "macro",
    toolLabel: "Macro Planner",
    toolHref: "/#macro",
    publishedAt: "2026-03-08",
    updatedAt: "2026-09-26",
    image: "/blog/macro.jpg",
    imageAlt: "Balanced plate with protein vegetables and whole grains",
    keywords: [
      "macro calculator",
      "protein carbs fat",
      "macro planner",
      "nutrition macros",
      "Mifflin St Jeor",
    ],
    sections: [
      {
        heading: "What macros are",
        paragraphs: [
          "Macronutrients—protein, carbohydrates, and fat—are the calorie-providing nutrients in food. Planning them helps you hit a calorie target while supporting satiety, training, and recovery.",
          "Our planner starts with estimated daily calories, then applies a ratio preset so you can see grams and calories for each macro at a glance.",
        ],
      },
      {
        heading: "How our planner works",
        paragraphs: [
          "Enter gender, age, height, weight, and activity. We estimate BMR with Mifflin–St Jeor (or Katch–McArdle when body fat % is provided), multiply by activity for TDEE, then adjust for goals such as mild loss (−250), weight loss (−500), extreme loss (−1000), mild gain (+250), or weight gain (+500).",
          "Choose Balanced (40/30/30), Low carb (20/40/40), High carb (50/25/25), or High protein (30/40/30). These are practical starting points, not rigid medical prescriptions.",
        ],
      },
      {
        heading: "Getting started",
        paragraphs: [
          "Use the TDEE tool if you only need maintenance calories, or stay in the Macro planner when you want calories and grams together. Adjust from real-world hunger, performance, and weekly averages.",
        ],
      },
      {
        heading: "Limits",
        paragraphs: [
          "Individual needs vary with sport, medical conditions, and food access. People with kidney disease, diabetes, or eating-disorder history should get personalized clinical guidance.",
        ],
      },
    ],
  },
  {
    slug: "pregnancy",
    title: "Pregnancy Due Date Calculator: LMP, Ultrasound, and IVF",
    excerpt:
      "Estimate your due date from LMP, conception, ultrasound dating, or IVF transfer, then see gestational age, trimester, and days remaining.",
    description:
      "How pregnancy due dates are estimated (LMP + 280 days, conception + 266 days, ultrasound and IVF adjustments), trimester ranges, and past-due messaging.",
    toolId: "pregnancy",
    toolLabel: "Due Date Calculator",
    toolHref: "/#pregnancy",
    publishedAt: "2026-03-22",
    updatedAt: "2026-09-26",
    image: "/blog/pregnancy.jpg",
    imageAlt: "Calendar and prenatal planning for pregnancy due date",
    keywords: [
      "due date calculator",
      "pregnancy timeline",
      "LMP due date",
      "IVF due date",
      "ultrasound dating",
      "trimesters",
    ],
    sections: [
      {
        heading: "How due dates are estimated",
        paragraphs: [
          "From last menstrual period (LMP), the common estimate is LMP + 280 days (40 weeks). From conception date, many tools use conception + 266 days (38 weeks).",
          "Ultrasound dating uses the scan date plus the remaining days to 280 after subtracting gestational age at the scan. IVF day-3 and day-5 transfers use transfer + 263 or + 261 days respectively.",
        ],
      },
      {
        heading: "Trimesters in our tool",
        paragraphs: [
          "While the pregnancy is ongoing, we map gestational weeks to Trimester 1 (under 14 weeks), Trimester 2 (under 28 weeks), and Trimester 3 thereafter, aligned with common clinical banding.",
          "If today is after the estimated due date, the calculator shows a past-due status with days overdue instead of continuing to label the timeline as Trimester 3.",
        ],
      },
      {
        heading: "Who it is for",
        paragraphs: [
          "People planning or tracking a pregnancy who want a clear educational estimate. Always confirm dating with prenatal care providers and ultrasound when available.",
        ],
      },
      {
        heading: "Limits",
        paragraphs: [
          "Irregular cycles, uncertain LMP, IVF dating, and clinical findings can change the estimated due date. This tool is not medical advice or obstetric care.",
        ],
      },
    ],
  },
  {
    slug: "ovulation",
    title: "Ovulation Calculator: Fertile Window and Next Cycles",
    excerpt:
      "Estimate ovulation, fertile days, pregnancy-test timing, next period, and due date if pregnant—plus the next six cycles from your LMP and cycle length.",
    description:
      "Learn how ovulation and fertile-window estimates work from cycle length and last menstrual period, including multi-cycle projections in the BMI Wellness Pro ovulation calculator.",
    toolId: "ovulation",
    toolLabel: "Ovulation Calculator",
    toolHref: "/#ovulation",
    publishedAt: "2026-04-05",
    updatedAt: "2026-09-26",
    image: "/blog/ovulation.jpg",
    imageAlt: "Calendar marking menstrual cycle and fertile window",
    keywords: [
      "ovulation calculator",
      "fertile window",
      "menstrual cycle",
      "ovulation estimate",
      "pregnancy test timing",
    ],
    sections: [
      {
        heading: "How the estimate works",
        paragraphs: [
          "Most probable ovulation is estimated as LMP + (cycle length − 14). The ovulation window spans about two days before and after that peak. The intercourse / fertile window typically runs from five days before ovulation through the day after.",
          "We also estimate next period (LMP + cycle length), a pregnancy-test day around ovulation + 10 days, and a due date if pregnant (LMP + 280 days).",
        ],
      },
      {
        heading: "Multi-cycle view",
        paragraphs: [
          "The calculator projects the next six cycles assuming a steady average cycle length. Use it for planning conversations, not as contraception.",
        ],
      },
      {
        heading: "Who it helps",
        paragraphs: [
          "People with relatively regular cycles who want an educational estimate for timing. It is not a contraceptive method and is not a fertility diagnosis.",
        ],
      },
      {
        heading: "Limits",
        paragraphs: [
          "Stress, illness, PCOS, postpartum changes, and irregular cycles reduce accuracy. Seek clinical care for fertility concerns or pregnancy planning support.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
