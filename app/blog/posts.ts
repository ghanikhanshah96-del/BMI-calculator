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
    title: "TDEE & BMR Explained: Daily Calories with Mifflin St Jeor",
    excerpt:
      "Understand basal metabolic rate (BMR), total daily energy expenditure (TDEE), and how our calculator uses the official Mifflin St Jeor equation.",
    description:
      "Learn BMR and TDEE using the Mifflin St Jeor formula, activity multipliers, and practical calorie targets for maintaining, losing, or gaining weight.",
    toolId: "tdee",
    toolLabel: "TDEE Calculator",
    toolHref: "/#tdee",
    publishedAt: "2026-02-02",
    updatedAt: "2026-09-25",
    image: "/blog/tdee.jpg",
    imageAlt: "Healthy meal prep bowls representing daily calorie planning",
    keywords: [
      "TDEE calculator",
      "BMR calculator",
      "Mifflin St Jeor",
      "daily calorie needs",
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
        heading: "Official Mifflin St Jeor formula",
        paragraphs: [
          "Men: BMR = 10 times weight(kg) + 6.25 times height(cm) minus 5 times age + 5. Women: BMR = 10 times weight(kg) + 6.25 times height(cm) minus 5 times age minus 161.",
          "Our TDEE tool uses these equations exactly, then applies standard activity multipliers (sedentary through athlete) to estimate maintenance calories and suggested ranges for fat loss or lean gain.",
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
    title: "Macro Planner: Protein, Carbs, and Fat Made Simple",
    excerpt:
      "Build a practical macro split from your calorie target and goal, fat loss, maintenance, or muscle gain, without overcomplicating meals.",
    description:
      "How to plan protein, carbohydrate, and fat macros from daily calories. Use the BMI Wellness Pro macro planner for fat loss, maintenance, or muscle gain goals.",
    toolId: "macro",
    toolLabel: "Macro Planner",
    toolHref: "/#macro",
    publishedAt: "2026-03-08",
    updatedAt: "2026-09-25",
    image: "/blog/macro.jpg",
    imageAlt: "Balanced plate with protein vegetables and whole grains",
    keywords: [
      "macro calculator",
      "protein carbs fat",
      "macro planner",
      "nutrition macros",
    ],
    sections: [
      {
        heading: "What macros are",
        paragraphs: [
          "Macronutrients, protein, carbohydrates, and fat, are the calorie providing nutrients in food. Planning them helps you hit a calorie target while supporting satiety, training, and recovery.",
          "Protein is prioritized first in our planner because it supports lean mass and fullness. Fat is set as a share of calories, and carbohydrates fill the remainder.",
        ],
      },
      {
        heading: "How our planner works",
        paragraphs: [
          "Enter body weight, daily calories, and a goal. Fat loss uses about 1.8 g protein/kg, muscle gain about 2.1 g/kg, and maintenance about 1.6 g/kg. About 28% of calories are allocated to fat; carbs make up the rest.",
          "These are practical starting points, not rigid medical prescriptions. Adjust based on hunger, performance, and preference.",
        ],
      },
      {
        heading: "Getting started",
        paragraphs: [
          "Pair this tool with the TDEE calculator to choose calories, then translate grams into familiar foods. Focus on weekly averages rather than perfect daily hits.",
        ],
      },
      {
        heading: "Limits",
        paragraphs: [
          "Individual needs vary with sport, medical conditions, and food access. People with kidney disease, diabetes, or eating disorder history should get personalized clinical guidance.",
        ],
      },
    ],
  },
  {
    slug: "pregnancy",
    title: "Pregnancy Due Date Calculator: Timeline and Trimesters",
    excerpt:
      "Estimate your due date from last menstrual period (LMP) or conception date, understand trimesters, and see what happens after the due date passes.",
    description:
      "How pregnancy due dates are estimated (LMP + 280 days or conception + 266 days), trimester ranges, and how our due date calculator handles past due timelines.",
    toolId: "pregnancy",
    toolLabel: "Due Date Calculator",
    toolHref: "/#pregnancy",
    publishedAt: "2026-03-22",
    updatedAt: "2026-09-25",
    image: "/blog/pregnancy.jpg",
    imageAlt: "Calendar and prenatal planning for pregnancy due date",
    keywords: [
      "due date calculator",
      "pregnancy timeline",
      "LMP due date",
      "trimesters",
    ],
    sections: [
      {
        heading: "How due dates are estimated",
        paragraphs: [
          "From last menstrual period (LMP), the common estimate is LMP + 280 days (40 weeks). From conception date, many tools use conception + 266 days (38 weeks).",
          "These are population averages. Only a minority of births occur exactly on the estimated due date.",
        ],
      },
      {
        heading: "Trimesters in our tool",
        paragraphs: [
          "While the pregnancy is ongoing, we map gestational weeks to Trimester 1 (under 14 weeks), Trimester 2 (under 28 weeks), and Trimester 3 thereafter, aligned with common clinical banding.",
          "If today is after the estimated due date, the calculator shows a past due status with days overdue instead of continuing to label the timeline as Trimester 3.",
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
    title: "Ovulation Calculator: Fertile Window Basics",
    excerpt:
      "Estimate ovulation day and a fertile window from cycle length and last period, useful for planning, with clear limits of calendar methods.",
    description:
      "Learn how ovulation and fertile window estimates work from cycle length and last menstrual period, and how to use the BMI Wellness Pro ovulation calculator.",
    toolId: "ovulation",
    toolLabel: "Ovulation Calculator",
    toolHref: "/#ovulation",
    publishedAt: "2026-04-05",
    updatedAt: "2026-09-25",
    image: "/blog/ovulation.jpg",
    imageAlt: "Calendar marking menstrual cycle and fertile window",
    keywords: [
      "ovulation calculator",
      "fertile window",
      "menstrual cycle",
      "ovulation estimate",
    ],
    sections: [
      {
        heading: "Calendar based ovulation estimates",
        paragraphs: [
          "Many simple tools estimate ovulation about 14 days before the next period. With a known cycle length and last period start date, you can project ovulation and a fertile window.",
          "Our calculator estimates ovulation as last period + (cycle length minus 14) days, then shows a fertile window starting several days before ovulation.",
        ],
      },
      {
        heading: "How to use the results",
        paragraphs: [
          "Treat the dates as a planning guide. Track a few cycles to see your personal pattern. Combine with cervical mucus or ovulation tests if you need higher confidence.",
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
