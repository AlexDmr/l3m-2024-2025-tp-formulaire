import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SelectAdressState } from '../../data/SelectAdressState';
import { Feature, Point } from 'geojson';
import { Adress } from '../../data/Adress';
import { debounceTime } from 'rxjs';
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
  private readonly _fb = inject(FormBuilder);
  protected readonly searchControl = this._fb.nonNullable.control("");
  private readonly _emitSearch = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    takeUntilDestroyed()
  ).subscribe( q => this.search.emit(q) );

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
