import { ToastContainer, Toast, Button, Container, Form, Nav, NavDropdown, Navbar, Image } from "react-bootstrap";
import NotificationPopover from "./notificationpoper";
import MessagePoper from "./messagepoper";
import LikePoper from "./likepoper";
import UserDetailPoper from "./userdetailpoper";
import * as signalR from '@microsoft/signalr';
import { useEffect, useState } from "react";
import { useLoginStatus } from "../../services/authservice";
import OrderCart from "./ordercart";
import { useUser } from "../../services/usercontext";

function NavBarTop() {
    const [notificationCount, setNotificationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const [showNotificationToast, setShowNotificationToast] = useState(false);
    const [showMessageToast, setShowMessageToast] = useState(false);
    const [notificationToastMessage, setNotificationToastMessage] = useState('');
    const [messageToastMessage, setMessageToastMessage] = useState('');
    const [hubConnection, setHubConnection] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { currentUser } = useUser();

    const isLogined = useLoginStatus();

    useEffect(() => {
        if (isLogined) {
            const accessToken = localStorage.getItem('accessToken');
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_APP_API_BASE_URL}/chatHub?access_token=${accessToken}`)
                .withAutomaticReconnect()
                .build();
            setHubConnection(connection);
        }
    }, [isLogined]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Điều hướng đến trang kết quả tìm kiếm
        window.location.href = `/search?q=${searchQuery}`;
    };

    useEffect(() => {
        if (hubConnection) {
            hubConnection.start()
                .then(() => console.log('SignalR Connected'))
                .catch(err => console.error('SignalR Connection Error: ', err));

            hubConnection.on('ReceiveCombinedNotification', (combinedNotification) => {
                console.log(combinedNotification);
                setNotificationToastMessage(combinedNotification.toastMessage);
                setShowNotificationToast(true);
                setMessageCount(combinedNotification.UnreadMessagesCount);
                setNotificationCount(combinedNotification.UnreadNotificationsCount);
            });

            return () => {
                hubConnection.stop()
                    .then(() => console.log('SignalR Disconnected'))
                    .catch(err => console.error('SignalR Disconnection Error: ', err));
            };
        }
    }, [hubConnection]);

    return (
        <>
            <Navbar expand="lg" style={{ backgroundColor: '#D6DEF4' }} fixed="top">
                <Container fluid>
                    <div className="d-flex align-items-center">
                        <Navbar.Brand href="/">
                            <Image
                                src="https://yt3.googleusercontent.com/ytc/AGIKgqNI016vg9pzPI9j_WgKSpOokYwHk8nW3wc7Ypuf=s900-c-k-c0x00ffffff-no-rj"
                                width="50"
                                height="50"
                                roundedCircle
                                className="d-inline-block align-top"
                                style={{ objectFit: 'cover' }}
                                alt="Logo"
                            />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                                <Nav.Link href="#action1">Home</Nav.Link>
                                <Nav.Link href="#action2">Link</Nav.Link>
                                <NavDropdown title="Link" id="navbarScrollingDropdown">
                                    <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action4">
                                        Another action
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action5">
                                        Something else here
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link href="#" disabled>
                                    Link
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </div>

                    <div className="d-flex align-items-center mx-3">
                        <Form className="d-flex me-2" onSubmit={handleSearch}>
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center me-2">
                            <NotificationPopover notfiCount={notificationCount} />
                        </div>
                        <div className="d-flex align-items-center me-2">
                            <MessagePoper messageCount={messageCount} />
                        </div>
                        <div className="d-flex align-items-center me-2">
                            <LikePoper />
                        </div>
                        {/* Thêm icon giỏ hàng vào đây */}
                        <div className="d-flex align-items-center me-2">
                            <OrderCart />
                        </div>
                        {isLogined ? (
                            <div className="d-flex align-items-center me-2">
                                <UserDetailPoper />
                            </div>
                        ) : (
                            <div className="d-flex align-items-center">
                                <a href="/login" className="btn btn-outline-dark me-2">Login</a>
                                <span className="me-2"> / </span>
                                <a href="/register" className="btn btn-outline-dark">Sign Up</a>
                            </div>
                        )}
                    </div>
                </Container>
            </Navbar>


            <ToastContainer position="bottom-end" className='mt-3 me-3'>
                <Toast show={showNotificationToast} onClose={() => setShowNotificationToast(false)} delay={20000} autohide className="bg-info">
                    <Toast.Header>
                        <strong className="me-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>{notificationToastMessage}</Toast.Body>
                </Toast>
                <Toast show={showMessageToast} onClose={() => setShowMessageToast(false)} delay={5000} autohide className="bg-info">
                    <Toast.Header>
                        <strong className="me-auto">Message</strong>
                    </Toast.Header>
                    <Toast.Body>{messageToastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
}

export default NavBarTop;
