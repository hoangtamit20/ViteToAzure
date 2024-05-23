// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button, ListGroup, ListGroupItem, Image, Offcanvas } from 'react-bootstrap';
// import ChatBox from './chatbox';

// const RightMenu = () => {
//     const [chatData, setChatData] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [show, setShow] = useState(false);
//     const [activeChatBoxes, setActiveChatBoxes] = useState({});
//     const [chatBoxes, setChatBoxes] = useState({});
//     const [positions, setPositions] = useState({});
//     const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

//     useEffect(() => {
//         axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/user/get-all-user-chat`, {
//             headers: {
//                 'Authorization': `Bearer ${accessToken}`
//             }
//         })
//             .then(response => {
//                 setUsers(response.data.data);
//             })
//             .catch(error => {
//                 console.error('There was an error!', error);
//             });
//     }, [accessToken]);

//     const toggleShow = () => {
//         setShow(!show);
//     };

//     const handleSendMessage = (userId) => {
//         if (!chatBoxes[userId]) {
//             setChatBoxes(prevState => ({
//                 ...prevState,
//                 [userId]: true
//             }));
//             setActiveChatBoxes(prevState => ({
//                 ...prevState,
//                 [userId]: true
//             }));

//             // Call API to get conversation chats
//             axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/chats/getconversationchats`, { userId }, {
//                 headers: {
//                     'Authorization': `Bearer ${accessToken}`
//                 }
//             })
//                 .then(response => {
//                     // Handle response if needed
//                     console.log(response.data);
//                     setChatData(response.data);
//                 })
//                 .catch(error => {
//                     console.error('Error sending message:', error);
//                 });
//         }
//     };

//     const handleChatBoxClose = (userId) => {
//         setChatBoxes(prevState => ({
//             ...prevState,
//             [userId]: false
//         }));
//         setActiveChatBoxes(prevState => ({
//             ...prevState,
//             [userId]: false
//         }));
//     };

//     useEffect(() => {
//         const newPositions = {};
//         const keys = Object.keys(chatBoxes);
//         keys.forEach((key, index) => {
//             newPositions[key] = {
//                 bottom: `${index * 120}px`,
//                 right: '20px',
//             };
//         });
//         setPositions(newPositions);
//     }, [chatBoxes]);

//     return (
//         <>
//             <Button variant="primary" style={{ position: 'fixed', bottom: '150px', right: '25px', zIndex: '9999' }} onClick={toggleShow}>
//                 <i className="fas fa-comment"></i> Chat
//             </Button>
//             <Offcanvas show={show} onHide={toggleShow} placement='end'>
//                 <Offcanvas.Header closeButton>
//                     <Offcanvas.Title>Right Menu</Offcanvas.Title>
//                 </Offcanvas.Header>
//                 <Offcanvas.Body>
//                     <ListGroup>
//                         {users.map(user => (
//                             <ListGroupItem key={user.userId}>
//                                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                                     <Image
//                                         src={user.picture ? user.picture : "https://www.gmercyu.edu/academics/faculty/_images/maleheadshotprofile.jpeg"}
//                                         roundedCircle
//                                         style={{ width: "45px", height: "45px", objectFit: "cover", marginRight: "10px" }}
//                                     />
//                                     <div>
//                                         <h6>{user.name}</h6>
//                                     </div>
//                                 </div>
//                                 <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                                     <Button
//                                         variant='outline-dark'
//                                         size='sm'
//                                         value={user.userId}
//                                         onClick={() => handleSendMessage(user.userId)}
//                                     >
//                                         Send Message
//                                     </Button>
//                                 </div>
//                             </ListGroupItem>
//                         ))}
//                     </ListGroup>
//                 </Offcanvas.Body>
//             </Offcanvas>
//             <div className='d-flex gap-1 align-items-end' style={{ position: 'fixed', bottom: '0', right: '15px' }}>
//                 {Object.keys(chatBoxes).map(userId => (
//                     chatBoxes[userId] && <ChatBox data={chatData} key={userId} userId={userId} show={activeChatBoxes[userId]} handleClose={handleChatBoxClose} style={positions[userId]} />
//                 ))}
//             </div>
//         </>
//     );
// };

// export default RightMenu;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem, Image, Offcanvas } from 'react-bootstrap';
import ChatBox from './chatbox';

const RightMenu = () => {
    const [groupChatId, setGroupChatId] = useState(null);
    const [users, setUsers] = useState([]);
const [show, setShow] = useState(false);
    const [activeChatBoxes, setActiveChatBoxes] = useState({});
    const [chatBoxes, setChatBoxes] = useState({});
    const [positions, setPositions] = useState({});
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/user/get-all-user-chat`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                setUsers(response.data.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [accessToken]);

    const toggleShow = () => {
        setShow(!show);
    };

    const handleSendMessage = (userId) => {
        console.log(accessToken);
        axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/chats/getorcreategroupchat`, { UserOfGroupChats: [userId] }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                const groupChatId = response.data.data.groupChatId;
                setGroupChatId(groupChatId); // Save groupChatId to pass to ChatBox

                setChatBoxes(prevState => ({
                    ...prevState,
                    [userId]: true
                }));
                setActiveChatBoxes(prevState => ({
                    ...prevState,
                    [userId]: true
                }));
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    };

    const handleChatBoxClose = (userId) => {
        setChatBoxes(prevState => ({
            ...prevState,
            [userId]: false
        }));
        setActiveChatBoxes(prevState => ({
            ...prevState,
            [userId]: false
        }));
    };

    useEffect(() => {
        const newPositions = {};
        const keys = Object.keys(chatBoxes);
        keys.forEach((key, index) => {
            newPositions[key] = {
                bottom: `${index * 120}px`,
                right: '20px',
            };
        });
        setPositions(newPositions);
    }, [chatBoxes]);

    return (
        <>
            <Button variant="primary" style={{ position: 'fixed', bottom: '150px', right: '25px', zIndex: '9999' }} onClick={toggleShow}>
                <i className="fas fa-comment"></i> Chat
            </Button>
            <Offcanvas show={show} onHide={toggleShow} placement='end'>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Right Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ListGroup>
                        {users.map(user => (
                            <ListGroupItem key={user.userId}>
<div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Image
                                        src={user.picture ? user.picture : "https://www.gmercyu.edu/academics/faculty/_images/maleheadshotprofile.jpeg"}
                                        roundedCircle
                                        style={{ width: "45px", height: "45px", objectFit: "cover", marginRight: "10px" }}
                                    />
                                    <div>
                                        <h6>{user.name}</h6>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant='outline-dark'
                                        size='sm'
                                        value={user.userId}
                                        onClick={() => handleSendMessage(user.userId)}
                                    >
                                        Send Message
                                    </Button>
                                </div>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
            <div className='d-flex gap-1 align-items-end' style={{ position: 'fixed', bottom: '0', right: '15px' }}>
                {Object.keys(chatBoxes).map(userId => (
                    chatBoxes[userId] && <ChatBox groupId={groupChatId} key={userId} userId={userId} show={activeChatBoxes[userId]} handleClose={handleChatBoxClose} style={positions[userId]} />
                ))}
            </div>
        </>
    );
};

export default RightMenu;