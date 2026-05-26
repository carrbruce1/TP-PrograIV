import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingPosicionesComponent } from './ranking-posiciones.component';

describe('RankingPosicionesComponent', () => {
  let component: RankingPosicionesComponent;
  let fixture: ComponentFixture<RankingPosicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingPosicionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingPosicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
