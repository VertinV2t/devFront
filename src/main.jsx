import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import './index.css'
import ErrorPage from './errorpage.jsx';
import Students from './Students.jsx';
import Instructors from './Instructors.jsx';
import Courses from './Courses.jsx';
import StudentDetails from './StudentDetails.jsx';
import InstructorDetails from './InstructorDetails.jsx';
import CourseDetails from './CourseDetails.jsx';
import Enrollments from './Enrollments.jsx';
import EnrollmentDetails from './EnrollmentDetails.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "students/",
        element: <Students />
      },
      {
        path: "instructors/",
        element: <Instructors />
      },
      {
        path: "courses/",
        element: <Courses />
      },
      {
        path: "enrollments/",
        element: <Enrollments />
      }
    ]
  },
  {
    path: '/students/:studentId',
    element: <StudentDetails/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: '/instructors/:instructorId',
    element: <InstructorDetails/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: '/courses/:courseId',
    element: <CourseDetails/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: '/enrollments/:id',
    element: <EnrollmentDetails/>,
    errorElement: <ErrorPage/>,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
