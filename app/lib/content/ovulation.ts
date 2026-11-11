import { action, cards, eq, faqSection, p, section, sub, table, ul, type ToolContent } from "./blocks";

export const ovulation: ToolContent = {
  intro:
    "Estimate your ovulation date, fertile window, peak fertility days, and upcoming cycles using your last period and average cycle length.",
  notice: [
    "These results are estimates, not a medical diagnosis. Ovulation can occur earlier or later than predicted, even when your periods are usually regular.",
    "If your cycles are irregular, frequently absent, or you have concerns about fertility, speak with a healthcare professional. [How Our Calculators Work](/about-us).",
  ],
  article: [
    section(
      "about",
      "About This Ovulation Calculator",
      [
        p("This Ovulation Calculator estimates when ovulation may occur and identifies the days in your menstrual cycle when pregnancy may be more likely."),
        p("Enter the first day of your last menstrual period and your average cycle length. The calculator then estimates your next period, likely ovulation date, fertile window, and upcoming cycle dates."),
        p("Calendar calculations cannot confirm that ovulation occurred. Use your results as a planning guide rather than an exact prediction."),
      ],
      { nav: "About" },
    ),
    section(
      "how-to",
      "How to Use the Ovulation Calculator",
      [
        p("Using the calculator requires two pieces of information:"),
        ul(
          "**First day of your last period:** Enter the first day of normal menstrual bleeding. Do not use the final day of your period or light spotting that occurred before your period began.",
          "**Average cycle length:** Enter the average number of days from the first day of one period to the first day of the next.",
        ),
        p("Select **Calculate** to see your estimated fertile window and ovulation date."),
        p("If your cycle lengths vary, calculate an average using several recent cycles rather than automatically choosing 28 days."),
        p("**Example.** If your recent cycles were:"),
        ul("28 days", "30 days", "29 days", "31 days", "29 days"),
        p("your average cycle length would be about **29–30 days**."),
      ],
      { nav: "How to use" },
    ),
    section(
      "how-it-works",
      "How Does the Ovulation Calculator Work?",
      [
        p("The calculator first estimates when your next period may begin based on the cycle length you enter. It then works backward to estimate when ovulation may occur."),
        p("A simplified calendar estimate is:"),
        eq("Expected next period = first day of last period + average cycle length"),
        eq("Estimated ovulation = approximately 14 days before the expected next period"),
        p("This is an estimate rather than a biological measurement. The time between ovulation and the next period is not identical for everyone."),
        p("For example:"),
        table(
          ["Average Cycle Length", "Approximate Ovulation Estimate"],
          ["26 days", "Around cycle day 12"],
          ["28 days", "Around cycle day 14"],
          ["30 days", "Around cycle day 16"],
          ["32 days", "Around cycle day 18"],
        ),
        p("These examples should not be treated as exact ovulation dates."),
      ],
      { nav: "How it works", tone: "brand" },
    ),
    section(
      "what-is-ovulation",
      "What Is Ovulation?",
      [
        p("Ovulation is the release of an egg from an ovary during the menstrual cycle."),
        p("If sperm fertilizes the egg, pregnancy may occur. Because sperm can survive for several days before ovulation, pregnancy is possible from intercourse that takes place before the egg is released."),
        p("Ovulation does not occur on the same cycle day for everyone, and it may shift from one month to another."),
      ],
      { nav: "What is ovulation", half: true },
    ),
    section(
      "fertile-window",
      "What Is the Fertile Window?",
      [
        p("The fertile window is the group of days during the menstrual cycle when intercourse may result in pregnancy."),
        p("The American Society for Reproductive Medicine describes the fertile window as approximately the **six-day period ending on the day of ovulation**."),
        p("This window exists because sperm may remain viable for several days, while the egg remains viable for a much shorter period after ovulation."),
        p("That is why estimating a fertile range is more useful than focusing on a single predicted ovulation date."),
      ],
      { nav: "Fertile window", half: true },
    ),
    section(
      "most-fertile-days",
      "When Are You Most Fertile?",
      [
        p("Fertility is generally highest close to ovulation, particularly during the days immediately before the egg is released."),
        p("For someone with a textbook 28-day cycle, an example might look like this:"),
        table(
          ["Cycle Event", "Example"],
          ["Period begins", "Day 1"],
          ["Fertile window begins", "Around Day 9"],
          ["Peak fertility", "Around Days 12–14"],
          ["Estimated ovulation", "Around Day 14"],
          ["Next period", "Around Day 28"],
        ),
        p("This is only an example. Your own dates depend on your cycle length and natural cycle-to-cycle variation."),
      ],
      { nav: "Most fertile days" },
    ),
    section(
      "day-14",
      "Does Ovulation Always Happen on Day 14?",
      [
        p("No."),
        p("Day 14 is commonly used as an example because it roughly corresponds with ovulation in a 28-day cycle. It is not a universal rule."),
        p("The NHS notes that ovulation commonly occurs around **10 to 16 days before the next period**, and timing can differ between people and between cycles."),
        p("A longer cycle may shift the estimated ovulation date later, while a shorter cycle may shift it earlier."),
      ],
      { nav: "Day 14?", tone: "frame" },
    ),
    section(
      "accuracy",
      "How Accurate Is an Ovulation Calculator?",
      [
        p("An ovulation calculator can be useful for identifying a likely fertility pattern, but it cannot directly detect the release of an egg."),
        p("Its usefulness depends on factors such as:"),
        ul(
          "How regular your menstrual cycles are",
          "How accurately you know your average cycle length",
          "How much your cycle varies from month to month",
          "Whether ovulation occurs during that cycle",
          "Natural hormonal and biological variation",
        ),
        p("The result is best understood as:"),
        eq("“Ovulation may occur around this time.”"),
        p("It should not be interpreted as:"),
        eq("“Ovulation will definitely happen on this date.”"),
      ],
      { nav: "Accuracy" },
    ),
    section(
      "irregular-periods",
      "What If Your Periods Are Irregular?",
      [
        p("Calendar estimates become less reliable when cycle lengths vary substantially."),
        p("For example, cycles of:"),
        ul("25 days", "36 days", "29 days", "41 days"),
        p("do not follow a consistent pattern. Calculating an average may hide how much the timing actually changes."),
        p("If your cycles are irregular, other fertility-tracking methods may provide additional information, including:"),
        ul(
          "Ovulation predictor kits that detect luteinizing hormone (LH)",
          "Cervical mucus tracking",
          "Basal body temperature tracking",
          "Recording multiple fertility signs together",
        ),
        p("If your periods are frequently irregular or absent, consider discussing them with a healthcare professional."),
      ],
      { nav: "Irregular periods" },
    ),
    section(
      "ovulation-signs",
      "Signs That Ovulation May Be Approaching",
      [
        p("Calendar estimates are only one way to monitor fertility. Some people also notice physical changes around ovulation."),
        cards(
          sub(
            "Cervical Mucus",
            p("Cervical mucus may become clearer, wetter, more slippery, and stretchier around the fertile part of the cycle."),
          ),
          sub(
            "LH Surge",
            p("Ovulation predictor kits detect an increase in luteinizing hormone in urine. An LH surge may indicate that ovulation is approaching."),
          ),
          sub(
            "Basal Body Temperature",
            p("Basal body temperature often increases slightly after ovulation. Because the temperature change generally occurs after the egg has been released, this method may be more useful for identifying patterns across previous cycles than predicting the beginning of the fertile window."),
          ),
        ),
      ],
      { nav: "Signs" },
    ),
    section(
      "calendar-vs-test",
      "Ovulation Calculator vs. Ovulation Test",
      [
        p("An ovulation calculator and an ovulation test provide different types of information."),
        table(
          ["Method", "What It Tells You"],
          ["Ovulation calculator", "Estimates fertile dates from cycle timing"],
          ["Ovulation predictor kit", "Detects an LH rise associated with approaching ovulation"],
          ["Cervical mucus tracking", "Monitors changes associated with fertility"],
          ["Basal body temperature", "Helps identify a temperature rise after ovulation"],
        ),
        p("A calendar estimate can help you decide when to begin paying closer attention to fertility signs or using an ovulation test."),
        p("An ovulation test does not guarantee that ovulation occurred, and a calculator does not replace biological fertility tracking."),
      ],
      { nav: "Calculator vs. test" },
    ),
    section(
      "trying-to-conceive",
      "Using Your Fertile Window When Trying to Conceive",
      [
        p("If you are trying to become pregnant, focus on the estimated fertile window rather than trying to identify one perfect day."),
        p("Because sperm may survive for several days, intercourse before the predicted ovulation date can still result in pregnancy."),
        p("The American Society for Reproductive Medicine notes that having intercourse every **one to two days** during the fertile window can help maximize the opportunity for conception."),
        p("You can combine the calculator with:"),
        ul(
          "Your recent cycle history",
          "Cervical mucus observations",
          "Ovulation predictor kits",
          "Basal body temperature tracking",
        ),
        p("Remember that no calendar calculator can guarantee pregnancy or confirm the exact day of ovulation."),
      ],
      { nav: "Trying to conceive", half: true },
    ),
    section(
      "before-after",
      "Can You Get Pregnant Before or After Ovulation?",
      [
        p("Pregnancy can occur from intercourse before ovulation because sperm may remain viable while waiting for an egg to be released."),
        p("Pregnancy becomes less likely after ovulation because the released egg remains viable for a relatively short period."),
        p("However, the difficulty is knowing the exact moment ovulation occurred. If the calculator predicts one date but actual ovulation occurs earlier or later, the true fertile window may also shift."),
      ],
      { half: true },
    ),
    section(
      "contraception",
      "Can You Use an Ovulation Calculator to Prevent Pregnancy?",
      [
        p("No. Do not rely on this calculator alone as a method of contraception."),
        p("Ovulation timing can vary even when menstrual cycles appear regular, and sperm may survive for several days. This makes it unsafe to assume that dates outside the predicted fertile window are automatically pregnancy-free."),
        p("If preventing pregnancy is your goal, discuss appropriate contraceptive methods with a qualified healthcare professional."),
      ],
      { half: true },
    ),
    section(
      "see-professional",
      "When Should You Speak With a Healthcare Professional?",
      [
        p("An ovulation calculator cannot diagnose infertility, hormonal conditions, or menstrual disorders."),
        p("Consider speaking with a healthcare professional if:"),
        ul(
          "Your periods are frequently irregular or absent",
          "Your periods are unusually heavy or painful",
          "Your cycle pattern changes significantly",
          "You have concerns about whether you are ovulating",
          "You have a medical condition that may affect fertility",
          "You have been trying to conceive without success",
        ),
        p("The American Society for Reproductive Medicine generally defines infertility as not achieving pregnancy after **12 months** of regular unprotected intercourse. Evaluation may be recommended after about **six months** for women age 35 or older, and earlier assessment may be appropriate when there are known fertility concerns."),
      ],
      { half: true },
    ),
    faqSection("Frequently Asked Questions About Ovulation"),
    section("related-tools", "Related Tools", [
      p("Already pregnant or estimating a possible due date after conception? Use our [Pregnancy Due Date Calculator](/pregnancy-due-date-calculator) to estimate your expected delivery date based on your last menstrual period or the inputs supported by the calculator."),
      p("You can also explore our [BMI](/bmi-calculator), [TDEE](/tdee-calculator), [body fat percentage](/body-fat-percentage-calculator), [macro](/macro-calculator), pregnancy due date, and other [health calculators](/calculators)."),
    ]),
    section("sources", "Sources & Medical References", [
      p("The medical and fertility information on this page should be reviewed against authoritative sources."),
      p("Recommended references:"),
      ul(
        "[U.S. Office on Women’s Health — Ovulation Calculator and menstrual-cycle information](https://womenshealth.gov/ovulation-calculator)",
        "[American Society for Reproductive Medicine (ASRM) — Fertility and natural conception guidance](https://www.asrm.org/)",
        "[NHS — Menstrual cycle, ovulation, and trying to get pregnant](https://www.nhs.uk/)",
        "[MedlinePlus — Ovulation testing and reproductive health information](https://medlineplus.gov/)",
      ),
    ]),
    section("editorial-review", "Editorial Review", [
      p("Our calculators are designed for educational and planning purposes. Learn more about our methodology, editorial process, and limitations on our [About Us](/about-us) and [Editorial Policy](/editorial-policy) pages."),
    ]),
    section("medical-disclaimer", "Medical Disclaimer", [
      p("This calculator provides estimated dates for educational and planning purposes only. It does not confirm ovulation, diagnose a medical condition, guarantee pregnancy, or provide contraception."),
      p("Individual menstrual cycles and fertility patterns vary. If you have questions about your menstrual cycle, fertility, pregnancy, contraception, or reproductive health, consult a qualified healthcare professional."),
      action("Enter the first day of your last period and your average cycle length in the calculator above to estimate your fertile window."),
    ]),
  ],
  faqs: [
    {
      question: "When will I ovulate?",
      answer:
        "Ovulation timing depends on your menstrual cycle. It is often estimated by working backward from your expected next period rather than assuming everyone ovulates on cycle day 14.\n\nUse the calculator above for an estimate based on your last period and average cycle length.",
    },
    {
      question: "What are my most fertile days?",
      answer:
        "The days immediately before ovulation and the estimated ovulation day generally make up the most fertile part of the cycle.",
    },
    {
      question: "When do I ovulate with a 28-day cycle?",
      answer:
        "A calendar estimate commonly places ovulation around cycle day 14, but actual timing may occur earlier or later.",
    },
    {
      question: "When do I ovulate with a 30-day cycle?",
      answer: "A simple estimate may place ovulation around cycle day 16.",
    },
    {
      question: "When do I ovulate with a 32-day cycle?",
      answer: "A simple estimate may place ovulation around cycle day 18.",
    },
    {
      question: "Can I use the calculator if my cycle is not 28 days?",
      answer: "Yes. Enter your actual average cycle length instead of assuming a 28-day cycle.",
    },
    {
      question: "Can an ovulation calculator tell me if I am pregnant?",
      answer:
        "No. An ovulation calculator estimates fertility timing; it cannot detect pregnancy.\n\nIf pregnancy is possible and your period is late, use a pregnancy test according to its instructions or speak with a healthcare professional.",
    },
    {
      question: "How often should I recalculate my ovulation date?",
      answer: "Recalculate after each new period if you want the estimate to reflect your latest cycle information.",
    },
    {
      question: "Can stress change when I ovulate?",
      answer:
        "Changes in health, hormones, routine, sleep, stress, illness, and other factors may affect menstrual-cycle timing. A calculator cannot determine why an individual cycle changed.",
    },
    {
      question: "Is an ovulation calculator the same as a pregnancy due date calculator?",
      answer:
        "No.\n\nAn ovulation calculator estimates fertile timing before conception. A Pregnancy Due Date Calculator estimates an expected delivery date after pregnancy begins.",
    },
  ],
  sources: [
    { label: "U.S. Office on Women's Health - Ovulation Calculator", url: "https://womenshealth.gov/ovulation-calculator" },
    { label: "American Society for Reproductive Medicine", url: "https://www.asrm.org/" },
    { label: "NHS - Menstrual cycle and ovulation", url: "https://www.nhs.uk/" },
    { label: "MedlinePlus - Reproductive health", url: "https://medlineplus.gov/" },
  ],
};
