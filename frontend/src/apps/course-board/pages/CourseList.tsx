import React, { useEffect, useState } from 'react';
import { MapPin, Clock, User, BookOpen } from 'lucide-react';
import { getCourses, registerEnrollment } from '../../../services/api';
import { Course, CourseListProps } from '../interfaces/CourseBoard';
import { useAuth } from '../../../hooks/AuthProvider';


const CourseList: React.FC<CourseListProps> = ({ searchTerm = '', activeFilters = [] }) => {
    const { user: studentInfo } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { results = [] } = await getCourses(searchTerm);
                let temp = results.map((m: Course) => {
                    let startTime = (m.startTime || "").slice(0, -3);
                    let endTime = (m.endTime || "").slice(0, -3);
                    return {
                        ...m, startTime, endTime, credits: m.credits || "3.0", status: m.maxStudents ? 'Open' : 'Closed'
                    }
                });
                setCourses(temp);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };
        fetchCourses();
    }, [searchTerm]);

    const filteredCourses = courses.filter(course => {
        if (activeFilters.length > 0) {
            if (activeFilters.includes(course.majorName) ||
                activeFilters.includes(course.campusLocation) ||
                activeFilters.includes(course.status || "")) {
                return true;
            }
            const hour = course.startTime ? parseInt(course.startTime.split(':')[0]) : 0;
            if ((activeFilters.includes('Morning') && hour >= 8 && hour < 12) ||
                (activeFilters.includes('Afternoon') && hour >= 12 && hour < 17) ||
                (activeFilters.includes('Evening') && hour >= 17) ||
                (activeFilters.includes('Weekend') && (course.day === 'Saturday' || course.day === 'Sunday'))) {
                return true;
            }
            if (activeFilters.includes('Online') && course.day === 'Online') {
                return true;
            }

            return false;
        }
        return true;
    });

    const registerCourse = async (courseId: string) => {
        if (!(studentInfo && studentInfo?.id)) {
            alert("Please login");
            return;
        }
        const enrollment = {
            "studentId": studentInfo.id,
            "courseId": courseId,
            "enrolledSemester": "spring"
        };
        try {
            const { results } = await registerEnrollment(enrollment);
            setCourses(results);
            alert("Course registered successfully");
            console.log(results)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }


    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Major & Course</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map(course => (
                                <tr key={course.courseId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">{course.courseName}</div>
                                            <div className="text-sm text-gray-500">{course.majorName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-gray-900">{course.professorName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-gray-900">{course.campusLocation || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-gray-900">{course.credits}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`${course.maxStudents ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"} px-3 py-1 justify-center inline-flex text-xs leading-5 font-semibold rounded-full min-w-[65px]`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                                            <div>
                                                <div className="text-gray-900">{course.day}</div>
                                                {course.startTime && course.endTime && (
                                                    <div className="text-sm text-gray-500">
                                                        {course.startTime} - {course.endTime}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            className={`${course.maxStudents ?
                                                "bg-primary text-white hover:bg-primary/90 bg-blue-600 hover:bg-blue-700"
                                                : "border border-gray-200 border-input bg-background hover:bg-accent hover:text-accent-foreground  text-gray-600 bg-gray-100 opacity-70"}
                                                 h-9 rounded-md px-3 font-semibold text-sm select-none`}
                                            onClick={() => registerCourse(course.courseId)}
                                        >
                                            Register
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13.5V15m-6 4h12a2 2 0 002-2v-12a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-lg font-medium">No courses found</span>
                                        <p className="mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseList;
