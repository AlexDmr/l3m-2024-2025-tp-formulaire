import { Component, computed, input, output } from '@angular/core';
import { SelectAdressState } from '../../data/SelectAdressState';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { tileLayer, MapOptions, latLng, Marker, Layer } from 'leaflet';
import { getMarker } from '../../data/utils.leaflet';

@Component({
  selector: 'app-map-adress',
  imports: [
    LeafletModule
  ],
  templateUrl: './map-adress.component.html',
  styleUrl: './map-adress.component.scss'
})
export class MapAdressComponent {
  public readonly chooseAmong = input.required<SelectAdressState>({ alias: "choose-among" });
  public readonly chooseChange = output<Partial<Pick<SelectAdressState, "displayPossibleAdresses" | "currentAdress" | "overAdress">>>({ alias: "choose-change" });
  
  /**
   * Leaflet map
   */
  private readonly baseLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' });
  protected readonly mapOptions: MapOptions = {
    zoom: 5,
    center: latLng(46.5, 2),
    zoomControl: false,
    attributionControl: false
  }
  private readonly _mapMarkers = computed<readonly Marker[]>(
    () => {
      const S = this.chooseAmong();
      const blueAdress = S.overAdress ?? S.currentAdress;
      return S.displayPossibleAdresses ? S.possibleAdresses.map(
        ad => getMarker(ad, {
          color: ad === blueAdress ? 'blue' : 'grey',
          onClick: () => this.chooseChange.emit({ currentAdress: ad, displayPossibleAdresses: false }),
          onOver: () => {
            if ( this.chooseAmong().overAdress !== ad)
              this.chooseChange.emit({ overAdress: ad })
            },
          onLeave: () => this.chooseChange.emit({ overAdress: undefined })
        })
      ) : [
          ...(S.currentAdress ? [getMarker(S.currentAdress, { color: 'blue' })] : [])
      ]
    }
  );
  protected readonly mapLayers = computed<Layer[]>(
    () => [
      this.baseLayer,
      ...this._mapMarkers()
    ]
  );

}
