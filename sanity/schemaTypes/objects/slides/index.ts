import { defineArrayMember } from "sanity";

import { slideMedia } from "./slideMedia";

export const slideTypes = [slideMedia];

export const slideArrayMembers = [defineArrayMember({ type: "slideMedia" })];
