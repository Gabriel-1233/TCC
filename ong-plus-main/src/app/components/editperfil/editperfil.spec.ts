import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editperfil } from './editperfil';

describe('Editperfil', () => {
  let component: Editperfil;
  let fixture: ComponentFixture<Editperfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editperfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editperfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
