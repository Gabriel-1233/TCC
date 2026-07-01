import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPoliticy } from './privacy-politicy';

describe('PrivacyPoliticy', () => {
  let component: PrivacyPoliticy;
  let fixture: ComponentFixture<PrivacyPoliticy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPoliticy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyPoliticy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
