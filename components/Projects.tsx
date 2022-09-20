import React from "react";

type AppProps = {
  data: object;
};

export const Projects = ({ data }: AppProps) => {
  console.log(data);

  return <h1>Projects Section</h1>;
};
