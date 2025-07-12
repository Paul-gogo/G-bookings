"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchFlights,
  getAirportSuggestions,
} from "@/app/components/api/fetch";

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for form and suggestions
  const [originInput, setOriginInput] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [usedFallback, setUsedFallback] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch suggestions as user types
  useEffect(() => {
    if (originInput.length > 2) {
      getAirportSuggestions(originInput).then(setOriginSuggestions);
    } else {
      setOriginSuggestions([]);
    }
  }, [originInput]);
  useEffect(() => {
    if (destinationInput.length > 2) {
      getAirportSuggestions(destinationInput).then(setDestinationSuggestions);
    } else {
      setDestinationSuggestions([]);
    }
  }, [destinationInput]);

  // Fetch flights when both codes are set
  useEffect(() => {
    if (origin && destination) {
      setLoading(true);
      fetchFlights(origin, destination).then(({ data, fallback }) => {
        setFlights(data || []);
        setUsedFallback(fallback);
        setLoading(false);
      });
    }
  }, [origin, destination]);

  // Optional: prefill from query params if present
  useEffect(() => {
    const o = searchParams.get("origin");
    const d = searchParams.get("destination");
    if (o) setOrigin(o);
    if (d) setDestination(d);
  }, [searchParams]);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (origin && destination) {
      router.push(`/flights?origin=${origin}&destination=${destination}`);
    }
  };

  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit}
        className="mb-6 flex flex-col md:flex-row gap-4"
      >
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="From (type city or airport)"
            value={originInput}
            onChange={(e) => {
              setOriginInput(e.target.value);
              setOrigin("");
            }}
            autoComplete="off"
            required
          />
          {originSuggestions.length > 0 && (
            <ul className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto rounded shadow">
              {originSuggestions.map((s) => (
                <li
                  key={s.id || s.iata || s.name}
                  className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setOriginInput(`${s.name} (${s.iata || s.id})`);
                    setOrigin(s.iata || s.id);
                    setOriginSuggestions([]);
                  }}
                >
                  {s.name} ({s.iata || s.id})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="To (type city or airport)"
            value={destinationInput}
            onChange={(e) => {
              setDestinationInput(e.target.value);
              setDestination("");
            }}
            autoComplete="off"
            required
          />
          {destinationSuggestions.length > 0 && (
            <ul className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto rounded shadow">
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
          disabled={!origin || !destination}
        >
          Search Flights
        </button>
      </form>

      <h1 className="text-2xl font-bold mb-4">
        {usedFallback
          ? "No flights found for your search. Showing BOM → DEL instead."
          : "Available Flights"}
      </h1>

      {loading ? (
        <p>Loading flights...</p>
      ) : flights.length > 0 ? (
        flights.map((flight, index) => (
          <div key={index} className="mb-4 border-b pb-2">
            <p>
              <strong>Airline:</strong> {flight.airlineName}
            </p>
            <p>
              <strong>Price:</strong> {flight.displayedFare?.currency}{" "}
              {flight.displayedFare?.total}
            </p>
            <p>
              <strong>Departure:</strong>{" "}
              {flight.legs[0]?.departureAirport?.name} at{" "}
              {flight.legs[0]?.departureTime}
            </p>
            <p>
              <strong>Arrival:</strong> {flight.legs[0]?.arrivalAirport?.name}{" "}
              at {flight.legs[0]?.arrivalTime}
            </p>
          </div>
        ))
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-1/4 p-4 bg-gray-50 border-r">
            <h2 className="text-lg font-semibold mb-4">Filter Results</h2>

            <div className="mb-4">
              <h3 className="font-medium">Price Range</h3>
              <input
                type="range"
                min="100"
                max="1000"
                className="w-full mt-2"
              />
            </div>

            <div className="mb-4">
              <h3 className="font-medium">Stops</h3>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Nonstop
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />1 Stop
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  2+ Stops
                </label>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium">Airlines</h3>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  SkyJet Airways
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  Global Airlines
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  TransOcean Air
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  StarLink Flights
                </label>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium">Departure Time</h3>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Early Morning (12AM - 6AM)
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Morning (6AM - 12PM)
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Afternoon (12PM - 6PM)
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Evening (6PM - 12AM)
                </label>
              </div>
            </div>

            <button className="w-full bg-gray-900 text-white py-2 rounded">
              Apply Filters
            </button>
          </aside>

          {/* Flights List */}
          <main className="flex-1 p-4 space-y-4">
            <div className="border rounded-xl p-4 shadow-sm bg-white">
              {/* Airline and Stops */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-gray-700">
                    G-Airlines
                  </span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  2 stops (ATL, DEN)
                </span>
              </div>

              {/* Times and Route */}
              <div className="flex justify-between items-center mb-1">
                <div>
                  <p className="text-xl font-bold">
                    07:00 AM{" "}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      LGA
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">New York</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">8h 30m</p>
                  <div className="h-1 w-32 bg-gray-300 rounded-full mx-auto mb-1 relative">
                    <div className="absolute left-0 top-[-6px] w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="absolute right-0 top-[-6px] w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-400">2 stops (ATL, DEN)</p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    12:30 PM{" "}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      LAX
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">Los Angeles</p>
                </div>
              </div>

              {/* Price and Button */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-blue-600 font-bold text-lg">
                  $199{" "}
                  <span className="text-sm font-normal text-gray-500">
                    / person
                  </span>
                </p>
                <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600">
                  View Details →
                </button>
              </div>
            </div>
            <div className="border rounded-xl p-4 shadow-sm bg-white">
              {/* Airline and Stops */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-gray-700">
                    G-Airlines
                  </span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  2 stops (ATL, DEN)
                </span>
              </div>

              {/* Times and Route */}
              <div className="flex justify-between items-center mb-1">
                <div>
                  <p className="text-xl font-bold">
                    07:00 AM{" "}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      LGA
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">New York</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">5h 30m</p>
                  <div className="h-1 w-32 bg-gray-300 rounded-full mx-auto mb-1 relative">
                    <div className="absolute left-0 top-[-6px] w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="absolute right-0 top-[-6px] w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-400">0 stops</p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    12:30 PM{" "}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      LAX
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">Los Angeles</p>
                </div>
              </div>

              {/* Price and Button */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-blue-600 font-bold text-lg">
                  $129{" "}
                  <span className="text-sm font-normal text-gray-500">
                    / person
                  </span>
                </p>
                <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600">
                  View Details →
                </button>
              </div>
            </div>
            <div className="border rounded-xl p-4 shadow-sm bg-white">
              {/* Airline and Stops */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-gray-700">
                    G-Airlines
                  </span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  1 stops ( DEN)
                </span>
              </div>

              {/* Times and Route */}
              <div className="flex justify-between items-center mb-1">
                <div>
                  <p className="text-xl font-bold">
                    07:00 AM{" "}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      LGA
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">New York</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">8h 30m</p>
                  <div className="h-1 w-32 bg-gray-300 rounded-full mx-auto mb-1 relative">
                    <div className="absolute left-0 top-[-6px] w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="absolute right-0 top-[-6px] w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <p className="text-xs text-gray-400">2 stops (ATL, BOM)</p>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold">
                    12:30 PM{" "}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      LAX
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">Lagos</p>
                </div>
              </div>

              {/* Price and Button */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-blue-600 font-bold text-lg">
                  $199{" "}
                  <span className="text-sm font-normal text-gray-500">
                    / person
                  </span>
                </p>
                <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600">
                  View Details →
                </button>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
