import { useRef, useState } from "react";
import ReviewForm from "./ReviewForm";
import StudentReviews from "./Reviews";
import { Link } from "react-router-dom";
import { professorReviews, registerProfessorReview } from "../../services/api";


const courses = JSON.parse(localStorage.getItem("courses") as string) || [];

const ProfessorReview = () => {
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formRef = useRef<any>(null);


    const handleProfessorChange = async (prof: any) => {
        setSelectedProfessor(prof);
        const { results = [] } = await professorReviews(prof.professorId);
        setReviews(results);
    };

    const handleReviewSubmit = async (newReview: any) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await registerProfessorReview(newReview);
            const { results = [] } = await professorReviews(newReview.professorID);
            setReviews(results);
            formRef.current?.resetForm();
        } catch (err) {
            setError("Failed to submit review. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Professor Reviews</h1>
                    <p className="text-lg text-gray-600">Help other students by sharing your experience</p>
                </div>

                {courses && courses.length > 0 ?
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Actual Review Form */}
                        <div className="lg:col-span-7">
                            <ReviewForm
                                ref={formRef}
                                selectedProfessor={selectedProfessor}
                                onProfessorChange={handleProfessorChange}
                                onSubmit={handleReviewSubmit}
                                isSubmitting={isSubmitting}
                                error={error}
                            />
                        </div>

                        {/* All Reviews */}
                        <div className="lg:col-span-5">
                            <StudentReviews reviews={reviews} />
                        </div>
                    </div>
                    : (
                        <div className="text-center">
                            <h2 className="text-xl">Yo, no courses registered yet. Gotta sign up for one to drop a review on that prof.</h2>
                            <Link className="text-blue-500 underline" to={'/courses/registration'}>Register here</Link>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default ProfessorReview;