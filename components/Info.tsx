import React from "react";
import { PrismicRichText } from "@prismicio/react";
import styles from "./Info.module.scss";

type AppProps = {
  data: any;
};

export const InfoSection = ({ data }: AppProps) => {
  console.log(data.data);

  return (
    <div className={styles.content_col}>
      <div className={styles.row}>
        <div className={styles.label}> </div>
        <div className={styles.content}>
          <PrismicRichText field={data.data.profile} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label}>
          <span>Contact</span>
        </div>
        <div className={styles.content}>
          <PrismicRichText field={data.data.contact} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.label}>
          <span>Clients</span>
        </div>
        <div className={styles.content}>
          <ul>
            {data.data.clients.map(function (item: any, i: any) {
              console.log("test");
              return <li key={i}>{item.client}, &nbsp;</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
