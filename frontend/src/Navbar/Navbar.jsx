import styles from './Navbar.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    function toggleMenu() {
        setIsMenuOpen((prev) => !prev);
    }
    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.link}>
                GoalShare
            </Link>
            <div className={styles.userSection}>
                <div className={styles.avatar} onClick={toggleMenu}>
                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                {isMenuOpen && (
                    <div className={styles.dropdown}>
                        <p className={styles.userName}>
                            {user?.name || 'User'}
                        </p>
                        <button
                            className={styles.logoutButton}
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
