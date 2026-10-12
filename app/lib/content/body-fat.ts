import { faqSection, p, section, table, ul, type ToolContent } from "./blocks";

export const bodyFat: ToolContent = {
  intro: "Use our Body Fat Percentage Calculator to estimate body fat for adults (U.S. Navy) and ages 8–17 (RFMp/RFM).",
  lead: [
    p("Use our **Body Fat Percentage Calculator** to estimate how much of your total body weight is made up of fat. Enter the measurements requested in the calculator above to get an estimated body fat percentage and a clearer picture of your body composition."),
    p("**Adults 18+** use the U.S. Navy circumference method. **Ages 8–17** use Relative Fat Mass pediatric (RFMp) or adult RFM equations based on height-to-waist ratio, shown as an estimated range rather than a single hard number."),
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
        p("To calculate body fat percentage, enter the measurements requested by the calculator as accurately as possible. The fields change with age:"),
        ul(
          "Ages 8–17: sex, age, height, weight, and waist (measure at the top of the hip bone / navel level)",
          "Ages 18+: sex, age, height, weight, neck, waist, and hip (women)",
        ),
        p("For children and teens, you can also mark if the child is heavily active or in competitive athletics. When that option is selected, the calculator does not show a body fat percentage because muscle development can skew height-to-waist equations."),
        p("Once you enter the required information, select **Calculate**. Measure the same way each time: a snug tape on bare skin, at the same spot, without pulling the stomach in."),
      ],
      { nav: "How to use", tone: "brand" },
    ),
    section(
      "pediatric-rfmp",
      "Body Fat Estimates for Ages 8–17 (RFMp / RFM)",
      [
        p("For ages **8–17**, this calculator uses Relative Fat Mass equations validated against DXA in NHANES research (Woolcott & Bergman). The estimate relies on the **height-to-waist ratio** and sex—not BMI."),
        ul(
          "Ages 8–14: RFMp = 74 − (22 × height/waist) + (5 × sex)",
          "Ages 15–17: RFM = 64 − (20 × height/waist) + (12 × sex)",
        ),
        p("Sex is coded as 0 for boys and 1 for girls. Height and waist must use the same units (cm or inches). Results are shown as an **estimated range** (about ±2 percentage points) to reflect screening uncertainty."),
        p("Below age 8, automated public equations are not offered here—body fat fluctuates too much for responsible online estimation. For weight-for-height screening in children, use our [BMI Calculator](/bmi-calculator), which includes CDC BMI-for-age percentiles."),
      ],
      { nav: "Ages 8–17" },
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
        p("A **Body Fat Calculator** estimates fat from measurements. It does not scan the fat inside your body, and the result changes with tape placement, body shape, and the formula used."),
        p("Other methods include skinfold calipers, bioelectrical impedance (smart scales), air displacement, underwater weighing, and a DXA scan. No two methods should be expected to return the same percentage."),
      ],
      { nav: "Accuracy" },
    ),
    section(
      "result-changes",
      "Why Your Body Fat Result May Change",
      [
        p("A change in your calculator result does not always mean that your body gained or lost that exact amount of fat."),
        p("Tape and scale readings also move with measurement conditions. A change may reflect:"),
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
        p("For tracking, use the **same calculator and the same procedure**, and read the trend over weeks rather than one reading."),
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
        p("Some body fat is essential, and extremely low levels can be unhealthy. Athletic chart ranges are not automatic goals. Consider your:"),
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
        "Results may be less representative for people whose body composition differs substantially from the population on which a particular formula was developed.\n\nHighly muscular athletes should therefore interpret calculator results cautiously and may benefit from a professional body-composition assessment when precision is important. For ages 8–17, the calculator can suppress a percentage entirely when competitive athletics or high muscularity is indicated.",
    },
    {
      question: "Can this calculator estimate body fat for children and teens?",
      answer:
        "Yes, for ages 8–17 it uses pediatric Relative Fat Mass (RFMp) for ages 8–14 and the adult RFM equation for ages 15–17, based on height and waist circumference.\n\nResults are shown as an estimated range for general screening only and are not a medical diagnosis. Below age 8, the tool does not provide an automated body fat estimate.",
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
