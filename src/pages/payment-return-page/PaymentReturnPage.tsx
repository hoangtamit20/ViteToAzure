import React from "react";
import { Alert, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const PaymentReturnPage = () => {
    const searchParams = new URLSearchParams(useLocation().search);
    const paymentStatus = searchParams.get("PaymentStatus");
    const paymentMessage = searchParams.get("PaymentMessage");

    let alertVariant = "warning";
    let alertMessage = "Unknown payment status!";

    switch (paymentStatus) {
        case "00":
            alertVariant = "success";
            alertMessage = "Payment has been successful!";
            break;

        case "10":
            alertVariant = "danger";
            alertMessage = "Payment has failed!";
            break;

        default:
            break;
    }

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Alert variant={alertVariant} className="text-center w-75">
                <Alert.Heading>{alertMessage}</Alert.Heading>
                {paymentMessage && <p>{paymentMessage}</p>}
            </Alert>
        </Container>
    );
};

export default PaymentReturnPage;
