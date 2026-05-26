import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JokersTrapComponent } from './jokers-trap.component';

describe('JokersTrapComponent', () => {
  let component: JokersTrapComponent;
  let fixture: ComponentFixture<JokersTrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JokersTrapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JokersTrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
