import { action, cards, eq, faqSection, note, p, section, steps, sub, table, ul, type ToolContent } from "./blocks";

export const pregnancy: ToolContent = {
  intro: "Calculate your due date from your last period or conception date with our free Pregnancy Due Date Calculator.",
  article: [
    section(
      "what-is-due-date-calculator",
      "What Is a Pregnancy Due Date Calculator?",
      [
        p("A **Pregnancy Due Date Calculator** is a tool that estimates when a baby may be born based on information about the pregnancy. The result is called the **estimated due date (EDD)**. A due date is an estimate rather than a guaranteed delivery date, but it provides an important reference point for tracking pregnancy and planning prenatal care."),
        p("Our **Pregnancy Due Date Calculator Online** allows you to estimate your expected due date using the information supported by the calculator. You can use the result as a starting point for understanding your pregnancy timeline, while your healthcare provider can confirm or adjust dating when appropriate."),
      ],
      { nav: "What it is" },
    ),
    steps(
      "how-to",
      "How to Use This Due Date Calculator",
      "Using a **Free Pregnancy Due Date Calculator** is simple. Enter the relevant date requested by the calculator and select the calculation method available to you.",
      [
        ["Choose Your Calculation Method", "You can calculate an estimated due date using either your **last menstrual period (LMP)** or your **conception date**, depending on which information you know."],
        ["Enter the Date", "Enter the date carefully. If you are using your LMP, use the **first day of your last menstrual period**, rather than the day your period ended."],
        ["Calculate Your Due Date", "The calculator processes the information you provide and produces an estimated delivery date."],
        ["Use the Result as an Estimate", "Your calculated date gives you a useful reference for your pregnancy timeline. It should not be treated as an exact prediction of the day labor will begin."],
      ],
      "How to use",
    ),
    section(
      "from-last-period",
      "Due Date Calculator From Last Period",
      [
        p("A **Due Date Calculator From Last Period** uses the first day of your last menstrual period to estimate when your baby may be due."),
        p("The first day of the LMP is traditionally used as the starting point for calculating pregnancy length. ACOG states that the estimated due date is conventionally calculated as **280 days, or 40 weeks, from the first day of the LMP**."),
        p("This method is commonly used because the exact date of conception is often difficult to determine."),
        cards(
          sub(
            "What Is LMP?",
            p("**LMP** stands for **Last Menstrual Period**. For pregnancy dating, the relevant date is the **first day of your last menstrual period**."),
            p("If you know this date accurately, you can enter it into the calculator to get an estimated due date. If you are unsure about your LMP, tell your healthcare provider because uncertainty about the date can affect the initial estimate."),
          ),
        ),
      ],
      { nav: "From last period", half: true },
    ),
    section(
      "from-conception",
      "Due Date Calculator From Conception Date",
      [
        p("A **Due Date Calculator From Conception Date** uses the estimated date of conception rather than the first day of the last menstrual period."),
        p("Pregnancy is commonly described as lasting about **38 weeks, or 266 days, from conception**, while the clinical pregnancy timeline is generally counted as 40 weeks from the first day of the LMP."),
        p("The conception-date method can be useful when the conception date is known or can be estimated with reasonable confidence. However, conception is not always possible to identify precisely, so the resulting date should still be considered an estimate."),
      ],
      { nav: "From conception", half: true },
    ),
    section(
      "edd-calculation",
      "How Is an Estimated Due Date Calculated?",
      [
        p("An **Estimated Due Date (EDD)** is calculated using information about when pregnancy began, with the first day of the LMP being the traditional starting point."),
        p("The standard LMP-based calculation uses **280 days or 40 weeks** from the first day of the last menstrual period. This convention assumes a typical 28-day menstrual cycle with ovulation occurring around the middle of the cycle, which means the calculation may not perfectly reflect every pregnancy."),
        p("A simplified explanation is:"),
        eq("First day of LMP + 280 days = Estimated Due Date"),
        p("When a known conception or fertilization date is available, pregnancy dating can instead use that information. ACOG also recognizes known fertilization dates, particularly in pregnancies resulting from assisted reproductive technology, as part of determining an EDD."),
      ],
      { nav: "Calculation", tone: "brand" },
    ),
    section(
      "edd-meaning",
      "What Does EDD Mean in Pregnancy?",
      [
        p("**EDD** means **Estimated Due Date**. It is the estimated date when a baby is expected to be born."),
        p("The EDD is useful for establishing gestational age and helping healthcare professionals track pregnancy progress and schedule appropriate prenatal care."),
        p("The word **estimated** is important. A due date does not mean that labor will necessarily begin on that exact day."),
        p("ACOG notes that only about **1 in 20 women give birth on their estimated due date**."),
      ],
      { nav: "EDD meaning" },
    ),
    section(
      "accuracy",
      "How Accurate Is a Pregnancy Due Date Calculator?",
      [
        p("A **Pregnancy Due Date Calculator** provides an estimate, so the result should not be interpreted as an exact prediction."),
        p("One reason is that LMP-based calculations depend on the accuracy of the date provided and make assumptions about the timing of ovulation. Menstrual cycles and ovulation timing can vary, which can affect an LMP-based estimate."),
        p("A healthcare provider may use an ultrasound examination to establish or confirm gestational age. According to ACOG, **first-trimester ultrasound measurement is the most accurate method for establishing or confirming gestational age** when used appropriately."),
        cards(
          sub(
            "Why Your Calculated Date May Differ",
            p("Your calculator result may differ from a clinical estimate because:"),
            ul(
              "Your LMP date may not be exact.",
              "Your cycle or ovulation timing may differ from the assumptions used in the calculation.",
              "An early ultrasound may provide additional information.",
              "Pregnancy dating may be based on assisted reproductive technology when applicable.",
              "Your healthcare provider may determine that another dating method is more appropriate.",
            ),
          ),
        ),
      ],
      { nav: "Accuracy", tone: "frame" },
    ),
    section(
      "due-date-change",
      "Can Your Due Date Change?",
      [
        p("Yes, your estimated due date can sometimes change after additional information becomes available."),
        p("For example, if your LMP is uncertain or an early ultrasound provides a different estimate of gestational age, your healthcare provider may evaluate whether the EDD should be revised. ACOG recommends that changes to an established EDD be reserved for specific circumstances and documented appropriately."),
        p("This is one reason an online calculator should be viewed as a helpful estimate rather than a replacement for pregnancy dating performed as part of prenatal care."),
      ],
      { half: true },
    ),
    section(
      "pregnancy-length",
      "Pregnancy Due Date and Pregnancy Length",
      [
        p("Pregnancy is generally counted as approximately **40 weeks from the first day of the last menstrual period**. This includes approximately two weeks before conception would normally occur, because gestational age is conventionally counted from the beginning of the last menstrual period."),
        p("Pregnancy is commonly divided into three trimesters:"),
        table(
          ["Trimester", "Approximate Gestational Period"],
          ["First trimester", "Up to 13 weeks and 6 days"],
          ["Second trimester", "14 weeks through 27 weeks and 6 days"],
          ["Third trimester", "28 weeks onward"],
        ),
        p("These standard gestational periods are used to describe the progression of pregnancy."),
      ],
      { nav: "Trimesters", half: true },
    ),
    section(
      "full-term",
      "When Is a Baby Considered Full Term?",
      [
        p("ACOG divides term pregnancy into several categories based on gestational age:"),
        table(
          ["Pregnancy Classification", "Gestational Age"],
          ["Early term", "37 weeks 0 days through 38 weeks 6 days"],
          ["Full term", "39 weeks 0 days through 40 weeks 6 days"],
          ["Late term", "41 weeks 0 days through 41 weeks 6 days"],
          ["Postterm", "42 weeks and beyond"],
        ),
        p("These classifications help healthcare professionals describe pregnancy timing more precisely than simply referring to a pregnancy as being \"at term.\""),
      ],
      { nav: "Full term", half: true },
    ),
    section(
      "edd-importance",
      "Why Is the Estimated Due Date Important?",
      [
        p("Knowing an **Estimated Due Date (EDD)** provides a reference point for pregnancy care."),
        p("It can help healthcare professionals:"),
        ul(
          "Determine gestational age",
          "Monitor fetal growth",
          "Plan appropriate prenatal care",
          "Schedule certain pregnancy tests",
          "Track pregnancy progression",
          "Identify when a pregnancy is approaching or passing the expected delivery period",
        ),
        p("ACOG explains that accurate pregnancy dating is important for appropriate prenatal care, interpretation of tests, and assessment of fetal growth."),
      ],
      { half: true },
    ),
    section("unknown-lmp", "What If I Do Not Know My Last Period?", [
      p("If you do not know the first day of your last menstrual period, or you are unsure of the date, an online **Due Date Calculator From Last Period** may not provide a reliable starting point."),
      p("In this situation, speak with your healthcare provider. An ultrasound, particularly during the first trimester, may be used to estimate gestational age and help establish an EDD."),
    ]),
    section(
      "calculator-vs-ultrasound",
      "Due Date Calculator vs. Ultrasound Dating",
      [
        p("An online calculator and clinical ultrasound serve different purposes."),
        p("A calculator uses the information you enter to produce an estimated date. An ultrasound allows a healthcare professional to evaluate the developing pregnancy and use fetal measurements to help establish or confirm gestational age."),
        p("ACOG states that ultrasound measurement in the first trimester is the most accurate method for establishing or confirming gestational age."),
        p("Therefore, if your online calculation and clinical dating differ, discuss the difference with your healthcare provider rather than assuming that the calculator result is the final date."),
      ],
      { nav: "Vs. ultrasound", half: true },
    ),
    section(
      "lmp-vs-conception",
      "What Is the Difference Between LMP and Conception Date?",
      [
        p("The **LMP** is the first day of your last menstrual period. The **conception date** refers to when fertilization occurred."),
        p("They are different points in the pregnancy timeline."),
        table(
          ["Method", "Starting Information", "Typical Pregnancy Dating"],
          ["LMP", "First day of last menstrual period", "About 40 weeks"],
          ["Conception", "Estimated or known conception date", "About 38 weeks"],
        ),
        p("Clinical pregnancy dating conventionally uses the first day of the LMP, while a known fertilization date can also be used in certain circumstances."),
      ],
      { half: true },
    ),
    faqSection("Frequently Asked Questions About Pregnancy Due Dates"),
    section("calculate-due-date", "Calculate Your Estimated Due Date", [
      p("Use the **Pregnancy Due Date Calculator** above to estimate your baby's expected arrival based on the information available to you. You can use the **Pregnancy Due Date Calculator Online** as a convenient starting point for understanding your pregnancy timeline."),
      p("Remember that an online result is an estimate. Your healthcare provider can assess your pregnancy and use clinical information, including ultrasound when appropriate, to establish or confirm your **Estimated Due Date (EDD)**."),
      action("Calculate your estimated due date above and keep the result as a reference for your pregnancy timeline."),
      note("**Important:** This calculator provides an estimate and is not a substitute for medical care or professional pregnancy dating. If you are pregnant or have questions about your due date, discuss your individual situation with a qualified healthcare professional."),
    ]),
  ],
  faqs: [
    {
      question: "How do I calculate my pregnancy due date?",
      answer: "You can use the first day of your last menstrual period to estimate your due date. The conventional calculation is 280 days, or 40 weeks, from that date.",
    },
    {
      question: "What is a pregnancy due date calculator?",
      answer: "A pregnancy due date calculator estimates when your baby may be born using information such as your last menstrual period or conception date.",
    },
    {
      question: "Can I calculate my due date from my last period?",
      answer: "Yes. The first day of your last menstrual period is traditionally used to estimate an EDD.",
    },
    {
      question: "What does LMP mean?",
      answer: "LMP means Last Menstrual Period. For pregnancy dating, it refers to the first day of your last menstrual period.",
    },
    {
      question: "Can I calculate my due date from the conception date?",
      answer: "Yes. If the conception date is known or can be estimated, it can be used to estimate the delivery date. A conception-based calculation generally uses about 38 weeks from conception.",
    },
    {
      question: "What does EDD mean?",
      answer: "EDD stands for Estimated Due Date, the estimated date when your baby may be born.",
    },
    {
      question: "Is my due date exact?",
      answer: "No. A due date is an estimate. The actual date of delivery can be different from the calculated EDD.",
    },
    {
      question: "Can an ultrasound change my due date?",
      answer: "An ultrasound can provide information that helps establish or confirm gestational age. If the dating differs significantly from an LMP-based estimate, your healthcare provider may determine whether the EDD should be revised.",
    },
    {
      question: "How accurate is a due date calculator?",
      answer: "Its accuracy depends partly on the information used. An LMP-based calculation can be affected by uncertainty about the LMP or variation in ovulation timing. First-trimester ultrasound is considered the most accurate method for establishing or confirming gestational age.",
    },
    {
      question: "How long is pregnancy?",
      answer: "Pregnancy is generally counted as about 40 weeks from the first day of the last menstrual period.",
    },
    {
      question: "Will I give birth on my estimated due date?",
      answer: "Not necessarily. The EDD is an estimate rather than a guaranteed delivery date. ACOG reports that only about 1 in 20 women give birth on their estimated due date.",
    },
  ],
  sources: [
    {
      label: "ACOG — Methods for Estimating the Due Date",
      url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date",
    },
    { label: "ACOG — How Your Fetus Grows During Pregnancy", url: "https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy" },
    { label: "ACOG — When Pregnancy Goes Past Your Due Date", url: "https://www.acog.org/womens-health/faqs/when-pregnancy-goes-past-your-due-date" },
    { label: "NHS — Pregnancy Due Date Calculator", url: "https://www.nhs.uk/pregnancy/finding-out/due-date-calculator/" },
    { label: "Cleveland Clinic — Due Date Calculator", url: "https://my.clevelandclinic.org/health/diagnostics/22052-due-date-calculator" },
  ],
};
