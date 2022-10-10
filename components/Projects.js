import React, { useEffect } from "react";
import styles from "./Projects.module.scss";

export const Projects = ({
  data,
  themeColor,
  setThemeColor,
  curr,
  setCurr,
}) => {
  // console.log("Projects Component", data);

  const textStyle = (color) => ({
    color: `${color}`,
  });

  const imgStyle = (imgSrc) => ({
    backgroundImage: `url(${imgSrc})`,
  });

  const changeProject = (i) => {
    // console.log("Change Project", i);
    if (i + 1 > data.length - 1) {
      setCurr(0);
    } else {
      setCurr(i + 1);
    }
  };

  useEffect(() => {
    // console.log("Current Project Updated");
    setThemeColor(data[curr].project.data.text_color);
  }, [curr]);

  return (
    <section className={styles.projects_module}>
      <ul>
        {data.map((item, i) => {
          return (
            <li
              onClick={() => changeProject(i)}
              index={i}
              key={i}
              className={i === curr ? styles.active : null}
            >
              <figure
                className={
                  item.project.data.orientation === "Full Bleed"
                    ? styles.full_bleed
                    : styles.constrained
                }
              >
                {item.project.data.media_type === "Image" ? (
                  <div
                    className={styles.imageCanvas}
                    style={imgStyle(item.project.data.image.url)}
                  />
                ) : (
                  <video loop autoPlay muted>
                    <source
                      src={item.project.data.video.url}
                      type="video/mp4"
                    />
                  </video>
                )}
              </figure>
              <span
                className={styles.caption}
                style={
                  item.project.data.text_color
                    ? textStyle(item.project.data.text_color)
                    : textStyle("inherit")
                }
              >
                {item.project.data.description}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
