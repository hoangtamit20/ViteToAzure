import { useState, useEffect } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { Bell } from 'react-bootstrap-icons';

const NotificationPoper = ({ notfiCount }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [clickedPosition, setClickedPosition] = useState({ x: 0, y: 0 });
    const [listPosition, setListPosition] = useState({ top: 0, right: 0 });

    const toggleNotifications = (event) => {
        const rect = event.target.getBoundingClientRect();
        setClickedPosition({ x: rect.left, y: rect.bottom + 5 });
        setShowNotifications(!showNotifications);
        setNotificationCount(0);
    };


    useEffect(() => {
        setNotificationCount(notfiCount);
    });

    useEffect(() => {
        const updateListPosition = () => {
            const bellRect = document.getElementById('bellIcon').getBoundingClientRect();
            const rightSpace = window.innerWidth - bellRect.right;
            if (rightSpace < 400) {
                setListPosition({ top: bellRect.bottom + 5, right: 15 });
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

    return (
        <div className="position-relative">
            <a className='btn btn-outline-secondary border border-0' >
                <Bell id="bellIcon"
                    onClick={toggleNotifications}
                    className="me-0 position-relative" style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
            </a>
            {notificationCount > 0 &&
                <Badge bg="danger" className="position-absolute top-0 end-0 translate-middle-y">
                    {notificationCount}
                </Badge>
            }
            {showNotifications && (
                <div className="position-absolute" style={{ ...listPosition }}>
                    <div className="bg-light rounded p-2" style={{ maxWidth: '350px', maxHeight: '600px', overflowY: 'auto' }}>
                        <ListGroup>
                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                Some news <Badge bg="danger">New</Badge>
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPoper;