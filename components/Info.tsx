import React from "react";
import styles from "./Info.module.scss";

type AppProps = {
  data: any;
};

export const InfoSection = ({ data }: AppProps) => {
  console.log(data.data);

  return (
    <div className={styles.content_col}>
      <div className={styles.row}>
        <span className={styles.label}>Profile</span>
        <div className={styles.content}>content</div>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Contact</span>
        <div className={styles.content}>content</div>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Clients</span>
        <div className={styles.content}>content</div>
      </div>
    </div>
  );
};
