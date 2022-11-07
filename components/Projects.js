import React, { useEffect, useMemo } from "react";
import styles from "./Projects.module.scss";

export const Projects = ({
  data,
  setThemeColor,
  setProjectColor,
  curr,
  setCurr,
  old,
  setOld,
}) => {
  // console.log("Projects Component", data);

  const refs = useMemo(
    () =>
      Array(data.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  useEffect(() => {
    // console.log("curr", curr);

    if (refs.length > 0) {
      if (refs[old] && refs[old].current) {
        refs[old].current.pause();
        refs[old].current.currentTime = 0;
        // refs[i].current.load();
      }

      if (refs[curr] && refs[curr].current) {
        refs[curr].current.play();
      }
    }
  }, [curr, old, refs]);

  const textStyle = (color) => ({
    color: `${color}`,
  });

  const bgStyle = (color) => ({
    backgroundColor: `${color}`,
  });

  const imgStyle = (imgSrc) => ({
    backgroundImage: `url(${imgSrc})`,
  });

  const changeProject = (i, dir) => {
    // console.log("Change Project", i, dir);

    if (dir === "next") {
      if (i + 1 > data.length - 1) {
        setCurr(0);
        setOld(data.length - 1);
        setThemeColor(data[0].project.data.text_color);
        setProjectColor(data[0].project.data.text_color);
      } else {
        setCurr(i + 1);
        setOld(i);
        setThemeColor(data[i + 1].project.data.text_color);
        setProjectColor(data[i + 1].project.data.text_color);
      }
    } else if (dir === "prev") {
      if (i - 1 < 0) {
        setCurr(data.length - 1);
        setOld(0);
        setThemeColor(data[data.length - 1].project.data.text_color);
        setProjectColor(data[data.length - 1].project.data.text_color);
      } else {
        setCurr(i - 1);
        setOld(i);
        setThemeColor(data[i - 1].project.data.text_color);
        setProjectColor(data[i - 1].project.data.text_color);
      }
    }
  };

  return (
    <section className={styles.projects_module}>
      <ul>
        {data &&
          data.map((item, i) => {
            return (
              <li
                index={i}
                key={i}
                className={i === curr ? styles.active : null}
                style={
                  item.project.data.background_color
                    ? bgStyle(item.project.data.background_color)
                    : "#ffffff"
                }
              >
                <figure
                  className={
                    item.project.data.orientation === "Full Bleed"
                      ? styles.full_bleed
                      : styles.constrained
                  }
                  data-video={item.project.data.video ? i : null}
                >
                  {item.project.data.media_type === "Image" ? (
                    <div
                      className={styles.imageCanvas}
                      style={imgStyle(item.project.data.image.url)}
                    />
                  ) : (
                    <video loop muted playsInline ref={refs[i]}>
                      <source
                        src={item.project.data.video.url}
                        type="video/mp4"
                      />
                    </video>
                  )}
                </figure>
                <div
                  className={styles.caption}
                  style={
                    item.project.data.text_color
                      ? textStyle(item.project.data.text_color)
                      : textStyle("inherit")
                  }
                >
                  <span className={styles.total_count}>{`${i + 1}/${
                    data.length
                  }`}</span>{" "}
                  {item.project.data.external_link ? (
                    <a
                      className={styles.external_link}
                      href={item.project.data.external_link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.project.data.description} <span>↗</span>
                    </a>
                  ) : (
                    item.project.data.description
                  )}
                </div>
                <div
                  onClick={() => changeProject(i, "prev")}
                  className={styles.prev_proj}
                />
                <div
                  onClick={() => changeProject(i, "next")}
                  className={styles.next_proj}
                />
              </li>
            );
          })}
      </ul>
    </section>
  );
};
