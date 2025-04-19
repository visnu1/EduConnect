import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Course } from "../interfaces/CourseBoard";


const courseData = JSON.parse(localStorage.getItem("courses") as string) || [];

const MyCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        setCourses(courseData);
    }, [])


    return (
        <>
            <div className="m-5">
                <h1 className="text-4xl font-bold mb-4 text-black font-semibold text-center">My Courses</h1>
                <div className="w-full flex items-center justify-end mb-2">
                    <Link to={'/courses/registration'} className="inline border flex items-center bg-blue-600 text-white hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg">
                        Register Course
                    </Link>
                </div>
                <div className="border border-gray-300 rounded-lg overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead>
                            <tr className="bg-gray-200">
                                <th scope="col" className="p-3">#</th>
                                <th scope="col" className="p-3">Course Name</th>
                                <th scope="col" className="p-3">Professor Name</th>
                                <th scope="col" className="p-3">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length && courses.map((course: Course, index: number) => (
                                <tr key={course.courseId} className="border-t border-gray-300">
                                    <th className="p-3 font-medium" scope="row">{index + 1}</th>
                                    <td className="p-3">{course.courseName}</td>
                                    <td className="p-3">{course.professorName}</td>
                                    <td className="p-3">{course.day || 'Online'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default MyCourses;