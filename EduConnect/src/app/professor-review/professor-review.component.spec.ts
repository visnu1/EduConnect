import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorReviewComponent } from './professor-review.component';

describe('ProfessorReviewComponent', () => {
  let component: ProfessorReviewComponent;
  let fixture: ComponentFixture<ProfessorReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorReviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfessorReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
