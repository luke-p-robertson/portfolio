import styles from "./template.module.scss";

/** Remounts on every page change (unlike the layout), so each page fades in. */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
