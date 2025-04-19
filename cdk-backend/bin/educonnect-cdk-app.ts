#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EduconnectCdkAppStack } from '../lib/educonnect-cdk-app-stack';
import { StudentPantryAppStack } from '../lib/student-pantry/student-pantry-app-stack';
import { StudentCourseRegistrationAppStack } from '../lib/student-course-registration/student-course-registration-app-stack';
import { ProfessorReviewAppStack } from '../lib/professor-review/professor-review-app-stack';

import { getConfig } from "../lib/config";
const config = getConfig();

const app = new cdk.App();

// Main Stack
const educonnectCdkAppStack = new EduconnectCdkAppStack(app, 'EduconnectCdkAppStack');

// Individual Application Stacks
const pantryAppStack = new StudentPantryAppStack(app, 'StudentPantryAppStack');
pantryAppStack.addDependency(educonnectCdkAppStack);

const courseRegistrationAppStack = new StudentCourseRegistrationAppStack(app, 'StudentCourseRegistrationAppStack', { config });
courseRegistrationAppStack.addDependency(educonnectCdkAppStack);

const professorReviewAppStack = new ProfessorReviewAppStack(app, 'ProfessorReviewAppStack', {  config });
professorReviewAppStack.addDependency(educonnectCdkAppStack);