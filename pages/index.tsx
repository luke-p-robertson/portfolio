import { useRef, useState, useLayoutEffect } from "react";
import type { NextPage, GetStaticProps } from "next";
import { createClient, linkResolver } from "../prismicio";
import Head from "next/head";
import styles from "./Home.module.scss";
import { InfoSection } from "../components/Info";
import { Projects } from "../components/Projects";
import animateScrollTo from "animated-scroll-to";

type Props = {
  pagedata: {
    id: string;
    data: {
      clients: Array<Props>;
      contact: Array<Props>;
      profile: Array<Props>;
      projects: Array<Props>;
    };
  };
  previewData: any;
};

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData });

  const pagedata = await client.getSingle("homepage", {
    fetchLinks: [
      "project.media_type",
      "project.image",
      "project.video",
      "project.description",
      "project.orientation",
      "project.text_color",
    ],
  });

  return {
    props: {
      pagedata,
    },
  };
};

const Home: NextPage<Props> = ({ pagedata }) => {
  console.log("PageData", pagedata);

  const infoRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    console.log(infoRef); // { current: <h1_object> }
  });

  return (
    <>
      <Head>
        <title>Luke Robertson</title>
        <meta
          name="description"
          content="Luke Robertson is an Australian born designer with a focus on visual identity and typographic craft."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={`${styles.navigation}`}>
        <span>Luke Robertson</span>
        <button
          onClick={() => {
            animateScrollTo(infoRef.current);
          }}
        >
          Information
        </button>
      </nav>

      <main className={styles.main}>
        <Projects data={pagedata ? pagedata.data.projects : null} />
      </main>
      <section ref={infoRef} className={styles.info} id="information">
        <InfoSection data={pagedata} />
      </section>
    </>
  );
};

export default Home;
