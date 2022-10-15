import { useRef, useState, useContext, useEffect } from "react";
import Head from "next/head";
import { createClient } from "../prismicio";
import { InfoSection } from "../components/Info";
import { Projects } from "../components/Projects";
import animateScrollTo from "animated-scroll-to";
import styles from "./Home.module.scss";

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

  const [curr, setCurr] = useState(0);
  const [themeColor, setThemeColor] = useState(null);
  const [infoClick, setInfoClick] = useState(false);

  const textStyle = (color) => ({
    color: `${color}`,
  });

  // set initial theme color
  useEffect(() => {
    console.log("checking for populated page data", pagedata);

    if (pagedata && pagedata.data) {
      setThemeColor(pagedata.data.projects[0].project.data.text_color);
    }
  }, [pagedata]);

  // handle keyboard controls
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

        if (curr - 1 < 0) {
          // console.log("Back to End");
          next = pagedata.data.projects.length - 1;
        } else {
          // console.log("Subtract One");
          next = curr - 1;
        }
      }

      setCurr(next);
      setThemeColor(pagedata?.data?.projects[next]?.project?.data?.text_color);
    };

    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [curr, setCurr, pagedata]);

  const infoRef = useRef();
  const projectRef = useRef();

  // automatically change nav color and scroll destination when info is in view
  useEffect(() => {
    const handleScroll = () => {
      var someDiv = infoRef.current;
      var distanceToTop = someDiv.getBoundingClientRect().top;

      // console.log("Info to Top", distanceToTop);

      if (distanceToTop < 20) {
        setThemeColor("#000000");
        setInfoClick(true);
      } else {
        setThemeColor("#FFFFFF");

        setInfoClick(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setThemeColor, setInfoClick]);

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
        style={themeColor && textStyle(themeColor)}
      >
        <span>Luke Robertson</span>
        <button
          onClick={() => {
            if (infoClick) {
              setInfoClick(false);
              setThemeColor("#FFFFFF");
              animateScrollTo(0);
            } else {
              setInfoClick(true);
              setThemeColor("#000000");
              animateScrollTo(infoRef.current);
            }
          }}
        >
          Information
        </button>
      </nav>

      <main className={styles.main} ref={projectRef}>
        <Projects
          data={pagedata && pagedata.data.projects}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
          curr={curr}
          setCurr={setCurr}
        />
      </main>
      <section ref={infoRef} className={styles.info} id="information">
        <InfoSection data={pagedata && pagedata} />
      </section>
    </>
  );
}
