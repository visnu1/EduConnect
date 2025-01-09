import { Routes } from '@angular/router';
import { CourseRegistrationComponent } from './course-registration/course-registration.component';
import { ProfessorReviewComponent } from './professor-review/professor-review.component';
import { CampausCareComponent } from './campus-care/campus-care.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatabaseComponent } from './database/database.component';

export const routes: Routes = [
    {
        path: 'registration',
        component: CourseRegistrationComponent
    },
    {
        path: 'campus-care',
        component: CampausCareComponent
    },
    {
        path: 'reviews',
        component: ProfessorReviewComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'database',
        component: DatabaseComponent
    },
    {
        path: '',
        redirectTo: "/dashboard",
        pathMatch: "full"
    }
];
