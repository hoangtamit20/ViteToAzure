import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Button, FormGroup, TextField, Typography } from "@mui/material";
import styles from "./Register.module.scss";

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [successMessage, setSuccessMesage] = useState('');
    const navigate = useNavigate();


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

        if (password !== rePassword) {
            setErrors(["Passwords do not match"]);
            return;
        }

        const response = await fetch(
            `${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            }
        );

        const data = await response.json();

        if (data.isSuccess) {
            setErrors([]);
            setSuccessMesage(data.data.message);
            // navigate to home page after user register successfully
            // navigate('/');
        } else {
            setErrors(data.errors);
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.registerWrapper}>
                {errors.length > 0 && (
                    <div className='alert alert-danger text-start'>
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {successMessage && (
                    <div className='alert alert-info text-start'>
                        <ul>
                            <li>{successMessage}</li>
                        </ul>
                    </div>
                )}
                <Box className={styles.registerContainer}>
                    <Box className={styles.formTitle}>Register Account</Box>
                    <Form
                        className={styles.registerForm}
                        onSubmit={handleSubmit}
                    >
                        <FormGroup className={styles.formGroup}>
                            <TextField
                                className={styles.textField}
                                type="text"
                                placeholder="Enter Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                label={<span>{<PersonIcon />} Full Name:</span>}
                            />
                        </FormGroup>
                        <FormGroup className={styles.formGroup}>
                            <TextField
                                className={styles.textField}
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label={<span>{<EmailIcon />} Emai:</span>}
                            />
                        </FormGroup>
                        <FormGroup className={styles.formGroup}>
                            <TextField
                                className={styles.textField}
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label={<span>{<KeyIcon />} Password:</span>}
                            />
                        </FormGroup>
                        <FormGroup className={styles.formGroup}>
                            <TextField
                                className={styles.textField}
                                type="password"
                                placeholder="Re-enter Password"
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                label={
                                    <span>
                                        {<KeyIcon />} Re-enter Password:
                                    </span>
                                }
                            />
                        </FormGroup>
                        <Box className={styles.optionContainer}>
                            <Link className={styles.link} to="/login">
                                <ArrowBackIosIcon className={styles.backIcon} />
                                Back to login
                            </Link>
                        </Box>
                        <Box className={styles.registerButtonContainer}>
                            <Button
                                className={`mt-2 mb-2 ${styles.registerButton}`}
                                variant="contained"
                                type="submit"
                            >
                                Register
                            </Button>
                        </Box>
                    </Form>
                </Box>
            </Box>
        </Box>
    );
}

export default Register;
