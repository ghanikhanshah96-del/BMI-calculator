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
