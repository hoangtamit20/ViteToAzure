import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';

function RegisterResult() {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const statusCode = urlParams.get('statuscode');
    const result = urlParams.get('result') === 'True'; // Convert to boolean
    const message = decodeURIComponent(urlParams.get('message'));

    return (
        <div>
            <div>
                <h1>Registration Result</h1>
                {result ? (
                    <Alert variant="success" style={{ textAlign: 'center' }}>
                        <CheckCircle size={96} style={{ marginBottom: '10px' }} />
                        <div>{message}</div>
                    </Alert>
                ) : (
                    <Alert variant="danger" style={{ textAlign: 'center' }}>
                        <XCircle size={96} style={{ marginBottom: '10px' }} />
                        <div>{message}</div>
                    </Alert>
                )}
            </div>
            <div>
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
    );
}

export default RegisterResult;
