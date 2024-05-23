import { jwtDecode } from "jwt-decode";

export function checkIfUserIsAdmin() {
    const token = localStorage.getItem('accessToken'); // replace 'token' with the key you used to store the token
    if (!token) return false;

    try {
        const decodedToken = jwtDecode(token);
        const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        return roles.includes('Admin');
    } catch (error) {
        console.error('Failed to decode token:', error);
        return false;
    }
}
