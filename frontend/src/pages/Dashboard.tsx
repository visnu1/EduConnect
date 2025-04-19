import { useEffect } from "react";
import { Cloud, Database, Code, Layers } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getStudentsCourses } from "../services/api";
import { useAuth } from "../hooks/AuthProvider";


const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user?.id) navigate("/login");

        if (user) {
            const fetchStudentCourses = async () => {
                const { results = null } = await getStudentsCourses(user?.id);
                localStorage.setItem("courses", JSON.stringify(results))
            }

            const courses = JSON.parse(localStorage.getItem("courses") as string) || null;
            if (!courses) fetchStudentCourses();
        }
    }, []);


    return (
        <>
            <div className="flex items-center p-2 bg-black text-white">
                <div className="flex-1 text-center text-2xl">
                    <span>Hi, {user?.name}!</span>
                    <div className="mx-1 inline-block animate-wiggle">👋</div>
                </div>
                <div>
                    <button onClick={logout}
                        className="text-white border border-white px-4 py-0.5 rounded">
                        Logout
                    </button>
                </div>
            </div>

            <section>
                <div className="m-5">
                    <h1 className="text-2xl font-semibold mb-4">Student Services</h1>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <Link to={'/courses/student'} className="text-blue-600 hover:underline">
                                MyCourses
                            </Link>
                        </li>
                        <li>
                            <Link to={'/pantry/products'} className="text-blue-600 hover:underline">
                                Pantry Pal
                            </Link>
                        </li>
                        <li>
                            <Link to={'/review'} className="text-blue-600 hover:underline">
                                Professor Review
                            </Link>
                        </li>
                    </ul>
                </div>
            </section>

            <HeroSection />
        </>
    )
}


export default Dashboard;


const HeroSection = () => {
    return (
        <div className="fixed bottom-0 w-full p-5 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTQgNGg1MnY1Mkg0VjR6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
            <div className="container mx-auto px-4 relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
                    Microservices Architecture
                </h1>
                <p className="text-xl md:text-2xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
                    Built using modern cloud technologies for scalability, reliability, and performance
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                    <div className="flex items-center space-x-2 bg-white/10 rounded-full px-6 py-2">
                        <Cloud className="w-5 h-5" />
                        <span>Cloud Services</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 rounded-full px-6 py-2">
                        <Database className="w-5 h-5" />
                        <span>Scalable Data</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 rounded-full px-6 py-2">
                        <Code className="w-5 h-5" />
                        <span>Modern Stack</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 rounded-full px-6 py-2">
                        <Layers className="w-5 h-5" />
                        <span>Event Driven</span>
                    </div>
                </div>
            </div>
        </div>
    );
};