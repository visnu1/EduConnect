import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';



@Component({
  selector: 'app-professor-review',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSliderModule,
    FormsModule,
    TextFieldModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule
  ],

  templateUrl: './professor-review.component.html',
  styleUrl: './professor-review.component.scss'
})
export class ProfessorReviewComponent {

  private dataSubscription: Subscription;
  public questions = [];
  public shortTextReview = "";
  public searchProfessor = "";
  public courses: any = [];
  public studentMeta: any;
  public selectedProfessor: string;
  allReviews = [];


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.courses = this.dataService.studentCourses || [];
    this.studentMeta = this.dataService.studentMetadata || [];

    this.dataSubscription = this.dataService.getReviewQuestions()
      .subscribe({
        next: (data) => {
          let results: any[] = data['results'];
          this.questions = results.map(item => { return { ...item, value: 0 } });
        },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }

  onSearch(event: MatSelectChange) {
    this.selectedProfessor = event.value;
    this.dataService.getProfessorReviews(event.value)
      .subscribe({
        next: (data) => {
          let results: any[] = data['results'];
          this.allReviews = results.map(r => {
            let { questionDetails, ...review } = r;
            review.ratings = review.ratings.map(rating => {
              let q = questionDetails.filter(q => q._id == rating.questionId)[0];
              return { ...rating, question: q.question, ratingFrequency: q.ratingFrequency }
            })
            return review;
          })
        },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }

  onSubmit() {
    if (!this.selectedProfessor) return alert("Please, select a professor");
    let c = this.courses.find(c => c.professorId == this.selectedProfessor);
    console.log(c);
    let tempRatings = [];
    let data = {
      studentID: this.studentMeta.id,
      courseID: c.courseId,
      professorID: c.professorId,
      courseName: c.courseName,
      professorName: c.professorName,
      ratings: this.questions.map(q => {
        tempRatings.push({ questionId: q._id, ...q })
        return { questionId: q._id, value: q.value }
      }),
      review: this.shortTextReview
    }

    this.dataService.registerProfessorReview(data)
      .subscribe({
        next: (res) => {
          let results = res['results'];
          console.log(results);
          this.shortTextReview = "";
          this.questions = this.questions.map(item => { return { ...item, value: 0 } });
          this.allReviews.push({ ...data, ratings: tempRatings })
        },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Completed')
      });
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

}
