import { action, cards, eq, faqSection, ol, p, section, sub, table, ul, type ToolContent } from "./blocks";

export const ovulation: ToolContent = {
  intro:
    "Use our Ovulation Calculator to estimate your ovulation date, fertile window and most fertile days using your last period and average cycle length.",
  lead: [
    p("Use our **Ovulation Calculator** to estimate your ovulation date, fertile window, and the days in your menstrual cycle when pregnancy may be more likely."),
    p("Enter the **first day of your last menstrual period** and your average **cycle length** into the calculator above. The result can help you plan when to pay closer attention to fertility signs or when to try to conceive."),
    p("An ovulation calculator is based on calendar estimates. It cannot confirm the exact day an egg will be released because ovulation can shift from one menstrual cycle to another—even when periods are usually regular."),
    p("**Your calculator result may include:**"),
    ul("Estimated ovulation date", "Estimated fertile window", "Most fertile days", "Current or next cycle dates", "Expected next period date"),
    p("If you are trying to become pregnant, use these dates as a planning tool rather than assuming ovulation will occur on exactly the predicted day."),
  ],
  article: [
    section(
      "how-to",
      "How to Use the Ovulation Calculator",
      [
        p("You usually need two pieces of information:"),
        ol("**First day of your last period**", "**Average length of your menstrual cycle**"),
        p("Enter these values and select **Calculate**."),
        p("Your estimated dates will then appear."),
        p("For example, if your average cycle is 28 days, the calculator may estimate ovulation around the middle of the cycle. This should not be interpreted as a rule that everyone with a 28-day cycle ovulates on exactly day 14."),
        p("The NHS explains that ovulation generally occurs around **10 to 16 days before the next period**, and the exact timing can vary between individuals and cycles."),
        cards(
          sub(
            "What Date Should I Enter as My Last Period?",
            p("Use the **first day of menstrual bleeding** as day 1."),
            p("Do not use:"),
            ul("The last day of your period", "A day of light spotting before your actual period began", "The date your previous period ended"),
            p("Using the correct starting date gives the **Ovulation Calculator by Last Period** a better basis for estimating your cycle."),
          ),
        ),
      ],
      { nav: "How to use" },
    ),
    section(
      "how-calculated",
      "How Is Your Ovulation Date Calculated?",
      [
        p("A calendar-based calculator estimates when your next period may start and works backward to approximate ovulation."),
        p("Ovulation is the process in which an ovary releases an egg. If sperm fertilizes the egg, pregnancy may occur."),
        p("For someone with a regular cycle, estimated ovulation is often calculated at roughly **14 days before the expected next period**. However, the interval between ovulation and the next period is not identical for every person."),
        p("That is why an **Ovulation Date Calculator** or **Ovulation Day Calculator** produces an estimate rather than a confirmed biological event."),
        cards(
          sub(
            "Example",
            p("Suppose your average menstrual cycle is 30 days."),
            p("A simple calendar estimate may place ovulation around:"),
            eq("Cycle day 30 − 14 = approximately cycle day 16"),
            p("This does not mean you can only become pregnant on day 16. The days leading up to ovulation are also important because sperm can remain viable for several days."),
          ),
        ),
      ],
      { nav: "Calculation", tone: "brand" },
    ),
    section(
      "fertile-window",
      "What Is the Fertile Window?",
      [
        p("Your **fertile window** is the group of days during your menstrual cycle when intercourse can potentially result in pregnancy."),
        p("The American Society for Reproductive Medicine defines the fertile window for counseling purposes as the **six-day period ending on the day of ovulation**."),
        p("This window exists because:"),
        ul(
          "Sperm may survive in the reproductive tract for several days.",
          "The released egg remains viable for a much shorter period.",
          "Intercourse before ovulation can therefore still lead to fertilization after the egg is released.",
        ),
        p("This is why an **Ovulation and Fertile Window Calculator** is often more useful than showing only one predicted ovulation date."),
      ],
      { nav: "Fertile window", half: true },
    ),
    section(
      "most-fertile-days",
      "When Are Your Most Fertile Days?",
      [
        p("Pregnancy is generally most likely when intercourse occurs close to ovulation."),
        p("ASRM reports that peak fertility has been observed during the days immediately before ovulation, with particularly high chances within the two days before the egg is released."),
        p("A **Most Fertile Days Calculator** therefore estimates a range rather than labeling the entire cycle equally fertile."),
        p("Your result might look similar to this:"),
        table(
          ["Cycle Event", "Example Estimate"],
          ["Period begins", "Day 1"],
          ["Fertile window begins", "Around Day 9"],
          ["Most fertile days", "Around Days 12–14"],
          ["Estimated ovulation", "Around Day 14"],
          ["Next period", "Around Day 28"],
        ),
        p("This is only an illustration of a 28-day cycle. Your dates will depend on your own cycle length."),
      ],
      { nav: "Most fertile days", half: true },
    ),
    section(
      "day-14",
      "Does Ovulation Always Happen on Day 14?",
      [
        p("No."),
        p("The idea that everyone ovulates on cycle day 14 is an oversimplification."),
        p("Day 14 is commonly used as an example because it roughly corresponds with ovulation in a textbook 28-day menstrual cycle. Real cycles can be shorter, longer, and variable."),
        p("The NHS notes that ovulation often takes place approximately 10 to 16 days before the next period."),
        p("For example:"),
        table(
          ["Average Cycle Length", "Approximate Calendar Estimate"],
          ["26 days", "Around Day 12"],
          ["28 days", "Around Day 14"],
          ["30 days", "Around Day 16"],
          ["32 days", "Around Day 18"],
        ),
        p("These examples explain why an **Ovulation Calculator for a 28 day cycle**, **Ovulation Calculator for a 30 day cycle**, and **Ovulation Calculator for a 32 day cycle** may return different dates."),
        p("They should not be interpreted as guarantees."),
      ],
      { nav: "Day 14?", half: true },
    ),
    section(
      "cycle-length",
      "Ovulation Calculator by Cycle Length",
      [
        p("Your average cycle length is the number of days from the first day of one period to the day before your next period begins."),
        p("For example:"),
        ul("The period starts March 1.", "The next period starts March 29.", "Cycle length is approximately 28 days."),
        p("A calculator generally works better when you enter your actual average cycle length instead of assuming that every cycle lasts 28 days."),
        p("If your recent cycle lengths were:"),
        ul("28 days", "30 days", "29 days", "31 days", "29 days"),
        p("Your average would be approximately 29–30 days."),
        p("Using several recent cycles can provide a more representative input for an **Ovulation Calculator by Cycle Length**."),
      ],
      { nav: "Cycle length", half: true },
    ),
    section(
      "calculate-ovulation-date",
      "How to Calculate Ovulation Date From Your Last Menstrual Period",
      [
        p("If you are asking **how to calculate ovulation date**, the simplest calendar approach is:"),
        ol(
          "Identify day 1 of your last menstrual period.",
          "Determine your average cycle length.",
          "Estimate when your next period will start.",
          "Count backward approximately 14 days as a rough ovulation estimate.",
          "Include several days before the estimated ovulation date when considering your fertile window.",
        ),
        p("Our calculator performs these steps automatically."),
        p("This is also why terms such as **Menstrual Cycle Ovulation Calculator**, **Period Ovulation Calculator**, and **Ovulation Calculator using last period date** generally describe the same basic type of tool."),
      ],
      { half: true },
    ),
    section(
      "calculate-fertile-window",
      "How to Calculate Your Fertile Window",
      [
        p("If your question is **how to calculate the fertile window**, estimating the ovulation date is only the first step."),
        p("ASRM's clinical guidance uses the estimated day of ovulation plus the five preceding days as the fertile window."),
        p("For example, if estimated ovulation is on day 16:"),
        eq("Estimated fertile window: approximately days 11–16"),
        p("A **Fertile Window Calculator using last period** applies this type of calendar logic automatically based on the dates you enter."),
        p("Because real ovulation can shift, the true fertile window may occur earlier or later than the predicted dates."),
      ],
      { half: true },
    ),
    section("after-period", "When Do I Ovulate After My Period?", [
      p("There is no fixed number of days after a period when everyone ovulates."),
      p("The answer depends partly on:"),
      ul("Total cycle length", "How long your period lasts", "Normal cycle-to-cycle variation", "Hormonal changes", "Whether your periods are regular"),
      p("Someone with a shorter menstrual cycle may ovulate relatively soon after their period, while someone with a longer cycle may ovulate later."),
      p("Therefore, the question **“how many days after period does ovulation occur?”** does not have one universal answer."),
      p("Cycle length is usually more useful than counting a fixed number of days from when bleeding stops."),
    ]),
    section(
      "before-ovulation",
      "Can You Get Pregnant Before Ovulation?",
      [
        p("Yes."),
        p("Intercourse during the days before ovulation can lead to pregnancy because sperm can remain viable while waiting for an egg to be released."),
        p("That is why the fertile window begins before the estimated ovulation day."),
        p("If you are using a **Fertile Days Calculator** or **Fertility Days Calculator for Pregnancy**, pay attention to the entire predicted window rather than only the final day."),
      ],
      { half: true },
    ),
    section(
      "after-ovulation",
      "Can You Get Pregnant After Ovulation?",
      [
        p("Pregnancy becomes less likely as more time passes after ovulation because the egg remains viable for a limited period."),
        p("MedlinePlus notes that a released egg survives for less than about 24 hours."),
        p("The difficulty is knowing exactly when ovulation occurred. A calendar tool may predict one date while actual ovulation occurs earlier or later."),
        p("For that reason, the estimated date should not be used to assume that pregnancy is impossible on another day."),
      ],
      { half: true },
    ),
    section(
      "accuracy",
      "How Accurate Is an Ovulation Calculator?",
      [
        p("An **Online Ovulation Calculator** is useful for estimating patterns, but it cannot directly detect egg release."),
        p("Accuracy depends on:"),
        ul(
          "How regular your cycles are",
          "How accurately you know your average cycle length",
          "Whether your cycle changes from month to month",
          "Whether ovulation actually occurs during that cycle",
          "The assumptions built into the calculator",
        ),
        p("Research reviewed by ASRM highlights an important limitation: calendar-based apps may not precisely identify an individual's actual ovulation day because fertile-window timing can vary considerably."),
        p("So the result is best understood as:"),
        eq("“Ovulation may occur around this time.”"),
        p("Not:"),
        eq("“Ovulation will definitely happen on this date.”"),
      ],
      { nav: "Accuracy", tone: "frame" },
    ),
    section(
      "irregular-periods",
      "Ovulation Calculator for Irregular Periods",
      [
        p("Calendar predictions become less reliable when cycle lengths change substantially from month to month."),
        p("For example, if your cycles recently lasted:"),
        ul("25 days", "36 days", "29 days", "41 days"),
        p("An average alone may hide considerable variation."),
        p("An **Ovulation Calculator for irregular periods** can still provide a rough estimate, but the fertile window may be wider and harder to predict."),
        p("MedlinePlus notes that people with irregular cycles may find ovulation predictor kits useful for identifying when ovulation may be approaching."),
        p("Other fertility-awareness methods include:"),
        ul(
          "Urinary luteinizing hormone (LH) testing",
          "Cervical mucus observation",
          "Basal body temperature tracking",
          "Monitoring several cycle signs together",
        ),
        p("If your periods are frequently irregular or absent, consider discussing this with a healthcare professional, particularly if you are trying to conceive."),
      ],
      { nav: "Irregular periods" },
    ),
    section(
      "ovulation-signs",
      "Signs That Ovulation May Be Approaching",
      [
        p("Calendar dates are only one way to track fertility."),
        p("Your body may also show changes around ovulation."),
        cards(
          sub(
            "Changes in Cervical Mucus",
            p("Cervical mucus commonly becomes wetter, clearer, more slippery, and stretchier around the fertile part of the cycle."),
            p("MedlinePlus describes highly fertile cervical fluid as having a slippery and stretchy quality."),
          ),
          sub(
            "LH Surge",
            p("Ovulation predictor kits measure a rise in **luteinizing hormone (LH)** in urine."),
            p("MedlinePlus states that a positive home ovulation test generally indicates that ovulation may occur within approximately the next **24 to 36 hours**, although this does not apply perfectly to every person."),
          ),
          sub(
            "Basal Body Temperature",
            p("Basal body temperature often rises slightly after ovulation."),
            p("Because the increase usually happens **after** the egg has been released, temperature tracking may be especially useful for identifying patterns across previous cycles rather than predicting the exact first fertile day in real time."),
          ),
        ),
      ],
      { nav: "Signs" },
    ),
    section(
      "get-pregnant",
      "Ovulation Calculator to Get Pregnant",
      [
        p("If you are trying to conceive, an **Ovulation Calculator to Get Pregnant** can help identify when intercourse may be more likely to overlap with your fertile period."),
        p("ASRM states that reproductive efficiency is highest when intercourse occurs every one to two days during the fertile window, although less frequent intercourse can still result in pregnancy."),
        p("You do not need to identify one “perfect” moment."),
        p("A more practical approach is to consider the estimated fertile window as a range of opportunity."),
        p("This is why searches such as:"),
        ul(
          "**Best Days to Conceive Calculator**",
          "**Pregnancy Ovulation Calculator**",
          "**Conception Calculator**",
          "**Fertility Calculator**",
          "**Fertility window calculator for pregnancy**",
        ),
        p("often refer to closely related planning tools."),
        p("Our calculator focuses specifically on estimating the timing of ovulation and the fertile window."),
      ],
      { nav: "Trying to conceive", half: true },
    ),
    section(
      "most-fertile",
      "What Are My Most Fertile Days?",
      [
        p("If you're wondering **“when am I most fertile?”**, the answer generally centers on the days immediately before ovulation and the ovulation day itself."),
        p("However, your exact most fertile days cannot be guaranteed from calendar dates alone."),
        p("For a better picture, you can combine your calculator estimate with:"),
        ul("Changes in cervical mucus", "Ovulation predictor tests", "Previous cycle patterns", "Other advice from your healthcare professional"),
        p("A **Best Days to Get Pregnant Calculator** can narrow down the likely dates, but biological signs may provide additional information."),
      ],
      { half: true },
    ),
    section(
      "best-time",
      "When Is the Best Time to Conceive?",
      [
        p("There is no requirement to time intercourse to a single exact hour or day."),
        p("ASRM guidance indicates that intercourse every one to two days during the fertile window is associated with high reproductive efficiency."),
        p("This approach also reduces the pressure of trying to identify the exact moment of ovulation."),
        p("If you are specifically asking **“when is the best time to conceive?”**, think in terms of the fertile window—particularly the days immediately preceding ovulation—rather than one isolated calculator date."),
      ],
      { half: true },
    ),
    section(
      "next-ovulation",
      "Next Ovulation Calculator: Planning Future Cycles",
      [
        p("A **Next Ovulation Calculator** estimates fertility dates for an upcoming cycle based on your previous menstrual dates and average cycle length."),
        p("This can be useful for:"),
        ul("Planning when to begin LH testing", "Tracking future cycles", "Understanding recurring patterns", "Planning intercourse when trying to conceive"),
        p("However, the further into the future a prediction goes, the more opportunity there is for actual cycle timing to differ from the estimate."),
        p("Update your calculation when a new period begins."),
      ],
      { half: true },
    ),
    section(
      "calendar-vs-test",
      "Ovulation Calendar Calculator vs. Ovulation Test",
      [
        p("These tools answer different questions."),
        table(
          ["Method", "What It Does"],
          ["Ovulation Calendar Calculator", "Predicts likely dates based mainly on cycle timing"],
          ["Ovulation Predictor Kit", "Detects an LH rise associated with approaching ovulation"],
          ["Cervical Mucus Tracking", "Observes changes associated with fertility"],
          ["Basal Body Temperature", "Helps identify a temperature rise that generally occurs after ovulation"],
        ),
        p("An ovulation test does not make the calculator unnecessary, and a calculator does not replace biological testing."),
        p("Some people use both: calendar estimates can indicate **when to start testing**, while LH tests provide additional information about what may be happening in the current cycle."),
      ],
      { nav: "Calendar vs. test" },
    ),
    section(
      "contraception",
      "Can You Use an Ovulation Calculator to Prevent Pregnancy?",
      [
        p("An ovulation calculator should **not be relied on by itself as contraception**."),
        p("The timing of ovulation can vary even in people who usually have regular cycles, and sperm can survive for several days."),
        p("That creates uncertainty around supposedly “safe” calendar days."),
        p("If preventing pregnancy is your goal, discuss reliable contraceptive options with an appropriate healthcare professional rather than depending solely on an estimated fertile window."),
      ],
      { half: true },
    ),
    section(
      "see-professional",
      "When Should You Speak With a Healthcare Professional?",
      [
        p("Ovulation calculators cannot diagnose infertility, hormonal disorders, or menstrual conditions."),
        p("Consider seeking medical advice if:"),
        ul(
          "Your periods are frequently irregular or absent.",
          "You have unusually heavy or painful periods.",
          "You cannot identify a normal cycle pattern.",
          "You have concerns about ovulation.",
          "You have a known condition that may affect fertility.",
          "You have been trying to conceive without success.",
        ),
        p("ASRM defines infertility as failure to achieve pregnancy after **12 months of regular unprotected intercourse**. It recommends earlier evaluation after about **6 months for women aged 35 or older**, and evaluation may be appropriate sooner when medical history indicates a possible fertility issue."),
      ],
      { half: true },
    ),
    faqSection("Ovulation Calculator FAQs"),
    section("estimate-fertile-window", "Estimate Your Fertile Window", [
      p("The **Ovulation Calculator** gives you a simple way to estimate your next ovulation date, fertile window, and most fertile days using your menstrual cycle information."),
      p("Use your result as a planning estimate—not confirmation that ovulation will happen on a specific date."),
      action("Enter the first day of your last period and your average cycle length in the calculator above to calculate your fertile window."),
      p("If you are trying to conceive, you may also find our [Pregnancy Due Date Calculator](/due-date-calculator) and **Pregnancy Calculator** useful after a positive pregnancy test."),
    ]),
  ],
  faqs: [
    {
      question: "When will I ovulate?",
      answer:
        "Your ovulation date depends on your menstrual cycle. Ovulation commonly occurs approximately 10 to 16 days before the next period, according to the NHS, but timing varies.\n\nUse the calculator above for a personalized estimate based on your last period and average cycle length.",
    },
    {
      question: "How do I calculate my fertile days?",
      answer: "Estimate your likely ovulation date and include the several days immediately before it.\n\nOur Fertile Window Calculator performs this calculation automatically.",
    },
    {
      question: "What are my most fertile days?",
      answer:
        "The days immediately before ovulation are generally among the most fertile. ASRM identifies the fertile window as the six days ending on ovulation day, with especially high fertility close to ovulation.",
    },
    {
      question: "How can I calculate my fertile days from my period?",
      answer:
        "Enter the first day of your last period and average cycle length into the calculator.\n\nThis allows the tool to estimate your next period, likely ovulation timing, and fertile window.",
    },
    {
      question: "Is a Fertility Calculator the same as an Ovulation Calculator?",
      answer:
        "The terms are often used interchangeably, but fertility can refer to a broader subject.\n\nAn ovulation calculator specifically estimates ovulation timing and related fertile days.",
    },
    {
      question: "Can I calculate ovulation if my cycle is not 28 days?",
      answer: "Yes.\n\nEnter your actual average cycle length. A 28-day cycle should not be assumed if your usual cycles are shorter or longer.",
    },
    {
      question: "When do I ovulate with a 30-day cycle?",
      answer:
        "A simple calendar estimate may place ovulation around cycle day 16 because that is approximately 14 days before the next expected period.\n\nActual ovulation may occur earlier or later.",
    },
    {
      question: "When do I ovulate with a 32-day cycle?",
      answer: "A calendar estimate may place ovulation near cycle day 18. Treat this as an approximation rather than an exact date.",
    },
    {
      question: "When do I ovulate with a 28-day cycle?",
      answer: "Ovulation is often estimated around day 14 in a 28-day cycle, but individual timing varies.",
    },
    {
      question: "How accurate is a fertile window calculator by cycle length?",
      answer:
        "It can provide a useful estimate when cycles are regular, but cycle length alone cannot determine the exact day of ovulation.\n\nCalendar methods become less reliable when cycles vary significantly.",
    },
    {
      question: "Can an ovulation calculator tell me if I am pregnant?",
      answer:
        "No.\n\nAn ovulation calculator predicts cycle timing; it does not detect pregnancy.\n\nIf pregnancy is possible and your period is late, use an appropriate pregnancy test according to its instructions or speak with a healthcare professional.",
    },
    {
      question: "Is an ovulation calculator the same as a pregnancy due date calculator?",
      answer:
        "No.\n\nAn ovulation calculator estimates fertility timing before conception.\n\nA pregnancy due date calculator estimates an expected delivery date after pregnancy begins.",
    },
    {
      question: "Can stress change my ovulation date?",
      answer:
        "Cycle timing can vary for many reasons, and changes in health, routine, hormones, or other circumstances may affect menstrual patterns.\n\nA calculator cannot determine why your ovulation date changed.",
    },
    {
      question: "Should I use an ovulation calculator every month?",
      answer:
        "If you are tracking fertility, recalculating after each new period gives the tool your most recent cycle information.\n\nRecording several cycles can also help you better understand whether your cycle length is consistent.",
    },
  ],
};
