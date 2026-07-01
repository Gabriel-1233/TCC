import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDoador } from './dashboard-doador';

describe('DashboardDoador', () => {
  let component: DashboardDoador;
  let fixture: ComponentFixture<DashboardDoador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDoador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDoador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
