import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormAdressComponent } from './components/form-adress/form-adress.component';
import { AdressService } from './services/adress.service';
import { MapAdressComponent } from './components/map-adress/map-adress.component';
import { emptySelectedAdressState, SelectAdressState } from './data/SelectAdressState';
import { map, Observable, scan, startWith, Subject, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet,
    FormAdressComponent,
    MapAdressComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly _srvAdress = inject(AdressService);
  protected readonly updates = new Subject<Partial<SelectAdressState>>();
  private readonly _selectedAdressStateObs: Observable<SelectAdressState> = this._srvAdress.searchResults.pipe(
    map(
      fc => fc === undefined ? emptySelectedAdressState : {
        possibleAdresses: fc.features,
        displayPossibleAdresses: true
      }
    ),
    switchMap(
      sas => this.updates.pipe(
        scan((s, u) => ({ ...s, ...u }), sas),
        startWith(sas)
      )
    )
  );
  protected readonly selectedAdressState = toSignal(
    this._selectedAdressStateObs,
    { initialValue: emptySelectedAdressState }
  );

  protected search(q: string): void {
    this._srvAdress.search(q);
  }
}
