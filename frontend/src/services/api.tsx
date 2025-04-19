import axios from 'axios';

// Base URLs
const REVIEWS_API_URL = 'https://upemgfn5we.execute-api.us-east-1.amazonaws.com/prod';
const PANTRY_API_URL = 'https://3s8cxykppa.execute-api.us-east-1.amazonaws.com/prod';
const STUDENT_API_URL = 'https://rzd6l535ab.execute-api.us-east-1.amazonaws.com/prod';


const reviewsApi = axios.create({
  baseURL: REVIEWS_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const campusApi = axios.create({
  baseURL: PANTRY_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

const studentApi = axios.create({
  baseURL: STUDENT_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Professor Review APIs
export const reviewQuestions = async () => {
  try {
    const response = await reviewsApi.get('/questions');
    return response.data;
  } catch (error) {
    console.error('Error fetching review questions:', error);
    throw error;
  }
};

export const professorReviews = async (professorID = "") => {
  try {
    const response = await reviewsApi.get('/review', {
      params: { id: professorID },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching professor reviews:', error);
    throw error;
  }
};

export const registerProfessorReview = async (data: any) => {
  try {
    const response = await reviewsApi.post('/review', data);
    return response.data;
  } catch (error) {
    console.error('Error registering review:', error);
    throw error;
  }
};

// ---------- Campus Care Service ----------
export const getProducts = async () => {
  try {
    const response = await campusApi.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const registerOrder = async (orderData: any) => {
  try {
    const response = await campusApi.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error registering order:', error);
    throw error;
  }
};

export const getMyOrders = async (studentId: string) => {
  try {
    const response = await campusApi.get('/orders', {
      params: { studentId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Student & Registration APIs
export const getStudents = async () => {
  try {
    const response = await studentApi.get('/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStudentsCourses = async (studentId: string) => {
  try {
    const response = await studentApi.get('/students/search', {
      params: { id: studentId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getProfessors = async () => {
  try {
    const response = await studentApi.get('/professors');
    return response.data;
  } catch (error) {
    console.error('Error fetching professors:', error);
    throw error;
  }
};

export const getCourses = async (search: string) => {
  try {
    let options: any = {}
    if (search)
      options['params'] = { search };
    const response = await studentApi.get('/courses/search', options);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const getMajors = async () => {
  try {
    const response = await studentApi.get('/majors');
    return response.data;
  } catch (error) {
    console.error('Error fetching majors:', error);
    throw error;
  }
};

export const getEnrollments = async () => {
  try {
    const response = await studentApi.get('/enrollment');
    return response.data;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }
};

export const getMajorCourses = async () => {
  try {
    const response = await studentApi.get('/major_courses');
    return response.data;
  } catch (error) {
    console.error('Error fetching major courses:', error);
    throw error;
  }
};

export const searchStudents = async (query: string) => {
  try {
    const response = await studentApi.get('/students/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};

export const searchCourses = async (searchTerm: string) => {
  try {
    const response = await studentApi.get('/courses/search', {
      params: { q: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
};

export const registerEnrollment = async (data: any) => {
  try {
    const response = await studentApi.post('/courses', data);
    return response.data;
  } catch (error) {
    console.error('Error enrolling in courses:', error);
    throw error;
  }
};

export const clearStorage = () => {
  localStorage.clear();
};
