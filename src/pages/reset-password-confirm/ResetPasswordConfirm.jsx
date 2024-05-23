import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Box, Button, FormGroup, TextField } from "@mui/material";
import styles from "./ResetPasswordConfirm.module.scss";

function ResetPasswordConfirm() {
    const [newPassword, setNewPassword] = useState("");
    const [reNewPassword, setReNewPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMesage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

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
                navigate("/login"); // Add this line to navigate to login
            }, 5000);
            return () => clearTimeout(timer); // This will clear the timeout if the component is unmounted
        }
    }, [successMessage]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== reNewPassword) {
            setErrors(["Passwords do not match"]);
            return;
        }

        const urlParams = new URLSearchParams(location.search);
        const id = urlParams.get("id");
        const token = encodeURIComponent(urlParams.get("token"));
        console.log(id);

        const response = await fetch(
            `${
                import.meta.env.VITE_APP_API_BASE_URL
            }/api/v1/auth/confirm-reset-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    token: token,
                    newPassword: newPassword,
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
            <Box className={styles.resetPasswordConfirmWrapper}>
                <Box className={styles.resetPasswordConfirmContainer}>
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
                    <Box className={styles.formTitle}>Confirm Password</Box>
                    <Form
                        className={styles.resetPasswordConfirmForm}
                        onSubmit={handleSubmit}
                    >
                        <FormGroup className={styles.formGroup}>
                            <TextField
                                className={styles.textField}
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup className={styles.formGroup}>
                            <TextField
                                type="password"
                                placeholder="Re-enter New Password"
                                value={reNewPassword}
                                onChange={(e) =>
                                    setReNewPassword(e.target.value)
                                }
                            />
                        </FormGroup>

                        <Box
                            className={
                                styles.resetPasswordConfirmButtonContainer
                            }
                        >
                            <Button
                                className={`mt-2 mb-2 ${styles.resetPasswordConfirmButton}`}
                                variant="contained"
                                type="submit"
                            >
                                Confirm Reset Password
                            </Button>
                        </Box>
                    </Form>
                </Box>
            </Box>
        </Box>
    );
}

export default ResetPasswordConfirm;
