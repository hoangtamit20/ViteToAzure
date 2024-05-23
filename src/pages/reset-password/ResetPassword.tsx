import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Box, Button, FormGroup, TextField } from "@mui/material";
import styles from "./ResetPassword.module.scss";
import EmailIcon from "@mui/icons-material/Email";

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMesage] = useState("");

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]); // This will clear the error message after 5 seconds
            }, 5000);
            return () => clearTimeout(timer); // This will clear the timeout if the component is unmounted
        }
    }, [errors]); // This effect runs whenever the 'errors' state changes

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMesage(""); // This will clear the error message after 5 seconds
            }, 5000);
            return () => clearTimeout(timer); // This will clear the timeout if the component is unmounted
        }
    }, [successMessage]); // This effect runs whenever the 'errors' state changes

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(
            `${
                import.meta.env.VITE_APP_API_BASE_URL
            }/api/v1/auth/check-email-reset-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            }
        );

        const data = await response.json();

        if (data.isSuccess) {
            setSuccessMesage(data.data.message);
            setErrors([]);
            // You can show a success message here
        } else {
            setErrors(data.errors);
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.resetPasswordWrapper}>
                <Box className={styles.resetPasswordContainer}>
                    {errors.length > 0 && (
                        <div className="alert alert-danger">
                            <ul>
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {successMessage && (
                        <div className="alert alert-info">
                            <ul>
                                <li>{successMessage}</li>
                            </ul>
                        </div>
                    )}
                    <Box className={styles.formTitle}>Email address</Box>
                    <Form
                        className={styles.resetPasswordForm}
                        onSubmit={handleSubmit}
                    >
                        <FormGroup className={styles.formGroup}>
                            <TextField
                                className={styles.textField}
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label={<span>{<EmailIcon />} Email:</span>}
                            />
                        </FormGroup>
                        <Box className={styles.resetPasswordButtonContainer}>
                            <Button
                                className={`mt-2 mb-2 ${styles.resetPasswordButton}`}
                                variant="contained"
                                type="submit"
                            >
                                Reset Password
                            </Button>
                        </Box>
                    </Form>
                </Box>
            </Box>
        </Box>
    );
}

export default ResetPassword;
