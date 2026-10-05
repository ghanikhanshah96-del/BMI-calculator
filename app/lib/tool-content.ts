import type { ToolId } from "./tool-nav";
import type { ToolContent } from "./content/blocks";
import { bmi } from "./content/bmi";
import { bodyFat } from "./content/body-fat";
import { macro } from "./content/macro";
import { ovulation } from "./content/ovulation";
import { pregnancy } from "./content/pregnancy";
import { tdee } from "./content/tdee";

export { articleNav, plainText } from "./content/blocks";
export type {
  ArticleSection,
  ContentBlock,
  ContentCard,
  ContentTable,
  SectionTone,
  ToolContent,
  ToolFaq,
  ToolSource,
} from "./content/blocks";

export const toolContent: Record<ToolId, ToolContent> = {
  bmi,
  "body-fat": bodyFat,
  tdee,
  macro,
  pregnancy,
  ovulation,
};
