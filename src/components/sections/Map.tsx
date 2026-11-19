import { Card, CardContent } from '@bettergov/kapwa/card';
import { divIcon, type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import LucideIcon from '../ui/LucideIcon';

const longitude = 120.91842047296477;
const latitude = 15.584260432092078;
const talaveraCenter: LatLngExpression = [latitude, longitude];
const openStreetMapUrl = `https://www.openstreetmap.org/#map=13/${latitude}/${longitude}`;

const cityHallIcon = divIcon({
  className: '',
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="48" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" fill="var(--color-primary-600)" stroke="white" stroke-width="1.5"/><circle cx="12" cy="10" r="3" fill="white"/></svg>',
  iconSize: [40, 48],
  iconAnchor: [20, 48],
});

export default function Map({ className }: { className?: string }) {
  return (
    <div className={`relative h-96 w-full overflow-hidden z-0 ${className}`}>
      <MapContainer
        center={talaveraCenter}
        zoom={15}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={talaveraCenter}
          icon={cityHallIcon}
          title="Talavera Municipal Hall"
        />
      </MapContainer>
      <CityHallCard openStreetMapUrl={openStreetMapUrl} />
    </div>
  );
}

function CityHallCard({ openStreetMapUrl }: { openStreetMapUrl: string }) {
  return (
    <div className="absolute bottom-4 left-4 z-1000 w-[calc(100%-2rem)] max-w-sm">
      <Card className="bg-white shadow-lg">
        <CardContent className="flex gap-4 p-4">
          <div className="text-primary-600 p-2 my-auto">
            <LucideIcon size="lg" icon="MapPinned" />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900">Visit City Hall</h2>
            <p className="mt-1 text-sm text-gray-700">
              Talavera Municipal Hall, Quezon Street, Pag-asa District,
              Talavera, Philippines, 3114
            </p>
            <a
              href={openStreetMapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary-700 underline"
            >
              Open in Maps
              <LucideIcon size="sm" icon="ArrowUpRight" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
