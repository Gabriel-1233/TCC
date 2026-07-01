import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDoador } from './form-doador';

describe('FormDoador', () => {
  let component: FormDoador;
  let fixture: ComponentFixture<FormDoador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDoador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDoador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
