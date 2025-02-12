import { Marker, marker, icon, Icon, LatLngExpression } from "leaflet";

export type MarkerColor = 'black' | 'blue' | 'gold' | 'green' | 'grey' | 'orange' | 'red' | 'violet' | 'yellow';
export function getMarker(latLng: LatLngExpression, color: MarkerColor = 'grey'): Marker {
    return marker(latLng, {
        icon: icon({
            ...Icon.Default.prototype.options,
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`, // 'assets/marker-icon.png',
            iconRetinaUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`, // 'assets/marker-icon-2x.png',
            shadowUrl: 'assets/marker-shadow.png'
       })
    });
}
