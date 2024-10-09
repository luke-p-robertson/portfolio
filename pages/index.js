import { useRef, useState, useEffect } from "react";
import Head from "next/head";
import { createClient } from "../prismicio";
import { InfoSection } from "../components/Info";
import { Projects } from "../components/Projects";
import animateScrollTo from "animated-scroll-to";
import { motion } from "framer-motion";
import styles from "./Home.module.scss";

// comment for deploy purpose only

export async function getServerSideProps({ previewData }) {
  const client = createClient({ previewData });

  const pagedata = await client.getSingle("homepage", {
    fetchLinks: [
      "project.media_type",
      "project.image",
      "project.video",
      "project.description",
      "project.orientation",
      "project.text_color",
      "project.background_color",
      "project.external_link",
    ],
  });

  return {
    props: {
      pagedata,
    },
  };
}

export default function Homepage({ pagedata }) {
  // console.log("PageData", pagedata);

  const [siteLoaded, setSiteLoaded] = useState(false);
  const [siteTimer, setSiteTimer] = useState(false);
  const [curr, setCurr] = useState(0);
  const [old, setOld] = useState(pagedata.data.projects.length - 1);
  const [themeColor, setThemeColor] = useState(null);
  const [projectColor, setProjectColor] = useState(null);

  const textStyle = (color) => ({
    color: `${color}`,
  });

  // set initial theme color
  useEffect(() => {
    // console.log("checking for populated page data", pagedata);

    if (pagedata && pagedata.data) {
      setThemeColor(pagedata.data.projects[0].project.data.text_color);
      setProjectColor(pagedata.data.projects[0].project.data.text_color);
      setSiteLoaded(true);
    }
  }, [pagedata]);

  // handle keyboard controls
  useEffect(() => {
    const handleKeyUp = (event) => {
      const { key } = event;

      let next;
      let prev;

      if (key === "ArrowRight") {
        // console.log("Next Project", key, curr);

        if (curr + 1 > pagedata.data.projects.length - 1) {
          // console.log("Back to Zero");
          next = 0;
          prev = pagedata.data.projects.length - 1;
        } else {
          // console.log("Add One");
          prev = curr;
          next = curr + 1;
        }
      }

      if (key === "ArrowLeft") {
        // console.log("Previous Project", key, curr);

        if (curr - 1 < 0) {
          // console.log("Back to End");
          next = pagedata.data.projects.length - 1;
          prev = 0;
        } else {
          // console.log("Subtract One");
          prev = curr;
          next = curr - 1;
        }
      }

      setOld(prev);
      setCurr(next);
      setThemeColor(pagedata?.data?.projects[next]?.project?.data?.text_color);
      setProjectColor(
        pagedata?.data?.projects[next]?.project?.data?.text_color
      );
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [curr, setCurr, pagedata]);

  const infoRef = useRef();
  const projectRef = useRef();

  // after 3 seconds, show the site
  useEffect(() => {
    setTimeout(() => {
      // alert("site loaded");
      setSiteTimer(true);
    }, 1000);

    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    };
    window.addEventListener("resize", appHeight);
    appHeight();

    return () => {
      window.removeEventListener("resize", appHeight);
    };
  }, []);

  // automatically change nav color and scroll destination when info is in view
  useEffect(() => {
    const handleScroll = () => {
      var someDiv = infoRef.current;
      var distanceToTop = someDiv.getBoundingClientRect().top;

      // console.log("Info to Top", distanceToTop);

      if (distanceToTop < 20) {
        setThemeColor("#000000");
      } else {
        setThemeColor(projectColor);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [projectColor, setThemeColor]);

  const animTiming = 0.5;
  const variants = {
    show: {
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: animTiming,
      },
    },
    hide: {
      opacity: 0,
      transition: {
        ease: "easeOut",
        duration: animTiming,
      },
      transitionEnd: {
        display: "none",
      },
    },
    init: {
      opacity: 0,
    },
  };

  return (
    <>
      <Head>
        <title>Luke Robertson</title>
        <meta
          name="description"
          content="Luke Robertson is an Australian born designer with a focus on visual identity and typographic craft."
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <motion.nav
        className={`${styles.navigation}`}
        variants={variants}
        initial={"init"}
        animate={siteTimer ? "show" : "init"}
        style={themeColor && textStyle(themeColor)}
      >
        <button
          className={styles.logotype}
          onClick={() => {
            setThemeColor(projectColor);
            animateScrollTo(0);
          }}
        >
          Luke Robertson
        </button>
        <button
          className={styles.information}
          onClick={() => {
            setThemeColor("#000000");
            animateScrollTo(infoRef.current);
          }}
        >
          Information
        </button>
      </motion.nav>

      <motion.main
        variants={variants}
        initial={"init"}
        animate={siteTimer ? "show" : "init"}
        className={styles.main}
        ref={projectRef}
      >
        <Projects
          data={pagedata && pagedata.data.projects}
          setThemeColor={setThemeColor}
          setProjectColor={setProjectColor}
          curr={curr}
          setCurr={setCurr}
          old={old}
          setOld={setOld}
        />
      </motion.main>
      <section ref={infoRef} className={styles.info} id="information">
        <InfoSection data={pagedata && pagedata} />
      </section>
      {/* <motion.div
        variants={variants}
        animate={siteLoaded && siteTimer ? "hide" : null}
        // initial={"show"}
        className={styles.loader}
      /> */}
    </>
  );
}
