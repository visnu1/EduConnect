import { Star } from "lucide-react";

type Review = {
    id: string;
    studentName: string;
    professorName: string;
    date: string;
    rating: number;
    comment: string;
    title: string;
};

interface StudentReviewsProps {
    reviews: Review[];
}


const StudentReviews: React.FC<StudentReviewsProps> = ({ reviews }) => {

    const renderStars = (ratings: any) => {
        let temp = 0;
        ratings.forEach((rating: any) => temp = temp + rating.value);
        temp = temp / ratings.length
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < temp ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Student Reviews</h2>
                <span className="text-sm text-gray-500">{reviews.length} reviews</span>
            </div>

            {reviews.length === 0 ? (
                <div className="border-gray-200 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to leave a review!</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                    {reviews.map((review: any, index) => (
                        <div key={review._id || index} className="rounded-lg border bg-card text-card-foreground shadow-sm border-gray-200 hover:shadow-md transition-shadow">
                            <div className="lex flex-col space-y-1.5 p-6 pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-2">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{review.studentID}</h3>
                                            <p className="text-xs text-gray-500">{review.date}</p>
                                        </div>
                                    </div>
                                    {renderStars(review.ratings)}
                                </div>
                            </div>
                            <div className="p-6 pt-0">
                                <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>
                                <p className="text-gray-600 text-sm">{review.review}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentReviews;