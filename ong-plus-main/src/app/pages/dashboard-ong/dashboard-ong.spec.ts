import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOng } from './dashboard-ong';

describe('DashboardOng', () => {
  let component: DashboardOng;
  let fixture: ComponentFixture<DashboardOng>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOng]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardOng);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
