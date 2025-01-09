import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { DataService } from '../data.service';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  students: any = {};
  student: any = null;
  studentCourses: any = [];
  selectedOpt: any;

  constructor(private dataService: DataService) { }


  ngOnInit(): void {
    this.loadData();
    if (this.student?.id) this.selectedOpt = this.student;
    this.onStudents();
  }

  public loadData() {
    this.student = this.dataService.studentMetadata;
    this.studentCourses = this.dataService.studentCourses;
  }


  onStudents() {
    this.dataService.getStudents()
      .subscribe({
        next: (data) => this.students = { rows: data['results'] || [], columns: Object.keys(data['results'][0]) || [] },
        error: (error) => console.error('Error fetching data:', error),
        complete: () => console.log('Data fetch completed')
      });
  }

  onStudentCourses(studentId: string) {
    return new Promise((resolve) => {
      this.dataService.getStudentCourses(studentId)
        .subscribe({
          next: (data) => resolve(data['results']),
          error: (error) => console.error('Error fetching data:', error),
          complete: () => console.log('Data fetch completed')
        });
    })
  }


  async onStudentSelected() {
    let courses = await this.onStudentCourses(this.selectedOpt?.id);
    this.dataService.setStudentCourses(courses);
    this.dataService.setStudentData(this.selectedOpt);
    this.loadData();
  }

  onLogout() {
    this.dataService.clearStorage();
    this.student = null;
    this.studentCourses = [];
    this.selectedOpt = undefined;
  }

}
