import { useEffect, useState } from 'react';
import viteLogo from '../../../public/vite.svg';
import reactLogo from '../../assets/react.svg';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { isTokenValid, sendApiRequest } from '../../services/apiservice';
import { Link } from 'react-router-dom';

function HomePage() {
    const [count, setCount] = useState(0);

    const [isLoggedIn, setIsLoggedIn] = useState(false); // New state

    useEffect(() => {
        const checkTokenValidity = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const isValid = await isTokenValid(token);
                if (!isValid) {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const response = await sendApiRequest(`https://localhost:7209/api/v1/auth/refresh-token`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                refreshToken: refreshToken,
                            }),
                        });
                        const refreshData = await response.json();
                        if (refreshData.isSuccess) {
                            localStorage.setItem('accessToken', refreshData.data.accessToken);
                            setIsLoggedIn(true);
                        } else {
                            setIsLoggedIn(false);
                        }
                    } else {
                        setIsLoggedIn(false);
                    }
                } else {
                    setIsLoggedIn(true);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        checkTokenValidity();
    }, []);

    const login = () => {
        // Add your login logic here
        setIsLoggedIn(true);
    };


    const logoutCurrentDevice = async () => {
        const response = await fetch('https://localhost:7209/api/v1/auth/logout-current-device', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (response.ok) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsLoggedIn(false);
            // Redirect user to login page or show a message
        }
    };

    const logoutAllDevices = async () => {
        const response = await fetch('https://localhost:7209/api/v1/auth/logout-all-device', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (response.ok) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsLoggedIn(false);
            // Redirect user to login page or show a message
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <>
                    <button className='btn btn-sm btn-outline-secondary' onClick={logoutCurrentDevice}>Logout Current Device</button>
                    <button className='btn btn-sm btn-outline-danger' onClick={logoutAllDevices}>Logout All Devices</button>
                </>
            ) : (
                <Link to="/login" className='btn btn-sm btn-outline-primary' onClick={login}>Login</Link>
            )}
            <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    );
}


export default HomePage;