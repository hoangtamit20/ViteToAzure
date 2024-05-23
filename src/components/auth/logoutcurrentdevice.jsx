import { Button } from "react-bootstrap";
import { Power } from "react-bootstrap-icons";

function LogOutCurrentDevice() {
    const logoutCurrentDevice = async () => {
        const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/auth/logout-current-device`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (response.ok) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // setIsLoggedIn(false);
            // 
            window.location.reload();
        }
    };
    return (
        <Button className="w-100 p-2 border border-0 text-start" 
            variant="outline-secondary"
            size="sm"
            onClick={logoutCurrentDevice}>
            <Power className="me-2" /> Log Out Current Device
        </Button>
    );
}

export default LogOutCurrentDevice;