import Link from "next/link";

import { Media } from "@/components/Media/Media";
import type { FeatureData } from "@/sanity/lib/cachedQueries";

import styles from "./FeatureScroll.module.scss";

type FeatureScrollProps = {
  features?: FeatureData[] | null;
};

/** The homepage's long scroll: full-width or paired images, each opening its project. */
export function FeatureScroll({ features }: FeatureScrollProps) {
  if (!features?.length) {
    return null;
  }

  return (
    <main>
      {features.map((feature, index) => {
        const isPair = feature.layout === "pair";
        const href = feature.slug ? `/projects/${feature.slug}` : null;
        const priority = index === 0;
        const content = (
          <>
            <div
              className={[styles.desktop, isPair ? styles.pair : styles.single].join(" ")}
            >
              <Media
                media={feature.media}
                className={styles.media}
                sizes={isPair ? "50vw" : "100vw"}
                priority={priority}
              />
              {isPair ? (
                <Media media={feature.secondMedia} className={styles.media} sizes="50vw" />
              ) : null}
            </div>
            <Media
              media={feature.mobileMedia?.mediaType ? feature.mobileMedia : feature.media}
              className={styles.mobile}
              sizes="100vw"
              priority={priority}
            />
            {feature.title ? <span className={styles.caption}>{feature.title}</span> : null}
          </>
        );

        return href ? (
          <Link key={feature._key} href={href} className={styles.feature}>
            {content}
          </Link>
        ) : (
          <div key={feature._key} className={styles.feature}>
            {content}
          </div>
        );
      })}
    </main>
  );
}
