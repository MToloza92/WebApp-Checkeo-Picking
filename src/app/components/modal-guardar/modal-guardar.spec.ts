import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGuardar } from './modal-guardar';

describe('ModalGuardar', () => {
  let component: ModalGuardar;
  let fixture: ComponentFixture<ModalGuardar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalGuardar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalGuardar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
