import { eq, faqSection, p, section, steps, tables, ul, type ToolContent } from "./blocks";

export const bmi: ToolContent = {
  intro: "Calculate BMI online for free using height and weight. See your BMI category with this simple BMI Calculator.",
  article: [
    section(
      "what-is-bmi",
      "What Is a BMI Calculator?",
      [
        p("A **BMI Calculator** is a simple tool that uses your height and weight to calculate your Body Mass Index (BMI). BMI provides a number that can be used to place an adult into a weight category such as underweight, healthy weight, overweight, or obesity."),
        p("Our **free BMI Calculator online** lets you enter your height and weight to calculate your BMI without doing the calculation manually. You can use the result as a starting point for understanding how your weight compares with standard BMI categories for adults."),
        p("BMI is considered a **screening measure**, not a diagnosis. It should be considered alongside other factors such as medical history, physical activity, health conditions, physical examination findings, and laboratory results when evaluating overall health."),
      ],
      { nav: "What is BMI" },
    ),
    steps(
      "how-to",
      "How to Use This BMI Calculator",
      "Using a **Body Mass Index Calculator** is straightforward. Enter your height and weight in the calculator above and select the appropriate measurement units.",
      [
        ["Enter Your Height", "Provide your height using the unit supported by the calculator, such as centimeters or feet and inches."],
        ["Enter Your Weight", "Enter your current body weight using kilograms or pounds, depending on the selected unit system."],
        ["Calculate Your BMI", "Select the calculate option to determine your BMI. The calculator uses your height and weight to produce your BMI value."],
        ["Review Your BMI Category", "For adults, your BMI can then be compared with standard BMI categories. These categories help provide context for the number produced by the calculation."],
      ],
      "How to use",
    ),
    section(
      "formula",
      "How Is BMI Calculated?",
      [
        p("BMI is calculated by comparing a person's weight with their height."),
        p("For metric measurements, the standard BMI formula is:"),
        eq("BMI = weight in kilograms ÷ height in meters²"),
        p("For example, if someone's weight is 70 kg and height is 1.75 meters:"),
        eq("BMI = 70 ÷ (1.75 × 1.75) = 22.9"),
        p("The same calculation can be performed using U.S. customary measurements:"),
        eq("BMI = weight in pounds ÷ height in inches² × 703"),
        p("Enter centimeters or feet and inches. The calculator converts them before applying the formula."),
      ],
      { nav: "Formula", tone: "brand", half: true },
    ),
    section(
      "bmi-categories",
      "BMI Categories for Adults",
      [
        p("For adults aged 20 and older, standard BMI categories are based on the calculated BMI value."),
        tables({
          head: ["BMI Range", "Category"],
          rows: [
            ["Below 18.5", "Underweight"],
            ["18.5 to less than 25", "Healthy Weight"],
            ["25 to less than 30", "Overweight"],
            ["30 or higher", "Obesity"],
          ],
        }),
        p("Obesity is further divided into three classes:"),
        tables({
          head: ["BMI Range", "Obesity Class"],
          rows: [
            ["30 to less than 35", "Class 1"],
            ["35 to less than 40", "Class 2"],
            ["40 or higher", "Class 3"],
          ],
        }),
        p("These ranges are used for adults regardless of age, sex, or race."),
      ],
      { nav: "Categories", half: true },
    ),
    section(
      "bmi-meaning",
      "What Does Your BMI Mean?",
      [
        p("A BMI number is a screening result, not a complete health assessment. It does not directly measure body fat or separate fat from muscle and bone. The category table above shows where an adult result falls; the limits below explain what that number cannot tell you."),
      ],
      { nav: "What it means" },
    ),
    section(
      "limits",
      "Is BMI a Good Measure of Health?",
      [
        p("BMI can be useful because it is quick, inexpensive, and easy to calculate. It can help identify weight ranges that may be associated with certain health risks at a population and individual screening level."),
        p("However, BMI has limitations."),
        p("It does not tell you:"),
        ul(
          "How much of your weight comes from muscle",
          "Where body fat is stored",
          "Your complete body composition",
          "Whether you have a specific medical condition",
          "Your overall health by itself",
        ),
        p("For this reason, a BMI result should be considered together with other relevant health information rather than used alone."),
      ],
      { nav: "Limits", tone: "frame" },
    ),
    section(
      "bmi-children",
      "BMI for Children and Teenagers",
      [
        p("Adult BMI categories should **not** be applied to children and teenagers in the same way."),
        p("For children and adolescents ages 2 through 19, BMI is interpreted using age- and sex-specific BMI percentiles because their bodies are still growing."),
        p("The CDC recommends using a child and teen BMI calculator that accounts for these factors rather than applying adult BMI ranges to younger people."),
        p("If you are calculating BMI for a child or teenager, discuss the result with a qualified healthcare professional who can interpret it using the appropriate growth charts and other information."),
      ],
      { nav: "Children & teens", half: true },
    ),
    section(
      "when-to-check",
      "When Should You Check Your BMI?",
      [
        p("People may use a **BMI Calculator Online** to get a quick estimate of their BMI when monitoring changes in height and weight or learning more about standard BMI categories."),
        p("Tracking BMI over time can provide additional context about changes in weight. CDC notes that routine BMI tracking can be useful when considered alongside other health information."),
        p("If your BMI result concerns you, or if you are making decisions about weight, nutrition, or treatment, discuss the result with a healthcare professional."),
      ],
      { half: true },
    ),
    faqSection("Frequently Asked Questions About BMI"),
    section("calculate-bmi", "Calculate Your BMI Online", [
      p("Use the **BMI Calculator** above, then read the category with the limits in mind. Discuss the result with a healthcare professional before using it for a medical decision."),
    ]),
  ],
  faqs: [
    {
      question: "What is BMI?",
      answer: "BMI stands for Body Mass Index. It is a calculated measure that compares body weight with height and is commonly used as a screening measure for adults.",
    },
    {
      question: "How do I calculate my BMI?",
      answer: "For adults, BMI can be calculated by dividing weight in kilograms by height in meters squared. You can also use the U.S. customary formula with pounds and inches.",
    },
    {
      question: "What is a healthy BMI?",
      answer: "For adults age 20 and older, a BMI from 18.5 to less than 25 is classified as the healthy weight range in the standard adult BMI categories.",
    },
    {
      question: "Is a BMI of 25 overweight?",
      answer: "For adults, a BMI from 25 to less than 30 falls within the overweight category.",
    },
    {
      question: "Is BMI the same for men and women?",
      answer: "The standard adult BMI categories are based on the BMI value and are used regardless of sex, age, or race for adults 20 and older. However, BMI does not capture differences in body composition between individuals.",
    },
    {
      question: "Does BMI measure body fat?",
      answer: "No. BMI is calculated from height and weight and does not directly measure body fat. It also cannot distinguish between muscle, fat, and bone mass.",
    },
    {
      question: "Can I use an adult BMI calculator for a child?",
      answer: "Adult BMI categories should not be used for children and teenagers. For ages 2 through 19, BMI is interpreted using age- and sex-specific percentiles.",
    },
    {
      question: "Is BMI a diagnosis?",
      answer: "No. BMI is a screening measure and should not be treated as a diagnosis of a disease or health condition. A healthcare professional can consider BMI alongside other health information.",
    },
  ],
  sources: [
    { label: "CDC — Adult BMI Categories", url: "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html" },
    { label: "CDC — BMI FAQs", url: "https://www.cdc.gov/bmi/faq/" },
    { label: "NHLBI — Overweight and Obesity", url: "https://www.nhlbi.nih.gov/health/overweight-and-obesity/symptoms" },
  ],
};
