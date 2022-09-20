import { useRef, useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import { createClient, linkResolver } from "../prismicio";
import Head from "next/head";
import styles from "./Home.module.scss";
import { InfoSection } from "../components/Info";
import { Projects } from "../components/Projects";

type Props = {
  pagedata: any;
  previewData: any;
};

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData });

  const pagedata = await client.getSingle("homepage");

  return {
    props: {
      pagedata,
    },
  };
};

const Home: NextPage<Props> = ({ pagedata }) => {
  console.log(pagedata);

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
      <nav>
        <span>Luke Robertson</span>
        <button>Information</button>
      </nav>

      <main className={styles.main}>
        <Projects data={pagedata} />
      </main>
      <section className={styles.info}>
        <InfoSection data={pagedata} />
      </section>
    </>
  );
};

export default Home;
