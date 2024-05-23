const apiUrl = import.meta.env.VITE_APP_API_BASE_URL;


// This function is used to send API requests. It takes two parameters: the URL of the API endpoint (url) and the options for the fetch request (options).
export async function sendApiRequest(url, options) {
    // The function starts by sending the API request using the provided URL and options.
    const response = await fetch(url, options);

    // If the server responds with a 401 status (Unauthorized), this usually means that the access token has expired.
    if (response.status === 401) {
        // In this case, the function sends a request to the refresh token API endpoint.
        const refreshResponse = await fetch(`${apiUrl}/api/v1/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The body of the request contains the current refresh token, which is retrieved from local storage.
            body: JSON.stringify({
                refreshToken: localStorage.getItem('refreshToken'),
            }),
        });

        // The response from the refresh token request is then converted to JSON.
        const refreshData = await refreshResponse.json();

        // If the refresh token request is successful, the function updates the access token in local storage.
        if (refreshData.isSuccess) {
            localStorage.setItem('accessToken', refreshData.data.accessToken);

            // The function then retries the original API request with the new access token.
            options.headers['Authorization'] = 'Bearer ' + refreshData.data.accessToken;
            return fetch(url, options);
        } else {
            // If the refresh token request fails, the function throws an error.
            throw new Error('Failed to refresh token: ' + refreshData.errors.join(', '));
        }
    }

    // If the server responds with a status other than 401, the function returns the response from the original API request.
    return response;
}


// Test access token is valid
export async function isTokenValid(token) {
    const response = await fetch(`${apiUrl}/api/Helper/TestAuthAc`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    return response.status !== 401;
}

