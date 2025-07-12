import React from "react";
import styles from "./visited.module.css";

const Visited = () => {
  return (
    <div>
      <h1 className={`${styles.pop} justify-center`}>Popular Destination</h1>
      <div className={`${styles.general} mt-[5px]`}>
        <div
          className={`${styles.img1}  bg-cover bg-center h-96 w-full transition-transform duration-500 hover:scale-105`}
        >
          <p className={`${styles.p}`}>Portugal</p>
        </div>
        <div
          className={`${styles.img2}  bg-cover bg-center h-96 w-full transition-transform duration-500 hover:scale-105`}
        >
          <p className={`${styles.p}`}>France</p>
        </div>
        <div
          className={`${styles.img3}  bg-cover bg-center h-96 w-full transition-transform duration-500 hover:scale-105`}
        >
          <p className={`${styles.p}`}>Poland</p>
        </div>
        <div
          className={`${styles.img4}  bg-cover bg-center h-96 w-full transition-transform duration-500 hover:scale-105`}
        >
          <p className={`${styles.p}`}>Brazil</p>
        </div>
      </div>
    </div>
  );
};

export default Visited;
