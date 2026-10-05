import { action, cards, faqSection, p, section, steps, sub, table, ul, type ToolContent } from "./blocks";

export const tdee: ToolContent = {
  intro:
    "Calculate your TDEE online for free and estimate your daily calorie needs based on your age, weight, height, and activity level.",
  lead: [
    p("Use this **TDEE Calculator** to estimate your total daily calorie needs based on your personal information and activity level. TDEE stands for **Total Daily Energy Expenditure** and refers to the amount of energy your body uses over the course of a typical day."),
    p("Your estimated TDEE can help you understand your approximate **maintenance calories** and provide a starting point when planning nutrition around goals such as maintaining, losing, or gaining weight. Because energy needs vary from person to person, a TDEE result should be treated as an estimate rather than an exact measurement."),
  ],
  article: [
    section(
      "what-is-tdee",
      "What Is TDEE?",
      [
        p("**TDEE stands for Total Daily Energy Expenditure.** It describes the total amount of energy your body uses during a 24-hour period."),
        p("Your daily energy expenditure is influenced by several processes and activities, including the energy your body needs to maintain normal functions, the energy used for physical activity, and the energy required to digest and process food. The National Academies describes total energy expenditure as consisting of resting metabolic rate, the thermic effect of food, and physical activity."),
        p("In simple terms, your TDEE represents the approximate number of calories your body uses throughout an average day."),
        cards(
          sub(
            "TDEE Can Be Influenced By",
            ul(
              "Body size and weight",
              "Height",
              "Age",
              "Sex",
              "Daily physical activity",
              "Exercise",
              "Normal movement throughout the day",
              "Energy used to process food",
            ),
            p("Physical activity is particularly variable between individuals, which is one reason two people with similar body measurements can have different daily calorie requirements."),
          ),
        ),
      ],
      { nav: "What is TDEE" },
    ),
    section(
      "how-it-works",
      "How Does a TDEE Calculator Work?",
      [
        p("A **TDEE Calculator Online** typically starts with information about your body and lifestyle to estimate your resting energy needs. It then accounts for your typical physical activity to estimate your total daily energy expenditure."),
        p("Depending on the calculator, the information used may include:"),
        ul("Age", "Sex", "Height", "Weight", "Activity level"),
        p("One commonly used approach begins with an estimated resting metabolic rate and then incorporates physical activity. The Mifflin-St Jeor equation is one established method for estimating resting metabolic rate from factors such as weight, height, age, and sex."),
        p("The important point is that a TDEE calculation is an **estimate based on a mathematical prediction**, not a direct measurement of exactly how many calories your body burns each day."),
      ],
      { nav: "How it works", tone: "brand" },
    ),
    steps(
      "how-to",
      "How to Use This TDEE Calculator",
      "Using our **free TDEE Calculator** is straightforward.",
      [
        ["Enter Your Personal Information", "Enter the information requested by the calculator, such as your age, sex, height, and weight."],
        ["Select Your Activity Level", "Choose the activity level that best represents your normal routine. Consider your overall daily movement and exercise rather than basing your selection on one unusually active day."],
        ["Calculate Your TDEE", "Select the calculate option to generate your estimated daily calorie expenditure."],
        [
          "Review Your Result",
          "Your result provides an estimate of the calories your body may use during a typical day based on the information you entered.",
          "Use the number as a starting point for understanding your daily calorie needs rather than treating it as an exact target for every day.",
        ],
      ],
      "How to use",
    ),
    section(
      "tdee-vs-bmr",
      "TDEE vs BMR: What Is the Difference?",
      [
        p("**BMR** and **TDEE** are related, but they are not the same thing."),
        p("BMR, or Basal Metabolic Rate, refers to the energy required to support basic body functions under specific resting conditions. TDEE accounts for energy expenditure across the day, including resting energy expenditure, physical activity, and the thermic effect of food."),
        table(
          ["BMR", "TDEE"],
          ["Focuses on energy needed at rest", "Estimates total daily energy expenditure"],
          ["Does not represent a normal day's complete activity", "Includes daily physical activity"],
          ["Forms part of overall energy expenditure", "Represents the broader daily estimate"],
          ["Generally lower than TDEE", "Usually higher because it includes additional activity and energy expenditure"],
        ),
        p("Think of BMR as one component of your overall daily energy needs, while TDEE represents the larger daily picture."),
      ],
      { nav: "TDEE vs BMR" },
    ),
    section(
      "tdee-components",
      "What Are the Components of TDEE?",
      [
        p("Total daily energy expenditure is not created by exercise alone. Several processes contribute to the amount of energy your body uses."),
        cards(
          sub(
            "Resting Metabolic Rate",
            p("Your body uses energy even when you are resting. This energy supports essential functions such as maintaining normal body processes and homeostasis."),
            p("Resting metabolic rate generally represents the largest component of total daily energy expenditure."),
          ),
          sub(
            "Physical Activity",
            p("Physical activity includes more than structured workouts. Walking, household activities, work-related movement, exercise, and other forms of movement all contribute to daily energy expenditure."),
            p("Physical activity is also one of the most variable components of total energy expenditure between individuals."),
          ),
          sub(
            "Thermic Effect of Food",
            p("Your body also uses energy to digest, absorb, metabolize, and store nutrients from the food and drinks you consume. This is known as the **thermic effect of food**, or diet-induced thermogenesis."),
          ),
        ),
      ],
      { nav: "Components" },
    ),
    section(
      "activity-levels",
      "Understanding Activity Levels",
      [
        p("Your activity level can have a significant effect on your estimated TDEE."),
        p("Different calculators may use slightly different descriptions or activity multipliers, but activity levels generally progress from little daily movement to very high levels of physical activity."),
        table(
          ["Activity Level", "General Description"],
          ["Sedentary", "Mostly sitting with little structured exercise"],
          ["Lightly Active", "Some regular walking or light physical activity"],
          ["Moderately Active", "Regular exercise and a reasonably active daily routine"],
          ["Very Active", "Frequent exercise and substantial daily movement"],
          ["Extremely Active", "Very high levels of training or physically demanding activity"],
        ),
        p("When selecting an activity level, think about your **usual routine over time**, not your most active day of the week."),
        p("For example, someone who exercises once on the weekend but spends most weekdays sitting may not have the same overall activity level as someone who trains several days per week and remains active throughout the day."),
      ],
      { nav: "Activity levels" },
    ),
    section("maintenance-calories", "What Are Maintenance Calories?", [
      p("Your estimated TDEE is often used as a starting point for understanding **maintenance calories**."),
      p("Maintenance calories are the approximate amount of energy you would need to consume to maintain your body weight under a particular activity pattern."),
      p("If calorie intake and energy expenditure remain approximately balanced over time, body weight may remain relatively stable. If energy intake consistently exceeds energy expenditure, weight can increase; if energy intake is lower than expenditure, weight can decrease."),
      p("However, your actual calorie needs can change as your body weight, activity, eating habits, and other factors change."),
    ]),
    section(
      "tdee-weight-loss",
      "TDEE for Weight Loss",
      [
        p("A **TDEE Calculator for Weight Loss** can provide a starting point for understanding how calorie intake relates to estimated daily energy expenditure."),
        p("If a person consistently consumes fewer calories than they use, the resulting energy deficit can contribute to weight loss. Physical activity can also increase the amount of energy used."),
        p("However, there is no single calorie target that is appropriate for everyone."),
        cards(
          sub(
            "When Using TDEE for Weight Loss",
            p("Consider:"),
            ul(
              "Your estimated maintenance calories",
              "Your current eating pattern",
              "Your physical activity",
              "Your health and medical history",
              "Your weight-management goals",
              "How your body responds over time",
            ),
          ),
        ),
        p("A TDEE number should not be treated as a guarantee of a particular rate of weight loss. NIDDK notes that the relationship between calorie intake, energy expenditure, and changes in body weight is more complex than a simple fixed calorie rule."),
      ],
      { nav: "Weight loss", half: true },
    ),
    section(
      "tdee-weight-gain",
      "TDEE for Weight Gain",
      [
        p("TDEE can also be used as a reference point when someone is trying to gain weight."),
        p("If calorie intake consistently exceeds energy expenditure, body weight can increase over time. However, the quality of the diet and the type of weight gained also matter."),
        p("A weight-gain approach should consider:"),
        ul(
          "Overall calorie intake",
          "Protein and other nutrients",
          "Strength training or other physical activity",
          "Existing health conditions",
          "Individual goals",
        ),
        p("People with specific nutritional or medical needs should work with a qualified healthcare professional or registered dietitian rather than relying on a calculator alone."),
      ],
      { nav: "Weight gain", half: true },
    ),
    section(
      "tdee-changes",
      "Why Your TDEE Can Change",
      [
        p("Your TDEE is not necessarily a permanent number."),
        p("Changes in your body and lifestyle can affect how much energy you use each day."),
        p("For example:"),
        ul(
          "Your body weight changes",
          "Your activity level changes",
          "Your exercise routine changes",
          "Your daily movement changes",
          "Your eating habits change",
          "Your health or medications change",
        ),
        p("NIDDK notes that metabolism and calorie needs can change during weight loss, with the body requiring fewer calories at a lower weight."),
        p("This is one reason a TDEE estimate can be useful as a starting point but should not be considered a fixed number for life."),
      ],
      { half: true },
    ),
    section(
      "tdee-accuracy",
      "How Accurate Is a TDEE Calculator?",
      [
        p("A **TDEE Calculator** provides an estimate rather than directly measuring your energy expenditure."),
        p("Predictive equations for resting energy expenditure can provide useful estimates, but research shows that the accuracy of these equations can vary between individuals and populations."),
        p("Your actual daily energy expenditure can also change depending on your activity, body composition, health, and other factors."),
        p("For this reason, your TDEE result is best viewed as a **starting estimate**."),
        cards(
          sub(
            "Why Your Actual Calorie Needs May Differ",
            p("Your actual energy expenditure may differ from a calculator estimate because:"),
            ul(
              "Your daily activity may vary",
              "Exercise intensity can change",
              "Your body composition may differ from the assumptions used by an equation",
              "Your metabolism may not match a predicted value exactly",
              "Your lifestyle can change from week to week",
            ),
          ),
        ),
      ],
      { nav: "Accuracy", half: true },
    ),
    section(
      "daily-calorie-needs",
      "TDEE and Daily Calorie Needs",
      [
        p("Your TDEE can help put your daily calorie intake into context."),
        p("For example, someone who has a physically demanding job and exercises regularly may have substantially different calorie needs from someone who spends most of the day sitting."),
        p("Daily calorie requirements can also be affected by factors beyond activity, including age, body size, health conditions, and other individual characteristics."),
        p("Rather than asking for one universal calorie number, it is more useful to consider your own estimated energy expenditure and personal circumstances."),
      ],
      { half: true },
    ),
    section(
      "physical-activity",
      "TDEE and Physical Activity",
      [
        p("Physical activity is an important part of daily energy expenditure."),
        p("It includes both planned exercise and other movement throughout the day. The National Academies notes that physical activity energy expenditure is the most variable component of total daily energy expenditure."),
        p("Regular physical activity can also support weight management and overall health. NIDDK recommends that adults generally work toward at least 150 minutes of moderate-intensity physical activity per week, with muscle-strengthening activities on at least two days per week."),
        p("Your TDEE calculation should therefore reflect your **normal activity pattern**, not just the number of workouts you complete."),
      ],
      { half: true },
    ),
    section(
      "tdee-vs-calorie",
      "TDEE Calculator vs Calorie Calculator",
      [
        p("The terms can sometimes overlap, but they can serve different purposes."),
        p("A **TDEE Calculator** focuses on estimating your total daily energy expenditure."),
        p("A general **Calorie Calculator** may provide an estimate of daily calorie needs based on similar information, depending on how the tool is designed."),
        p("The most important thing is understanding what the result represents. If a calculator gives you a TDEE estimate, the number is intended to represent estimated daily energy expenditure rather than a direct measurement of your metabolism."),
      ],
      { half: true },
    ),
    section(
      "weight-maintenance",
      "Can TDEE Help With Weight Maintenance?",
      [
        p("Yes, a TDEE estimate can provide a useful reference when thinking about weight maintenance."),
        p("If your estimated TDEE is 2,400 calories per day, for example, that number can serve as a starting estimate for the amount of energy your body may use under the activity pattern entered into the calculator."),
        p("It does **not** mean that exactly 2,400 calories will maintain your weight every day. Your actual needs can fluctuate, and your body weight and activity can change over time."),
        p("NIDDK's Body Weight Planner similarly uses calorie intake, physical activity, body measurements, and goals to model weight change rather than treating calorie requirements as a permanently fixed number."),
      ],
      { half: true },
    ),
    faqSection("Frequently Asked Questions About TDEE"),
    section(
      "remember",
      "Important Things to Remember About TDEE",
      [
        p("A TDEE estimate can be useful for understanding your approximate daily energy needs, but it should be treated as a starting point rather than an exact measurement."),
        p("Keep these points in mind:"),
        ul(
          "**TDEE is an estimate, not a direct measurement.**",
          "Your energy needs can change as your weight and activity change.",
          "Activity level can have a substantial effect on daily energy expenditure.",
          "TDEE should not be used as a diagnosis of a medical condition.",
          "Individual calorie needs can differ even when two people have similar measurements.",
          "Weight-management decisions should consider your overall health and circumstances.",
        ),
        p("If you have a medical condition, take medications that affect weight or metabolism, are pregnant or breastfeeding, or have specific nutritional needs, speak with a qualified healthcare professional before making significant changes to your calorie intake."),
      ],
      { tone: "frame" },
    ),
    section("calculate-tdee", "Calculate Your TDEE Online", [
      p("Use the **TDEE Calculator** above to estimate your total daily energy expenditure based on the information you enter. Your result can give you a useful starting point for understanding your approximate daily calorie needs and how activity level can influence energy expenditure."),
      p("For the most useful interpretation, treat your result as an estimate and consider it alongside your actual lifestyle, eating pattern, activity, and health circumstances."),
      action("Calculate your TDEE above and use the result as a starting point for understanding your daily calorie needs."),
    ]),
  ],
  faqs: [
    {
      question: "What does TDEE stand for?",
      answer: "TDEE stands for Total Daily Energy Expenditure. It refers to the total amount of energy your body uses over a typical 24-hour period.",
    },
    {
      question: "What is a TDEE Calculator?",
      answer: "A TDEE Calculator is a tool that estimates your daily energy expenditure using information such as body measurements and activity level.",
    },
    {
      question: "What is the difference between TDEE and BMR?",
      answer: "BMR represents the energy your body requires at rest, while TDEE is a broader estimate that includes resting energy expenditure, physical activity, and the thermic effect of food.",
    },
    {
      question: "How do I calculate my TDEE?",
      answer: "TDEE can be estimated using a resting metabolic rate equation combined with information about your physical activity. Different calculators can use different equations and activity assumptions.",
    },
    {
      question: "What are maintenance calories?",
      answer: "Maintenance calories are an estimate of how many calories you may need to consume to maintain your current body weight under a particular activity pattern.",
    },
    {
      question: "Can I use TDEE for weight loss?",
      answer: "TDEE can provide a starting estimate for understanding your daily energy expenditure when planning weight-management goals. However, calorie needs and weight changes vary between individuals, so the result should not be treated as a guaranteed weight-loss prescription.",
    },
    {
      question: "Can I use TDEE for weight gain?",
      answer: "TDEE can be used as a reference point when planning calorie intake for weight gain. Individual nutritional needs vary, so people with specific health or dietary requirements should seek professional guidance.",
    },
    {
      question: "Does exercise increase TDEE?",
      answer: "Physical activity contributes to total daily energy expenditure, so changes in your activity level can affect your estimated TDEE.",
    },
    {
      question: "Is TDEE the same every day?",
      answer: "No. Your energy expenditure can vary with changes in activity, body weight, exercise, lifestyle, and other factors.",
    },
    {
      question: "How accurate is a TDEE Calculator?",
      answer: "A TDEE Calculator provides an estimate. Predictive equations cannot perfectly measure the energy expenditure of every individual, so your actual calorie needs may differ from the calculated result.",
    },
    {
      question: "Can children use an adult TDEE calculator?",
      answer: "Adult calorie-planning tools should not automatically be applied to children. NIDDK's Body Weight Planner, for example, is intended for adults age 18 and older and specifically excludes younger people and pregnant or breastfeeding women.",
    },
  ],
  sources: [
    { label: "National Academies / NCBI — Factors Affecting Energy Expenditure and Requirements", url: "https://www.ncbi.nlm.nih.gov/books/NBK591031/" },
    { label: "NIDDK — Body Weight Planner", url: "https://www.niddk.nih.gov/bwp" },
    {
      label: "NIDDK — Eating & Physical Activity to Lose or Maintain Weight",
      url: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/eating-physical-activity",
    },
    { label: "NCBI Endotext — Estimating Resting Metabolic Rate", url: "https://www.ncbi.nlm.nih.gov/books/NBK278991/" },
  ],
};
