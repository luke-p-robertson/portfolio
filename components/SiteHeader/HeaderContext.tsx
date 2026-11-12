"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** What the current project page lends the header. */
export type ProjectHeader = {
  title: string;
  /** The project's text color, if set. */
  textColor?: string | null;
  /** Jumps to the info slide; absent when the project has no info. */
  onInfo?: (() => void) | null;
};

/** What the Projects page lends the header for its filter. */
export type FilterHeader = {
  options: { title: string; slug: string }[];
  value: string;
  open: boolean;
  toggle: () => void;
  choose: (slug: string) => void;
};

type HeaderContextValue = {
  project: ProjectHeader | null;
  setProject: (project: ProjectHeader | null) => void;
  filter: FilterHeader | null;
  setFilter: (filter: FilterHeader | null) => void;
};

const HeaderContext = createContext<HeaderContextValue | null>(null);

/**
 * Holds the page-specific parts of the persistent site header. The header lives in the
 * site layout so it never remounts between pages; pages register their controls here.
 */
export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<ProjectHeader | null>(null);
  const [filter, setFilter] = useState<FilterHeader | null>(null);
  const value = useMemo(() => ({ project, setProject, filter, setFilter }), [project, filter]);
  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>;
}

export function useHeader(): HeaderContextValue {
  const value = useContext(HeaderContext);
  if (!value) {
    throw new Error("useHeader must be used inside <HeaderProvider>");
  }
  return value;
}

/** Lends the header a project's title, color and Info action while the page is mounted. */
export function useProjectHeader(project: ProjectHeader) {
  const { setProject } = useHeader();
  const { title, textColor, onInfo } = project;
  useEffect(() => {
    setProject({ title, textColor, onInfo });
  }, [setProject, title, textColor, onInfo]);
  useEffect(() => () => setProject(null), [setProject]);
}

/** Lends the header the Projects page filter while the page is mounted. */
export function useFilterHeader(filter: FilterHeader | null) {
  const { setFilter } = useHeader();
  useEffect(() => {
    setFilter(filter);
  }, [setFilter, filter]);
  useEffect(() => () => setFilter(null), [setFilter]);
}
