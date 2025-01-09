const axios = require('axios');
const { v1: uuid } = require('uuid');
const { ObjectId } = require('mongodb');
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Content-Type": "application/json"
}

exports.handler = async (event) => {

    let db = await require('./db')();

    const httpMethod = event.httpMethod;
    const path = event.path;

    if (httpMethod == 'GET' && path == '/questions') {
        console.log(`TESTING=> 'GET' /questions`);
        const collection = db.collection('questions');
        let results = await collection.find({}).toArray();
        return { body: JSON.stringify({ results }), statusCode: 200, headers };
    }

    if (httpMethod == 'GET' && path == '/review') {
        console.log(`TESTING=> 'GET' '/review'`);
        const professorID = event.queryStringParameters.id;
        let searchResults = [];
        if (professorID)
            try {
                const collection = db.collection('reviews');
                const pipeline = [
                    {
                        $match: {
                            "professorID": professorID
                        }
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
                searchResults = await collection.aggregate(pipeline).toArray();
            } catch (error) {
                console.log(error);
                return { body: JSON.stringify({ message: "Something went wrong", error }), statusCode: 500, headers };
            }

        return { body: JSON.stringify({ message: "Success", results: searchResults }), statusCode: 200, headers };
    }

    if (httpMethod === 'POST' && path === '/review') {
        console.log(`TESTING=> 'POST' '/review'`);
        const collection = db.collection('reviews');
        let body = JSON.parse(event.body);
        try {
            let updateResults = await collection.updateOne(
                {
                    studentID: body.studentID,
                    professorID: body.professorID,
                    courseID: body.courseID
                },
                {
                    $set: {
                        courseID: body.courseID,
                        studentID: body.studentID,
                        professorID: body.professorID,
                        professorName: body.professorName,
                        courseName: body.courseName,
                        ratings: body.ratings.map(i => { return { questionId: new ObjectId(i.questionId), value: i.value } }),
                        review: body.review
                    }
                }, { upsert: true });
            return { body: JSON.stringify({ message: "You review has been recorded. Thank You!", updateResults }), statusCode: 200, headers };
        } catch (error) {
            console.log(error);
            return { body: JSON.stringify({ message: "Something went wrong" }), statusCode: 500, headers };
        }
    }
    console.log(`TESTING=> NO MATCHING'`);
    return { body: JSON.stringify({ message: "Route or method not supported" }), statusCode: 404, headers };
};