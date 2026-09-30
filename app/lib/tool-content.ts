import type { ToolId } from "./tool-nav";

export type ToolFaq = { question: string; answer: string };

export type ToolContent = {
  intro: string;
  howToSteps: string[];
  interpretation: { title: string; text: string }[];
  faqs: ToolFaq[];
  formula: { lines: string[]; note: string };
  example: string[];
  limits: string[];
};

export const toolContent: Record<ToolId, ToolContent> = {
  bmi: {
    intro:
      "Body mass index (BMI) compares your weight with your height to give a quick screening number. Enter your details below to see your BMI, the adult WHO category it falls in, and the weight range that corresponds to a healthy BMI for your height.",
    howToSteps: [
      "Choose metric, imperial, or other units at the top of the calculator.",
      "Enter your age, gender, height, and current weight.",
      "Press Calculate to see your BMI, category, and healthy weight range.",
      "Use the result as a starting point and compare it with waist size, fitness, and medical advice.",
    ],
    interpretation: [
      { title: "Below 18.5", text: "Underweight. It may point to low energy intake or an underlying condition worth discussing with a clinician." },
      { title: "18.5 to 24.9", text: "Healthy weight range for most adults. Keep an eye on activity, sleep, and nutrition quality as well." },
      { title: "25.0 to 29.9", text: "Overweight. Risk depends on waist size, fitness, and family history, not BMI alone." },
      { title: "30 and above", text: "Obesity range. A clinician can help you look at the full picture and set realistic goals." },
    ],
    faqs: [
      {
        question: "How is BMI calculated?",
        answer: "BMI is weight in kilograms divided by height in meters squared. In imperial units, it is 703 multiplied by weight in pounds divided by height in inches squared.",
      },
      {
        question: "Is BMI accurate for athletes?",
        answer: "Not always. BMI cannot tell muscle from fat, so muscular people can show a high BMI with low body fat. A body fat estimate gives better context.",
      },
      {
        question: "Is the BMI result different for men and women?",
        answer: "The adult WHO cut-offs are the same for men and women. Body composition differs, which is why BMI works best alongside other measurements.",
      },
      {
        question: "Can children use this BMI calculator?",
        answer: "No. Children and teens need age and sex specific BMI percentile charts, so this tool is designed for adults aged 20 and over.",
      },
    ],
    formula: {
      lines: ["BMI = weight (kg) ÷ height (m)²", "BMI = 703 × weight (lb) ÷ height (in)²"],
      note: "Both versions give the same number. The healthy weight range is found by working the formula backwards with BMI values of 18.5 and 24.9 for your height.",
    },
    example: [
      "Take an adult who is 1.75 m tall and weighs 70 kg. Height squared is 1.75 × 1.75 = 3.06, and 70 ÷ 3.06 gives a BMI of about 22.9, which sits in the healthy range.",
      "For the same height, a BMI of 18.5 matches about 56.7 kg and a BMI of 24.9 matches about 76.3 kg, so the healthy weight range is roughly 57 to 76 kg (125 to 168 lb).",
    ],
    limits: [
      "It does not separate muscle, fat, bone, and water, so strength athletes can read as overweight.",
      "It does not show where fat is stored. Waist size adds useful context about health risk.",
      "WHO suggests lower action points for some Asian populations, around 23 and 27.5.",
      "It is not designed for pregnancy, children and teens, or adults with major muscle loss.",
    ],
  },
  "body-fat": {
    intro:
      "Body fat percentage shows how much of your weight is fat rather than muscle, bone, and water. This calculator uses the U.S. Navy circumference equations, so all you need is a tape measure and a few minutes.",
    howToSteps: [
      "Pick imperial, metric, or other units and select your gender.",
      "Measure your neck and waist (and hips for women) with a flexible tape, keeping it level.",
      "Enter your height, weight, and measurements, then press Calculate.",
      "Repeat under the same conditions every few weeks to track the trend.",
    ],
    interpretation: [
      { title: "Essential fat", text: "About 2 to 5% for men and 10 to 13% for women. Going lower is not considered healthy." },
      { title: "Athletes", text: "About 6 to 13% for men and 14 to 20% for women, typical of people in regular hard training." },
      { title: "Fitness and average", text: "About 14 to 24% for men and 21 to 31% for women covers most healthy, active adults." },
      { title: "Obese range", text: "25% and above for men or 32% and above for women. Worth discussing with a clinician." },
    ],
    faqs: [
      {
        question: "How accurate is the U.S. Navy body fat method?",
        answer: "It is usually within a few percentage points of lab methods for most people. Consistent measuring technique matters more than a single reading.",
      },
      {
        question: "Where should I measure my waist?",
        answer: "Men usually measure at the navel. Women measure at the narrowest point of the waist. Stand relaxed and do not pull the tape tight.",
      },
      {
        question: "Why do women need a hip measurement?",
        answer: "Women tend to store more fat around the hips, so the Navy equation for women adds hip circumference for a better estimate.",
      },
      {
        question: "Should I use body fat or BMI?",
        answer: "Use both. BMI is a quick screen, while body fat percentage explains whether your weight is mostly muscle or fat.",
      },
    ],
    formula: {
      lines: [
        "Men: 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76",
        "Women: 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387",
      ],
      note: "All measurements are in inches; metric entries are converted first. Fat mass is body weight × body fat %, and lean mass is everything else.",
    },
    example: [
      "A man who is 70 in (178 cm) tall with a 15 in neck and a 34 in waist has a waist minus neck of 19 in. The equation gives about 17.5% body fat, inside the fitness to average range.",
      "If he weighs 180 lb (82 kg), that is about 31.5 lb of fat mass and 148.5 lb of lean mass. Tracking lean mass helps show whether weight loss is coming from fat or muscle.",
      "A woman who is 65 in (165 cm) tall with a 13 in neck, a 30 in waist, and 38 in hips has a waist plus hip minus neck of 55 in. The women's equation gives about 28.6% body fat, also in the fitness to average range.",
    ],
    limits: [
      "Small tape errors matter. Half an inch on the waist can move the result by one or two points.",
      "It estimates total body fat and cannot separate fat under the skin from fat around organs.",
      "Results can be less reliable for very lean, very muscular, or very large bodies.",
      "Hydration, meals, and time of day change waist size, so measure under the same conditions.",
    ],
  },
  tdee: {
    intro:
      "Total daily energy expenditure (TDEE) is the number of calories you burn in a day, including exercise and everyday movement. This calculator estimates your BMR first, then applies an activity multiplier to find your maintenance calories.",
    howToSteps: [
      "Choose metric or imperial units and enter your gender and age.",
      "Add your weight and height, then pick the activity level that matches a typical week.",
      "Optionally enter body fat percentage to switch to the Katch-McArdle formula.",
      "Press Calculate and use maintenance calories as your baseline for cutting or bulking.",
    ],
    interpretation: [
      { title: "BMR", text: "Calories your body needs at complete rest. It is the base that every activity level builds on." },
      { title: "Maintenance (TDEE)", text: "Calories to keep your weight stable. Track your weight for two to three weeks to fine tune it." },
      { title: "Cutting", text: "A deficit of about 300 to 500 calories below maintenance supports steady, sustainable fat loss." },
      { title: "Bulking", text: "A surplus of about 250 to 500 calories supports muscle gain while limiting fat gain." },
    ],
    faqs: [
      {
        question: "What is the difference between BMR and TDEE?",
        answer: "BMR is the energy you use at rest. TDEE multiplies BMR by an activity factor to include exercise, work, and daily movement.",
      },
      {
        question: "Which formula does the TDEE calculator use?",
        answer: "It uses Mifflin-St Jeor by default. If you enter body fat percentage, it switches to Katch-McArdle, which uses lean body mass.",
      },
      {
        question: "Which activity level should I pick?",
        answer: "Choose based on an average week, not your best week. Most people with desk jobs and a few workouts fit lightly or moderately active.",
      },
      {
        question: "How often should I recalculate my TDEE?",
        answer: "Recalculate after a weight change of about 5 kg (10 lb) or when your activity level changes for more than a few weeks.",
      },
    ],
    formula: {
      lines: [
        "Men: BMR = 10 × kg + 6.25 × cm − 5 × age + 5",
        "Women: BMR = 10 × kg + 6.25 × cm − 5 × age − 161",
        "Katch-McArdle: BMR = 370 + 21.6 × lean mass (kg)",
        "TDEE = BMR × activity factor (1.2 to 1.9)",
      ],
      note: "The activity factors are 1.2 for sedentary, 1.375 for light exercise, 1.55 for moderate, 1.725 for heavy, and 1.9 for athletes training twice a day.",
    },
    example: [
      "A 30 year old woman who weighs 65 kg and is 165 cm tall has a Mifflin-St Jeor BMR of about 1,370 calories. With moderate exercise, 1,370 × 1.55 gives a TDEE of about 2,124 calories a day.",
      "To lose fat steadily she might eat about 1,700 to 1,800 calories, then adjust after two to three weeks based on her weight trend rather than the number alone.",
    ],
    limits: [
      "Formulas predict averages. Real needs can differ by 10% or more from person to person.",
      "Activity levels are broad. Step count and job type can matter as much as workouts.",
      "Metabolism adapts during long diets, so maintenance may drift lower over time.",
      "It is not designed for pregnancy, breastfeeding, or medical conditions that change energy needs.",
    ],
  },
  macro: {
    intro:
      "Macronutrients are the protein, carbohydrates, and fat that supply your calories. This macro calculator estimates your daily calories for a chosen goal, then splits them into gram targets you can use for meal planning.",
    howToSteps: [
      "Enter your gender, age, height, weight, and activity level.",
      "Pick a goal, from extreme weight loss to weight gain.",
      "Choose a macro split such as balanced, low carb, high carb, or high protein.",
      "Press Calculate to see calories and grams of each macro per day.",
    ],
    interpretation: [
      { title: "Protein", text: "Supports muscle repair and fullness. Active adults often aim for about 1.6 to 2.2 g per kg of body weight." },
      { title: "Carbohydrates", text: "The main fuel for training. Higher carb splits suit endurance and high volume training." },
      { title: "Fat", text: "Needed for hormones and vitamin absorption. Most plans keep fat at 20 to 35% of calories." },
      { title: "Adjusting", text: "Follow the plan for two to three weeks, then adjust calories based on your weight trend and energy." },
    ],
    faqs: [
      {
        question: "What is the best macro ratio for weight loss?",
        answer: "There is no single best ratio. Hitting your calorie target matters most, and a higher protein split helps many people stay full and keep muscle.",
      },
      {
        question: "How many calories are in each macro?",
        answer: "Protein and carbohydrates provide about 4 calories per gram. Fat provides about 9 calories per gram.",
      },
      {
        question: "Is the macro calculator the same as the TDEE calculator?",
        answer: "They share the same calorie formulas. The TDEE calculator focuses on energy needs, while the macro calculator turns a goal into gram targets.",
      },
      {
        question: "Do I have to hit my macros exactly?",
        answer: "No. Staying within about 5 to 10 grams of each target on most days is plenty for steady progress.",
      },
    ],
    formula: {
      lines: [
        "Daily calories = TDEE + goal adjustment",
        "Protein (g) = calories × protein % ÷ 4",
        "Carbs (g) = calories × carb % ÷ 4",
        "Fat (g) = calories × fat % ÷ 9",
      ],
      note: "Goal adjustments range from −1,000 calories for extreme weight loss to +500 calories for weight gain. The presets are Balanced 40/30/30, Low carb 20/40/40, High carb 50/25/25, and High protein 30/40/30 (carbs/protein/fat).",
    },
    example: [
      "A 25 year old man who weighs 70 kg, is 175 cm tall, and exercises three to five days a week has a TDEE of about 2,594 calories. The weight loss goal subtracts 500, leaving about 2,094 calories.",
      "With the Balanced split, that works out to about 209 g of carbs, 157 g of protein, and 70 g of fat per day. Protein lands near 2.2 g per kg, which helps keep muscle while dieting.",
    ],
    limits: [
      "Macro targets rest on a calorie estimate, so check your weight trend before changing ratios.",
      "Food labels and tracking apps have errors, so aim for consistency rather than perfection.",
      "The presets do not cover medical diets such as those for diabetes or kidney disease.",
      "Fiber, vitamins, and minerals are not shown, so food quality still matters.",
    ],
  },
  pregnancy: {
    intro:
      "Your estimated due date is the day you reach 40 weeks of pregnancy. This calculator works it out from your last menstrual period, conception date, an ultrasound scan, or an IVF transfer, and shows how far along you are today.",
    howToSteps: [
      "Choose how you want to date the pregnancy: last period, conception, ultrasound, or IVF.",
      "Pick the matching date from the calendar and add any extra details the method asks for.",
      "Press Calculate to see your due date, gestational age, and current trimester.",
      "Confirm the result with your prenatal care provider, especially after an early ultrasound.",
    ],
    interpretation: [
      { title: "First trimester", text: "Week 1 to the end of week 13. Early scans are the most accurate way to confirm dating." },
      { title: "Second trimester", text: "Week 14 to the end of week 27. The anatomy scan usually happens around week 20." },
      { title: "Third trimester", text: "Week 28 until birth. Full term starts at 39 weeks." },
      { title: "Due date", text: "Only a small share of babies arrive on the exact date. Most are born within two weeks either side." },
    ],
    faqs: [
      {
        question: "How is a due date calculated?",
        answer: "The standard method adds 280 days (40 weeks) to the first day of your last menstrual period. From a known conception date, it adds 266 days.",
      },
      {
        question: "What if my cycle is irregular?",
        answer: "A date based on your last period may be less accurate. An early ultrasound gives a more reliable estimate, so use the ultrasound option if you have one.",
      },
      {
        question: "How are IVF due dates calculated?",
        answer: "The calculator adds 263 days to a day 3 embryo transfer date or 261 days to a day 5 transfer date.",
      },
      {
        question: "Can my due date change?",
        answer: "Yes. Your provider may adjust it after an ultrasound if the measured size differs from the date based on your last period.",
      },
    ],
    formula: {
      lines: [
        "Last period: due date = LMP + 280 days",
        "Conception: due date = conception + 266 days",
        "Ultrasound: due date = scan date + (280 − age at scan in days)",
        "IVF: transfer + 263 days (day 3) or + 261 days (day 5)",
      ],
      note: "Gestational age is counted from the first day of the last period, so you are already about two weeks pregnant on the day of conception.",
    },
    example: [
      "If your last period started on January 1, 2026, adding 280 days gives an estimated due date of October 8, 2026.",
      "A conception date of January 15 or a day 5 IVF transfer on January 20 points to the same October 8 due date, because each method lines up with the same 40 week timeline.",
    ],
    limits: [
      "Dates based on the last period assume ovulation on about day 14, which is not true for every cycle.",
      "An early ultrasound is usually more accurate, and your provider may update your date after it.",
      "The due date is an estimate. Only a small share of babies are born on that exact day.",
      "This tool cannot check how a pregnancy is progressing. Regular prenatal care does that.",
    ],
  },
  ovulation: {
    intro:
      "Ovulation usually happens about 14 days before your next period. Enter the first day of your last period and your average cycle length to estimate your most fertile days and see dates for the next six cycles.",
    howToSteps: [
      "Select the first day of your last menstrual period.",
      "Enter your average cycle length, usually between 21 and 35 days.",
      "Press Calculate to see your ovulation day, fertile window, and next period.",
      "Switch tabs to view upcoming cycles and plan ahead.",
    ],
    interpretation: [
      { title: "Fertile window", text: "About five days before ovulation through the day after. These are the days pregnancy is most likely." },
      { title: "Ovulation day", text: "Estimated as your cycle length minus 14 days from the start of your last period." },
      { title: "Pregnancy test", text: "The suggested test date is about 10 days after ovulation. Home tests are most reliable from the day your period is due." },
      { title: "Irregular cycles", text: "If your cycle varies a lot, ovulation tests or tracking temperature give better timing than a calendar estimate." },
    ],
    faqs: [
      {
        question: "How accurate is an ovulation calculator?",
        answer: "It works best for regular cycles. Ovulation can shift from month to month, so combine it with ovulation tests or body signs for better timing.",
      },
      {
        question: "What is the fertile window?",
        answer: "It is the roughly six days when pregnancy is possible: the five days before ovulation and the day of ovulation, since sperm can survive up to five days.",
      },
      {
        question: "Can I use this calculator as birth control?",
        answer: "No. Calendar estimates are not reliable enough to prevent pregnancy. Speak to a healthcare provider about contraception options.",
      },
      {
        question: "What if my cycle is shorter or longer than 28 days?",
        answer: "Enter your own average cycle length. The calculator moves your ovulation day and fertile window to match it.",
      },
    ],
    formula: {
      lines: [
        "Ovulation day = period start + (cycle length − 14) days",
        "Fertile window = ovulation − 5 days to ovulation + 1 day",
        "Pregnancy test ≈ ovulation + 10 days",
        "Next period = period start + cycle length",
      ],
      note: "The 14 day figure is the typical length of the luteal phase, the time between ovulation and your next period. It stays fairly steady while the first half of the cycle varies.",
    },
    example: [
      "If your period started on March 1 and your cycles last 30 days, estimated ovulation is March 17 and the fertile window runs from March 12 to March 18.",
      "Your next period would be due on March 31, and a home pregnancy test is suggested from about March 27, with the most reliable result from the day your period is due.",
    ],
    limits: [
      "Calendar estimates assume a steady luteal phase, but it can range from about 10 to 16 days.",
      "Stress, illness, travel, and breastfeeding can delay ovulation in any cycle.",
      "Conditions such as PCOS make cycles less predictable, so test strips give better timing.",
      "It is not a form of contraception and cannot confirm that ovulation happened.",
    ],
  },
};
