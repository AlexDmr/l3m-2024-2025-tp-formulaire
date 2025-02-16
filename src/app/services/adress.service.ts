import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, map, Observable, switchMap, throwError } from 'rxjs';
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
    return EMPTY;
  }

}
