import type { SchemaTypeDefinition } from "sanity";

import { category } from "./documents/category";
import { homepage } from "./documents/homepage";
import { profile } from "./documents/profile";
import { project } from "./documents/project";
import { projectIndex } from "./documents/projectIndex";
import { siteSettings } from "./documents/siteSettings";
import { blockContent } from "./objects/blockContent";
import { credit } from "./objects/credit";
import { feature } from "./objects/feature";
import { link } from "./objects/link";
import { media } from "./objects/media";
import { profileColumn, profileDetail, profileSection } from "./objects/profileSection";
import { seo } from "./objects/seo";
import { slideTypes } from "./objects/slides";

export const schemaTypes: SchemaTypeDefinition[] = [
  seo,
  blockContent,
  link,
  media,
  credit,
  feature,
  profileSection,
  profileDetail,
  profileColumn,
  ...slideTypes,
  project,
  category,
  homepage,
  projectIndex,
  profile,
  siteSettings,
];
