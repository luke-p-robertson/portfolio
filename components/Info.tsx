import React from "react";

type AppProps = {
  data: object;
};

export const InfoSection = ({ data }: AppProps) => {
  console.log(data);

  return <h1>Info Section</h1>;
};
