import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim() || !email.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/members/register', {
        username,
        password,
        email
      });
      
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 중 오류가 발생했습니다:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px', 
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '5px'
    }}>
      <h2>회원가입</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>아이디: </label>
          <input 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>비밀번호: </label>
          <input 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            value={password} 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>이메일: </label>
          <input 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            value={email} 
            type="email"
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/login')}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#f1f1f1', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            로그인 페이지로
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
