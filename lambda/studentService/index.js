const mysql2 = require('mysql2/promise');
const { v4: uuid } = require('uuid');
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
}
let connection;
const TABLES = ['students', 'professors', 'courses', 'enrollment', 'majors', 'major_courses'];

exports.handler = async (event) => {
    const httpMethod = event.httpMethod;
    const path = event.path.substring(1).toLowerCase();

    console.log('path =>', path);

    try {
        await createConnection();

        if (httpMethod == 'GET' && TABLES.includes(path)) {
            let query = `SELECT * FROM ${path};`;
            if (path == 'major_courses') query = majorCourses();
            const [results] = await connection.execute(query);
            return { body: JSON.stringify({ results }), statusCode: 200, headers };
        }

        if (httpMethod == 'GET' && path == 'students/search') {
            const studentId = event.queryStringParameters.id;
            let query = studentCourses(studentId);
            const [results] = await connection.execute(query);
            return { body: JSON.stringify({ results }), statusCode: 200, headers };
        }


        if (httpMethod == 'GET' && path == 'courses/search') {
            let search = event.queryStringParameters?.search || "";
            let query = courseList(search);
            const [results] = await connection.execute(query);
            return { body: JSON.stringify({ results }), statusCode: 200, headers };
        }

        if (httpMethod == 'POST' && path == 'courses') {
            let enrollmentObj = JSON.parse(event.body);
            console.log("enrollmentObj", enrollmentObj);
            let query = `INSERT INTO enrollment (studentId, courseId, enrolledSemester) VALUES (?, ?, ?)`;
            const [results] = await connection.execute(query, [enrollmentObj.studentId, enrollmentObj.courseId, enrollmentObj.enrolledSemester]);
            return { body: JSON.stringify({ results }), statusCode: 200, headers };
        }

        console.log(`TESTING=> NO MATCHING'`);
        return { body: JSON.stringify({ message: "Route or method not supported" }), statusCode: 404, headers };

    } catch (error) {
        console.error("Error:", error);
        return { body: JSON.stringify({ message: "Internal server error" }), statusCode: 500, headers };
    }
};


function majorCourses() {
    return `SELECT mc.majorId, m.name as majorName, mc.courseId, c.name as courseName FROM  major_courses mc JOIN majors m ON mc.majorId = m.id JOIN courses c ON mc.courseId = c.id;`;
}


function studentCourses(search) {
    return `
    SELECT 
        e.studentId,
        e.courseId,
        e.enrolledSemester,
        e.gradeReceived,
        c.name AS courseName,
        c.classRoomNumber,
        c.professorId,
        c.day,
        c.startTime,
        c.endTime,
        p.name AS professorName,
        p.title AS professorTitle
    FROM 
        enrollment e
    JOIN 
        courses c ON e.courseId = c.id
    JOIN 
        professors p ON c.professorId = p.id
    WHERE 
        e.studentId = '${search}';
    `;
}


function courseList(search) {
    let query = `SELECT 
        c.id AS courseId,
        c.name AS courseName,
        c.credits,
        c.classRoomNumber,
        c.maxStudents,
        c.campusLocation,
        c.day,
        c.startTime,
        c.endTime,
        p.name AS professorName,
        m.name AS majorName
    FROM 
        courses c
    JOIN 
        professors p ON c.professorId = p.id
    JOIN 
        major_courses mc ON c.id = mc.courseId
    JOIN 
        majors m ON mc.majorId = m.id
   `;
    // let queryBuilder = [];
    // if (search.professor) queryBuilder.push(`p.name LIKE '%${search.professor}%'`);
    // if (search.course) queryBuilder.push(`c.name LIKE '%${search.course}%'`);
    // if (search.major) queryBuilder.push(`m.name LIKE '%${search.major}%'`);
    if (search)
        query += 'WHERE ' + `p.name LIKE '%${search}%' OR c.name LIKE '%${search}%' OR m.name LIKE '%${search}%';`;
    // console.log('queryyyy =>', query);
    return query;
}

async function createConnection() {
    connection = await mysql2.createConnection({
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: process.env.DB_NAME
    });
    return;
}