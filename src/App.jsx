import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
    useLocation,
} from "react-router-dom";
import CourseTypeCRUD from "./components/admin/managecoursetype/coursetypecrud";
import Login from "./pages/login/Login";
import RegisterResult from "./pages/register-result/RegisterResult";
import Register from "./pages/register/Register";
import ResetPassword from "./pages/reset-password/ResetPassword";
import { checkIfUserIsAdmin } from "./services/roleservice";
import HomePage from "./pages/home-page/HomePage";
import SearchAppBar from "./components/Navbar/SearchAppBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "swiper/css";
import "swiper/css/virtual";
import CourseDetail from "./pages/course-detail-page/CourseDetail";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LessonPage from "./pages/lesson-page/LessonPage";
import { Box } from "@mui/material";
import PaymentReturnPage from "./pages/payment-return-page/PaymentReturnPage";
import NavBarTop from "./components/base/navbartop";
import PaymentPage from "./pages/payment/PaymentPage";
import CreateCourse from "./pages/courses/createcourse";
import { UserProvider } from "./services/usercontext";
import ResetPasswordConfirm from "./pages/reset-password-confirm/ResetPasswordConfirm";

// import your components here
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
        mutations: {},
    },
});

function ProtectedRoute({ children, showToast, ...rest }) {
    const location = useLocation();
    const checkUserPermission = checkIfUserIsAdmin();

    useEffect(() => {
        if (
            !checkUserPermission &&
            location.pathname === "/admin/manage-course-type/course-type-crud"
        ) {
            showToast(true);
            setTimeout(() => showToast(false), 5000); // hide the toast after 5 seconds
        }
    }, [checkUserPermission, location]);

    return checkUserPermission ? children : <Navigate to="/login" />;
}

function NavBarWrapper() {
    const location = useLocation();
    const authPaths = ['/login', '/register', '/reset-password', '/reset-password-confirm', '/register-result'];

    return !authPaths.includes(location.pathname) ? <NavBarTop /> : null;
}

function App() {
    const [showToast, setShowToast] = useState(false);

    return (
        <Box
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UserProvider>
                        {/* <Navbar /> */}
                        <NavBarWrapper />
                        <Routes>
                            {/* <Route path="/test" element={<SearchAppBar />} /> */}
                            <Route path="/homepage" element={<HomePage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/reset-password"
                                element={<ResetPassword />}
                            />
                            <Route
                                path="/course-detail/:id"
                                element={<CourseDetail />}
                            />
                            <Route
                                path="/course-detail/:courseId/lesson"
                                element={<LessonPage />}
                            />
                            <Route
                                path="/reset-password-confirm"
                                element={<ResetPasswordConfirm />}
                            />
                            <Route
                                path="/register-result"
                                element={<RegisterResult />}
                            />
                            <Route path="/payment" element={<PaymentPage />} />
                            <Route
                                path="/payments/return"
                                element={<PaymentReturnPage />}
                            />
                            <Route path="/" element={<HomePage />} />
                            <Route path="/courses/create" element={<CreateCourse />} />
                            {/* Route for admin */}
                            <Route
                                path="/admin/manage-course-type/course-type-crud"
                                element={
                                    <ProtectedRoute showToast={setShowToast}>
                                        <CourseTypeCRUD />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                        <Footer />
                    </UserProvider>
                </Router>

                <ToastContainer position="top-end" className="mt-3 me-3">
                    <Toast
                        show={showToast}
                        onClose={() => setShowToast(false)}
                        delay={5000}
                        autohide
                        className="bg-danger"
                    >
                        <Toast.Header>
                            <strong className="me-auto">Access Denied</strong>
                        </Toast.Header>
                        <Toast.Body>
                            You don't have permission to access this page.
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            </QueryClientProvider>
        </Box>
    );
}

export default App;
