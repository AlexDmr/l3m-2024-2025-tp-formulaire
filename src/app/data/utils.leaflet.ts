import { Feature, Point } from "geojson";
import { Marker, latLng,  marker, icon, Icon, LatLngExpression } from "leaflet";

export type MarkerColor = 'black' | 'blue' | 'gold' | 'green' | 'grey' | 'orange' | 'red' | 'violet' | 'yellow';
export interface MarkerConfig {
    readonly color: MarkerColor;
    readonly onClick?: (m: Marker) => void;
    readonly onOver?: (m: Marker) => void;
    readonly onLeave?: (m: Marker) => void;
}
const defaultMarkerConfig: MarkerConfig = {
    color: 'grey',
};

export function getMarker(pt: Feature<Point>, conf: Partial<MarkerConfig>): Marker;
export function getMarker(pt: LatLngExpression, conf: Partial<MarkerConfig>): Marker
export function getMarker(pt: Feature<Point> | LatLngExpression, conf: Partial<MarkerConfig> = {}): Marker {
    const { color, onClick, onOver, onLeave } = { ...defaultMarkerConfig, ...conf };
    const position = 'geometry' in pt ? latLng(pt.geometry.coordinates[1], pt.geometry.coordinates[0])  : pt;
    const m = marker(position, {
        icon: icon({
            ...Icon.Default.prototype.options,
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`, // 'assets/marker-icon.png',
            iconRetinaUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`, // 'assets/marker-icon-2x.png',
            shadowUrl: 'assets/marker-shadow.png',
       })
    });

    if (onClick) {
        m.on('click', () => onClick(m));
    }
    if (onOver) {
        m.on('mouseover', () => onOver(m));
    }
    if (onLeave) {
        m.on('mouseout', () => onLeave(m));
    }
    
    return m;
}


