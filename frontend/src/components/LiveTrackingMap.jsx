import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const driverIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return null;
}

function LiveTrackingMap({ position }) {
  if (!position) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
        <p className="text-sm text-slate-500">
          Waiting for driver location...
        </p>
      </div>
    );
  }

  const mapPosition = [position.latitude, position.longitude];

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <MapContainer
        center={mapPosition}
        zoom={14}
        scrollWheelZoom={true}
        className="h-[420px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenter position={mapPosition} />

        <Marker position={mapPosition} icon={driverIcon}>
          <Popup>
            Driver is here
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LiveTrackingMap;