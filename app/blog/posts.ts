import { getPostCard, type PostCard } from "./post-cards";

export type PostFigure = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type PostBlock =
  | { kind: "p"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  | { kind: "table"; caption: string; head: string[]; rows: string[][] }
  | { kind: "figure"; figure: PostFigure };

export type PostSection = {
  heading: string;
  blocks: PostBlock[];
};

export type BlogPost = PostCard & {
  description: string;
  /** Exact document title. The site name is not appended. */
  metaTitle: string;
  metaTitleAbsolute: boolean;
  relatedSlugs: string[];
  publishedAt: string;
  keywords: string[];
  takeaways: string[];
  intro: PostBlock[];
  sections: PostSection[];
  faqs: { question: string; answer: string }[];
};

const barbell: PostFigure = {
  src: "/blog/adult-barbell-strength-training.jpg",
  alt: "Adult in athletic clothes lifting a barbell from the floor during strength training",
  width: 1023,
  height: 682,
  caption:
    "An adult lifting a barbell during strength training. Photo by Homedust via [Flickr](https://www.flickr.com/photo.gne?id=41851164705), licensed [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). Credit: [homedust.com](https://homedust.com/).",
};

const dumbbell: PostFigure = {
  src: "/blog/adult-dumbbell-resistance-training.jpg",
  alt: "Adult holding a dumbbell during a gym resistance-training session",
  width: 1280,
  height: 852,
  caption:
    "An adult using a dumbbell for resistance training. Photo by PattayaPatrol via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:DSC_6393_Bald_man_working_out_with_a_15_lb_dumbbell_looking_off_to_the_side_in_a_bright_gym.jpg), licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).",
};

const homeDumbbell: PostFigure = {
  src: "/blog/adult-home-dumbbell-exercise.jpg",
  alt: "Adult sitting on an exercise mat and raising two dumbbells",
  width: 1024,
  height: 684,
  caption:
    "An adult exercising with dumbbells. Photo by Nenad Stojkovic via [Flickr](https://www.flickr.com/photos/202846129@N03/54579614508), licensed [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/).",
};

const pregnantAdult: PostFigure = {
  src: "/blog/adult-pregnant-holding-abdomen.jpg",
  alt: "Adult in a long-sleeved dress standing in profile with both hands resting on the abdomen",
  width: 1280,
  height: 960,
  caption:
    "An adult wearing a long-sleeved dress and resting both hands on the abdomen. Photo by [NIAID](https://www.flickr.com/photos/niaid/43338546905/) via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Pregnant_woman_(43338546905).jpg), licensed [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). Resized for this page. NIAID has not endorsed this use.",
};

const waistTape: PostFigure = {
  src: "/blog/clinician-waist-circumference-tape.jpg",
  alt: "Clinician holding a tape measure at the waist over clothing",
  width: 1024,
  height: 684,
  caption:
    "A tape measure held at the waist over clothing. Photo by Nenad Stojkovic via [Flickr](https://www.flickr.com/photos/202846129@N03/54584433874), licensed [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/).",
};

export const blogPosts: BlogPost[] = [
  {
    ...getPostCard("how-accurate-are-due-dates-for-pregnancy"),
    metaTitle: "How Accurate Are Due Dates for Pregnancy? Explained",
    metaTitleAbsolute: true,
    description:
      "How accurate are due dates for pregnancy? Learn how ultrasound and last-period estimates work, why dates change, and when babies typically arrive.",
    relatedSlugs: [],
    publishedAt: "2026-10-16",
    keywords: [
      "how accurate are due dates for pregnancy",
      "pregnancy due date accuracy",
      "ultrasound due date accuracy",
      "due date based on last period",
      "how often are babies born on their due date",
    ],
    takeaways: [
      "A due date is an estimate. According to ACOG, only about 1 in 20 women give birth on that exact day.",
      "A first-trimester ultrasound is the most accurate ultrasound method for establishing gestational age.",
      "A last-period calculation assumes a 28-day cycle, so irregular or uncertain cycles can make that estimate less reliable.",
      "An online calculator can apply the standard formula, but a healthcare professional confirms the date used for care.",
    ],
    intro: [
      {
        kind: "p",
        text: "**How accurate are due dates for pregnancy?** A due date is a useful estimate of when your baby may arrive, but it is not an exact prediction of the day you will give birth. In fact, according to the American College of Obstetricians and Gynecologists (ACOG), only about 1 in 20 women give birth on their estimated due date.",
      },
      {
        kind: "p",
        text: "Your due date helps healthcare professionals track your pregnancy, schedule important tests, and assess your baby's development. However, the actual day of delivery can vary because pregnancy length is not identical for everyone.",
      },
      {
        kind: "p",
        text: "The accuracy of your estimated due date also depends on how it was calculated. A date based on your last menstrual period may differ from one established through an early ultrasound.",
      },
      {
        kind: "p",
        text: "Understanding these differences can help you plan for your baby's arrival without expecting everything to happen on one particular day.",
      },
      { kind: "figure", figure: pregnantAdult },
    ],
    faqs: [
      {
        question: "Are pregnancy due dates usually accurate?",
        answer:
          "Due dates can be useful estimates of gestational age, especially when established through an early ultrasound. However, they are not highly accurate at predicting the exact day of birth. Only about 5% of women give birth on their estimated due date, according to ACOG.",
      },
      {
        question: "Is the ultrasound due date more accurate than the last period?",
        answer:
          "A first-trimester ultrasound is generally the most accurate ultrasound method for estimating gestational age. It can be particularly helpful when menstrual cycles are irregular or the last-period date is uncertain. Healthcare professionals determine the best date using the available clinical information.",
      },
      {
        question: "How many days can a pregnancy due date be off?",
        answer:
          "The uncertainty depends on the dating method and when it is performed. First-trimester ultrasound dating generally has an accuracy of approximately ±5–7 days, while later ultrasound dating is less precise. These ranges describe uncertainty in gestational age, not how many days before or after the due date labor will occur.",
      },
      {
        question: "Can a due date change by two weeks?",
        answer:
          "It can, particularly when the original estimate was based on uncertain menstrual dates and later clinical information indicates a meaningful difference. Whether a change is appropriate depends on the timing and reliability of the ultrasound and other dating information.",
      },
      {
        question: "Is a due date calculator accurate?",
        answer:
          "A due date calculator can correctly apply a standard formula to the information entered. Its usefulness depends on the accuracy of that information and whether the assumptions fit your menstrual cycle. It cannot predict the exact day labor will begin.",
      },
      {
        question: "Can a baby arrive before or after the due date?",
        answer:
          "Yes. Babies can be born before or after their estimated due date. The date is used to guide pregnancy care, but the timing of delivery varies from one pregnancy to another.",
      },
    ],
    sections: [
      {
        heading: "How Accurate Are Due Dates for Pregnancy?",
        blocks: [
          {
            kind: "p",
            text: "Pregnancy due dates are generally more reliable for estimating how far along a pregnancy is than for predicting the exact day of birth.",
          },
          {
            kind: "p",
            text: "An estimated due date (EDD) represents the point at which a pregnancy reaches 40 weeks, calculated using standard pregnancy dating methods.",
          },
          {
            kind: "p",
            text: "However, labor does not automatically begin at 40 weeks. Some babies arrive before their due date, while others arrive afterward.",
          },
          {
            kind: "p",
            text: "According to [ACOG's pregnancy development guidance](https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy), approximately 5% of women give birth on their estimated due date.",
          },
          {
            kind: "p",
            text: "This means that even a carefully calculated due date should be viewed as a reference point rather than a guaranteed delivery date.",
          },
          { kind: "p", text: "There are also two different types of accuracy to consider:" },
          {
            kind: "list",
            items: [
              "**Gestational age accuracy:** How accurately a method estimates the number of weeks and days you have been pregnant.",
              "**Delivery date prediction:** Whether your baby will actually be born on the estimated date.",
            ],
          },
          {
            kind: "p",
            text: "An early ultrasound can provide a relatively accurate estimate of gestational age, but it cannot determine exactly when labor will begin.",
          },
        ],
      },
      {
        heading: "How Is a Pregnancy Due Date Calculated?",
        blocks: [
          {
            kind: "p",
            text: "Healthcare professionals commonly estimate due dates using the first day of the last menstrual period (LMP), ultrasound measurements, or assisted reproduction dates when applicable.",
          },
          { kind: "p", text: "Each method uses different information to estimate when a pregnancy reaches 40 weeks." },
          { kind: "h3", text: "Due Date Based on Last Menstrual Period" },
          {
            kind: "p",
            text: "The traditional calculation adds 280 days, or 40 weeks, to the first day of your last menstrual period.",
          },
          {
            kind: "p",
            text: "For example, if your last period began on January 1, your estimated due date would be around October 8 of the same non-leap year.",
          },
          {
            kind: "p",
            text: "This method assumes a menstrual cycle of approximately 28 days, with ovulation occurring around day 14.",
          },
          {
            kind: "p",
            text: "However, not everyone ovulates on the same day. If your cycle is longer, shorter, or irregular, the estimate based on your last period may be less reliable.",
          },
          {
            kind: "p",
            text: "You can explore this calculation using a [Pregnancy Due Date Calculator](/pregnancy-due-date-calculator). An online estimate is useful for initial planning, but your healthcare professional should confirm the date used for medical care.",
          },
          { kind: "h3", text: "Due Date Based on Ultrasound" },
          { kind: "p", text: "An ultrasound estimates gestational age by measuring the developing embryo or fetus." },
          {
            kind: "p",
            text: "During early pregnancy, healthcare professionals commonly use a measurement called crown-rump length (CRL), which measures the embryo or fetus from the top of the head to the bottom of the torso.",
          },
          {
            kind: "p",
            text: "This measurement is especially useful when the date of your last period is uncertain or your menstrual cycles are irregular.",
          },
          {
            kind: "p",
            text: "According to [ACOG's guidance on estimating due dates](https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date), first-trimester ultrasound is the most accurate ultrasound method for establishing or confirming gestational age.",
          },
          { kind: "h3", text: "Due Date After IVF" },
          {
            kind: "p",
            text: "Pregnancies resulting from in vitro fertilization (IVF) can be dated using the embryo's age and the date of embryo transfer.",
          },
          {
            kind: "p",
            text: "Because this information is known, the dating method does not need to rely on an assumed ovulation date.",
          },
          {
            kind: "p",
            text: "Healthcare professionals use the relevant treatment records to establish the estimated due date.",
          },
          {
            kind: "p",
            text: "Even with accurately known embryo-transfer dates, the actual day of birth remains unpredictable.",
          },
        ],
      },
      {
        heading: "How Accurate Is an Ultrasound Due Date?",
        blocks: [
          { kind: "p", text: "Ultrasound due date accuracy depends largely on when the scan is performed." },
          {
            kind: "p",
            text: "Measurements taken early in pregnancy are generally more useful for establishing gestational age because differences in fetal size become more pronounced as pregnancy progresses.",
          },
          { kind: "h3", text: "First Trimester Ultrasound Dating Accuracy" },
          {
            kind: "p",
            text: "A first-trimester ultrasound, performed up to 13 weeks and 6 days, is considered the most accurate ultrasound method for dating a pregnancy.",
          },
          {
            kind: "p",
            text: "ACOG reports that crown-rump length measurements during this period generally estimate gestational age within approximately 5–7 days.",
          },
          {
            kind: "p",
            text: "That does not mean your baby is expected to arrive within exactly five to seven days of the due date. The range describes the accuracy of the gestational age estimate, not the timing of spontaneous labor.",
          },
          { kind: "h3", text: "Second Trimester Ultrasound Accuracy" },
          { kind: "p", text: "Ultrasound dating becomes less precise during the second trimester." },
          { kind: "p", text: "According to ACOG:" },
          {
            kind: "list",
            items: [
              "Between 14 weeks and 21 weeks and 6 days, dating accuracy is approximately ±7–10 days.",
              "Between 22 weeks and 27 weeks and 6 days, accuracy is approximately ±10–14 days.",
            ],
          },
          {
            kind: "p",
            text: "At this stage, healthcare professionals assess several measurements, including the baby's head, abdomen, and thigh bone.",
          },
          {
            kind: "p",
            text: "If an earlier reliable ultrasound has already established the due date, a later scan usually does not replace it simply because the baby's measurements differ.",
          },
          { kind: "h3", text: "Third Trimester Ultrasound Accuracy" },
          {
            kind: "p",
            text: "Ultrasound is least reliable for establishing gestational age during the third trimester.",
          },
          { kind: "p", text: "ACOG reports a dating accuracy of approximately ±21–30 days after 28 weeks." },
          {
            kind: "p",
            text: "By this point, normal differences in fetal growth can make it difficult to distinguish a baby's individual size from the pregnancy's actual gestational age.",
          },
          {
            kind: "p",
            text: "For that reason, healthcare professionals generally rely on the earliest reliable dating information rather than repeatedly changing the due date based on later growth scans.",
          },
          {
            kind: "p",
            text: "**Medical reference:** [ACOG — Methods for Estimating the Due Date](https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date)",
          },
        ],
      },
      {
        heading: "Why Pregnancy Due Dates Can Be Wrong",
        blocks: [
          {
            kind: "p",
            text: "An estimated due date may differ from the most accurate clinical estimate for several reasons.",
          },
          { kind: "h3", text: "Irregular Menstrual Cycles" },
          {
            kind: "p",
            text: "The standard last-period calculation assumes ovulation around day 14 of a 28-day cycle.",
          },
          {
            kind: "p",
            text: "Someone with a 35-day cycle may ovulate later than this assumption suggests, while someone with a shorter cycle may ovulate earlier.",
          },
          {
            kind: "p",
            text: "As a result, the last-period estimate may not match the gestational age established by ultrasound.",
          },
          { kind: "h3", text: "Uncertain Last Period Date" },
          { kind: "p", text: "Some people cannot remember the exact first day of their last menstrual period." },
          {
            kind: "p",
            text: "Light bleeding, irregular cycles, or uncertainty about whether bleeding was a normal period can also make menstrual dating less reliable.",
          },
          { kind: "p", text: "An early ultrasound may help establish a more dependable estimate." },
          { kind: "h3", text: "Differences in Ovulation Timing" },
          {
            kind: "p",
            text: "Even people with fairly regular cycles do not necessarily ovulate on exactly the same day every month.",
          },
          {
            kind: "p",
            text: "Because fertilization generally occurs around ovulation, variation in its timing can affect calculations that assume a fixed conception date.",
          },
          { kind: "h3", text: "Late Pregnancy Ultrasound Measurements" },
          {
            kind: "p",
            text: "A baby measuring larger or smaller than average during a later scan does not necessarily mean the original due date was incorrect.",
          },
          {
            kind: "p",
            text: "Differences in fetal growth can influence ultrasound measurements, especially in the third trimester.",
          },
          {
            kind: "p",
            text: "Healthcare professionals consider the pregnancy's dating history and clinical findings before deciding whether a due date should change.",
          },
        ],
      },
      {
        heading: "How Often Are Babies Born on Their Due Date?",
        blocks: [
          { kind: "p", text: "Only a small proportion of babies arrive on their exact estimated due date." },
          { kind: "p", text: "ACOG states that approximately 1 in 20 women give birth on the predicted date." },
          { kind: "p", text: "This is why an estimated due date should not be treated as a fixed appointment." },
          {
            kind: "p",
            text: "Some pregnancies reach full term before 40 weeks, while others continue beyond that point.",
          },
          { kind: "p", text: "For clinical purposes, pregnancy timing is commonly described using these categories:" },
          {
            kind: "table",
            caption: "Clinical categories used to describe pregnancy duration",
            head: ["Pregnancy duration", "Classification"],
            rows: [
              ["Before 37 weeks", "Preterm"],
              ["37 weeks to 38 weeks, 6 days", "Early term"],
              ["39 weeks to 40 weeks, 6 days", "Full term"],
              ["41 weeks to 41 weeks, 6 days", "Late term"],
              ["42 weeks and beyond", "Postterm"],
            ],
          },
          { kind: "p", text: "These categories help healthcare professionals describe pregnancy duration and guide care." },
          {
            kind: "p",
            text: "They do not mean that every pregnancy will follow the same timeline or that delivery at any point in these ranges carries identical risks.",
          },
        ],
      },
      {
        heading: "Can Your Pregnancy Due Date Change?",
        blocks: [
          {
            kind: "p",
            text: "Yes. A healthcare professional may revise an estimated due date when more reliable dating information becomes available.",
          },
          {
            kind: "p",
            text: "For example, an early ultrasound might show that the pregnancy is several days earlier or later than expected from the last menstrual period.",
          },
          {
            kind: "p",
            text: "Whether the date should change depends on the timing of the ultrasound, the size of the discrepancy, and how reliable the original menstrual dating information is.",
          },
          { kind: "p", text: "However, due dates are not normally changed after every ultrasound." },
          {
            kind: "p",
            text: "ACOG recommends establishing and documenting the best estimated due date early in pregnancy. Subsequent changes should be reserved for relatively uncommon circumstances and discussed with the patient.",
          },
          {
            kind: "p",
            text: "If your due date changes, ask your healthcare professional which measurement was used and why the revised estimate is considered more reliable.",
          },
        ],
      },
      {
        heading: "Which Pregnancy Due Date Method Is Most Accurate?",
        blocks: [
          {
            kind: "p",
            text: "The most appropriate dating method depends on the information available and how early it was obtained.",
          },
          {
            kind: "table",
            caption: "Dating methods and the main consideration for each",
            head: ["Dating method", "Main consideration"],
            rows: [
              ["Last menstrual period", "Useful when the date is known and cycles are regular"],
              ["First-trimester ultrasound", "Most accurate ultrasound method for establishing gestational age"],
              ["Second-trimester ultrasound", "Useful when earlier reliable dating is unavailable, but less precise"],
              ["Third-trimester ultrasound", "Least reliable for establishing gestational age"],
              ["IVF embryo-transfer dating", "Uses known embryo age and transfer date"],
            ],
          },
          {
            kind: "p",
            text: "If the last menstrual period and early ultrasound suggest different dates, healthcare professionals use established clinical guidelines to determine which estimate should be used.",
          },
          {
            kind: "p",
            text: "A calculator can provide a helpful starting point, but it cannot replace ultrasound findings or individualized clinical assessment.",
          },
        ],
      },
      {
        heading: "How to Estimate Your Pregnancy Due Date at Home",
        blocks: [
          {
            kind: "p",
            text: "If you know the first day of your last menstrual period, you can calculate an initial estimated due date before your prenatal appointment.",
          },
          { kind: "h3", text: "Step 1: Find the First Day of Your Last Period" },
          { kind: "p", text: "Use the first day your most recent menstrual period began, not the day it ended." },
          {
            kind: "p",
            text: "If you are unsure of the date, avoid guessing with too much confidence. Your healthcare professional can help establish a more reliable estimate.",
          },
          { kind: "h3", text: "Step 2: Calculate 40 Weeks From That Date" },
          { kind: "p", text: "The standard calculation adds 280 days to the first day of the last menstrual period." },
          { kind: "p", text: "This provides an estimated date based on the conventional 28-day menstrual cycle." },
          { kind: "h3", text: "Step 3: Use an Online Pregnancy Due Date Calculator" },
          {
            kind: "p",
            text: "Instead of counting the days manually, you can use the [Pregnancy Due Date Calculator](/pregnancy-due-date-calculator) to obtain an initial estimate.",
          },
          { kind: "p", text: "The result can help you understand your expected pregnancy timeline." },
          { kind: "h3", text: "Step 4: Confirm the Date During Prenatal Care" },
          {
            kind: "p",
            text: "Share your menstrual history and any available ultrasound information with your healthcare professional.",
          },
          {
            kind: "p",
            text: "They can determine the estimated due date that should be used for pregnancy monitoring and medical decisions.",
          },
        ],
      },
      {
        heading: "What If Your Due Date Passes and You Are Still Pregnant?",
        blocks: [
          {
            kind: "p",
            text: "Reaching your estimated due date without going into labor does not automatically mean something is wrong.",
          },
          {
            kind: "p",
            text: "However, the timing of prenatal monitoring and any discussion about induction becomes more important as pregnancy continues.",
          },
          {
            kind: "p",
            text: "Your healthcare professional may recommend additional assessments or discuss delivery planning based on your gestational age, medical history, and individual circumstances.",
          },
          { kind: "p", text: "Do not change your due date yourself simply because labor has not started." },
          {
            kind: "p",
            text: "If you are past your estimated due date, contact your maternity care team for advice about your next appointment and any recommended monitoring. Seek prompt medical assessment for reduced fetal movements, vaginal bleeding, or other concerning symptoms, regardless of your due date.",
          },
        ],
      },
      {
        heading: "Final Thoughts",
        blocks: [
          {
            kind: "p",
            text: "So, **how accurate are due dates for pregnancy?** They are valuable estimates for tracking gestational age and planning prenatal care, but they cannot reliably predict the exact day your baby will arrive.",
          },
          {
            kind: "p",
            text: "A first-trimester ultrasound generally provides the most accurate ultrasound-based estimate of gestational age. Last-period calculations can also be useful, particularly when menstrual cycles are regular and the date is known.",
          },
          {
            kind: "p",
            text: "If you want an initial estimate, try the [Pregnancy Due Date Calculator](/pregnancy-due-date-calculator). For medical decisions, rely on the due date confirmed by your healthcare professional.",
          },
        ],
      },
      {
        heading: "Medical References",
        blocks: [
          {
            kind: "list",
            items: [
              "[American College of Obstetricians and Gynecologists — Methods for Estimating the Due Date](https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date)",
              "[American College of Obstetricians and Gynecologists — How Your Fetus Grows During Pregnancy](https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy)",
              "[American College of Obstetricians and Gynecologists — Management of Suboptimally Dated Pregnancies](https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/03/management-of-suboptimally-dated-pregnancies)",
            ],
          },
        ],
      },
      {
        heading: "Medical Disclaimer",
        blocks: [
          {
            kind: "p",
            text: "This article provides general educational information and is not a substitute for professional prenatal care or individualized medical advice. Also read the [Disclaimer](/disclaimer).",
          },
        ],
      },
    ],
  },
  {
    ...getPostCard("why-bmi-is-not-accurate-for-muscular-people"),
    metaTitle: "Why BMI Is Not Accurate for Muscular People: Explained",
    metaTitleAbsolute: true,
    description:
      "Find out why BMI is not accurate for muscular people, how muscle mass affects BMI results, and which other measurements can provide more context.",
    relatedSlugs: [],
    publishedAt: "2026-10-10",
    keywords: [
      "why BMI is not accurate for muscular people",
      "BMI for athletes",
      "muscle mass and BMI",
      "high BMI low body fat",
      "BMI vs body fat percentage",
    ],
    takeaways: [
      "BMI uses only height and weight, so it cannot tell muscle from body fat.",
      "Muscle is denser than fat, so a muscular person can have a high BMI with relatively low body fat.",
      "Standard adult BMI categories are screening ranges. They do not measure body fat.",
      "Waist size, body-composition checks, and clinical findings add context that BMI cannot provide.",
    ],
    intro: [
      {
        kind: "p",
        text: "If you exercise regularly, lift weights, or play sports, you may have noticed that your Body Mass Index (BMI) result seems higher than you expected. This raises an important question: **why BMI is not accurate for muscular people**, even when they are physically active and have a relatively low body fat level. The reason is that BMI uses only height and weight, so it cannot distinguish muscle from body fat.",
      },
      {
        kind: "p",
        text: "BMI is widely used as a screening tool to assess weight in relation to height. It can provide useful information for many people, but it does not tell the whole story about an individual's body composition. Understanding its limitations can help you interpret your result more accurately without relying on a single number to judge your health.",
      },
      { kind: "figure", figure: barbell },
    ],
    faqs: [
      {
        question: "Why can muscular people have a high BMI?",
        answer:
          "Muscular people may have a high BMI because additional muscle increases total body weight. Since BMI uses only height and weight, it cannot distinguish muscle mass from body fat.",
      },
      {
        question: "Can you be overweight according to BMI but not have excess body fat?",
        answer:
          "Yes. Some people with substantial muscle mass may fall into the standard overweight category despite having relatively low body fat. BMI alone cannot determine their exact body composition.",
      },
      {
        question: "Is BMI accurate for bodybuilders?",
        answer:
          "BMI has limitations for bodybuilders because their muscle mass can contribute substantially to their total weight. Their results should be interpreted alongside other measurements and relevant health information.",
      },
      {
        question: "Is body fat percentage better than BMI?",
        answer:
          "Body fat percentage provides a different type of information by estimating the proportion of body weight that is fat. It may be useful for understanding body composition, especially in muscular people, but its accuracy depends on the measurement method. Neither measurement provides a complete assessment of health on its own.",
      },
      {
        question: "Should athletes use a BMI calculator?",
        answer:
          "Athletes can use a BMI calculator as an initial screening tool, but they should recognize its limitations. Because athletic training can increase muscle mass, BMI may not accurately reflect body fat in every athlete.",
      },
      {
        question: "Does a high BMI always mean poor health?",
        answer:
          "No. A high BMI does not automatically establish that a person has poor health or excess body fat. It is one screening measure that should be interpreted alongside other health indicators and individual circumstances.",
      },
    ],
    sections: [
      {
        heading: "What Is BMI and How Is It Calculated?",
        blocks: [
          {
            kind: "p",
            text: "Body Mass Index is a numerical measurement calculated using your weight and height. It is commonly used to screen for weight categories in adults.",
          },
          { kind: "p", text: "The metric formula is:" },
          { kind: "p", text: "**BMI = weight in kilograms ÷ height in meters squared**" },
          {
            kind: "p",
            text: "For example, if a person weighs 80 kg and is 1.80 meters tall, the calculation is:",
          },
          { kind: "p", text: "BMI = 80 ÷ (1.80 × 1.80)" },
          { kind: "p", text: "BMI = 24.7" },
          {
            kind: "p",
            text: "This result falls within the standard healthy-weight range for adults. However, BMI does not directly measure body fat, muscle mass, or the distribution of fat around the body. The Centers for Disease Control and Prevention (CDC) explains that muscle, bone, and fat all contribute to body weight, but BMI cannot separate them. [CDC BMI guidance](https://www.cdc.gov/bmi/faq/)",
          },
          {
            kind: "p",
            text: "You can calculate your own result using our [BMI Calculator](/bmi-calculator). Keep in mind that the result is a screening measurement, not a complete assessment of body composition.",
          },
        ],
      },
      {
        heading: "Why BMI Is Not Accurate for Muscular People",
        blocks: [
          {
            kind: "p",
            text: "The main limitation is that BMI treats body weight as a single number without considering what that weight consists of. Two people with the same height and weight will have the same BMI, even if one has considerably more muscle and the other has more body fat.",
          },
          {
            kind: "p",
            text: "Muscle is denser than fat, meaning a given volume of muscle weighs more than the same volume of fat. As a result, people who develop substantial muscle through strength training or sports may weigh more for their height than someone with less muscle.",
          },
          {
            kind: "p",
            text: "This can place a muscular person in the overweight BMI category, or even the obesity category, without BMI alone establishing whether they have excess body fat.",
          },
          {
            kind: "p",
            text: "That does not mean every muscular person with a high BMI is healthy or that BMI is useless. It means the number needs to be interpreted alongside other relevant information, such as waist measurements, medical history, physical examination findings, and other health indicators. [CDC BMI FAQs](https://www.cdc.gov/bmi/faq/)",
          },
        ],
      },
      {
        heading: "How Muscle Mass Affects BMI Results",
        blocks: [
          {
            kind: "p",
            text: "Muscle mass can influence BMI results in several ways, particularly for people who participate in regular resistance training or competitive sports.",
          },
          { kind: "figure", figure: dumbbell },
          { kind: "h3", text: "Muscular People May Have a High BMI but Low Body Fat" },
          {
            kind: "p",
            text: "A person who has developed substantial muscle may have a higher body weight than expected for their height. Since the BMI formula does not account for muscle mass, it may classify that person as overweight even when their body fat level is relatively low.",
          },
          {
            kind: "p",
            text: "For example, two adults may have the same height and similar body weights, but different proportions of muscle and fat. Their BMI values would be similar, although their body composition could be quite different.",
          },
          {
            kind: "p",
            text: "This is one reason a high BMI should not automatically be interpreted as proof of excess body fat.",
          },
          { kind: "h3", text: "Why Athletes Can Have a High BMI" },
          {
            kind: "p",
            text: "Athletes involved in weightlifting, bodybuilding, rugby, and other strength-based sports may develop more muscle than the average person. Their additional lean mass can increase their weight and, consequently, their BMI.",
          },
          {
            kind: "p",
            text: "An athlete with a high BMI may therefore need a more detailed assessment before drawing conclusions about body fat or health risk. Training history, waist size, body composition, and other clinical findings can help provide additional context.",
          },
          {
            kind: "p",
            text: "Being athletic does not automatically mean a person has low body fat, however. BMI is only one piece of information, and athletic status alone cannot establish someone's overall health.",
          },
          { kind: "h3", text: "Does Muscle Weigh More Than Fat?" },
          {
            kind: "p",
            text: "Muscle does weigh more than fat when comparing equal volumes. This is because muscle tissue is denser than fat tissue.",
          },
          {
            kind: "p",
            text: "For example, if a person gains muscle while losing some fat, their weight may change very little even though their body composition has changed. This is why scale weight and BMI may not fully reflect progress in strength training or changes in body composition.",
          },
          {
            kind: "p",
            text: "The important distinction is between weight and composition: BMI measures weight relative to height, not the amount of muscle or fat in the body.",
          },
        ],
      },
      {
        heading: "BMI Categories for Muscular People",
        blocks: [
          {
            kind: "p",
            text: "Standard BMI categories are commonly used to interpret adult results. They can be useful for initial screening, but they do not account for an individual's muscle mass.",
          },
          {
            kind: "table",
            caption: "Standard adult BMI categories used for screening",
            head: ["Adult BMI", "Standard category"],
            rows: [
              ["Below 18.5", "Underweight"],
              ["18.5 to 24.9", "Healthy weight"],
              ["25.0 to 29.9", "Overweight"],
              ["30.0 or higher", "Obesity"],
            ],
          },
          {
            kind: "p",
            text: "These categories are intended for screening adults, not for directly measuring body fat. A muscular person may fall into a higher category because of their weight, but the category alone cannot determine whether that weight comes primarily from muscle or excess fat.",
          },
          {
            kind: "p",
            text: "Likewise, a BMI within the standard healthy-weight range does not guarantee that someone has a healthy body fat level. BMI should be considered alongside other information rather than used as a standalone diagnosis. [CDC adult BMI information](https://www.cdc.gov/bmi/about/index.html)",
          },
        ],
      },
      {
        heading: "BMI vs Body Fat Percentage: What's the Difference?",
        blocks: [
          { kind: "p", text: "BMI and body fat percentage provide different types of information." },
          { kind: "figure", figure: homeDumbbell },
          {
            kind: "p",
            text: "**BMI** compares body weight with height. It is simple to calculate and useful for general screening, but it does not separate fat mass from lean mass.",
          },
          {
            kind: "p",
            text: "**Body fat percentage** estimates how much of a person's total body weight consists of fat. This can offer more direct information about body composition, although the accuracy of the estimate depends on the measurement method used.",
          },
          {
            kind: "p",
            text: "For muscular individuals, body fat percentage may help explain why a BMI result appears high. However, body fat measurements also have limitations, and no single number captures every aspect of health.",
          },
          {
            kind: "p",
            text: "Other measurements, such as waist circumference, can provide useful context about abdominal fat. A healthcare professional can help determine which assessments are appropriate for an individual's circumstances. [NIDDK: Am I at a Healthy Weight?](https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/am-i-healthy-weight)",
          },
        ],
      },
      {
        heading: "How to Measure Body Fat Beyond BMI",
        blocks: [
          {
            kind: "p",
            text: "If you have a high BMI and a muscular build, there are several ways to get a more complete picture of your body composition and health.",
          },
          { kind: "figure", figure: waistTape },
          { kind: "h3", text: "Measure Waist Circumference" },
          {
            kind: "p",
            text: "Waist circumference can help assess abdominal size and provide additional information about health risks associated with fat around the abdomen. It is useful alongside BMI, although it does not directly measure body fat percentage.",
          },
          {
            kind: "p",
            text: "For consistent tracking, use the same measurement method each time and follow reliable guidance on where and how to measure your waist.",
          },
          { kind: "h3", text: "Consider a Body Composition Assessment" },
          {
            kind: "p",
            text: "Body composition methods estimate how much of your body consists of fat and lean tissue. Options include bioelectrical impedance analysis (BIA) and dual-energy X-ray absorptiometry (DXA).",
          },
          {
            kind: "p",
            text: "These methods differ in availability, cost, and accuracy. Results can also be affected by the equipment and measurement conditions, so they should be interpreted appropriately rather than treated as perfect measurements.",
          },
          { kind: "h3", text: "Review Other Health Indicators" },
          {
            kind: "p",
            text: "Blood pressure, cholesterol levels, blood glucose, medical history, and physical examination findings can help provide a broader picture of health. Which indicators matter most depends on the individual.",
          },
          {
            kind: "p",
            text: "If your BMI seems inconsistent with your physique or fitness level, discuss the result with a qualified healthcare professional instead of making decisions based on BMI alone.",
          },
        ],
      },
      {
        heading: "Should Muscular People Ignore BMI?",
        blocks: [
          {
            kind: "p",
            text: "No. BMI can still provide useful screening information for muscular people, but it should not be the only measurement used to assess health or body fat.",
          },
          {
            kind: "p",
            text: "A high result may partly reflect additional muscle mass, but it may also indicate excess body fat. The number alone cannot tell you which explanation applies.",
          },
          {
            kind: "p",
            text: "Similarly, regular exercise and visible muscle definition do not automatically rule out health risks. It is more useful to consider BMI together with body composition, waist measurements, lifestyle, and relevant clinical findings.",
          },
          {
            kind: "p",
            text: "For people who strength train, it can also help to track changes over time. Weight, waist circumference, training performance, and other appropriate measurements may provide a clearer picture than focusing on BMI alone.",
          },
        ],
      },
      {
        heading: "How to Use a BMI Calculator More Effectively",
        blocks: [
          {
            kind: "p",
            text: "A BMI calculator is a convenient starting point for understanding the relationship between your height and weight. To use the result responsibly:",
          },
          {
            kind: "list",
            ordered: true,
            items: [
              "Enter your current height and weight as accurately as possible.",
              "Review the BMI result and the standard category shown.",
              "Remember that the result does not distinguish muscle from fat.",
              "Consider additional measurements if you have a highly muscular build.",
              "Consult a healthcare professional if you have concerns about your weight or health risks.",
            ],
          },
          {
            kind: "p",
            text: "You can use the [BMI Calculator](/bmi-calculator) to calculate your BMI. Treat the result as one screening measure rather than a definitive statement about your fitness or overall health.",
          },
        ],
      },
      {
        heading: "Final Thoughts",
        blocks: [
          {
            kind: "p",
            text: "BMI is a useful and accessible way to compare weight with height, but it has limitations when applied to people with substantial muscle mass. The reason why BMI is not accurate for muscular people in some cases is that the formula cannot distinguish between muscle, fat, and bone.",
          },
          {
            kind: "p",
            text: "If you lift weights, play sports, or have a naturally muscular build, do not rely on your BMI result alone to judge your body composition. Consider other measurements and relevant health information for a more complete understanding.",
          },
          {
            kind: "p",
            text: "To get started, use the [BMI Calculator](/bmi-calculator) to find your BMI, then interpret the result in context. If you are unsure what your result means for your health, a qualified healthcare professional can help you understand it.",
          },
        ],
      },
      {
        heading: "Sources",
        blocks: [
          {
            kind: "p",
            text: "The screening limits described above come from public health sources. They are included so the categories and caveats can be checked against the original guidance.",
          },
          {
            kind: "list",
            items: [
              "[CDC: About Body Mass Index](https://www.cdc.gov/bmi/about/index.html)",
              "[CDC: BMI frequently asked questions](https://www.cdc.gov/bmi/faq/)",
              "[NIDDK: Am I at a Healthy Weight?](https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity/am-i-healthy-weight)",
            ],
          },
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

export function plainPostText(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
