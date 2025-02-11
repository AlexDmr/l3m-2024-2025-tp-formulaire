import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"
import { BehaviorSubject, Observable, of, Subject, switchMap } from 'rxjs';
import { getParserJSONFeatureCollection } from '../data/utils.geo';
import { FeatureCollection, Point } from 'geojson';
import { GeoJSON2DPointSchema } from 'zod-geojson';
import { Adress, parseAdress } from '../data/adress';

const parserFcPtAdresse = getParserJSONFeatureCollection(
  o => GeoJSON2DPointSchema.parseAsync(o).then( pt => pt as Point ),
  parseAdress
)

@Injectable({
  providedIn: 'root'
})
export class AdressService {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _httpClient = inject(HttpClient);
  private readonly _searchSubject = new Subject<string>();
  private readonly _searchObs: Observable<FeatureCollection<Point, Adress> | undefined> = this._searchSubject.pipe(
    switchMap( q => this._httpClient.get(`https://api-adresse.data.gouv.fr/search/`, { observe: 'response', params: { q } }) ),
    switchMap(r => r.ok ? parserFcPtAdresse(r.body) : of(undefined)),
    takeUntilDestroyed(this._destroyRef)
  )
  private readonly _bsSearchResults = new BehaviorSubject<FeatureCollection<Point, Adress> | undefined>(undefined);
  public readonly searchResults = this._bsSearchResults.asObservable();

  public search(search: string): void {
    this._searchSubject.next(search);
  }

  constructor() {
    this._searchObs.subscribe(this._bsSearchResults);
  }
}
