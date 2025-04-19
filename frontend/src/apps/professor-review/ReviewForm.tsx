import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { CheckCircle, LoaderCircle } from "lucide-react";
import { reviewQuestions } from "../../services/api";
import Select from "../../components/ui/Select";

interface ReviewQuestion {
    _id: string;
    question: string;
    createdAt: string;
    updatedAt: string;
    ratingFrequency: number;
}

interface ReviewFormProps {
    selectedProfessor: any;
    onProfessorChange: (prof: any) => void;
    onSubmit: (review: any) => void;
    isSubmitting: boolean;
    error: string | null;
}

const courses = JSON.parse(localStorage.getItem("courses") as string) || [];
const studentInfo = JSON.parse(localStorage.getItem("student") as string) || null;

const RatingInput: React.FC<{
    question: ReviewQuestion;
    index: number;
    value: number;
    onChange: (index: number, value: number) => void;
}> = ({ question, index, value, onChange }) => (
    <div className="rounded-md border border-gray-200 shadow-xs overflow-hidden">
        <div className="space-y-4 p-6">
            <div className="flex items-start">
                <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 h-6 w-6 text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                </span>
                <label htmlFor={question._id} className="text-gray-700">{question.question}</label>
            </div>

            <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Poor</span>
                    <span className="text-xs font-medium text-indigo-600">
                        {value}
                    </span>
                    <span className="text-xs text-gray-500">Excellent</span>
                </div>
                <input
                    type="range"
                    id={question._id}
                    name={question._id}
                    min="0"
                    max={question.ratingFrequency}
                    step="0.5"
                    value={value}
                    onChange={(e) => onChange(index, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    aria-label={`Rating for question ${index + 1} (${question.question})`}
                />
            </div>
        </div>
    </div>
);

const ReviewForm = forwardRef(({
    selectedProfessor,
    onProfessorChange,
    onSubmit,
    isSubmitting }: ReviewFormProps, ref) => {


    const [formState, setFormState] = useState<{
        questions: ReviewQuestion[];
        ratings: { questionId: string, value: number }[];
    }>({ questions: [], ratings: [] });

    const formRef = useRef<HTMLFormElement>(null);

    // expose this to the parent
    useImperativeHandle(ref, () => ({
        resetForm: () => {
            formRef.current?.reset();
            setFormState((prev) => ({
                questions: prev.questions,
                ratings: prev.questions.map((q) => ({ questionId: q._id, value: 0 })),
            }));
        }
    }));

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const { results = [] } = await reviewQuestions();
                setFormState({
                    questions: results,
                    ratings: results.map((q: ReviewQuestion) => ({ questionId: q._id, value: 0 })),
                });
            } catch (error) {
                console.error("Failed to fetch review questions:", error);
            }
        };
        fetchQuestions();
    }, []);

    const handleRatingChange = (index: number, value: number) => {
        setFormState((prevState) => {
            const updatedRatings = [...prevState.ratings];
            updatedRatings[index]['value'] = value;
            return { ...prevState, ratings: updatedRatings };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const { professorName, courseName, professorId, courseId } = selectedProfessor;

            if (!professorId) {
                alert("Please select a professor");
                return;
            }

            const newReview = {
                studentID: studentInfo.id,
                title: formData.get('reviewTitle'),
                courseID: courseId,
                professorID: professorId,
                courseName,
                professorName,
                ratings: formState.ratings,
                review: formData.get('review')
            };

            onSubmit(newReview);

        } catch (error) {
            console.error("Error parsing data:", error);
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Write a Review</h1>
                <div className="mt-2 h-1 w-24 bg-indigo-500 mx-auto rounded-full"></div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Select
                        label="Choose Professor"
                        name="course"
                        onChange={onProfessorChange}
                        options={courses.map((course: any) => ({ label: course.professorName, value: course }))}
                        value={selectedProfessor}
                    />
                </div>

                <div>
                    <label htmlFor="review-title" className="mb-2 block text-sm/6 font-medium text-gray-900">Review Title</label>
                    <input type="text" name="reviewTitle" id="review-title" className="w-full rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Add a title for your review" />
                </div>

                <div className="space-y-6">
                    {formState.questions.map((question, index) => (
                        <RatingInput
                            key={question._id}
                            question={question}
                            index={index}
                            value={formState.ratings[index].value}
                            onChange={handleRatingChange}
                        />
                    ))}
                </div>

                <div className="rounded-md bg-white p-6">
                    <label htmlFor="review" className="mb-2 block text-sm/6 font-medium text-gray-900">Write a Review</label>
                    <textarea name="review" id="review" rows={5} className="w-full rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" placeholder="Share details of your experience with this professor..."></textarea>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="border bg-blue-700 text-white hover:bg-primary/90 text-white font-medium py-2 px-8 rounded-full"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
                                Submitting...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Submit Review
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
});

export default ReviewForm;
