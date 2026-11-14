import Link from "next/link";

import { Media } from "@/components/Media/Media";
import { DESKTOP_QUERY, MOBILE_QUERY } from "@/lib/breakpoints";
import { SPLASH_WAIT_ATTRIBUTE } from "@/lib/navigation";
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
        // The first feature is what the splash uncovers: it waits for these to load. Each
        // breakpoint preloads only its own copy (desktop: both halves of a pair).
        const preload = index === 0;
        const waitAttribute = preload ? { [SPLASH_WAIT_ATTRIBUTE]: "" } : {};
        const content = (
          <>
            <div className={[styles.desktop, isPair ? styles.pair : styles.single].join(" ")}>
              <Media
                media={feature.media}
                className={styles.media}
                sizes={isPair ? "50vw" : "100vw"}
                preload={preload}
                preloadMedia={DESKTOP_QUERY}
              />
              {isPair ? (
                <Media
                  media={feature.secondMedia}
                  className={styles.media}
                  sizes="50vw"
                  preload={preload}
                  preloadMedia={DESKTOP_QUERY}
                />
              ) : null}
            </div>
            <Media
              media={feature.mobileMedia?.mediaType ? feature.mobileMedia : feature.media}
              className={styles.mobile}
              sizes="100vw"
              preload={preload}
              preloadMedia={MOBILE_QUERY}
            />
            {feature.title ? <span className={styles.caption}>{feature.title}</span> : null}
          </>
        );

        return href ? (
          <Link key={feature._key} href={href} className={styles.feature} {...waitAttribute}>
            {content}
          </Link>
        ) : (
          <div key={feature._key} className={styles.feature} {...waitAttribute}>
            {content}
          </div>
        );
      })}
    </main>
  );
}
