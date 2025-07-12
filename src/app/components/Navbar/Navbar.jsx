'use client'
import React, { useState } from 'react';
import Logo from '../Helpers/Logo';
import styles from './navbar.module.css';
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <div className={styles.navbar}>
      <div>
        <Logo />
      </div>

      <div className={styles.navlinks}>
        <h1><a href="">Home</a></h1>
        <h1><a href="">Hotels</a></h1>
        <h1><a href="">Flights</a></h1>
        <h1><a href="">Car Rental</a></h1>
      </div>

      <div className={styles.buttons}>
        <button><a href="">Sign up</a></button>
        <button><a href="">Register</a></button>
      </div>

      <div className={styles.menu} onClick={toggleMenu}>
        <GiHamburgerMenu />
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <h1><a href="">Home</a></h1>
          <h1><a href="">Hotels</a></h1>
          <h1><a href="">Flights</a></h1>
          <h1><a href="">Car Rental</a></h1>
          <button><a href="">Sign up</a></button>
          <button><a href="">Register</a></button>
        </div>
      )}
    </div>
  );
}

export default Navbar;

