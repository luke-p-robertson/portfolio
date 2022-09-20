import React from "react";
import styles from "./Projects.module.scss";

type AppProps = {
  data: any;
};

export const Projects = ({ data }: AppProps) => {
  console.log(data.data);

  return <h1>Projects Section</h1>;
};
