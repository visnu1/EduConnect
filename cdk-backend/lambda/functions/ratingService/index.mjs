import { ObjectId } from "mongodb";
import connectToDatabase from './db.mjs';

const allowedOrigins = process.env.ALLOW_ORIGINS?.split(',') || [];

export const handler = async (event) => {
    const origin = event.headers.origin;
    const { httpMethod, pathParameters, queryStringParameters, body, path } = event;

    let db = await connectToDatabase();
    if (!db) {
        console.log('Database connection failed');
        return response(origin, 500, { message: "Internal server error", error: "Unable to establish a connection to the database" });
    }

    const questionsCollection = db.collection('questions');
    const reviewsCollection = db.collection('reviews');

    if (path.endsWith('/questions')) {
        switch (httpMethod) {
            case 'GET':
                console.log(`TESTING=> 'GET' /questions`);

                const results = await questionsCollection.find({}).toArray();
                return response(origin, 200, { message: "Questions queried successfully", results });

            default:
                return response(origin, 404, { message: "Route or method not supported" });
        }
    }

    if (path.endsWith('/review')) {
        switch (httpMethod) {
            case 'GET':
                if (!queryStringParameters || !queryStringParameters.id) {
                    return response(origin, 400, { message: "Missing professor ID in query parameters" });
                }

                const professorID = queryStringParameters.id;
                const pipeline = [
                    {
                        $match: { "professorID": professorID }
                    },
                    {
                        $lookup: {
                            from: "questions",
                            localField: "ratings.questionId",
                            foreignField: "_id",
                            as: "questionDetails"
                        }
                    }
                ];
                const results = await reviewsCollection.aggregate(pipeline).toArray();
                return response(origin, 200, { message: "Reviews queried successfully", results });

            case 'POST':
                if (!body) {
                    return response(origin, 400, { message: "Missing request body" });
                }

                const parsedBody = JSON.parse(body);  // Renamed `body` to `parsedBody`
                const updateResults = await reviewsCollection.updateOne(
                    {
                        studentID: parsedBody.studentID,
                        professorID: parsedBody.professorID,
                        courseID: parsedBody.courseID
                    },
                    {
                        $set: {
                            courseID: parsedBody.courseID,
                            studentID: parsedBody.studentID,
                            professorID: parsedBody.professorID,
                            professorName: parsedBody.professorName,
                            courseName: parsedBody.courseName,
                            ratings: parsedBody.ratings.map(i => ({
                                questionId: new ObjectId(i.questionId),
                                value: i.value
                            })),
                            review: parsedBody.review
                        }
                    },
                    { upsert: true }
                );
                return response(origin, 200, { message: "Review saved successfully", results: updateResults });

            default:
                return response(origin, 404, { message: "Route or method not supported" });
        }
    }
};

function response(origin, statusCode, body) {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json"
        }
    };
}