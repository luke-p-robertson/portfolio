import { useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "./Home.module.scss";
import { InfoSection } from "../components/Info";
import { Projects } from "../components/Projects";

const Home: NextPage = () => {
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
        <Projects />
      </main>
      <section className={styles.info}>
        <InfoSection data={null} />
      </section>
    </>
  );
};

export default Home;
