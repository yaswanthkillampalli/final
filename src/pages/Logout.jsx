import { useEffect } from "react";
import { logoutUser } from "../api/axiosInstance";

export default function Logout() {
    useEffect(() => {
        logoutUser();
    }, []);

    return (
        <div className="container text-center mt-5">
            <h2>Logging out...</h2>
            <p>You will be redirected shortly.</p>
        </div>
    );
}
