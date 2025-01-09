import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../data.service';

@Component({
  selector: 'app-database',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './database.component.html',
  styleUrl: './database.component.scss'
})
export class DatabaseComponent {

  students: any = {};
  professors: any = {};
  courses: any = {};
  majors: any = {};
  majorCourses: any = {};
  studentEnrollments: any = {};


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.onStudents();
    this.onProfessors();
    this.onCourses();
    this.onMajors();
    this.onMajorCourses();
    this.onStudentEnrollments();
  }

  onStudents() {
    this.dataService.getStudents()
      .subscribe({
        next: (data) => this.students = { rows: data['results'] || [], columns: Object.keys(data['results'][0]) || [] },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }

  onProfessors() {
    this.dataService.getProfessors()
      .subscribe({
        next: (data) => this.professors = { rows: data['results'] || [], columns: Object.keys(data['results'][0]) || [] },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }

  onCourses() {
    this.dataService.getCourses()
      .subscribe({
        next: (data) => this.courses = { rows: data['results'] || [], columns: Object.keys(data['results'][0]) || [] },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }


  onMajors() {
    this.dataService.getMajors()
      .subscribe({
        next: (data) => this.majors = { rows: data['results'] || [], columns: Object.keys(data['results'][0]) || [] },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }


  onMajorCourses() {
    this.dataService.getMajorCourses()
      .subscribe({
        next: (data) => this.majorCourses = { rows: data['results'] || [], columns: Object.keys(data['results'][0]) || [] },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }


  onStudentEnrollments() {
    this.dataService.getStudentEnrollments()
      .subscribe({
        next: (data) => this.studentEnrollments = { rows: data['results'] || [], columns: Object.keys(data['results'][0] || {}) || [] },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }

}
