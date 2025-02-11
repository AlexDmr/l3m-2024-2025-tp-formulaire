import { Component, DestroyRef, inject, signal } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AdressService } from '../../services/adress.service';
import { debounceTime, filter, map, tap } from 'rxjs';

@Component({
  selector: 'app-form-adress',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule
  ],
  templateUrl: './form-adress.component.html',
  styleUrl: './form-adress.component.scss'
})
export class FormAdressComponent {
  private readonly _srvAdress = inject(AdressService);
  private readonly _fb = inject(FormBuilder);
  protected readonly searchControl = this._fb.control("");
  protected readonly searchOptions = toSignal<readonly string[]>(
    this._srvAdress.searchResults.pipe(
      tap(fc => console.log(fc)),
      map(fc => fc === undefined ? [] : fc.features.map(f => f.properties.label)),
    )
  )

  constructor(destroyRef: DestroyRef) {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      filter(v => (v?.length ?? 0) > 3),
      map(v => v as string),
      takeUntilDestroyed(destroyRef)
    ).subscribe( v => this._srvAdress.search(v) );
  }
}
