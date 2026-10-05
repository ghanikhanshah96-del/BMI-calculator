import type { ToolId } from "../tool-nav";
import { action, cards, faqSection, p, section, sub, table, terms, ul, type ArticleSection, type ToolFaq } from "./blocks";

export const homeHero = {
  title: "Free Fitness & Health Calculators",
  paragraphs: [
    "Get quick, easy-to-understand estimates for body composition, calorie needs, nutrition, pregnancy dates, and fertility timing.",
    "FitnessCalculatorPro gives you practical calculators with clear explanations, so you can understand what each result means instead of seeing only a number.",
  ],
  action: "Choose a calculator below to get started.",
};

export const popularCalculators: {
  title: string;
  items: { id: ToolId; title: string; paragraphs: [string, string]; link: string }[];
} = {
  title: "Popular Calculators",
  items: [
    {
      id: "bmi",
      title: "BMI Calculator",
      paragraphs: [
        "Estimate your **Body Mass Index (BMI)** using your height and weight.",
        "BMI is commonly used as a screening measure to compare body weight with height. Your result can help you understand which standard BMI range your measurement falls into, while also showing the limitations of using BMI on its own.",
      ],
      link: "Use the BMI Calculator",
    },
    {
      id: "tdee",
      title: "TDEE Calculator",
      paragraphs: [
        "Estimate your **Total Daily Energy Expenditure (TDEE)** based on your body information and activity level.",
        "TDEE represents an estimate of how many calories your body may use in a typical day. It can be a useful starting point when planning for weight maintenance, weight loss, or weight gain.",
      ],
      link: "Use the TDEE Calculator",
    },
    {
      id: "body-fat",
      title: "Body Fat Percentage Calculator",
      paragraphs: [
        "Estimate what percentage of your body weight may come from body fat.",
        "Unlike body weight alone, body fat percentage gives additional information about body composition. The calculator uses the measurements you enter to provide an estimate and explains how to interpret the result.",
      ],
      link: "Use the Body Fat Percentage Calculator",
    },
    {
      id: "macro",
      title: "Macro Calculator",
      paragraphs: [
        "Estimate your daily **protein, carbohydrate, fat, and calorie targets** based on your body information, activity level, and goal.",
        "A macro calculator can help you turn an overall calorie estimate into practical daily nutrition targets for weight loss, maintenance, or muscle-building goals.",
      ],
      link: "Use the Macro Calculator",
    },
    {
      id: "pregnancy",
      title: "Pregnancy Due Date Calculator",
      paragraphs: [
        "Estimate your expected pregnancy due date using information such as the first day of your last menstrual period.",
        "The calculator can also help you understand your estimated pregnancy timeline and important dates. Due dates are estimates, so actual delivery may occur before or after the calculated date.",
      ],
      link: "Use the Pregnancy Due Date Calculator",
    },
    {
      id: "ovulation",
      title: "Ovulation Calculator",
      paragraphs: [
        "Estimate your **ovulation date, fertile window, and most fertile days** based on your menstrual cycle information.",
        "Enter the first day of your last period and your average cycle length to get a calendar-based estimate. Because ovulation can vary from one cycle to another, the result should be used as a planning estimate rather than a confirmed ovulation date.",
      ],
      link: "Use the Ovulation Calculator",
    },
  ],
};

export const homeSections: ArticleSection[] = [
  section("find-calculator", "Find the Right Calculator for Your Goal", [
    p("Not sure which calculator you need? Start with your goal."),
    table(
      ["Your Goal", "Recommended Calculator"],
      ["Check weight relative to height", "[BMI Calculator](/bmi-calculator)"],
      ["Estimate daily calorie needs", "[TDEE Calculator](/tdee-calculator)"],
      ["Estimate body composition", "[Body Fat Percentage Calculator](/body-fat-calculator)"],
      ["Calculate protein, carbs, and fat", "[Macro Calculator](/macro-calculator)"],
      ["Estimate a pregnancy due date", "[Pregnancy Due Date Calculator](/due-date-calculator)"],
      ["Estimate fertile days and ovulation", "[Ovulation Calculator](/ovulation-calculator)"],
    ),
  ]),
  section("fitness-nutrition", "Fitness and Nutrition Calculators", [
    p("If your goal is related to body weight, calorie intake, body composition, or nutrition planning, start with one of these tools:"),
    cards(
      sub("[BMI Calculator](/bmi-calculator)", p("Use BMI for a quick height-to-weight screening estimate.")),
      sub("[TDEE Calculator](/tdee-calculator)", p("Use TDEE to estimate how many calories you may burn each day.")),
      sub("[Body Fat Percentage Calculator](/body-fat-calculator)", p("Use body measurements to estimate your body fat percentage.")),
      sub("[Macro Calculator](/macro-calculator)", p("Use your calorie needs to estimate daily protein, carbohydrate, and fat targets.")),
    ),
    p("These calculators measure different things, so they can be more useful when you understand how they connect."),
    p("For example:"),
    ul(
      "**BMI** looks at weight relative to height.",
      "**TDEE** estimates daily calorie expenditure.",
      "**Body Fat Percentage** estimates body composition.",
      "**Macro Calculator** divides calories into protein, carbohydrates, and fat.",
    ),
    p("One result does not replace the others."),
  ]),
  section("pregnancy-fertility", "Pregnancy and Fertility Calculators", [
    p("Our pregnancy and fertility tools are designed to make cycle and pregnancy dates easier to understand."),
    cards(
      sub("[Pregnancy Due Date Calculator](/due-date-calculator)", p("Estimate when your baby may be due based on the information you provide.")),
      sub("[Ovulation Calculator](/ovulation-calculator)", p("Estimate when ovulation and your fertile window may occur during your menstrual cycle.")),
    ),
    p("Both tools provide **date estimates**, not guarantees."),
    p("Pregnancy length and ovulation timing can vary between individuals, so calculator results should be used as general planning information rather than as a diagnosis or confirmation of a medical event."),
  ]),
  section(
    "how-it-works",
    "How Our Calculators Work",
    [
      p("Each calculator asks for the information needed for its specific calculation."),
      p("Depending on the tool, this may include:"),
      ul(
        "Age",
        "Sex",
        "Height",
        "Weight",
        "Activity level",
        "Body measurements",
        "Menstrual cycle length",
        "First day of the last menstrual period",
      ),
      p("After you enter your information, the calculator applies the relevant equation or calculation method and gives you an estimated result."),
      p("Where useful, our calculator pages also explain:"),
      ul(
        "What the result means",
        "How the calculation works",
        "What inputs affect the result",
        "Important limitations",
        "When the estimate may be less accurate",
      ),
      p("This gives you more context than a number alone."),
    ],
    { half: true },
  ),
  section(
    "estimate-vs-measurement",
    "Understand the Difference Between an Estimate and a Measurement",
    [
      p("Online calculators can be useful for planning and understanding your numbers, but they do not directly measure every process happening in your body."),
      p("For example:"),
      ul(
        "**BMI** does not directly measure body fat.",
        "**TDEE** is an estimate of daily energy expenditure.",
        "**Body fat calculations** can be affected by measurement technique.",
        "**Macro needs** can differ between individuals.",
        "**Pregnancy due dates** are estimated dates.",
        "**Ovulation calculators** cannot confirm exactly when ovulation occurs.",
      ),
      p("Use these tools as starting points for understanding your health, fitness, nutrition, or cycle information."),
      p("If a result relates to a medical concern, pregnancy complication, fertility problem, or significant change in your health, speak with an appropriate healthcare professional."),
    ],
    { half: true, tone: "frame" },
  ),
  section(
    "womens-health",
    "Which Women's Health Calculator Should I Use?",
    [
      p("Use the **Ovulation Calculator** if you want to estimate your fertile window or next ovulation date."),
      p("Use the **Pregnancy Due Date Calculator** if you are already pregnant or have a pregnancy start date or last menstrual period to work from."),
      p("These tools serve different stages:"),
      terms(
        ["Before pregnancy:", "[Ovulation Calculator](/ovulation-calculator)"],
        ["During pregnancy:", "[Pregnancy Due Date Calculator](/due-date-calculator)"],
      ),
    ],
    { half: true, tone: "brand" },
  ),
  section(
    "why-fitnesscalculatorpro",
    "Why Use FitnessCalculatorPro?",
    [
      p("FitnessCalculatorPro is designed to make commonly used fitness and health calculations easier to understand."),
      p("Our goal is to provide tools that are:"),
      ul(
        "**Simple:** Enter your information and get an estimate quickly.",
        "**Useful:** Results are supported by explanations and practical context.",
        "**Focused:** Each calculator is built around a specific question.",
        "**Transparent:** Calculator pages explain important assumptions and limitations.",
        "**Easy to access:** No unnecessary steps between you and the calculation.",
      ),
      p("We believe a useful calculator should tell you more than just the answer. It should also help you understand what that answer means."),
    ],
    { half: true },
  ),
  faqSection("Frequently Asked Questions"),
  section(
    "get-started",
    "Choose a Calculator and Get Started",
    [
      p("Use the calculator that matches your question:"),
      ul(
        "[BMI Calculator](/bmi-calculator) for weight relative to height",
        "[TDEE Calculator](/tdee-calculator) for daily calorie expenditure",
        "[Body Fat Percentage Calculator](/body-fat-calculator) for body-composition estimates",
        "[Macro Calculator](/macro-calculator) for protein, carbohydrate, and fat targets",
        "[Pregnancy Due Date Calculator](/due-date-calculator) for estimated pregnancy dates",
        "[Ovulation Calculator](/ovulation-calculator) for estimated fertile days",
      ),
      action("Select a calculator above and get your estimate in seconds."),
    ],
    { tone: "brand" },
  ),
];

export const homeFaqs: ToolFaq[] = [
  {
    question: "Are FitnessCalculatorPro calculators free?",
    answer: "Yes. You can use the calculators available on FitnessCalculatorPro without paying for individual calculations.",
  },
  {
    question: "Are online fitness calculators accurate?",
    answer:
      "Online calculators provide estimates based on the information you enter and the formula used.\n\nSome calculations are more precise than others, and individual results may differ from direct clinical or laboratory measurements.",
  },
  {
    question: "Can I use calculator results for medical decisions?",
    answer:
      "The calculators are intended for general informational and educational use.\n\nThey are not a substitute for diagnosis, medical testing, or personalized advice from a qualified healthcare professional.",
  },
  {
    question: "Why do different calculators give different results?",
    answer:
      "Different tools may use different formulas, assumptions, activity factors, measurement methods, or rounding rules.\n\nThis is why two calculators may produce slightly different estimates from the same information.",
  },
  {
    question: "Which calculator should I use for weight loss?",
    answer:
      "The TDEE Calculator can help estimate your daily calorie expenditure, while the Macro Calculator can help break a calorie target into protein, carbohydrates, and fat.\n\nBMI and body fat percentage can provide additional context but measure different things.",
  },
  {
    question: "What is the difference between BMI and body fat percentage?",
    answer:
      "BMI compares body weight with height.\n\nBody fat percentage estimates how much of your body weight comes from fat.\n\nThey are related to body composition but should not be treated as the same measurement.",
  },
  {
    question: "What is the difference between TDEE and a Macro Calculator?",
    answer:
      "TDEE estimates how many calories you may use in a day.\n\nA Macro Calculator takes a calorie target and estimates how much protein, carbohydrate, and fat may fit within that target.",
  },
  {
    question: "Can the Ovulation Calculator confirm ovulation?",
    answer: "No.\n\nIt estimates ovulation timing based on menstrual cycle information. Actual ovulation may occur earlier or later.",
  },
  {
    question: "Is a pregnancy due date exact?",
    answer: "No.\n\nA pregnancy due date is an estimate. The actual delivery date may be earlier or later than the calculated date.",
  },
  {
    question: "Do I need an account to use a calculator?",
    answer:
      "No.\n\nEvery calculator runs in your browser. You do not need an account, and the numbers you enter are not stored on our servers.",
  },
];
