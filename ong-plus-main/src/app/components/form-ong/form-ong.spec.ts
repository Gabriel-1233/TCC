import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOng } from './form-ong';

describe('FormOng', () => {
  let component: FormOng;
  let fixture: ComponentFixture<FormOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormOng]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormOng);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
