import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
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

interface InternalAdress {
  readonly feature: Feature<Point, Adress>;
  readonly marker: Marker;
}
interface InternalState {
  readonly currentAdress?: InternalAdress;
  readonly possibleAdresses: readonly InternalAdress[];
  readonly displayPossibleAdresses: boolean;
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
   * Search form control
   */
  private readonly _fb = inject(FormBuilder);
  protected readonly searchControl = this._fb.control("");
  protected readonly searchOptions = toSignal<readonly string[]>(
    this._srvAdress.searchResults.pipe(
      tap(fc => console.log(fc)),
      map(fc => fc === undefined ? [] : fc.features.map(f => f.properties.label)),
    )
  )

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
  private readonly _mapMarkers = toSignal<readonly Marker[]>(
    this._srvAdress.searchResults.pipe(
      map(fc => fc === undefined ? [] : fc.features.map(f => latLng(f.geometry.coordinates[1], f.geometry.coordinates[0]))),
      tap( L => console.log(L) ),
      map(L => L.map(pt => getMarker(pt))),
    ),
    { requireSync: true}
  )
  protected readonly mapLayers = computed<Layer[]>(
    () => [
      this.baseLayer,
      ...this._mapMarkers()
    ]
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
  onOptionActivated(e: unknown): void {
    console.log("onOptionActivated", e);
  }

  onSelectionChange(e: unknown): void {
    console.log("onSelectionChange", e);
  }
  
}
