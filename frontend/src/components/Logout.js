import { useEffect, useContext } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Logout(){
    const { setUserContext } = useContext(UserContext); 
    useEffect(() => {
        async function logout(){
            try {
                const response = await fetch("http://localhost:3001/users/logout", { credentials: 'include' }); // Include credentials to send the cookie
                if (response.ok) {
                    // If the logout was successful, clear the user context
                    setUserContext(null);
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('An error occurred while logging out:', error);
            }
        }
        logout();
    }, [setUserContext]);

    return (
        <Navigate replace to="/" />
    );
}

export default Logout;
