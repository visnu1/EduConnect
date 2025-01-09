import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampausCareComponent } from './campus-care.component';

describe('CampausCareComponent', () => {
  let component: CampausCareComponent;
  let fixture: ComponentFixture<CampausCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampausCareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CampausCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
