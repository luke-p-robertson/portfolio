import { SmartLink } from "@/components/SmartLink/SmartLink";
import type { ProfileData } from "@/sanity/lib/cachedQueries";

import styles from "./Profile.module.scss";

type ProfileProps = {
  data?: ProfileData | null;
  siteCreditLink?: string | null;
};

/** Detail columns (Enquiries, Follow, Business hours; Services) beside the profile text. */
export function Profile({ data, siteCreditLink }: ProfileProps) {
  return (
    <main className={styles.page}>
      <div className={styles.grid}>
        {data?.columns?.map((column) => (
        <div key={column._key} className={styles.column}>
          {column.details?.map((detail) => (
            <dl key={detail._key}>
              <dt className={styles.label}>{detail.heading}</dt>
              {detail.lines?.map((line) => {
                const href = line.href?.trim();
                return (
                  <dd key={line._key}>
                    {href ? <SmartLink href={href}>{line.label}</SmartLink> : line.label}
                  </dd>
                );
              })}
            </dl>
          ))}
        </div>
      ))}
        <div className={styles.text}>
          {data?.sections?.map((section) => (
            <p key={section._key}>
              {section.heading ? <span className={styles.label}>{section.heading}</span> : null}
              {section.body}
            </p>
          ))}
        </div>
      </div>
      {siteCreditLink ? (
        <p className={styles.credit}>
          <SmartLink href={siteCreditLink}>Site built by AP</SmartLink>
        </p>
      ) : null}
    </main>
  );
}
