import React from "react";
import { PrismicRichText } from "@prismicio/react";
import styles from "./Info.module.scss";

export const InfoSection = ({ data }) => {
  // console.log("Info Component", data.data);

  return (
    <div className={styles.content_col}>
      <div className={styles.row}>
        <div className={`${styles.label} ${styles.no_margin}`}>
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
          <span>Select Clients</span>
        </div>
        <div className={styles.content}>
          <p>
            {data.data.clients.map(function (item, i) {
              if (i + 1 === data.data.clients.length) {
                // last one
                return <span key={i}>{item.client}</span>;
              } else {
                return <span key={i}>{item.client}, </span>;
              }
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
