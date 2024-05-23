import {
    Box,
    Button,
    Divider,
    FormGroup,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import KeyIcon from "@mui/icons-material/Key";
import EmailIcon from "@mui/icons-material/Email";
import { Link, useNavigate } from "react-router-dom";
import { isTokenValid } from "../../services/apiservice";
import styles from "./Login.module.scss";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { httpClient } from "../../utils/AxiosHttpClient";

interface ILogin {
    email: string;
    password: string;
}

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginWithEmailPassword = async (payload: ILogin) => {
        const reponse = await httpClient.post(`/api/v1/auth/login`, payload);
        return reponse.data;
    };

    const { mutateAsync } = useMutation({
        mutationFn: loginWithEmailPassword,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["login"] });
        },
        mutationKey: ["login"],
    });

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        accessToken &&
            isTokenValid(accessToken).then(() => {
                navigate("/"); // Chuyển hướng người dùng đến trang chủ
            });
    }, []); // Chỉ chạy khi component được render lần đầu

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]); // This will clear the error message after 5 seconds
            }, 5000);
            return () => clearTimeout(timer); // This will clear the timeout if the component is unmounted
        }
    }, [errors]); // This effect runs whenever the 'errors' state changes

    const handleLoginWithEmailAndPassword = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;   
        if (form.checkValidity() === false) {
            console.log("Da click");
            event.preventDefault();
            event.stopPropagation();
        } else {

            const data = await mutateAsync({
                email: username,
                password: password,
            });

            console.log("data:", data);

            if (data.isSuccess) {
                localStorage.setItem("accessToken", data.data.accessToken);
                localStorage.setItem("refreshToken", data.data.refreshToken); // Lưu refresh token vào local storage
                setErrors([]);

                // navigate to homepage after user login successfully.
                navigate("/");
            } else {
                setErrors(data.errors);
            }
            setValidated(true);
        }
    };

    const handleGoogleSuccess = async (googleResponse) => {
        console.log(googleResponse);
        const idToken = googleResponse.credential;

        const response = await fetch(
            `${
                import.meta.env.VITE_APP_API_BASE_URL
            }/api/v1/auth/login-with-google`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idToken: idToken,
                }),
            }
        );

        const data = await response.json();

        if (data.isSuccess) {
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("refreshToken", data.data.refreshToken);
            setErrors([]);
            // navigate to home page after user login successfully
            navigate("/");
        } else {
            setErrors(data.errors);
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.loginContainer}>
                <Box className={styles.loginWrapper}>
                    {errors.length > 0 && (
                        <Box className="alert alert-danger">
                            <ul>
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </Box>
                    )}
                    <Box className={styles.formTitle}>Login</Box>
                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleLoginWithEmailAndPassword}
                        className={styles.loginForm}
                    >
                        <FormGroup className={styles.formGroup}>
                            {/* <Form.Label>Username</Form.Label> */}
                            <TextField
                                className={styles.textField}
                                required
                                type="text"
                                placeholder="Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                label={<span>{<EmailIcon />} Email:</span>}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a username.
                            </Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup className={styles.formGroup}>
                            <TextField
                                className={styles.textField}
                                required
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label={<span>{<KeyIcon />} Password:</span>}
                            />

                            {/* <Form.Label>Password</Form.Label> */}
                            <Form.Control.Feedback type="invalid">
                                Please provide a password.
                            </Form.Control.Feedback>
                        </FormGroup>
                        <Box className={styles.optionContainer}>
                            <Link to="/register" className={styles.link}>
                                Register
                            </Link>
                            <Link to="/reset-password" className={styles.link}>
                                Reset password
                            </Link>
                        </Box>
                        <Box className={styles.submitButtonContainer}>
                            <Button
                                className={`mt-2 mb-2 ${styles.submitButton}`}
                                type="submit"
                                variant="contained"
                            >
                                Login
                            </Button>
                        </Box>
                        <Box className={styles.orOptionContainer}>
                            <Box className={styles.divider} />
                            <Typography
                                className={styles.orOption}
                                variant="body1"
                                component="p"
                            >
                                {"or"}
                            </Typography>
                            <Box className={styles.divider} />
                        </Box>
                        <Box className={styles.googleLoginContainer}>
                            <GoogleOAuthProvider
                                clientId={
                                    import.meta.env.VITE_APP_GOOGLE_CLIENTID
                                }
                            >
                                <GoogleLogin
                                    width={"200px"}
                                    // text="signin_with"

                                    onSuccess={handleGoogleSuccess}
                                    onFailure={handleGoogleSuccess}
                                    cookiePolicy={"single_host_origin"}
                                    // render={() => {
                                    //     return <button>ABC</button>;
                                    // }}
                                />
                            </GoogleOAuthProvider>
                        </Box>
                    </Form>
                </Box>
            </Box>
        </Box>
    );
}

export default Login;
