import React, { useContext } from 'react';
import { BudgetContext } from '../contexts/BudgetContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { state, dispatch } = useContext(BudgetContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-dark bg-dark px-4 mb-4 shadow d-flex justify-content-between">
            {/* Phần bên trái: Logo + Brand Name */}
            <div className="d-flex align-items-center">
                <img
                    src="logo.png"
                    alt="Logo"
                    style={{ width: '40px', height: '40px', marginRight: '8px' }} // Chỉnh 8px hoặc 5px để gần hơn
                />
                <span className="navbar-brand mb-0 h1">PersonalBudget 💰</span>
            </div>

            {/* Phần bên phải: User Info + Logout */}
            {state.user && (
                <div className="text-light d-flex align-items-center">
                    <span>Signed in as: <strong>{state.user.fullName}</strong></span>
                    <button className="btn btn-sm btn-outline-danger ms-3" onClick={logout}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};
export default Header;