import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { DataService } from '../data.service';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-course-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatChipsModule,
    MatInputModule
  ],
  templateUrl: './course-registration.component.html',
  styleUrl: './course-registration.component.scss'
})
export class CourseRegistrationComponent implements OnInit {

  searchField: FormControl = new FormControl('');
  courses = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.allRegisterCourses();
    this.searchField.valueChanges.pipe(debounceTime(500)).subscribe(d => this.allRegisterCourses());
  }

  allRegisterCourses() {
    this.dataService.registerCourses(this.searchField.value)
      .subscribe({
        next: (data) => {
          this.courses = data['results'].map(m => {
            let startTime = (m.startTime || "").slice(0, -3);
            let endTime = (m.endTime || "").slice(0, -3);
            return {
              ...m,
              startTime,
              endTime,
              credits: m.credits || "3.0"
            }
          }),
            console.log(data)
        },
        error: (error) => console.error('Error fetching data:', error)
      });
  }

  onRegister(courseId: string) {
    let student = this.dataService.student;
    if (!(student && student?.id)) {
      alert("Please login");
      return;
    }
    let enrollment = {
      "studentId": student.id,
      "courseId": courseId,
      "enrolledSemester": "spring"
    };
    this.dataService.enrollCourse(enrollment)
      .subscribe({
        next: (data) => { this.courses = data['results']; alert("Course registered successfully"); console.log(data) },
        error: (error) => console.error('Error fetching data:', error)
      });
  }

  onSearch() {

  }

  onSubmit(formValues: any) {
    console.log('Form Submission:', formValues);
    // You will get all form values here as an object
  }
}
