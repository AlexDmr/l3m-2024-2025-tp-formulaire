import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap, throwError } from 'rxjs';
import { getParserJSONFeatureCollection } from '../data/utils.geo';
import { FeatureCollection, Point } from 'geojson';
import { GeoJSON2DPointSchema } from 'zod-geojson';
import { Adress, parserAdress } from '../data/Adress';

const parserFcPtAdresse = getParserJSONFeatureCollection(
  o => GeoJSON2DPointSchema.parseAsync(o).then( pt => pt as Point ),
  parserAdress
)

@Injectable({
  providedIn: 'root'
})
export class AdressService {
  private readonly _httpClient = inject(HttpClient);

  public search(q: string): Observable<FeatureCollection<Point, Adress>> {
    return this._httpClient.get(
      `https://api-adresse.data.gouv.fr/search/`, 
      { observe: 'response', params: { q, limit: 5 } }
    ).pipe(
      switchMap(r => r.ok ? parserFcPtAdresse(r.body) : throwError(() => new Error(`HTTP error ${r.status}`))),
      map(
        fc => {
          // Sort adresses by decreasing latitude
          fc.features.sort((a, b) => b.geometry.coordinates[1] - a.geometry.coordinates[1]);
          return fc;
        }
      )
    )
  }

}
