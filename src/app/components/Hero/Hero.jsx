"use client";

import React, { useState } from "react";
import styles from "./hero.module.css";
import {
  PiAirplaneTilt,
  PiAirplaneLandingLight,
  PiAirplaneTiltLight,
} from "react-icons/pi";
import { LuHotel } from "react-icons/lu";
import { IoCarSportOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { CiCalendarDate, CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { getAirportSuggestions } from "@/app/components/api/fetch"; // Adjust the import path as necessary

function BookingApp() {
  const [activeForm, setActiveForm] = useState("hotels");

  const renderForm = () => {
    switch (activeForm) {
      case "hotels":
        return <HotelForm />;
      case "cars":
        return <CarRentalForm />;
      case "flights":
        return <FlightForm />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.hero}>
      <div className="p-5">
        <div className="text-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-[45px] font-bold">
            Find Your Perfect Trip
          </h1>
          <p className="text-white text-base md:text-lg">
            Search hotels, flights and car rentals across the world at the best
            prices
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full bg-white mt-4 cursor-pointer border-b border-[#f1f2f1]">
          <button
            onClick={() => setActiveForm("hotels")}
            className="flex justify-center items-center w-full sm:w-1/3 gap-1 py-2 hover:bg-[#f1f2f1]"
          >
            <LuHotel /> Book Hotels
          </button>
          <button
            onClick={() => setActiveForm("flights")}
            className="flex justify-center items-center w-full sm:w-1/3 gap-1 py-2 hover:bg-[#f1f2f1]"
          >
            <PiAirplaneTilt /> Flights
          </button>
          <button
            onClick={() => setActiveForm("cars")}
            className="flex justify-center items-center w-full sm:w-1/3 gap-1 py-2 hover:bg-[#f1f2f1]"
          >
            <IoCarSportOutline /> Car Rentals
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow mt-4">
          {renderForm()}
        </div>
      </div>
    </div>
  );
}

function HotelForm() {
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const destination = e.target.destination.value;
    const checkIn = e.target.checkIn.value;
    const checkOut = e.target.checkOut.value;
    const passengers = e.target.passengers.value;
    router.push(
      `/hotels?destination=${destination}&checkIn=${checkIn}&checkOut=${checkOut}&passengers=${passengers}`
    );
  };

  return (
    <form onSubmit={handleSearch}>
      <h2 className="text-xl font-semibold text-center mb-4">Hotel Booking</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label>Destination</label>
          <div className="flex items-center gap-2 bg-[#f9f9f9] p-2 rounded-full">
            <FaLocationDot />
            <input
              name="destination"
              className="w-full outline-none bg-transparent"
              type="text"
              placeholder="Where are you going?"
            />
          </div>
        </div>
        <div>
          <label>Check In</label>
          <div className="flex items-center gap-2 bg-[#f9f9f9] p-2 rounded-full">
            <CiCalendarDate />
            <input
              name="checkIn"
              className="w-full outline-none bg-transparent"
              type="date"
            />
          </div>
        </div>
        <div>
          <label>Check Out</label>
          <div className="flex items-center gap-2 bg-[#f9f9f9] p-2 rounded-full">
            <CiCalendarDate />
            <input
              name="checkOut"
              className="w-full outline-none bg-transparent"
              type="date"
            />
          </div>
        </div>
        <div>
          <label>Guests</label>
          <select
            name="passengers"
            className="w-full bg-[#f9f9f9] p-2 rounded-full outline-none"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n === 5 ? "5+" : n}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 mx-auto">
          <CiSearch /> Search Hotels
        </button>
      </div>
    </form>
  );
}

// ...existing code...
export function FlightForm() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [originInput, setOriginInput] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destination, setDestination] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  // Fetch origin suggestions
  React.useEffect(() => {
    if (originInput.length > 2) {
      getAirportSuggestions(originInput).then(setOriginSuggestions);
    } else {
      setOriginSuggestions([]);
    }
  }, [originInput]);

  // Fetch destination suggestions
  React.useEffect(() => {
    if (destinationInput.length > 2) {
      getAirportSuggestions(destinationInput).then(setDestinationSuggestions);
    } else {
      setDestinationSuggestions([]);
    }
  }, [destinationInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
    });
    router.push(`/flights?${queryParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-center mb-4">Flight Booking</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Departure</label>
          <div className="flex flex-col gap-1 bg-white p-2 rounded-md relative">
            <div className="flex items-center gap-2">
              <PiAirplaneTiltLight />
              <input
                type="text"
                className="w-full outline-none"
                placeholder="From where?"
                value={originInput}
                onChange={(e) => {
                  setOriginInput(e.target.value);
                  setOrigin(""); // Reset selected value
                }}
                required
                autoComplete="off"
              />
            </div>
            {originSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full mt-1 max-h-40 overflow-y-auto rounded shadow">
                {originSuggestions.map((s) => (
                  <li
                    key={s.id || s.iata || s.name}
                    className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setOriginInput(`${s.name} (${s.iata || s.id})`);
                      setOrigin(s.iata || s.id); // Use the code for API
                      setOriginSuggestions([]);
                    }}
                  >
                    {s.name} ({s.iata || s.id})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <label>Arrival</label>
          <div className="flex flex-col gap-1 bg-white p-2 rounded-md relative">
            <div className="flex items-center gap-2">
              <PiAirplaneLandingLight />
              <input
                type="text"
                className="w-full outline-none"
                placeholder="To where?"
                value={destinationInput}
                onChange={(e) => {
                  setDestinationInput(e.target.value);
                  setDestination("");
                }}
                required
                autoComplete="off"
              />
            </div>
            {destinationSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full mt-1 max-h-40 overflow-y-auto rounded shadow">
                {destinationSuggestions.map((s) => (
                  <li
                    key={s.id || s.iata || s.name}
                    className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setDestinationInput(`${s.name} (${s.iata || s.id})`);
                      setDestination(s.iata || s.id);
                      setDestinationSuggestions([]);
                    }}
                  >
                    {s.name} ({s.iata || s.id})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label>Departure Date</label>
          <div className="flex items-center gap-2 bg-white p-2 rounded-md">
            <CiCalendarDate />
            <input
              type="date"
              className="w-full outline-none"
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label>Return Date</label>
          <div className="flex items-center gap-2 bg-white p-2 rounded-md">
            <CiCalendarDate />
            <input
              type="date"
              className="w-full outline-none"
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label>Passengers</label>
          <select
            className="w-full p-2 rounded-md bg-white outline-none"
            onChange={(e) => setPassengers(e.target.value)}
            required
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} Passenger{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 mx-auto">
          <CiSearch /> Search Flights
        </button>
      </div>
    </form>
  );
}

function CarRentalForm() {
  return (
    <form>
      <h2 className="text-xl font-semibold text-center mb-4">Car Rental</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label>Pick-Up Location</label>
          <div className="flex items-center gap-2 bg-white p-2 rounded-md">
            <FaLocationDot />
            <input
              type="text"
              placeholder="City, Airport, Address"
              className="w-full outline-none"
            />
          </div>
        </div>
        <div>
          <label>Pick-Up Date</label>
          <div className="flex items-center gap-2 bg-white p-2 rounded-md">
            <CiCalendarDate />
            <input type="date" className="w-full outline-none" />
          </div>
        </div>
        <div>
          <label>Drop-Off Date</label>
          <div className="flex items-center gap-2 bg-white p-2 rounded-md">
            <CiCalendarDate />
            <input type="date" className="w-full outline-none" />
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 mx-auto">
          <IoCarSportOutline /> Search Cars
        </button>
      </div>
    </form>
  );
}

export default BookingApp;
