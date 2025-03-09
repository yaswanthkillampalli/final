import { Link } from "react-router-dom";
import { logoutUser } from "../api/axiosInstance";

export default function ProfilePopupMenu() {
    return (
        <div className="dropdown">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Profile
            </button>
            <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                <li><Link className="dropdown-item" to="/published">Published</Link></li>
                <li><Link className="dropdown-item" to="/liked">Liked</Link></li>
                <li><Link className="dropdown-item" to="/saved">Saved</Link></li>
                <li><Link className="dropdown-item" to="/change-password">Change Password</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={logoutUser}>Logout</button></li>
            </ul>
        </div>
    );
}
