import Navbar from "./Components/Navbar/Navbar";
import BookingApp from "./Components/Hero/Hero";
import Visited from "./Components/Place/Visited";
import Pick from "./Components/Choose/Pick";
import Footer from "./Components/Footer/Footer";

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
