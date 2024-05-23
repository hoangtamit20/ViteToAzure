import { Button } from "react-bootstrap";
import { BoxArrowRight } from "react-bootstrap-icons";



function LogOutAllDevices() {


    const logoutAllDevices = async () => {
        const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/auth/logout-all-device`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (response.ok) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // setIsLoggedIn(false);
            // Redirect user to login page or show a message
            window.location.reload();
        }
    };

    return (
        <Button className="w-100 p-2 border border-0 text-start" 
            variant="outline-danger"
            size="sm"
            onClick={logoutAllDevices}>
            <BoxArrowRight className="me-2" /> Log Out All Devices
        </Button>
    );
}

export default LogOutAllDevices;