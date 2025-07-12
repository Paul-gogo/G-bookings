import Navbar from "./components/Navbar/Navbar";
import BookingApp from "./components/Hero/Hero";
import Visited from "./components/Place/Visited";
import Pick from "./components/Choose/Pick";
import Footer from "./components/Footer/Footer";

import styles from "./globals.css";

export default function Home() {
  return (
    <div>
      <div>
        <div>
          <Navbar />
        </div>
        <div>
          <BookingApp />
        </div>
        <div>
          <Visited/>
        </div>
        <div>
          < Pick/>
        </div>
        <div>
          < Footer />
        </div>
      </div>
    </div>
  );
}
