import { useState, useEffect } from 'react';
import { ListGroup, Badge, Row, Col, Button, Image } from 'react-bootstrap';
import { Heart } from 'react-bootstrap-icons';

const LikePoper = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [clickedPosition, setClickedPosition] = useState({ x: 0, y: 0 });
    const [listPosition, setListPosition] = useState({ top: 0, right: 0 });
    const [favoriteCourses, setFavoriteCourses] = useState([]);

    const toggleNotifications = (event) => {
        const rect = event.target.getBoundingClientRect();
        setClickedPosition({ x: rect.left, y: rect.bottom + 5 });
        setShowNotifications(!showNotifications);
        setNotificationCount(0);
    };

    useEffect(() => {
        const fetchFavoriteCourses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/favoritecourse/getalls`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                    }
                });
                const data = await response.json();
                if (data.isSuccess) {
                    setFavoriteCourses(data.data);
                } else {
                    console.error('Failed to fetch favorite courses:', data.message);
                }
            } catch (error) {
                console.error('Error fetching favorite courses:', error);
            }
        };

        if (showNotifications) {
            fetchFavoriteCourses();
        }

    }, [showNotifications]);

    useEffect(() => {
        const updateListPosition = () => {
            const likeRect = document.getElementById('likeIcon').getBoundingClientRect();
            const rightSpace = window.innerWidth - likeRect.right;
            if (rightSpace < 400) {
                setListPosition({ top: likeRect.bottom + 5, right: 15 });
            } else {
                setListPosition({ top: clickedPosition.y, left: clickedPosition.x });
            }
        };

        if (showNotifications) {
            updateListPosition();
            window.addEventListener('resize', updateListPosition);
        }

        return () => {
            window.removeEventListener('resize', updateListPosition);
        };
    }, [showNotifications]);

    const handleRemove = async (favoriteCourseId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/favoritecourse/removefavoritecourses`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    favoriteCourseIds: [favoriteCourseId]
                })
            });
            const data = await response.json();
            if (data.isSuccess) {
                // Remove the course from the list if successfully deleted
                setFavoriteCourses(prevCourses => prevCourses.filter(course => course.favoriteCourseId !== favoriteCourseId));
            } else {
                console.error('Failed to remove favorite course:', data.message);
            }
        } catch (error) {
            console.error('Error removing favorite course:', error);
        }
    };

    const handleAdd = () => {
        console.log('Add item');
    };

    const handleDelete = () => {
        console.log('Delete item');
    };

    return (
        <div className="position-relative">
            <a className='btn btn-outline-secondary border border-0' >
                <Heart id="likeIcon"
                    onClick={toggleNotifications}
                    className="me-0 position-relative" style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
            </a>
            <Badge bg="danger" className="position-absolute top-0 end-0 translate-middle-y">
                {notificationCount}
            </Badge>
            {showNotifications && (
                <div className="position-absolute" style={{ ...listPosition }}>
                    <div className="bg-light rounded p-2" style={{ width: '300px', maxHeight: '650px', overflowY: 'auto', overflowX: 'auto' }}>
                        <ListGroup>
                            {favoriteCourses.map(course => (
                                <ListGroup.Item key={course.favoriteCourseId} className='p-1'>
                                    <Row>
                                        <Col xs={4}>
                                            <div style={{ width: '90px', height: '80px' }}>
                                                <Image src={course.thumbnail} rounded className="w-100 h-100" />
                                            </div>
                                        </Col>
                                        <Col xs={5} className='text-start'>
                                            <h6 className="mb-1" style={{ fontSize: '14px' }}>{course.courseName}</h6>
                                            <p className="mb-1" style={{ fontSize: '10px', color: '#777' }}>{course.ownerName}</p>
                                            <p className="mb-1" style={{ fontSize: '13px', color: '#999' }}>Price: <span className="text-success">${course.price}</span></p>
                                        </Col>
                                        <Col xs={2}>
                                            <button className="btn btn-link" onClick={() => handleRemove(course.favoriteCourseId)}>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                            <button className="btn btn-link" onClick={handleAdd}>
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LikePoper;