import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, Image } from "react-bootstrap";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import axios from 'axios';
import * as signalR from "@microsoft/signalr";
import { useLoginStatus } from "../../services/authservice";
import { format } from "date-fns";
import './chatbox.css'
import { useUser } from "../../services/usercontext";

const ChatBox = ({ groupId, userId, show, handleClose }) => {
    const [chatData, setChatData] = useState(null);
    const [chatboxOpen, setChatboxOpen] = useState(true);
    const [chatboxMinimized, setChatboxMinimized] = useState(false);
    const [displayEmojiTable, setDisplayEmojiTable] = useState(false);
    const [messages, setMessages] = useState([]);
    const [textValue, setTextValue] = useState('');
    const fileInputRef = useRef(null);

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [error, setError] = useState(null);
    const [displayToast, setDisplayToast] = useState(false);

    const { currentUser } = useUser();
    console.log(currentUser);

    const connectionRef = useRef(null);

    const isLogined = useLoginStatus();

    useEffect(() => {
        if (isLogined) {
            const accessToken = localStorage.getItem('accessToken');
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_APP_API_BASE_URL}/chatHub?access_token=${accessToken}`)
                .withAutomaticReconnect()
                .build();

            connection.on("ReceiveMessage", (message) => {
                console.log(message);
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            connection.start()
                .then(() => {
                    console.log("Connected to the hub");
                    connection.invoke("JoinGroup", groupId);
                })
                .catch((err) => console.error("Connection failed: ", err));

            connectionRef.current = connection;

            return () => {
                connection.stop().then(() => console.log("Disconnected from the hub"));
            };
        }
    }, [isLogined, groupId]);

    useEffect(() => {
        if (groupId) {
            fetchChatData(groupId);
        }
    }, [groupId]);

    const fetchChatData = async (groupId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/chats/${groupId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setChatData(response.data);
            console.log(response.data);
            setMessages(response.data.chatInfoDtos);
        } catch (error) {
            console.error('Error fetching chat data:', error);
        }
    };

    const sendMessage = async () => {
        const message = {
            GroupChatId: groupId,
            MessageText: textValue,
            UploadChatFileModels: uploadedFiles.map(file => ({
                FileUrl: file.fileUrl,
                FileName: file.fileName,
                BlobContainerName: file.blobContainerName,
                FileType: file.fileType,
            })),
            UserId: currentUser.id,
            Name: currentUser.name,
            Picture: currentUser.picture,
            SendDate: new Date()
        };

        try {
            await connectionRef.current.invoke("SendMessage", message);
            setTextValue('');
            setUploadedFiles([]);
        } catch (err) {
            console.error("Error sending message: ", err);
        }
    };

    const handleCloseChatbox = () => {
        setChatboxOpen(false);
    };

    const handleMinimizeChatbox = () => {
        setChatboxMinimized(!chatboxMinimized);
    };

    const handleEmojiSelect = (emoji) => {
        setTextValue((prevMessage) => prevMessage + emoji.native);
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        const formData = new FormData();
        formData.append('GroupChatId', groupId);
        files.forEach((file) => {
            formData.append('Files', file);
        });

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/files/uploadchatfiles`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setUploadedFiles(response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
            setError('Error uploading files');
            setDisplayToast(true);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                const reader = new FileReader();
                reader.onloadend = () => {
                    setMessages([...messages, { type: 'image', content: reader.result }]);
                };
                reader.readAsDataURL(file);
            } else if (item.kind === 'string' && item.type === 'text/plain') {
                item.getAsString((text) => {
                    setTextValue((prevMessage) => prevMessage + text);
                });
            }
        }
    };

    const handleChange = (e) => {
        setTextValue(e.target.value);
    };

    const handleCloseToast = () => {
        setDisplayToast(false);
    };

    return (
        <>
            {chatboxOpen && chatData && (
                <div className="chatbox-container" style={{ maxWidth: "400px", maxHeight: "600px" }}>
                    <Card className='p-0'>
                        <Card.Header className="d-flex justify-content-between align-items-center p-1" style={{ borderTop: "4px solid #ffa900" }}>
                            <h5 className="mb-0">{chatData.groupChatInfoDto.groupChatName}</h5>
                            <div className="d-flex flex-row align-items-center">
                                <span className="badge bg-warning me-3">{messages.length}</span>
                                <button type="button" className="btn btn-outline-secondary me-3" onClick={handleMinimizeChatbox}>
                                    <i className="fas fa-minus"></i>
                                </button>
                                <button type="button" className="btn btn-outline-secondary me-3">
                                    <i className="fas fa-comments"></i>
                                </button>
                                <button type="button" className="btn btn-outline-danger me-3" onClick={() => handleClose(userId)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </Card.Header>
                        {!chatboxMinimized && (
                            <>
                                <Card.Body style={{ position: "relative", height: "400px", overflowY: "auto" }}>
                                    {messages.map((message, index) => (
                                        <div className="message" key={index}>
                                            {message.userId === currentUser.id && message.sendDate && (
                                                <div className="d-flex justify-content-end">
                                                    <p className="small mb-1 me-2 text-muted time-hidden">
                                                        {format(new Date(message.sendDate), 'M-d hh:mm:ssa')}
                                                    </p>
                                                    <p className="small mb-1">{message.name}</p>
                                                </div>
                                            )}
                                            {message.userId !== currentUser.id && message.sendDate && (
                                                <div className="d-flex justify-content-start">
                                                    <p className="small mb-1">{message.name}</p>
                                                    <p className="small ms-2 mb-1 text-muted time-hidden">
                                                        {format(new Date(message.sendDate), 'M-d hh:mm:ssa')}
                                                    </p>
                                                </div>
                                            )}
                                            <div
                                                className={`d-flex flex-row justify-content-${message.userId === currentUser.id ? 'end' : 'start'} mb-4 pt-1`}
                                            >
                                                {message.userId !== currentUser.id && (
                                                    <Image
                                                        roundedCircle
                                                        src={message.picture ? message.picture : "https:www.gmercyu.edu/academics/faculty/_images/maleheadshotprofile.jpeg"}
                                                        alt="avatar"
                                                        style={{ width: "45px", height: "100%" }}
                                                    />
                                                )}
                                                <div>
                                                    {message.messageText && (
                                                        <p
                                                            className={`small p-2 ${message.userId === currentUser.id ? 'me-3' : 'ms-3'} mb-3 text-white rounded-3`}
                                                            style={{
                                                                backgroundColor: `${message.userId === currentUser.id ? '#0dcaf0' : '#adb5bd'}`,
                                                            }}
                                                        >
                                                            {message.messageText}
                                                        </p>
                                                    )}
                                                    {message.UploadChatFileModels &&
                                                        message.UploadChatFileModels.length > 0 &&
                                                        message.UploadChatFileModels.map((file, fileIndex) => (
                                                            <div key={fileIndex} className="file-preview">
                                                                <a href={file.FileUrl} target="_blank" rel="noopener noreferrer">
                                                                    {file.FileName}
                                                                </a>
                                                            </div>
                                                        ))}
                                                </div>
                                                {message.userId === currentUser.id && (
                                                    <Image
                                                        roundedCircle
                                                        src={message.picture ? message.picture : "https:www.gmercyu.edu/academics/faculty/_images/maleheadshotprofile.jpeg"}
                                                        alt="avatar"
                                                        style={{ width: "45px", height: "100%" }}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                    ))}
                                </Card.Body>

                                <Card.Footer className="text-muted d-flex justify-content-start align-items-center p-1">
                                    <Image
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                                        alt="avatar 3"
                                        style={{ width: "45px", height: "100%" }}
                                    />
                                    <div>
                                        <Form.Control
                                            as="textarea"
                                            className="form-control-lg ms-1"
                                            placeholder="Type message"
                                            value={textValue}
                                            onChange={handleChange}
                                            onPaste={handlePaste}
                                        />
                                        <hr className='p-0 m-1' />
                                    </div>
                                    <Form.Control
                                        type="file"
                                        className="form-control-lg ms-1"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                        ref={fileInputRef}
                                    />
                                    <Button variant="link" className="text-muted ms-1" onClick={() => fileInputRef.current.click()}>
                                        <i className="fas fa-paperclip"></i>
                                    </Button>
                                    <div className='position-relative'>
                                        <Button variant="link" className="text-muted ms-1" onClick={() => setDisplayEmojiTable(!displayEmojiTable)}>
                                            {displayEmojiTable ? <i className="fa-solid fa-face-smile" style={{ color: "#FFC107" }}></i> : <i className="fa-regular fa-face-smile"></i>}
                                        </Button>
                                        {displayEmojiTable && (
                                            <div className='position-absolute' style={{ bottom: '45px', right: '0', zIndex: '99' }}>
                                                <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="link" className="ms-1" onClick={sendMessage}>
                                        <i className="fas fa-paper-plane"></i>
                                    </Button>
                                </Card.Footer>
                            </>
                        )}
                    </Card>
                </div>
            )}
            {displayToast && <ToastError error={error} onClose={handleCloseToast} />}
        </>
    );
};

export default ChatBox;