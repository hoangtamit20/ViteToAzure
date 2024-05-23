import { useEffect, useState } from 'react';
import { isTokenValid, sendApiRequest } from './apiservice';

export function useLoginStatus() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkTokenValidity = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const isValid = await isTokenValid(token);
                if (!isValid) {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const response = await sendApiRequest(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/auth/refresh-token`, {
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
                            localStorage.clear();
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

    return isLoggedIn;
}