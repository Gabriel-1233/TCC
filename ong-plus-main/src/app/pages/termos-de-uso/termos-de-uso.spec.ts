import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermosDeUso } from './termos-de-uso';

describe('TermosDeUso', () => {
  let component: TermosDeUso;
  let fixture: ComponentFixture<TermosDeUso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermosDeUso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermosDeUso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
