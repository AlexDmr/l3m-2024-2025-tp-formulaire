import { GeoJSONFeatureCollectionSchema } from 'zod-geojson';
import { FeatureCollection, Geometry, Feature } from 'geojson';

export function getParserJSONFeatureCollection<G extends Geometry, T = any>(
    geometryParser: (o: unknown) => Promise<G>,
    propertiesParser: (o: unknown) => Promise<T> = async o => o as T
  ): (obj: unknown) => Promise<FeatureCollection<G, T>> {
    return (obj: any) => GeoJSONFeatureCollectionSchema.parseAsync(obj).then(
      geojson => geojson as FeatureCollection<Geometry, any>
    ).then(
      geojson => Promise.all([
        geojson,
        Promise.all(
          geojson.features.map(
              feature => parseFeature(feature, geometryParser, propertiesParser)
            )
        )
      ])
    ).then(
      ([geojson, features]) => ({
        ...geojson,
        features
      })
    );
  }
  
  function parseFeature<G extends Geometry, T>(
    feature: Feature,
    geometryParser: (o: unknown) => Promise<G>,
    propertiesParser: (o: unknown) => Promise<T>
  ): Promise<Feature<G, T>> {
    return Promise.all([
        geometryParser  (feature.geometry  ),
        propertiesParser(feature.properties)
    ]).then(
        ([geometry, properties]) => ({
            type: 'Feature',
            geometry,
            properties
        })
    );
  }
  