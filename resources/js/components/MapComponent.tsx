import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface Clinic {
    id: number;
    name: string;
    address: string;
    location: {
        coordinates: [number, number]; // [longitude, latitude]
    };
}

const MapComponent: React.FC = () => {
    const [clinics, setClinics] = useState<Clinic[]>([]);

    useEffect(() => {
        fetch('/api/clinics')
            .then((res) => res.json())
            .then((data) => setClinics(data))
            .catch((err) => console.error('Failed to fetch clinics:', err));
    }, []);

    // Default center of the map (e.g., center of the clinics or a fixed location)
    const center: [number, number] = clinics.length ? [clinics[0].location.coordinates[1], clinics[0].location.coordinates[0]] : [0, 0];

    return (
        <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {clinics.map((clinic) => (
                <Marker key={clinic.id} position={[clinic.location.coordinates[1], clinic.location.coordinates[0]]}>
                    <Popup>
                        <strong>{clinic.name}</strong>
                        <br />
                        {clinic.address}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
