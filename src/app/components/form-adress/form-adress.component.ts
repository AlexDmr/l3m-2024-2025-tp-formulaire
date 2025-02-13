import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AdressService } from '../../services/adress.service';
import { debounceTime, filter, map, tap } from 'rxjs';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, Layer, MapOptions, Marker, tileLayer } from 'leaflet';
import { getMarker } from '../../data/utils.leaflet';
import { CommonModule } from '@angular/common';
import { Feature, Point } from 'geojson';
import { Adress } from '../../data/adress';

type InternalAdress = Feature<Point, Adress>;
interface InternalState {
  readonly currentAdress?: InternalAdress;
  readonly overAdress?: InternalAdress;
  readonly possibleAdresses: readonly InternalAdress[];
  readonly displayPossibleAdresses: boolean;
}

const emptyInternalState: InternalState = {
  currentAdress: undefined,
  possibleAdresses: [],
  displayPossibleAdresses: false
}

@Component({
  selector: 'app-form-adress',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    LeafletModule,
    CommonModule
  ],
  templateUrl: './form-adress.component.html',
  styleUrl: './form-adress.component.scss'
})
export class FormAdressComponent {
  private readonly _srvAdress = inject(AdressService);

  /**
   * COnstituants of the internal state
   */
  private readonly _overAdress = signal<InternalAdress | undefined>(undefined);
  private readonly _currentAdress = signal<InternalAdress | undefined>(undefined);
  protected readonly displayPossibleAdresses = signal<boolean>(false);
  private readonly _possibleAdresses = toSignal<readonly InternalAdress[]>(
    this._srvAdress.searchResults.pipe(
      map(fc => fc === undefined ? [] : fc.features),
    ),
    { requireSync: true }
  );

  /**
   * Search form control
   */
  private readonly _fb = inject(FormBuilder);
  protected readonly searchControl = this._fb.control("");
  protected readonly searchOptions = toSignal(this._srvAdress.searchResults);

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
      const S = this.internaleState();
      const blueAdress = S.overAdress ?? S.currentAdress;
      return S.displayPossibleAdresses ? S.possibleAdresses.map(
        ad => getMarker(ad, {
          color: ad === blueAdress ? 'blue' : 'grey',
          onClick: () => this.onSelectionChange(ad),
          onOver: () => this.onOverAdressChange(ad),
          onLeave: () => this.onOverAdressChange(undefined)
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

  /**
   * Internal state
   */
  protected readonly internaleState = computed(
    () => ({
      currentAdress: this._currentAdress(),
      overAdress: this._overAdress(),
      possibleAdresses: this._possibleAdresses(),
      displayPossibleAdresses: this.displayPossibleAdresses()
    })
  );

  /**
   * Constructor
   */
  constructor(destroyRef: DestroyRef) {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      filter(v => (v?.length ?? 0) > 3),
      map(v => v as string),
      takeUntilDestroyed(destroyRef)
    ).subscribe( v => this._srvAdress.search(v) );
  }


  /**
   * Interaction
   */
  protected getAdressLabel(adress: InternalAdress | string): string {
    return typeof adress === 'string' ? adress : adress.properties.label;
  }

  protected onSelectionChange(e: InternalAdress | undefined): void {
    this._currentAdress.set(e);
    this.searchControl.setValue(e?.properties.label ?? '');
  }
  
  protected onOverAdressChange(e: InternalAdress | undefined): void {
    this._overAdress.set(e);
  }
}
