import React from 'react';
import styles from './footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.column}>
          <h2>G-Bookings</h2>
          <p>
            Find and book your perfect trip with hotels, flights, and car rentals all in one place.
          </p>
        </div>
        <div className={styles.column}>
          <h3>Company</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press Center</li>
            <li>Sustainability</li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Help</h3>
          <ul>
            <li>Support Center</li>
            <li>Cancellation Options</li>
            <li>Safety Resource Center</li>
          </ul>
        </div>
        <div className={styles.column}>
          <h3>Contact</h3>
          <ul>
            <li>Email: support@gbookings.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Travel Street, Global City</li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        © 2025 G-Bookings. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

