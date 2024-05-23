import { useState, useEffect } from 'react';
import { ListGroup, Image } from 'react-bootstrap';
import LogOutCurrentDevice from '../auth/logoutcurrentdevice';
import LogOutAllDevices from '../auth/logoutalldevice';
import { useUser } from '../../services/usercontext';

const UserDetailPoper = () => {
    const [urlImageProfile, setUrlImageProfile] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [clickedPosition, setClickedPosition] = useState({ x: 0, y: 0 });
    const [listPosition, setListPosition] = useState({ top: 0, right: 0 });
    const { setCurrentUser } = useUser();

    useEffect(() => {
        const fetchUserBaseInfo = async () => {
            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/user/get-user-base-info`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            const data = await response.json();
            if (data.isSuccess) {
                setCurrentUser(data.data);
                if (data.data.picture) {
                    setUrlImageProfile(data.data.picture);
                }
                else {
                    setUrlImageProfile("https://www.gmercyu.edu/academics/faculty/_images/maleheadshotprofile.jpeg");
                }
            }
        };

        fetchUserBaseInfo();
    }, []);

    const toggleNotifications = (event) => {
        const rect = event.target.getBoundingClientRect();
        setClickedPosition({ x: rect.left, y: rect.bottom + 5 });
        setShowNotifications(!showNotifications);
    };

    useEffect(() => {
        const updateListPosition = () => {
            const bellRect = document.getElementById('imageProfile').getBoundingClientRect();
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
            <Image id="imageProfile"
                src={urlImageProfile}
                onClick={toggleNotifications}
                roundedCircle
                className="me-0 position-relative border border-1"
                style={{ cursor: 'pointer', width: '50px', height: '50px', objectFit: 'cover' }} />
            {showNotifications && (
                <div className="position-absolute" style={{ ...listPosition }}>
                    <div className="bg-light rounded p-2"
                        style={{ width: '300px', maxHeight: '600px', overflowY: 'auto', overflowX: 'auto' }}>
                        <ListGroup>
                            <ListGroup.Item className='p-0'>
                                <LogOutCurrentDevice />
                            </ListGroup.Item>
                            <ListGroup.Item className='p-0'>
                                <LogOutAllDevices />
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetailPoper;