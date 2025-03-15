import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: '#4CAF50',
      padding: '1rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
        게시판
      </Link>
      
      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>{user.username}님 환영합니다</span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'white',
                color: '#4CAF50',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              to="/login"
              style={{
                color: '#4CAF50',
                backgroundColor: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              로그인
            </Link>
            <Link
              to="/register"
              style={{
                color: '#4CAF50',
                backgroundColor: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header; 