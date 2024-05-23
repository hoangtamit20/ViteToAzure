import { useState, useEffect } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { CartCheck } from 'react-bootstrap-icons';

const OrderCart = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [clickedPosition, setClickedPosition] = useState({ x: 0, y: 0 });
    const [listPosition, setListPosition] = useState({ top: 0, right: 0 });
    const [cartItems, setCartItems] = useState([]);

    const toggleNotifications = (event) => {
        const rect = event.target.getBoundingClientRect();
        setClickedPosition({ x: rect.left, y: rect.bottom + 5 });
        setShowNotifications(!showNotifications);
        setNotificationCount(0);
    };

    useEffect(() => {
        const updateListPosition = () => {
            const cartRect = document.getElementById('cartIcon').getBoundingClientRect();
            const rightSpace = window.innerWidth - cartRect.right;
            if (rightSpace < 400) {
                setListPosition({ top: cartRect.bottom + 5, right: 15 });
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
    }, [showNotifications, clickedPosition]);

    useEffect(() => {
        // Call API to fetch cart items
        const fetchCartItems = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/carts/mycartitem`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                });
                const data = await response.json();
                if (data.isSuccess) {
                    setCartItems(data.data);
                } else {
                    console.error('Failed to fetch cart items');
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    return (
        <div className="position-relative">
            <a className='btn btn-outline-secondary border border-0'>
                <CartCheck id="cartIcon"
                    onClick={toggleNotifications}
                    className="me-0 position-relative" style={{ cursor: 'pointer', fontSize: '1.5rem' }} />
            </a>
            <Badge bg="danger" className="position-absolute top-0 end-0 translate-middle-y">
                {notificationCount}
            </Badge>
            {showNotifications && (
                <div className="position-absolute" style={{ ...listPosition }}>
                    <div className="bg-light rounded p-2" style={{ maxWidth: '350px', maxHeight: '600px', overflowY: 'auto' }}>
                        <ListGroup>
                            {cartItems.map((item, index) => (
                                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <img src={item.thumbnail} alt={item.courseName} style={{ width: '50px', height: 'auto', marginRight: '10px' }} />
                                        {item.courseName}
                                    </div>
                                    <Badge bg="primary">${item.price}</Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCart;