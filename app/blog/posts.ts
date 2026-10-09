import { getPostCard, type PostCard } from "./post-cards";

export type BlogPost = PostCard & {
  description: string;
  /** Short title for the <title> tag (the brand suffix is added by the layout). */
  metaTitle: string;
  /** Same-cluster guides first; drives the related guides block. */
  relatedSlugs: string[];
  publishedAt: string;
  keywords: string[];
  takeaways: string[];
  /** Paragraphs and answers may contain inline links written as [anchor text](/path). */
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
};

export const blogPosts: BlogPost[] = [
  {
    ...getPostCard("bmi"),
    metaTitle: "What Is BMI? Formula and Limits",
    description:
      "Guide to Body Mass Index (BMI): the formula, adult categories, healthy weight ranges, the limits of BMI, and how to use our free BMI calculator.",
    relatedSlugs: ["body-fat", "tdee", "macro"],
    publishedAt: "2026-01-15",
    takeaways: [
      "BMI is weight in kilograms divided by height in meters squared, or 703 × pounds ÷ inches squared.",
      "Adult categories are the same for men and women: under 18.5, 18.5 to 24.9, 25 to 29.9, and 30 or more.",
      "BMI cannot tell muscle from fat, so pair it with waist size or a body fat estimate.",
      "Children, teens, and pregnant people need different tools and professional guidance.",
    ],
    faqs: [
      {
        question: "What is a healthy BMI for adults?",
        answer:
          "For most adults, a BMI from 18.5 to 24.9 is considered a healthy range. At 1.75 m tall, that is roughly 57 to 76 kg (125 to 168 lb). Where you sit within that range depends on muscle, fitness, and medical history.",
      },
      {
        question: "Why is my BMI high when I exercise a lot?",
        answer:
          "Muscle is dense, so people who lift weights or play power sports can weigh more than the BMI chart expects for their height. A waist measurement or the [Body Fat Percentage Calculator](/body-fat-percentage-calculator) shows whether the extra weight is mostly lean tissue.",
      },
      {
        question: "How often should I check my BMI?",
        answer:
          "Once a month is plenty for most adults. Daily weight swings of 1 to 2 kg from water and food are normal, so look at the trend over several weeks rather than any single number.",
      },
      {
        question: "Does BMI change with age?",
        answer:
          "The adult cut-offs stay the same from age 20 onward, but body composition changes as people age. Older adults tend to lose muscle, so the same BMI can hide more body fat. Discuss your target range with a clinician if you are over 65.",
      },
    ],
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
          "Our [free BMI calculator](/bmi-calculator) converts your height from centimeters, shows your category, and estimates a healthy weight range for your height (BMI 18.5 to 24.9).",
        ],
      },
      {
        heading: "Who this tool helps",
        paragraphs: [
          "Adults who want a quick baseline before [working out daily calorie needs](/tdee-calculator) or setting activity goals. It is especially useful when you need a shared reference with a coach or clinician.",
          "BMI is less reliable for athletes with high muscle mass, pregnant people, older adults with changing body composition, and children (who need age specific charts). If you carry a lot of muscle, [estimating body fat percentage](/blog/body-fat) gives better context.",
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
    ...getPostCard("tdee"),
    metaTitle: "TDEE and BMR Explained Simply",
    description:
      "Learn BMR and TDEE using Mifflin–St Jeor or Katch–McArdle, activity multipliers, macros, ideal weight, BMI, and muscular potential estimates.",
    relatedSlugs: ["macro", "bmi", "body-fat"],
    publishedAt: "2026-02-02",
    takeaways: [
      "BMR is the energy you burn at rest; TDEE adds everyday movement and exercise on top.",
      "Mifflin–St Jeor is the default equation. Katch–McArdle is used when you know your body fat percentage.",
      "Activity multipliers range from 1.2 for sedentary to 1.9 for athletes who train twice a day.",
      "Treat the result as a starting estimate and adjust it after two to three weeks of tracking.",
    ],
    faqs: [
      {
        question: "How many calories should I eat to lose weight?",
        answer:
          "Start about 300 to 500 calories below your maintenance TDEE. For someone who maintains on 2,400 calories, that means roughly 1,900 to 2,100 a day, which usually leads to steady loss without extreme hunger.",
      },
      {
        question: "Why does my weight not match the TDEE estimate?",
        answer:
          "Equations predict averages, and real needs can differ by 10% or more. Water shifts, food tracking errors, and changes in daily steps also play a part. Compare your average weight over two to three weeks and adjust calories by 100 to 200 at a time.",
      },
      {
        question: "Should I eat back the calories burned in workouts?",
        answer:
          "Not separately. The activity level you choose already includes your usual training, so adding exercise calories again would count them twice.",
      },
      {
        question: "Does metabolism slow down when dieting?",
        answer:
          "Somewhat. As you lose weight you need fewer calories to move a smaller body, and everyday movement often drops too. This is why progress can slow after a few months and why recalculating after every 5 kg (10 lb) change helps.",
      },
    ],
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
          "This is often more accurate for people who know their body composition, and you can [measure body fat with a tape](/body-fat-percentage-calculator) in a few minutes. We also show Revised Harris–Benedict as a secondary reference.",
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
          "Use maintenance TDEE from the [TDEE calculator](/tdee-calculator) as your baseline. A modest deficit or surplus is usually more sustainable than aggressive cuts. Recalculate when weight, age, or activity changes meaningfully.",
          "Once you know your calorie target, the [macro calculator](/macro-calculator) turns it into daily protein, carb, and fat grams.",
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
    ...getPostCard("body-fat"),
    metaTitle: "U.S. Navy Body Fat Method Guide",
    description:
      "Guide to estimating body fat percentage with the official U.S. Navy / DoD circumference formulas, measurement tips, and how our body fat calculator works.",
    relatedSlugs: ["bmi", "tdee", "macro"],
    publishedAt: "2026-02-20",
    takeaways: [
      "The U.S. Navy method estimates body fat from height, neck, and waist, plus hips for women.",
      "It is usually within a few percentage points of lab methods when measurements are consistent.",
      "Measure at the same time of day with a flexible tape held level and snug, not tight.",
      "Track the trend every few weeks instead of reacting to a single reading.",
    ],
    faqs: [
      {
        question: "What is a healthy body fat percentage?",
        answer:
          "For most adults, roughly 14 to 24% for men and 21 to 31% for women falls in the fitness to average range. Athletes are often lower, and going below essential fat levels (about 2 to 5% for men and 10 to 13% for women) is not healthy.",
      },
      {
        question: "Is the Navy method better than a smart scale?",
        answer:
          "Both are estimates. Bioimpedance scales can swing several points with hydration, while tape measurements depend on technique. Picking one method and using it consistently matters more than which method you choose.",
      },
      {
        question: "Why did my body fat go up when I lost weight?",
        answer:
          "Small changes in tape placement or bloating can outweigh real fat loss in the short term. Take three measurements, use the average, and compare results over a month or more.",
      },
      {
        question: "How often should I measure body fat?",
        answer:
          "Every two to four weeks is enough for most people. Body fat changes slowly, so measuring more often mostly picks up noise from water, meals, and tape placement.",
      },
    ],
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
          "Scale weight and [what BMI really measures](/blog/bmi) do not show how much of your mass is fat versus lean tissue. Body fat estimates help explain progress when the scale is slow to move.",
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
          "Enter your measurements in the [Body Fat Percentage Calculator](/body-fat-percentage-calculator) to see fat mass, lean mass, and your category.",
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
    ...getPostCard("macro"),
    metaTitle: "How to Set Your Macros for a Goal",
    description:
      "How our macro calculator builds daily calories from BMR and activity, adjusts them for your goal, and splits protein, carbs, and fat into practical ratios.",
    relatedSlugs: ["tdee", "body-fat", "bmi"],
    publishedAt: "2026-03-08",
    takeaways: [
      "Protein and carbs provide about 4 calories per gram, and fat provides about 9.",
      "Your calorie target comes first; the macro split decides how those calories are divided.",
      "Higher protein splits help many people stay full and hold on to muscle while dieting.",
      "Aim to land within 5 to 10 grams of each target on most days rather than hitting them exactly.",
    ],
    faqs: [
      {
        question: "How much protein do I need per day?",
        answer:
          "Active adults often aim for about 1.6 to 2.2 g of protein per kg of body weight. For a 70 kg person, that is roughly 110 to 155 g a day, spread across three or four meals.",
      },
      {
        question: "Are low carb diets better for fat loss?",
        answer:
          "Not when calories and protein are equal. Studies comparing low carb and higher carb diets find similar fat loss over time, so choose the split that fits your food preferences and training.",
      },
      {
        question: "How do I turn macro targets into meals?",
        answer:
          "Build each meal around a protein source, add carbs around training, and fill the rest with vegetables and healthy fats. Using a food tracking app for a couple of weeks helps you learn portion sizes.",
      },
      {
        question: "Should macros change on rest days?",
        answer:
          "They can, but they do not have to. Some people eat more carbs on training days and fewer on rest days while keeping weekly calories the same. Consistency across the week matters more than the daily pattern.",
      },
    ],
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
          "Use the [TDEE calculator](/tdee-calculator) if you only need maintenance calories, or the [macro calculator](/macro-calculator) when you want calories and grams together. Adjust from real-world hunger, performance, and weekly averages.",
          "If you want more accurate calories, [estimate your body fat percentage](/blog/body-fat) first so the planner can use Katch–McArdle.",
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
    ...getPostCard("pregnancy"),
    metaTitle: "How Due Dates Are Calculated",
    description:
      "How pregnancy due dates are estimated (LMP + 280 days, conception + 266 days, ultrasound and IVF adjustments), trimester ranges, and past-due messaging.",
    relatedSlugs: ["ovulation", "bmi", "tdee"],
    publishedAt: "2026-03-22",
    takeaways: [
      "The standard due date is the first day of your last period plus 280 days, or 40 weeks.",
      "From a known conception date, the estimate is conception plus 266 days.",
      "Early ultrasound dating is usually the most accurate, and providers may update your date after a scan.",
      "Most babies are born within two weeks either side of the due date, not on the day itself.",
    ],
    faqs: [
      {
        question: "How many weeks pregnant am I?",
        answer:
          "Gestational age is counted from the first day of your last period, not from conception. Two weeks after conception you are already considered about four weeks pregnant. The [Pregnancy Due Date Calculator](/pregnancy-due-date-calculator) shows your current week and trimester.",
      },
      {
        question: "Which is more accurate, LMP or ultrasound dating?",
        answer:
          "A first trimester ultrasound is generally more accurate than a date based on your last period, especially if your cycles are irregular or you are unsure when your period started. Your provider will decide which date to use.",
      },
      {
        question: "What happens if I go past my due date?",
        answer:
          "Going a few days past the estimate is common, particularly in a first pregnancy. Your care team will usually offer extra monitoring and discuss options if the pregnancy continues well beyond 40 weeks.",
      },
      {
        question: "Why is my due date different from my ultrasound date?",
        answer:
          "If an early scan measures the baby as larger or smaller than expected from your last period, your provider may move the due date. In the first trimester, a difference of more than about 5 to 7 days, depending on how early the scan is, usually leads to a change.",
      },
    ],
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
          "People planning or tracking a pregnancy who want a clear educational estimate from the [Pregnancy Due Date Calculator](/pregnancy-due-date-calculator). Always confirm dating with prenatal care providers and ultrasound when available.",
          "Still trying to conceive? The [ovulation calculator](/ovulation-calculator) estimates your fertile window and next six cycles.",
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
    ...getPostCard("ovulation"),
    metaTitle: "Ovulation Guide: Fertile Window",
    description:
      "How ovulation and fertile window estimates work from your cycle length and last period, including six-cycle projections in our free ovulation calculator.",
    relatedSlugs: ["pregnancy", "bmi", "tdee"],
    publishedAt: "2026-04-05",
    takeaways: [
      "Ovulation usually happens about 14 days before your next period, which is not always cycle day 14.",
      "The fertile window covers the five days before ovulation, the day of ovulation, and the day after.",
      "Home pregnancy tests are most reliable from the day your period is due.",
      "Calendar estimates work best for regular cycles and are not a form of contraception.",
    ],
    faqs: [
      {
        question: "Can I get pregnant outside the fertile window?",
        answer:
          "It is unlikely but possible, because ovulation can arrive earlier or later than a calendar predicts. Sperm can survive up to five days, so an early ovulation can overlap with intercourse from several days before.",
      },
      {
        question: "What signs show that ovulation is near?",
        answer:
          "Common signs include clear, stretchy cervical mucus, a positive ovulation test (an LH surge), and a small rise in basal body temperature after ovulation. Combining these with the calendar estimate gives better timing.",
      },
      {
        question: "How long should we try before seeing a doctor?",
        answer:
          "Many clinicians suggest seeking advice after 12 months of trying if you are under 35, or after 6 months if you are 35 or older. See a doctor sooner if your cycles are very irregular or you have known health concerns.",
      },
      {
        question: "Do ovulation tests work with irregular cycles?",
        answer:
          "Yes, and they are often more useful than a calendar when cycles vary. Start testing a few days before the earliest likely ovulation and test daily until you get a positive result. Conditions such as PCOS can cause misleading results, so talk to a clinician if tests are hard to read.",
      },
    ],
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
          "We also estimate next period (LMP + cycle length), a pregnancy-test day around ovulation + 10 days, and a due date if pregnant (LMP + 280 days). Our [pregnancy due date guide](/blog/pregnancy) explains that dating in more detail.",
        ],
      },
      {
        heading: "Multi-cycle view",
        paragraphs: [
          "The [ovulation calculator](/ovulation-calculator) projects the next six cycles assuming a steady average cycle length. Use it for planning conversations, not as contraception.",
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
