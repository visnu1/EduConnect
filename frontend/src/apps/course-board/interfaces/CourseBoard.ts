
export interface CourseListProps {
    searchTerm?: string;
    activeFilters?: string[];
}

export interface Course {
    courseId: string;
    courseName: string;
    credits: string;
    classRoomNumber: string;
    maxStudents: number | null;
    campusLocation: string;
    day: string;
    startTime: string;
    endTime: string;
    professorName: string;
    majorName: string;
    status?: string
}
