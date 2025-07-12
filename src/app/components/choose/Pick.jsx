import React from 'react'
import styles from './pick.module.css'
import { FaPlus } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { TfiTarget } from "react-icons/tfi";

const Pick = () => {
  return (
    <div className={`${styles.container}`}>
      <h1>Why Choose <span className='text-[#0095E6]'>G-Bookings</span></h1>
      <div>
        <div className={styles.option}>
          <h2><FaPlus /></h2>
          <h1>Best Price Guarantee</h1>
          <p>Find a lower price? We'll refund the difference.</p>
        </div>
        <div className={styles.option}>
          <h2><TiTick /></h2>
          <h1>Easy Booking</h1>
          <p>Search, compare, and book in just a few clicks.</p>
        </div>
        <div className={styles.option}>
          <h2><TfiTarget /></h2>
          <h1>24/7 Support</h1>
          <p>Our team is available around the clock to help.</p>
        </div>
      </div>
    </div>
  )
}

export default Pick;

