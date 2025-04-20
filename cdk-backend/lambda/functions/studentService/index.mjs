import mysql2 from 'mysql2/promise';
import { v4 as uuid } from 'uuid';


const allowedOrigins = process.env.ALLOW_ORIGINS?.split(',') || [];
const TABLES = new Set(['students', 'professors', 'courses', 'enrollment', 'majors', 'major_courses']);
let connection;

export const handler = async (event) => {
    const origin = event.headers.origin;
    const { httpMethod, queryStringParameters, body } = event;
    const path = event.path.substring(1).toLowerCase();

    console.log('Requested Path:', path);

    try {
        await createConnection();

        if (httpMethod === 'GET' && TABLES.has(path)) {
            const query = path === 'major_courses' ? getMajorCoursesQuery() : `SELECT * FROM ${path};`;
            return await executeQuery(query, origin);
        }

        if (httpMethod === 'GET' && path === 'students/search') {
            if (!queryStringParameters?.id) {
                return response(origin, 400, { message: "Missing student ID in query parameters" });
            }
            const queryProps = getStudentCoursesQuery(queryStringParameters.id);
            return await executeQuery(queryProps.query, origin, queryProps.params);
        }

        if (httpMethod === 'GET' && path === 'courses/search') {
            const search = queryStringParameters?.search || "";
            const queryProps = getCourseListQuery(search);
            return await executeQuery(queryProps.query, origin, queryProps.params);
        }

        if (httpMethod === 'POST' && path === 'courses') {
            if (!body) {
                return response(origin, 400, { message: "Missing request body" });
            }
            const enrollmentObj = JSON.parse(body);
            console.log("Enrollment Request:", enrollmentObj);

            const query = `
                INSERT INTO enrollment (studentId, courseId, enrolledSemester) 
                VALUES (?, ?, ?)
            `;
            const params = [enrollmentObj.studentId, enrollmentObj.courseId, enrollmentObj.enrolledSemester];
            return await executeQuery(query, origin, params);
        }

        console.warn(`No matching route found for ${httpMethod} ${path}`);
        return response(origin, 404, { message: "Route or method not supported" });

    } catch (error) {
        console.error("Error:", error);
        return response(origin, 500, { message: "Internal server error", error: error.message });
    }
};

// fn to execute SQL query
async function executeQuery(query, origin, params = []) {
    try {
        const [results] = await connection.execute(query, params);
        return response(origin, 200, { results });
    } catch (error) {
        console.error("Query Execution Error:", error);
        return response(origin, 500, { message: "Database query error", error: error.message });
    }
}


function getMajorCoursesQuery() {
    return `
        SELECT mc.majorId, m.name AS majorName, mc.courseId, c.name AS courseName 
        FROM major_courses mc 
        JOIN majors m ON mc.majorId = m.id 
        JOIN courses c ON mc.courseId = c.id;
    `;
}


function getStudentCoursesQuery(studentId) {
    let query = `
        SELECT 
            e.studentId, e.courseId, e.enrolledSemester, e.gradeReceived,
            c.name AS courseName, c.classRoomNumber, c.professorId, 
            c.day, c.startTime, c.endTime, 
            p.name AS professorName, p.title AS professorTitle
        FROM enrollment e
        JOIN courses c ON e.courseId = c.id
        JOIN professors p ON c.professorId = p.id
        WHERE e.studentId = ?;
    `;
    return { query, params: [studentId] };
}

function getCourseListQuery(search) {
    let query = `
        SELECT 
            c.id AS courseId, c.name AS courseName, c.credits, c.classRoomNumber, 
            c.maxStudents, c.campusLocation, c.day, c.startTime, c.endTime, 
            p.name AS professorName, m.name AS majorName
        FROM courses c
        JOIN professors p ON c.professorId = p.id
        JOIN major_courses mc ON c.id = mc.courseId
        JOIN majors m ON mc.majorId = m.id
    `;

    if (search) {
        query += ` WHERE 
            p.name LIKE ? OR 
            c.name LIKE ? OR 
            m.name LIKE ?
        `;
        return { query, params: [`%${search}%`, `%${search}%`, `%${search}%`] };
    }
    return { query, params: [] };
}


async function createConnection() {
    if (!connection) {
        connection = await mysql2.createConnection({
            host: process.env.RDS_HOSTNAME,
            user: process.env.RDS_USERNAME,
            password: process.env.RDS_PASSWORD,
            port: parseInt(process.env.RDS_PORT || "3306", 10),
            database: process.env.DB_NAME,
            ssl: 'Amazon RDS',
            multipleStatements: true
        });
        console.log("DB connection established!");
    }
}

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