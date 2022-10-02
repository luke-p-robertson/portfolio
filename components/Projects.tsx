import React from "react";
import styles from "./Projects.module.scss";

type AppProps = {
  data: any;
};

export const Projects = ({ data }: AppProps) => {
  console.log("Projects Component", data.data);

  return (
    <section className={styles.projects_module}>
      <ul>
        <li>
          <span className={styles.caption}>Some Caption Here</span>
        </li>
      </ul>
    </section>
  );
};
