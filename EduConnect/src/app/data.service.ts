import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';


/**
 * DataService is an Angular service that provides methods to interact with various external APIs
 * and manage local storage for student and course information. It includes functionalities for fetching
 * and posting data related to professor reviews, campus care services, and student and course registrations.
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {

  student: any;
  courses = [];


  /**
   * Initializes the DataService.
   * @param http HttpClient used for making HTTP requests.
   * @param platformId Platform ID to check if the current platform is a browser.
   */
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.student = JSON.parse(localStorage.getItem('student')) || {};
      this.courses = JSON.parse(localStorage.getItem('courses')) || [];
    }
  }


  //Professor Review service APIs connect to a ratingService Lambda function, which then queries a MongoDB

  private questionsAPI = 'https://bcdycyy8b8.execute-api.us-east-1.amazonaws.com/api/questions';
  private professorReviewsAPI = 'https://bcdycyy8b8.execute-api.us-east-1.amazonaws.com/api/review';

  //Campus care service APIs connect to productService and orderService Lambda functions, which in turn query DynamoDB

  private productsAPI = 'https://vyg97ml2vi.execute-api.us-east-1.amazonaws.com/api/products';
  private registerOrderAPI = 'https://vyg97ml2vi.execute-api.us-east-1.amazonaws.com/api/orders';
  private myOrdersAPI = `https://vyg97ml2vi.execute-api.us-east-1.amazonaws.com/api/orders`;

  //Student and registration APIs connect to the studentService Lambda function, which queries an RDS MySQL database.

  private studentsAPI = 'https://gkh27vrark.execute-api.us-east-1.amazonaws.com/api/students';
  private professorsAPI = 'https://gkh27vrark.execute-api.us-east-1.amazonaws.com/api/professors';
  private coursesAPI = 'https://gkh27vrark.execute-api.us-east-1.amazonaws.com/api/courses';
  private majorsAPI = 'https://gkh27vrark.execute-api.us-east-1.amazonaws.com/api/majors';
  private studentsEnrollmentsAPI = 'https://gkh27vrark.execute-api.us-east-1.amazonaws.com/api/enrollment';
  private majorCoursesAPI = 'https://gkh27vrark.execute-api.us-east-1.amazonaws.com/api/major_courses';
  private searchStudentAPI = 'https://gkh27vrark.execute-api.us-east-1.amazonaws.com/api/students/search';
  private registerCoursesAPI = `https://gkh27vrark.execute-api.us-east-1.amazonaws.com/api/courses/search`;
  private enrollmentAPI = `https://gkh27vrark.execute-api.us-east-1.amazonaws.com/api/courses`;

  

  public get studentMetadata() {
    return this.student;
  }


  public get studentCourses() {
    return this.courses;
  }

  public setStudentCourses(courses: any) {
    this.courses = courses;
    localStorage.setItem('courses', JSON.stringify(this.courses))
  }

  public setStudentData(student: any) {
    this.student = student;
    localStorage.setItem('student', JSON.stringify(this.student))
  }

  public clearStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      this.student = null;
      this.courses = [];
    }
  }


  public getReviewQuestions(): Observable<any> {
    return this.http.get(this.questionsAPI);
  }

  public getProfessorReviews(professorID: string = ""): Observable<any> {
    return this.http.get(this.professorReviewsAPI + '?id=' + professorID);
  }

  public registerProfessorReview(data: any): Observable<any> {
    return this.http.post(this.professorReviewsAPI, data);
  }

  public getProducts(): Observable<any> {
    return this.http.get(this.productsAPI);
  }


  public getStudentOrders(studentId: any): Observable<any> {
    return this.http.get(this.myOrdersAPI + '?studentId=' + studentId);
  }

  public registerStudentOrder(order: any): Observable<any> {
    return this.http.post(this.registerOrderAPI, order);
  }


  // RDS APIS

  public getStudents(): Observable<any> {
    return this.http.get(this.studentsAPI);
  }

  public getProfessors(): Observable<any> {
    return this.http.get(this.professorsAPI);
  }

  public getCourses(): Observable<any> {
    return this.http.get(this.coursesAPI);
  }

  public getMajors(): Observable<any> {
    return this.http.get(this.majorsAPI);
  }

  public getMajorCourses(): Observable<any> {
    return this.http.get(this.majorCoursesAPI);
  }

  public getStudentEnrollments(): Observable<any> {
    return this.http.get(this.studentsEnrollmentsAPI);
  }

  public getStudentCourses(studentId: string): Observable<any> {
    return this.http.get(this.searchStudentAPI + '?id=' + studentId);
  }

  public registerCourses(search: string): Observable<any> {
    if (search)
      return this.http.get(this.registerCoursesAPI + '?search=' + search);
    else
      return this.http.get(this.registerCoursesAPI);
  }

  public enrollCourse(enrollmentObj: any) {
    debugger;
    return this.http.post(this.enrollmentAPI, enrollmentObj);
  }
}

