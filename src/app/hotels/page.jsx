"use client";

import React, { useEffect, useState } from "react";
import { getDestinationId, getSearchHotels } from "../components/api/fetch";
import { useSearchParams } from "next/navigation";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { LiaDollarSignSolid } from "react-icons/lia";
import { IoLocationOutline } from "react-icons/io5";
import styles from "./page.module.css";

const HotelsPage = () => {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const passengers = searchParams.get("passengers");

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destSuggestions, setDestSuggestions] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      if (!destination || !checkIn || !checkOut || !passengers) {
        console.error("Missing required search parameters");
        setLoading(false);
        return;
      }

      const destId = await getDestinationId(destination);
      if (!destId) {
        await fetchSuggestions(destination);
        setLoading(false);
        return;
      }

      const hotelRes = await getSearchHotels(
        destId,
        checkIn,
        checkOut,
        passengers
      );
      const hotelsData = hotelRes?.data || [];

      if (hotelsData.length === 0) {
        await fetchSuggestions(destination);
      }

      setHotels(hotelsData);
      setLoading(false);
    };

    const fetchSuggestions = async (destination) => {
      try {
        const res = await fetch(
          `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(
            destination
          )}&countryCode=gb`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key":
                "d71c614395mshcadb7eeb8897fbdp141f06jsn119117428eba",
              "x-rapidapi-host": "booking-com15.p.rapidapi.com",
            },
          }
        );
        const data = await res.json();
        const mapped =
          data?.data?.map((item) => ({
            id: item.dest_id,
            name: item.name,
            label: item.label,
            image: item.image_url || null,
          })) || [];
        setDestSuggestions(mapped);
      } catch (err) {
        console.error(
          "Error fetching fallback destination suggestions:",
          err.message
        );
      }
    };

    fetchHotels();
  }, [destination, checkIn, checkOut, passengers]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{`Hotels In ${destination}`}</h1>

      {loading ? (
        <p className={styles.heading}>Loading hotels...</p>
      ) : hotels.length > 0 ? (
        <div className={styles.grid}>
          {hotels.map((hotel, index) => (
            <div key={index} className={styles.card}>
              <img
                src={hotel.photo_main_url || "/placeholder.jpg"}
                alt={hotel.hotel_name}
                className={styles.cardImage}
              />
              <h2 className={styles.cardTitle}>{hotel.hotel_name}</h2>
              <p className={styles.cardCity}>{hotel.city}</p>
              <p className={styles.cardPrice}>
                ${hotel.min_total_price || "N/A"}
              </p>
              <p className={styles.cardRating}>
                {hotel.review_score
                  ? `Rating: ${hotel.review_score}`
                  : "No rating"}
              </p>
            </div>
          ))}
        </div>
      ) : destSuggestions.length > 0 ? (
        <div className={styles.suggestionWrapper}>
          <h2 className={styles.heading}>
            No hotels found. Try one of these suggestions:
          </h2>
          {destSuggestions.map((dest) => (
            <div key={dest.id} className={styles.suggestionCard}>
              {dest.image && (
                <img
                  src={dest.image}
                  alt={dest.name}
                  className={styles.suggestionImage}
                />
              )}
              <div className={styles.suggestionContent}>
                <h2 className={styles.suggestionTitle}>{dest.name}</h2>
                <p className={styles.suggestionLocation}>
                  <IoLocationOutline /> {dest.label}
                </p>
                <div className={styles.amenities}>
                  {[
                    "Free Wifi",
                    "Spa",
                    "Gym",
                    "Breakfast",
                    "Room service",
                    "Pool",
                  ].map((amenity, i) => (
                    <p key={i} className={styles.amenity}>
                      {amenity}
                    </p>
                  ))}
                </div>
                <div className={styles.suggestionFooter}>
                  <div className={styles.price}>
                    <LiaDollarSignSolid className="text-[#0095E6]" /> 199 /
                    Night
                  </div>
                  <button className={styles.button}>
                    View details <MdKeyboardDoubleArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.heading}>No hotels or suggestions found.</p>
      )}
    </div>
  );
};

export default HotelsPage;
