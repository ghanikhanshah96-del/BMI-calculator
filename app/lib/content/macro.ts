import { cards, eq, faqSection, ol, p, section, sub, table, terms, ul, type ToolContent } from "./blocks";

export const macro: ToolContent = {
  intro: "Use our Macro Calculator to estimate your daily protein, carbs, fat and calorie needs for weight loss, maintenance or muscle gain.",
  lead: [
    p("Use our **Macro Calculator** to estimate how much protein, carbohydrate, and fat you may need each day based on your calorie needs and nutrition goal."),
    p("Instead of giving you only a daily calorie number, the calculator divides those calories among the three main energy-providing macronutrients. This can make meal planning easier if your goal is weight loss, weight maintenance, muscle gain, or simply understanding what your daily food intake looks like."),
    p("Your result is an **estimate**, not a prescription. Individual nutrition needs can vary because of health conditions, pregnancy, athletic training, medications, age, and other factors."),
  ],
  article: [
    section(
      "how-to",
      "How to Use the Macro Calculator",
      [
        p("Enter your details and select **Calculate**. The result is daily grams of protein, carbohydrate, and fat, which you can compare with a nutrition label. Being a few grams off on one day matters less than the pattern across the week."),
      ],
      { nav: "How to use" },
    ),
    section(
      "what-are-macros",
      "What Are Macros?",
      [
        p("“Macros” is short for **macronutrients**: protein, carbohydrates, and fat, the three that contribute calories and can be converted between calories and grams."),
        cards(
          sub(
            "Protein",
            p("Protein provides amino acids that the body uses to build and maintain tissues and produce many important compounds."),
            ul("Meat and poultry", "Fish and seafood", "Eggs", "Milk, yogurt, and other dairy foods", "Beans and lentils", "Soy foods", "Nuts and seeds"),
            p("Protein provides approximately **4 calories per gram**."),
          ),
          sub(
            "Carbohydrates",
            p("Carbohydrates are an important energy source and are found in foods ranging from whole grains and fruit to vegetables, beans, milk, and sweets."),
            p("Not all carbohydrate-containing foods have the same nutritional value. A food's fiber, vitamins, minerals, added sugar, and overall level of processing also matter."),
            p("Carbohydrates provide approximately **4 calories per gram**."),
          ),
          sub(
            "Fat",
            p("Dietary fat provides energy and helps with several physiological functions, including the absorption of fat-soluble vitamins."),
            ul("Nuts and seeds", "Avocados", "Oils", "Fish", "Dairy products", "Meat", "Eggs"),
            p("Fat contains approximately **9 calories per gram**, making it more energy-dense than either carbohydrate or protein."),
          ),
        ),
      ],
      { nav: "What are macros" },
    ),
    section(
      "calories-per-gram",
      "How Many Calories Are in Protein, Carbs, and Fat?",
      [
        p("The basic calorie values used in macro calculations are:"),
        table(["Macronutrient", "Calories per gram"], ["Protein", "4 kcal"], ["Carbohydrate", "4 kcal"], ["Fat", "9 kcal"]),
        p("These values explain how a calorie target can be converted into grams of macros."),
        p("For example:"),
        ul("150 g protein × 4 = **600 calories**", "200 g carbohydrates × 4 = **800 calories**", "70 g fat × 9 = **630 calories**"),
        p("Total:"),
        eq("600 + 800 + 630 = 2,030 calories"),
        p("This relationship is the foundation of most calorie-and-macro calculations."),
      ],
      { nav: "Calories per gram", tone: "brand" },
    ),
    section(
      "how-it-works",
      "How Does a Macro Calculator Work?",
      [
        p("The calculator first estimates calories from your body size and activity, then splits those calories into protein, carbohydrate, and fat using the 4-4-9 values above. Two calculators can still disagree slightly on the same inputs."),
      ],
      { nav: "How it works" },
    ),
    section(
      "macro-ratio",
      "What Is a Good Macro Ratio?",
      [
        p("There is no single protein, carbohydrate, and fat ratio that is best for every person."),
        p("The Dietary Reference Intakes established by the National Academies provide **Acceptable Macronutrient Distribution Ranges (AMDRs)** for healthy adults."),
        p("Traditional adult AMDR reference ranges are:"),
        table(["Macronutrient", "Percentage of Daily Energy"], ["Carbohydrates", "45–65%"], ["Protein", "10–35%"], ["Fat", "20–35%"]),
        p("An AMDR is a population range for meeting nutrient needs while considering chronic-disease risk. It is **not a rule that every person must follow at the same ratio**. Your split may depend on:"),
        ul("Total calorie requirement", "Training volume", "Food preferences", "Health status", "Age", "Body-composition goal", "Athletic demands"),
        p("The NIH also notes that individual nutrient requirements can be higher or lower than Dietary Reference Intake estimates."),
      ],
      { nav: "Macro ratio" },
    ),
    section(
      "weight-loss",
      "Macro Calculator for Weight Loss",
      [
        p("Weight loss generally needs a calorie intake below the energy you use. A **macro calculator for weight loss** only splits that target among protein, carbohydrates, and fat — the ratio does not replace the calorie deficit."),
        p("Federal dietary guidance found a wide range of macro splits can support weight loss when energy intake is lower and the pattern is sustainable. Plan for something you can keep doing:"),
        ul(
          "A realistic calorie target",
          "Enough protein to support your nutritional needs",
          "Adequate dietary fat",
          "Carbohydrate intake that fits your food preferences and activity",
          "Fiber-rich foods",
          "Vitamins and minerals",
          "A plan you can maintain consistently",
        ),
        p("A calculator can provide the numbers. Your food choices determine the overall quality of the diet."),
      ],
      { nav: "Weight loss", half: true },
    ),
    section(
      "muscle-gain",
      "Macro Calculator for Muscle Gain",
      [
        p("Building muscle involves more than increasing protein."),
        p("Resistance training provides the training stimulus, while adequate energy and nutrients support recovery and tissue development."),
        p("A **Macro Calculator for muscle gain** may therefore use a different calorie target from one designed for weight loss."),
        p("The result can help you plan:"),
        ul("Daily protein", "Carbohydrates to support training and overall energy intake", "Dietary fat", "Total calories"),
        p("Athletes and people performing high volumes of exercise may have nutritional needs that differ substantially from those of less active adults."),
        p("If performance is a major priority, a sports dietitian can provide more individualized recommendations than a general-purpose calculator."),
      ],
      { nav: "Muscle gain", half: true },
    ),
    section(
      "maintenance",
      "Macros for Weight Maintenance",
      [
        p("If your goal is to maintain your current weight, the calculator will generally aim for calorie intake around estimated energy needs rather than deliberately creating a calorie deficit or surplus."),
        p("You can then distribute those calories across your macros."),
        p("Maintenance can be useful when you want to:"),
        ul(
          "Maintain current body weight",
          "Support regular training",
          "Practice tracking food intake",
          "Transition out of a weight-loss phase",
          "Understand your usual eating pattern",
        ),
        p("Remember that estimated calorie needs are not exact. Your actual body-weight trend over time can provide useful feedback on whether your intake is close to maintenance."),
      ],
      { half: true },
    ),
    section(
      "hit-macros-exactly",
      "Do You Need to Hit Your Macros Exactly?",
      [
        p("Usually, no."),
        p("If your target is 150 grams of protein and you eat 147 grams one day, that difference is unlikely to be meaningful by itself."),
        p("Trying to hit every macro to the exact gram can make nutrition tracking unnecessarily difficult."),
        p("A more practical approach is to:"),
        ol(
          "Stay reasonably close to your calorie goal.",
          "Meet important nutrient needs.",
          "Prioritize nutrient-dense foods.",
          "Look at patterns across several days.",
          "Adjust based on progress and how sustainable the plan feels.",
        ),
        p("Macro targets should function as planning tools rather than rigid rules."),
      ],
      { half: true },
    ),
    section(
      "vs-calorie-calculator",
      "Macro Calculator vs. Calorie Calculator",
      [
        p("A **Calorie Calculator** estimates how much energy you may need each day."),
        p("A **Macro Calculator** takes the process one step further by showing how that energy can be divided among protein, carbohydrates, and fat."),
        p("For example:"),
        terms(
          ["Calorie Calculator result:", "2,200 calories per day"],
          ["Macro Calculator result:", "2,200 calories plus estimated grams of protein, carbs, and fat."],
        ),
        p("If you only want to estimate your energy needs, use our **Calorie Calculator**."),
        p("If you want to understand the individual nutrients that make up those calories, the Macro Calculator provides more detail."),
      ],
      { nav: "Comparisons", half: true },
    ),
    section(
      "vs-tdee-calculator",
      "Macro Calculator vs. TDEE Calculator",
      [
        p("A **TDEE Calculator** estimates Total Daily Energy Expenditure—the approximate number of calories your body uses in a day."),
        p("TDEE generally includes energy used for basic body functions as well as daily activity and exercise."),
        p("Your estimated TDEE can act as a starting point for deciding how many calories to consume."),
        p("A macro calculator can then distribute those calories among protein, carbohydrate, and fat."),
        p("In simple terms:"),
        eq("TDEE → estimated calorie needs"),
        eq("Macro Calculator → estimated calories + protein, carbs, and fat"),
        p("You can use our [TDEE Calculator](/tdee-calculator) if you want to explore your estimated daily energy expenditure separately."),
      ],
      { half: true },
    ),
    section("vs-protein-calculator", "Macro Calculator vs. Protein Calculator", [
      p("A **Protein Calculator** focuses specifically on protein intake."),
      p("A Macro Calculator estimates several dietary targets together:"),
      ul("Protein", "Carbohydrates", "Fat", "Usually total calories"),
      p("If protein is your main concern, a dedicated Protein Calculator can provide a simpler result."),
      p("If you are planning an entire daily eating pattern, macros provide a broader framework."),
    ]),
    section(
      "macros-into-meals",
      "How to Turn Your Macro Targets Into Meals",
      [
        p("A result such as “160 g protein, 230 g carbohydrates, and 70 g fat” may initially seem abstract."),
        p("You do not need to calculate the exact macro content of every ingredient mentally."),
        cards(
          sub("Step 1: Build Meals Around Protein", ul("Eggs", "Greek yogurt", "Chicken", "Fish", "Lean meat", "Beans", "Lentils", "Tofu")),
          sub("Step 2: Add Carbohydrate Sources", ul("Rice", "Potatoes", "Oats", "Bread", "Pasta", "Fruit", "Beans", "Whole grains")),
          sub("Step 3: Include Dietary Fat", ul("Olive oil", "Avocado", "Nuts", "Seeds", "Nut butter", "Fatty fish")),
          sub(
            "Step 4: Add Fruits and Vegetables",
            p("Macros should not crowd out fiber, vitamins, minerals, and other compounds a gram target does not capture."),
          ),
        ),
        p("A food-tracking app or nutrition database can help you compare your meals with your calculator results."),
        p("USDA FoodData Central is one official database that provides detailed nutrient information for foods."),
      ],
      { nav: "Meals", tone: "frame" },
    ),
    section(
      "needs-differ",
      "Why Your Real Macro Needs May Differ From the Calculator",
      [
        p("No calculator can perfectly predict an individual's nutrition requirements."),
        p("Estimates can differ from real needs because of:"),
        ul(
          "Differences in metabolism",
          "Changes in activity",
          "Training intensity",
          "Changes in body weight",
          "Muscle mass",
          "Pregnancy or breastfeeding",
          "Medical conditions",
          "Medications",
          "Errors in estimating food intake",
          "Differences between estimated and actual calorie expenditure",
        ),
        p("That is why the output should be treated as a **starting estimate**."),
        p("If your weight, energy levels, performance, or hunger change significantly over several weeks, your targets may need to be reassessed."),
      ],
      { nav: "Accuracy", half: true },
    ),
    section(
      "track-macros",
      "Do You Have to Track Macros to Eat Well?",
      [
        p("No."),
        p("Macro tracking is one way to organize food intake, not a requirement for a healthy diet."),
        p("Some people find tracking useful because it helps them understand:"),
        ul("Portion sizes", "Protein intake", "Calorie intake", "Food composition", "Eating patterns"),
        p("Others find it easier to use meal structure, portion guidance, hunger cues, or dietary patterns without tracking individual grams."),
        p("Choose an approach that is useful and sustainable rather than tracking numbers simply because a calculator provides them."),
      ],
      { half: true },
    ),
    faqSection("Macro Calculator FAQ"),
  ],
  faqs: [
    {
      question: "How do I calculate my macros?",
      answer:
        "Use the Macro Calculator above and enter the requested information, including your body measurements, activity level, and goal.\n\nThe calculator estimates your calorie requirements and converts a selected calorie distribution into grams of protein, carbohydrates, and fat.",
    },
    {
      question: "How many calories are in each macro?",
      answer:
        "Protein provides about 4 calories per gram, carbohydrates about 4 calories per gram, and fat about 9 calories per gram, according to USDA nutrition guidance.",
    },
    {
      question: "What should my macros be for weight loss?",
      answer:
        "There is no single macro ratio that guarantees weight loss.\n\nYour total energy intake, nutritional needs, dietary preferences, and ability to maintain the eating pattern all matter. A calculator can provide a useful starting estimate, which you can adjust based on your progress.",
    },
    {
      question: "What should my macros be for muscle gain?",
      answer:
        "Muscle-building nutrition generally needs to support resistance training, adequate protein intake, recovery, and sufficient total energy.\n\nBecause training levels and body composition vary greatly, there is no single macro ratio appropriate for everyone trying to gain muscle.",
    },
    {
      question: "Are macros more important than calories?",
      answer:
        "They describe different parts of the same diet.\n\nCalories measure energy. Macros tell you where much of that energy is coming from.\n\nFor example, two diets can contain the same total calories but very different amounts of protein, carbohydrate, and fat.\n\nBoth total energy and nutrient composition can therefore be useful depending on your goal.",
    },
    {
      question: "Is protein more important than carbs and fat?",
      answer:
        "Protein has important roles in the body, but carbohydrates and fats also have physiological and nutritional functions.\n\nA balanced nutrition plan should not treat one macronutrient as the only one that matters.",
    },
    {
      question: "Can I lose weight without tracking macros?",
      answer:
        "Yes.\n\nMacro tracking is not required for weight loss. People can manage calorie intake using many approaches, including portion control, structured meal plans, changes in food choices, or other sustainable eating strategies.",
    },
    {
      question: "Can I build muscle without counting macros?",
      answer:
        "Yes.\n\nTracking can make intake easier to quantify, but muscle growth does not require entering every food into an app.\n\nResistance training, adequate nutrition, sufficient protein and energy, recovery, and consistency are more fundamental than tracking itself.",
    },
    {
      question: "Why are my macros different on different calculators?",
      answer:
        "Different calculators may use:\n\n- Different calorie equations\n- Different activity multipliers\n- Different protein recommendations\n- Different macro percentages\n- Different goal adjustments\n\nBecause these are estimates rather than direct measurements, some variation between tools is normal.",
    },
    {
      question: "How often should I recalculate my macros?",
      answer:
        "You do not need to recalculate them every day.\n\nConsider recalculating when there is a meaningful change in:\n\n- Body weight\n- Activity level\n- Training routine\n- Nutrition goal\n\nIf your body weight or activity has changed substantially, the inputs used to estimate your needs may no longer reflect your current situation.",
    },
  ],
};
