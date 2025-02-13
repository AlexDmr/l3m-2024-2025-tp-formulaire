import { Component, effect, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SelectAdressState } from '../../data/SelectAdressState';
import { Feature, Point } from 'geojson';
import { Adress } from '../../data/Adress';
import { debounceTime, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form-adress',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  templateUrl: './form-adress.component.html',
  styleUrl: './form-adress.component.scss'
})
export class FormAdressComponent {
  public readonly chooseAmong = input.required<SelectAdressState>({ alias: "choose-among" });
  public readonly chooseChange = output<Partial<Pick<SelectAdressState, "displayPossibleAdresses" | "currentAdress" | "overAdress">>>({ alias: "choose-change" });
  public readonly search = output<string>();

  /**
   * Search form control
   */
  private readonly _searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly _fb = inject(FormBuilder);
  protected readonly searchControl = this._fb.nonNullable.control<string | Feature<Point, Adress>>("");
  private readonly _emitSearch = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    filter(q => typeof q === 'string'),
    takeUntilDestroyed()
  ).subscribe( q => this.search.emit(q) );

  private _effSearchAdress = effect(
    () => {
      console.log(this._searchInput())
      if (document.activeElement !== this._searchInput()?.nativeElement)
        this.searchControl.setValue(this.chooseAmong().currentAdress ?? '', { emitEvent: false });
    }
  )
  /**
   * Interaction
   */
  protected getAdressLabel(adress: Feature<Point, Adress> | string): string {
    return typeof adress === 'string' ? adress : adress.properties.label;
  }

  protected onSelectionChange(ad: Feature<Point, Adress> | undefined): void {
    this.chooseChange.emit({ currentAdress: ad });
    // this.searchControl.setValue(ad?.properties.label ?? '');
  }
  
  protected onOverAdressChange(ad: Feature<Point, Adress> | undefined): void {
    this.chooseChange.emit({ overAdress: ad });
  }
}
