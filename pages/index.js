import { useRef, useState, useContext, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { createClient } from "../prismicio";
import { InfoSection } from "../components/Info";
import { Projects } from "../components/Projects";
import animateScrollTo from "animated-scroll-to";
import styles from "./Home.module.scss";

export async function getStaticProps({ previewData }) {
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
}

export default function Homepage({ pagedata }) {
  console.log("PageData", pagedata);

  const [curr, setCurr] = useState(0);
  const [themeColor, setThemeColor] = useState("#000000");
  // const [pressed, setPressed] = useState([]);

  useEffect(() => {
    const handleKeyUp = (event) => {
      const { key } = event;

      let next;

      if (key === "ArrowRight") {
        // console.log("Next Project", key, curr);

        if (curr + 1 > pagedata.data.projects.length - 1) {
          // console.log("Back to Zero");
          next = 0;
        } else {
          // console.log("Add One");
          next = curr + 1;
        }
      }

      if (key === "ArrowLeft") {
        // console.log("Previous Project", key, curr);

        if (curr - 1 <= 0) {
          // console.log("Back to End");
          next = pagedata.data.projects.length - 1;
        } else {
          // console.log("Subtract One");
          next = curr - 1;
        }
      }

      setCurr(next);
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [curr, setCurr, pagedata.data.projects.length]);

  const textStyle = (color) => ({
    color: `${color}`,
  });

  const infoRef = useRef(null);

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
      <nav
        className={`${styles.navigation}`}
        style={themeColor ? textStyle(themeColor) : textStyle("inherit")}
      >
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
        <Projects
          data={pagedata ? pagedata.data.projects : null}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
          curr={curr}
          setCurr={setCurr}
        />
      </main>
      <section ref={infoRef} className={styles.info} id="information">
        <InfoSection data={pagedata} />
      </section>
    </>
  );
}
