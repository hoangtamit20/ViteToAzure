import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import axios from 'axios';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const CreateCourseForm = () => {
    const [message, setMessage] = useState('');
    const [messageTest, setMessageTest] = useState('');
    const [connectionId, setConnectionId] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Loading state for the spinner

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl('https://localhost:7209/progressHub')
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => connection.invoke('GetConnectionId'))
            .then(connectionId => {
                console.log('Connection ID: ', connectionId);
                setConnectionId(connectionId);
            })
            .catch(err => console.error('SignalR Connection Error: ', err));

        connection.on('ReceiveProgress', (message) => {
            console.log('Progress Message: ', message);
            setMessage(message);
        });

        connection.on('SendMessageTest', mess => {
            console.log('Message tau đã gửi nè : ', mess);
            setMessageTest(mess);
        });

        return () => {
            connection.stop();
        };
    }, []);

    const [course, setCourse] = useState({
        name: '',
        price: 0,
        courseDescription: '',
        courseTopicId: 0,
        subtitleFileUploads: [],
        thumbnailFileUpload: null,
        videoFileUpload: null
    });

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading

        const formData = new FormData();

        // Append non-file fields
        formData.append('name', course.name);
        formData.append('price', course.price);
        formData.append('courseDescription', course.courseDescription);
        formData.append('courseTopicId', course.courseTopicId);

        // Append files
        if (course.subtitleFileUploads) {
            for (let i = 0; i < course.subtitleFileUploads.length; i++) {
                formData.append('subtitleFileUploads', course.subtitleFileUploads[i]);
            }
        }

        if (course.thumbnailFileUpload) {
            formData.append('thumbnailFileUpload', course.thumbnailFileUpload[0]);
        }

        if (course.videoFileUpload) {
            formData.append('videoFileUpload', course.videoFileUpload[0]);
        }

        try {
            const response = await axios.post('https://localhost:7209/api/v1/course/create-course', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                    'Connection-Id': connectionId,
                },
            });
            // console.log(response.data);
            navigate(`/course/lessons`, { state: { course: response.data } });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Container style={{ marginTop: '150px' }}>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group controlId="courseDescription">
                            <Form.Label>Course Description</Form.Label>
                            <Form.Control type="text" name="courseDescription" onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="courseTopicId">
                            <Form.Label>Course Topic Id</Form.Label>
                            <Form.Control type="number" name="courseTopicId" onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className='mb-5' controlId="subtitleFileUploads">
                            <Form.Label>Subtitle File Uploads</Form.Label>
                            <Form.Control type="file" name="subtitleFileUploads" onChange={handleFileChange} multiple accept=".srt,.vtt,.sbv" />
                        </Form.Group>

                        <Form.Group className='mb-4' controlId="thumbnailFileUpload">
                            <Form.Label>Thumbnail File Upload</Form.Label>
                            <Form.Control type="file" name="thumbnailFileUpload" onChange={handleFileChange} accept=".jpg,.jpeg,.png" />
                        </Form.Group>

                        <Form.Group controlId="videoFileUpload">
                            <Form.Label>Video File Upload</Form.Label>
                            <Form.Control type="file" name="videoFileUpload" onChange={handleFileChange} accept=".mp4,.avi,.mov" />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Submit'}
                        </Button>
                    </Col>
                </Row>
                {loading && <div className="d-flex justify-content-center mt-3">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Uploading...</span>
                    </Spinner>
                </div>}
                <div className='badge text-bg-warning'>{message}</div>
                <div className='badge text-bg-warning'>{messageTest}</div>
            </Form>
        </Container>
    );
};

export default CreateCourseForm;
