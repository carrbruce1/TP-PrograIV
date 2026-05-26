import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGeneralComponent } from './chat-general.component';

describe('ChatGeneralComponent', () => {
  let component: ChatGeneralComponent;
  let fixture: ComponentFixture<ChatGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
