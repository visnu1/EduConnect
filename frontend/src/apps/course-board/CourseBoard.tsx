import { Route, Routes } from "react-router-dom";
import MyCourses from "./pages/MyCourses";
import CourseRegistration from "./pages/CourseRegistration";



const PantryPal = () => {
    return (
        <Routes>
            <Route path="/">
                {/* Nested routes for Products and Orders */}
                <Route path="/student" element={<MyCourses />} />
                <Route path="/registration" element={<CourseRegistration />} />
            </Route>
        </Routes>
    );
};

export default PantryPal;
