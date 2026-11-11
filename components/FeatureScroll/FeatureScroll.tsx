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
        // Only the desktop image is preloaded: a preload ignores CSS, so preloading the
        // mobile version too would download both everywhere. The mobile one still loads
        // straight away on phones, as it's in view.
        const preload = index === 0;
        const content = (
          <>
            <div
              className={[styles.desktop, isPair ? styles.pair : styles.single].join(" ")}
            >
              <Media
                media={feature.media}
                className={styles.media}
                sizes={isPair ? "50vw" : "100vw"}
                preload={preload}
              />
              {isPair ? (
                <Media media={feature.secondMedia} className={styles.media} sizes="50vw" />
              ) : null}
            </div>
            <Media
              media={feature.mobileMedia?.mediaType ? feature.mobileMedia : feature.media}
              className={styles.mobile}
              sizes="100vw"
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
