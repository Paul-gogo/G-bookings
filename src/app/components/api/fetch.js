const baseUrl = "https://booking-com15.p.rapidapi.com";

const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'd71c614395mshcadb7eeb8897fbdp141f06jsn119117428eba',
		'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
	}
};
// 🔍 Step 1: Get destination ID based on user's input
export const getDestinationId = async (query) => {
  const url = `${baseUrl}/api/v1/hotels/searchDestination?query=${encodeURIComponent(
    query
  )}&countryCode=gb`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    console.log("Destination search result:", data);
    return data?.data?.[0]?.dest_id || null;
  } catch (error) {
    console.error("Error fetching destination ID:", error);
    return null;
  }
};

// 🔍 Step 2: Use destination ID to get hotel results
export const getSearchHotels = async (
  destId,
  checkIn,
  checkOut,
  passengers = 1
) => {
  const url = `${baseUrl}/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=CITY&checkin_date=${checkIn}&checkout_date=${checkOut}&adults=${passengers}`;

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error("Failed to fetch hotels");
    }

    const data = await response.json();
    // console.log("Hotel search results:", data);
    return data;
  } catch (error) {
    console.error("Fetch error:", error.message);
    return null;
  }
};
export async function fetchFlights(origin, destination) {
  const url = `${baseUrl}/api/v1/flights/searchFlights?fromId=${origin}&toId=${destination}&stops=none&pageNo=1&adults=1&children=0%2C17&sort=BEST&cabinClass=ECONOMY&currency_code=AED`;

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    console.log("🔍 Full API flight data:", data); // 👈 Add this line

    if (!data?.data?.length) {
      console.warn("No results for search, falling back to BOM → DEL");
      const fallbackUrl = `${baseUrl}/api/v1/flights/searchFlights?fromId=BOM.AIRPORT&toId=DEL.AIRPORT&stops=none&pageNo=1&adults=1&children=0%2C17&sort=BEST&cabinClass=ECONOMY&currency_code=AED`;
      const fallbackRes = await fetch(fallbackUrl, options);
      const fallbackData = await fallbackRes.json();
      console.log("🔁 Fallback API data:", fallbackData); // 👈 Also log fallback
      return { data: fallbackData.data, fallback: true };
    }

    return { data: data.data, fallback: false };
  } catch (err) {
    console.error("❌ Flight fetch failed:", err.message);
    return { data: [], fallback: false };
  }
}
export const getAirportSuggestions = async (query) => {
  const url = `${baseUrl}/api/v1/flights/searchDestination?query=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // Adjust the path below based on your API's response structure
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching airport suggestions:", error);
    return [];
  }
};

export const getHotelsSub = async () => {
  const response = await fetch(`${baseUrl}/api/v1/flights/searchDestination?`,options);
  const data = await response.json();
  console.log(response);
  console.log(data)
  return data;
}

