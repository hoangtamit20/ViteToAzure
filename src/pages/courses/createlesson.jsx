import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateLesson = () => {
    const { courseId } = useParams(); // Assuming the courseId is passed via URL params
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [lesson, setLesson] = useState({
        name: '',
        lessonIndex: 0,
        dateRelease: null,
        isPublic: false,
        description: '',
        thumbnailFile: null,
        subtitleFiles: [],
        videoFile: null,
        courseId: courseId
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`https://localhost:7209/api/v1/course/${courseId}`);
                setCourse(response.data);
            } catch (error) {
                console.error('Error fetching course data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleLessonChange = (e) => {
        const { name, value } = e.target;
        setLesson({ ...lesson, [name]: value });
    };

    const handleLessonFileChange = (e) => {
        const { name, files } = e.target;
        setLesson({ ...lesson, [name]: files });
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.keys(lesson).forEach(key => {
            if (key === 'subtitleFiles' && lesson[key]) {
                for (let i = 0; i < lesson[key].length; i++) {
                    formData.append(key, lesson[key][i]);
                }
            } else {
                formData.append(key, lesson[key]);
            }
        });

        try {
            const response = await axios.post('https://localhost:7209/api/v1/lesson/addlesson', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
            });
            console.log(response.data);
            setShowModal(false);
        } catch (error) {
            console.error('Error adding lesson:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-3">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container style={{ paddingTop: '60px' }}>
            {course ? (
                <>
                    <h1>{course.courseName}</h1>
                    <p>{course.courseDescription}</p>
                    <p>Price: {course.price}</p>
                    <p>Thumbnail: {course.thumbnailUrl}</p>
                    <h2>Streaming Information</h2>
                    <p>Dash CSF: {course.streamingDto?.urlStreamDashCsf}</p>
                    <p>Dash CMAF: {course.streamingDto?.urlStreamDashCmaf}</p>
                    <p>Smooth Streaming: {course.streamingDto?.urlSmoothStreaming}</p>
                    <p>PlayReady License Server: {course.streamingDto?.playReadyUrlLicenseServer}</p>
                    <p>Widevine License Server: {course.streamingDto?.widevineUrlLicenseServer}</p>
                    <h2>Subtitles</h2>
                    {course.subtitleDtos?.map(subtitle => (
                        <p key={subtitle.courseSubtitleId}>Language: {subtitle.language}, URL: {subtitle.urlSubtitle}</p>
                    ))}
                    <Button variant="primary" onClick={() => setShowModal(true)}>Add Lesson</Button>
                </>
            ) : (
                <p>No course data found</p>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Lesson</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddLesson}>
                        <Form.Group controlId="name">
                            <Form.Label>Lesson Name</Form.Label>
                            <Form.Control type="text" name="name" onChange={handleLessonChange} required />
                        </Form.Group>
                        <Form.Group controlId="lessonIndex">
                            <Form.Label>Lesson Index</Form.Label>
                            <Form.Control type="number" name="lessonIndex" onChange={handleLessonChange} required />
                        </Form.Group>
                        <Form.Group controlId="dateRelease">
                            <Form.Label>Date Release</Form.Label>
                            <Form.Control type="date" name="dateRelease" onChange={handleLessonChange} />
                        </Form.Group>
                        <Form.Group controlId="isPublic">
                            <Form.Label>Public</Form.Label>
                            <Form.Check type="checkbox" name="isPublic" onChange={e => setLesson({ ...lesson, isPublic: e.target.checked })} />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" onChange={handleLessonChange} />
                        </Form.Group>
                        <Form.Group controlId="thumbnailFile">
                            <Form.Label>Thumbnail File</Form.Label>
                            <Form.Control type="file" name="thumbnailFile" onChange={handleLessonFileChange} accept=".jpg,.jpeg,.png" />
                        </Form.Group>
                        <Form.Group controlId="subtitleFiles">
                            <Form.Label>Subtitle Files</Form.Label>
                            <Form.Control type="file" name="subtitleFiles" onChange={handleLessonFileChange} multiple accept=".srt,.vtt,.sbv" />
                        </Form.Group>
                        <Form.Group controlId="videoFile">
                            <Form.Label>Video File</Form.Label>
                            <Form.Control type="file" name="videoFile" onChange={handleLessonFileChange} accept=".mp4,.avi,.mov" required />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Add Lesson'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>



            <ToastContainer position="top-end" className='mt-3 me-3'>
                <Toast show={showModal} onClose={() => setShowModal(false)} delay={20000} autohide className="bg-info">
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Create course successfully.</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default CreateLesson;