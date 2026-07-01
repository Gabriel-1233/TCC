import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Campanhas } from './campanhas';

describe('Campanhas', () => {
  let component: Campanhas;
  let fixture: ComponentFixture<Campanhas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Campanhas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Campanhas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
