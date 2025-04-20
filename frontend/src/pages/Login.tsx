import { ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import campusImg from '../assets/campus-1.jpg'
import { getStudents } from "../services/api";
import { useAuth } from "../hooks/AuthProvider";
import { Student } from "../interfaces/Student";



const Login = () => {
    const { login } = useAuth();
    const [selectedUser, setSelectedUser] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const { results = [] } = await getStudents();
            setStudents(results);
        }
        fetchStudents();
    }, []);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!selectedUser) {
            alert("Please select a user");
            return;
        }
        setIsLoading(true);
        login(selectedUser, '/home');
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 flex items-center justify-center">
                <img className="w-full h-full" src={campusImg} alt="" />
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">Checkin to Edu-Connect</h1>
                    <p className="text-gray-600 mb-8">Please select your name to continue</p>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium">Select your name</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {students.map((student) => (
                                    <button
                                        key={student.id}
                                        type="button"
                                        className={`login-user h-auto py-3 px-4 rounded-md text-sm ${selectedUser && selectedUser.id === student.id ? "!border-purple-600 !bg-purple-50 !text-purple-700" : ""}`}
                                        onClick={() => setSelectedUser(student)}
                                    >
                                        {student.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="px-4 w-full flex items-center justify-center py-2 text-sm font-medium shadow text-white transition-colors duration-150 border border-transparent rounded-md focus:outline-none focus:shadow-outline-purple bg-purple-600  bg-purple-600 hover:bg-purple-700"
                            disabled={isLoading || !selectedUser}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin ml-2 h-4 w-4" />
                                    Loading...
                                </>
                            ) : (
                                <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>
                            )}
                        </button>

                        {selectedUser && (
                            <div className="mt-4 p-3 bg-purple-50 rounded-md border border-purple-200">
                                <p className="text-sm text-purple-700">
                                    You selected: <span className="font-medium">{selectedUser.name}</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;