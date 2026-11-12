"use client";

import { useEffect } from "react";

import { STUDIO_CREDIT } from "@/lib/siteCredit";

let logged = false;

/** Studio credit for anyone who opens DevTools: once per page load. */
export function SiteCreditConsole() {
  useEffect(() => {
    if (logged) {
      return;
    }
    logged = true;
    console.log(
      `%cSite design & development by ${STUDIO_CREDIT.name}%c\n${STUDIO_CREDIT.url}`,
      "font-weight: 600;",
      "font-weight: normal;",
    );
  }, []);

  return null;
}
