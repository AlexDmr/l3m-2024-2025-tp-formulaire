import { Feature, Point } from "geojson";
import { Adress } from "./Adress";

export interface SelectAdressState {
  readonly currentAdress?: Feature<Point, Adress>;
  readonly overAdress?: Feature<Point, Adress>;
  readonly possibleAdresses: readonly Feature<Point, Adress>[];
  readonly displayPossibleAdresses: boolean;
}

export const emptySelectedAdressState: SelectAdressState = {
  possibleAdresses: [],
  displayPossibleAdresses: false
}
