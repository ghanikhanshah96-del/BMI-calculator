import { cards, faqSection, ol, p, section, sub, table, terms, ul, type ToolContent } from "./blocks";

export const bodyFat: ToolContent = {
  intro: "Use our Body Fat Percentage Calculator to estimate your body fat, understand body fat ranges for men and women.",
  lead: [
    p("Use our **Body Fat Percentage Calculator** to estimate how much of your total body weight is made up of fat. Enter the measurements requested in the calculator above to get an estimated body fat percentage and a clearer picture of your body composition."),
    p("Body fat percentage can provide information that body weight alone cannot. Two people can weigh the same but have very different proportions of fat, muscle, bone, and other lean tissue."),
    p("Your result should be treated as an **estimate rather than a medical diagnosis**. Home body fat calculators and circumference-based methods are useful for tracking general changes, but their accuracy depends on the formula used and how carefully your measurements are taken."),
  ],
  article: [
    section(
      "what-is-body-fat",
      "What Is Body Fat Percentage?",
      [
        p("Body fat percentage is the proportion of your total body weight that comes from fat tissue."),
        p("For example, if someone weighs 180 pounds and has an estimated body fat percentage of 20%, approximately 36 pounds of their body weight would be fat mass."),
        p("The rest is generally referred to as **fat-free or lean mass**, which includes:"),
        ul("Muscle", "Bone", "Organs", "Body water", "Connective tissue"),
        p("Body fat itself is not something the body should eliminate completely. A certain amount of fat is necessary for normal physiological functions, including energy storage, insulation, hormone-related processes, and protection of internal organs."),
        p("That is why a lower body fat percentage is **not automatically better**."),
      ],
      { nav: "What it is" },
    ),
    section(
      "how-to",
      "How to Use the Body Fat Percentage Calculator",
      [
        p("To calculate body fat percentage, enter the measurements requested by the calculator as accurately as possible."),
        p("Depending on the method used by the calculator, you may be asked for measurements such as:"),
        ul("Sex", "Age", "Height", "Weight", "Waist circumference", "Neck circumference", "Hip circumference"),
        p("Once you enter the required information, select **Calculate** to see your estimated body fat percentage."),
        cards(
          sub(
            "For a More Consistent Result",
            p("Small measurement differences can change the estimate, especially when a calculator uses body circumferences."),
            p("For better consistency:"),
            ol(
              "Use a flexible, non-stretch measuring tape.",
              "Measure directly against the body rather than over thick clothing.",
              "Keep the tape snug but do not compress the skin.",
              "Stand naturally rather than pulling your stomach inward.",
              "Measure at the same anatomical location each time.",
              "If you are tracking progress, take measurements under similar conditions each time.",
            ),
            p("The U.S. Navy's body-composition guidance, for example, specifies particular anatomical measurement locations and standardized measuring procedures because inconsistent tape placement can affect the estimate."),
          ),
        ),
      ],
      { nav: "How to use", tone: "brand" },
    ),
    section(
      "body-fat-chart",
      "Body Fat Percentage Chart for Men and Women",
      [
        p("There is no single body fat percentage that is ideal for every adult. Sex, age, measurement method, athletic status, health history, and individual physiology can all affect how a result should be interpreted."),
        p("A commonly cited American Council on Exercise reference divides adult body fat percentages into the following general categories:"),
        table(
          ["Category", "Women", "Men"],
          ["Essential fat", "10–13%", "2–5%"],
          ["Athletes", "14–20%", "6–13%"],
          ["Fitness", "21–24%", "14–17%"],
          ["Average/acceptable", "25–31%", "18–24%"],
          ["Higher range", "32%+", "25%+"],
        ),
        p("These ranges are best used as **general reference points**, not as a diagnosis or a personal health target. ACE materials note that body-fat assessments have limitations and that different assessment methods can produce different results."),
        p("Your personal health cannot be determined from body fat percentage alone."),
      ],
      { nav: "Chart", half: true },
    ),
    section(
      "body-fat-vs-bmi",
      "Body Fat Percentage vs. BMI: What Is the Difference?",
      [
        p("Body fat percentage and **Body Mass Index (BMI)** measure different things."),
        p("BMI is calculated from your weight relative to your height. It does **not directly measure body fat** or separate fat from muscle, bone, or other tissue."),
        p("The CDC specifically notes that BMI cannot distinguish between fat, muscle, and bone mass and does not show where body fat is stored."),
        p("That distinction matters."),
        p("For example, a muscular athlete may have a relatively high BMI because muscle contributes to body weight, while their actual body fat may be comparatively low."),
        p("On the other hand, a person may have a BMI within a commonly used weight range while still carrying a relatively high amount of abdominal fat."),
        p("For that reason, BMI, waist measurements, body composition, blood pressure, laboratory results, fitness level, and medical history may all provide different pieces of useful health information."),
        p("You can compare the two measurements using our [BMI Calculator](/bmi-calculator)."),
      ],
      { nav: "vs. BMI", half: true },
    ),
    section(
      "waist-measurement",
      "Why Waist Measurement Also Matters",
      [
        p("Total body fat is only part of the picture. **Where fat is stored can also matter.**"),
        p("Fat concentrated around the abdomen may be associated with greater metabolic and cardiovascular health risks than fat stored in some other areas of the body."),
        p("The National Institute of Diabetes and Digestive and Kidney Diseases notes that someone can have a BMI that does not appear high while still carrying excess fat around the waist."),
        p("The National Heart, Lung, and Blood Institute also uses waist circumference as one measure clinicians may consider when evaluating weight-related health risk."),
        p("This is another reason not to judge your health from a single number."),
      ],
      { nav: "Waist" },
    ),
    section(
      "accuracy",
      "How Accurate Is a Body Fat Calculator?",
      [
        p("A **Body Fat Calculator** provides an estimate."),
        p("It does not directly scan or measure the amount of fat tissue inside your body."),
        p("The accuracy of your result depends on factors including:"),
        ul(
          "The calculation method",
          "Measurement technique",
          "Body shape",
          "Muscle mass",
          "Age and sex",
          "Where the tape is positioned",
          "Normal measurement error",
        ),
        p("Circumference-based methods are convenient because they require little more than a measuring tape, but they cannot provide the same type of information as laboratory or clinical body-composition testing."),
        cards(
          sub(
            "Other Ways Body Fat Can Be Estimated or Measured",
            p("Different body-composition methods include:"),
            terms(
              ["Skinfold measurements:", "A trained person uses calipers to measure skinfold thickness at specific locations."],
              [
                "Bioelectrical impedance analysis (BIA):",
                "Common in smart scales and fitness equipment. The device sends a small electrical current through the body and estimates body composition based partly on electrical resistance.",
              ],
              ["Air displacement:", "Specialized equipment estimates body composition using body volume."],
              ["Hydrostatic weighing:", "Body density is estimated using underwater weighing."],
              ["DXA or DEXA scan:", "Dual-energy X-ray absorptiometry can provide detailed estimates of fat mass, lean tissue, and bone mineral content."],
            ),
            p("NIH's Common Data Elements repository describes DXA as a highly regarded method for assessing percentage body fat and muscle mass, although it requires specialized equipment and trained personnel."),
            p("No method should be assumed to produce exactly the same percentage as another method."),
          ),
        ),
      ],
      { nav: "Accuracy" },
    ),
    section(
      "result-changes",
      "Why Your Body Fat Result May Change",
      [
        p("A change in your calculator result does not always mean that your body gained or lost that exact amount of fat."),
        p("Circumference and impedance measurements can be influenced by measurement conditions."),
        p("Changes may reflect:"),
        ul(
          "Actual fat gain or loss",
          "Changes in muscle mass",
          "Different tape placement",
          "Hydration differences",
          "Food intake",
          "Exercise",
          "Normal daily fluctuations",
          "Measurement error",
        ),
        p("For tracking progress, **consistency is often more useful than repeatedly switching between different methods**."),
        p("If you normally use the same calculator and the same measurement procedure, looking at the trend over several weeks or months may be more meaningful than reacting to a single reading."),
      ],
      { half: true },
    ),
    section(
      "vs-body-weight",
      "Is Body Fat Percentage Better Than Body Weight?",
      [
        p("It answers a different question."),
        p("A bathroom scale tells you your total weight. It cannot tell you how much of that weight comes from fat, muscle, bone, or water."),
        p("Body fat percentage attempts to provide more information about **body composition**."),
        p("This can be especially useful for someone who is exercising regularly. A person could lose body fat and gain muscle while seeing relatively little change on the scale."),
        p("However, body fat percentage still should not be treated as a complete measure of health."),
        p("Factors such as cardiovascular fitness, strength, nutrition, sleep, blood pressure, blood glucose, cholesterol, smoking status, medical history, and fat distribution may also matter."),
      ],
      { half: true },
    ),
    section(
      "lowest-body-fat",
      "Should You Try to Reach the Lowest Possible Body Fat Percentage?",
      [
        p("No."),
        p("Some body fat is essential for normal physiological function, and extremely low levels can be unhealthy."),
        p("Fitness or athletic reference ranges should also not automatically be treated as goals for everyone. Competitive athletes may have different training, nutrition, and body-composition requirements from the general population."),
        p("Instead of choosing a target solely because it appears on a chart, consider your:"),
        ul("Overall health", "Fitness goals", "Medical history", "Athletic requirements", "Energy levels", "Nutrition", "Sustainable lifestyle"),
        p("If body composition is important because of a medical condition, competitive sport, significant weight change, pregnancy, an eating disorder, or another health concern, discuss your result with a qualified healthcare professional."),
      ],
      { nav: "Lowest body fat?", tone: "frame" },
    ),
    faqSection("Body Fat Percentage Calculator FAQ"),
    section("starting-point", "Use Your Result as a Starting Point", [
      p("Your body fat percentage can help you understand your body composition, but it is only one measurement."),
      p("Use the **Body Fat Percentage Calculator** above to get your estimate, record your result, and compare future measurements using the same method and measuring technique."),
      p("If your goal is to understand your overall weight status as well, try our [BMI Calculator](/bmi-calculator) next. For medical decisions or concerns about unusually high or low body fat, discuss your results with a qualified healthcare professional."),
    ]),
  ],
  faqs: [
    {
      question: "What is a good body fat percentage?",
      answer:
        "There is no universal percentage that is best for everyone. Common reference ranges differ between men and women and can also vary with age, athletic status, health, and the method used to measure body composition.\n\nUse body fat charts as general references rather than strict personal targets.",
    },
    {
      question: "How do I calculate my body fat percentage?",
      answer:
        "The easiest option is to use the Body Fat Percentage Calculator above and enter the requested measurements.\n\nSome calculators estimate body fat using circumference measurements, while other tools may use BMI-based equations or another method. Because different formulas use different inputs, results can vary between calculators.",
    },
    {
      question: "Is BMI the same as body fat percentage?",
      answer:
        "No.\n\nBMI compares weight with height. Body fat percentage estimates how much of your total body weight consists of fat.\n\nThe CDC emphasizes that BMI does not directly measure body fat and cannot distinguish fat mass from muscle and bone.",
    },
    {
      question: "Can two people with the same BMI have different body fat percentages?",
      answer:
        "Yes.\n\nPeople with identical height and weight—and therefore the same BMI—can have different amounts of muscle and fat.\n\nThis is one of the main reasons BMI and body fat percentage should not be treated as interchangeable measurements.",
    },
    {
      question: "Are smart-scale body fat readings accurate?",
      answer:
        "Smart scales usually estimate body composition using bioelectrical impedance.\n\nThey can be useful for monitoring trends, but readings may vary depending on the device and measurement conditions. Rather than assuming each individual reading is exact, use the same device under similar conditions when tracking changes.",
    },
    {
      question: "Is a body fat calculator accurate for athletes?",
      answer:
        "Results may be less representative for people whose body composition differs substantially from the population on which a particular formula was developed.\n\nHighly muscular athletes should therefore interpret calculator results cautiously and may benefit from a professional body-composition assessment when precision is important.",
    },
    {
      question: "Does body fat percentage increase with age?",
      answer:
        "Body composition often changes with age, including changes in lean mass and fat mass, but age alone does not determine what an individual's body fat percentage should be.\n\nResearch using U.S. NHANES DXA data found substantial differences in body-fat distribution across sex and age groups, demonstrating why one universal percentage is not appropriate for every adult.",
    },
    {
      question: "How often should I check my body fat percentage?",
      answer:
        "Checking every day usually provides little useful information because measurement error and normal body changes can obscure meaningful trends.\n\nIf you are tracking fitness or weight-management progress, measuring periodically under similar conditions is generally more useful than focusing on daily fluctuations.",
    },
  ],
};
