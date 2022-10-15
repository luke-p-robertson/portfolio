import React from "react";
import { PrismicRichText } from "@prismicio/react";
import styles from "./Info.module.scss";

export const InfoSection = ({ data }) => {
  // console.log("Info Component", data.data);

  return (
    <div className={styles.content_col}>
      <div className={styles.row}>
        <div className={styles.label}>
          <span>Profile</span>
        </div>
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
            {data.data.clients.map(function (item, i) {
              if (i + 1 === data.data.clients.length) {
                // last one
                return <li key={i}>{item.client}</li>;
              } else {
                return <li key={i}>{item.client}, &nbsp;</li>;
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
