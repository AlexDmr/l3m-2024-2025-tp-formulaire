import { Component, inject } from '@angular/core';
import { FormAdressComponent } from './components/form-adress/form-adress.component';
import { AdressService } from './services/adress.service';
import { MapAdressComponent } from './components/map-adress/map-adress.component';
import { emptySelectedAdressState, SelectAdressState } from './data/SelectAdressState';
import { catchError, EMPTY, map, Observable, of, scan, startWith, Subject, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    FormAdressComponent,
    MapAdressComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly _srvAdress = inject(AdressService);
  protected readonly updates = new Subject<Partial<SelectAdressState>>();
  private readonly _searchQuery = new Subject<string>();
  private readonly _selectedAdressStateObs: Observable<SelectAdressState> = EMPTY;

  protected readonly selectedAdressState = toSignal(
    this._selectedAdressStateObs,
    { initialValue: emptySelectedAdressState }
  );

  protected search(q: string): void {
    this._searchQuery.next(q);
  }
}
