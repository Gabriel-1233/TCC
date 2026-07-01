import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCampaignDialog } from './new-campaign-dialog';

describe('NewCampaignDialog', () => {
  let component: NewCampaignDialog;
  let fixture: ComponentFixture<NewCampaignDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCampaignDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCampaignDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
