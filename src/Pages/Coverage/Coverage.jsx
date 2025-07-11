import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap, // Hook to access the Leaflet map instance
} from "react-leaflet";
import L from "leaflet"; // Leaflet library for custom icons
import "leaflet/dist/leaflet.css"; // Default Leaflet styles
import branches from "../../assets/warehouses.json"; // Data for branch locations

// --- Custom Marker Icon ---
// Using an SVG as a custom marker for a more professional and scalable look.
// The SVG creates a blue map pin.
const svgIcon = `
  <svg width="30" height="30" viewBox="0 0 24 24" fill="#1D4ED8" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
  </svg>
`;

// L.DivIcon allows using custom HTML (like SVG) for markers.
const customIcon = new L.DivIcon({
  html: svgIcon,
  className: "custom-map-marker-icon",
  iconSize: [30, 30], 
  iconAnchor: [15, 30], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -25], // Point from which the popup should open relative to the iconAnchor
});


// --- FlyToDistrict Component ---
// A small helper component to programmatically move the map view.
const FlyToDistrict = ({ location }) => {
  const map = useMap(); // Get the current map instance

  // If a location is provided, fly to its coordinates with an animation.
  if (location) {
    map.flyTo([location.latitude, location.longitude], 10, {
      duration: 1.5, // Animation duration in seconds
    });
  }
  return null; // This component doesn't render anything visually
};


// --- Coverage Component ---
const Coverage = () => {
  // State to hold the value of the search input field.
  const [searchInput, setSearchInput] = useState("");
  // State to hold the details of the district found by the search.
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Handles the search logic when the search button is clicked.
  const handleSearch = () => {
    // Find a matching district from the 'branches' data.
    const match = branches.find((b) =>
      b.district.toLowerCase().includes(searchInput.toLowerCase()) // Case-insensitive search
    );
    setSelectedDistrict(match || null); // Set the matched district or null if not found
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-4xl font-extrabold text-center mb-6 text-green-600">
        Our Extensive Coverage Across 64 Districts
      </h2>

      {/* Search Input and Button */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a district, e.g., Dhaka..."
          // Tailwind CSS classes for styling the input
          className="input input-bordered input-lg w-full max-w-md shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
        />
        <button
          onClick={handleSearch}
          // Tailwind CSS classes for styling the button
          className="btn btn-primary btn-lg px-8 shadow-md hover:scale-105 transition-transform duration-200 ease-in-out"
        >
          Search
        </button>
      </div>

      {/* Map Container */}
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-xl border border-gray-200">
        <MapContainer
          center={[23.685, 90.3563]} // Initial map center (Bangladesh)
          zoom={7} // Initial zoom level
          scrollWheelZoom={true} // Enable zooming with mouse scroll
          style={{ height: "100%", width: "100%" }} // Make map fill its container
        >
          {/* Tile Layer (Base Map) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap tiles
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Markers for all Branches */}
          {branches.map((branch, i) => (
            <Marker
              key={i} // Unique key for each marker
              position={[branch.latitude, branch.longitude]} // Marker coordinates
              icon={customIcon} // Apply the custom icon
            >
              {/* Popup content for each branch marker */}
              <Popup>
                <div className="font-semibold text-lg mb-1">{branch.district}</div>
                <div className="text-sm text-gray-700">
                  <p><strong>City:</strong> {branch.city}</p>
                  <p><strong>Areas:</strong> {branch.covered_area.join(", ")}</p>
                  <p className="mt-2">
                    <a
                      href={branch.flowchart}
                      className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                      target="_blank" // Open link in new tab
                      rel="noreferrer" // Security best practice for target="_blank"
                    >
                      View Flowchart
                    </a>
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render FlyToDistrict and highlight marker if a district is selected */}
          {selectedDistrict && (
            <>
              {/* Calls the FlyToDistrict component to animate map view to selected location */}
              <FlyToDistrict location={selectedDistrict} />
              {/* A separate marker for the selected district (could optionally highlight it differently) */}
              <Marker
                position={[
                  selectedDistrict.latitude,
                  selectedDistrict.longitude,
                ]}
                icon={customIcon} // Using the same custom icon
              >
                {/* Popup content for the selected district marker */}
                <Popup>
                  <div className="font-semibold text-lg mb-1">{selectedDistrict.district}</div>
                  <div className="text-sm text-gray-700">
                    <p><strong>City:</strong> {selectedDistrict.city}</p>
                    <p><strong>Areas:</strong> {selectedDistrict.covered_area.join(", ")}</p>
                    <p className="mt-2">
                      <a
                        href={selectedDistrict.flowchart}
                        className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Flowchart
                      </a>
                    </p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;