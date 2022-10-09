import React from "react";
import styles from "./Projects.module.scss";

export const Projects = ({ data }) => {
  console.log("Projects Component", data);

  const textStyle = (color) => ({
    color: `${color}`,
  });

  const imgStyle = (imgSrc) => ({
    backgroundImage: `url(${imgSrc})`,
  });

  return (
    <section className={styles.projects_module}>
      <ul>
        {data.map((item, i) => {
          return (
            <li key={i}>
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
