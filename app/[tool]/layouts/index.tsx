import "./layouts.css";
import BentoLayout from "./bento-layout";
import EditorialLayout from "./editorial-layout";
import JourneyLayout from "./journey-layout";
import type { LayoutProps } from "./shared";
import SpotlightLayout from "./spotlight-layout";
import StepperLayout from "./stepper-layout";
import TimelineLayout from "./timeline-layout";

/** Each tool gets its own below-calculator layout; section ids stay the same for the pill nav. */
export default function ToolSections(props: LayoutProps) {
  switch (props.tool.id) {
    case "bmi":
      return <TimelineLayout {...props} />;
    case "body-fat":
      return <BentoLayout {...props} />;
    case "tdee":
      return <StepperLayout {...props} />;
    case "macro":
      return <EditorialLayout {...props} />;
    case "pregnancy":
      return <JourneyLayout {...props} />;
    case "ovulation":
      return <SpotlightLayout {...props} />;
  }
}
