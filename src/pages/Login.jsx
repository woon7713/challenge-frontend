import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user) {
      // 이전 페이지가 있으면 그곳으로, 없으면 홈으로
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setMessage('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('');
      
      const response = await api.post('/api/members/login', { username, password });
      
      if (!response.data || !response.data.token) {
        throw new Error('로그인 응답이 올바르지 않습니다.');
      }
      
      // 백엔드에서 응답한 token과 member 정보 추출
      const { token, member } = response.data;
      // JWT 토큰과 사용자 정보를 localStorage에 저장
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(member));
      
      // 이전 페이지가 있으면 그곳으로, 없으면 홈으로
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('로그인 중 오류가 발생했습니다:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setMessage('로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.');
        } else if (error.response.status === 400) {
          setMessage(error.response.data.message || '입력 정보를 확인해주세요.');
        } else {
          setMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else if (error.message) {
        setMessage(error.message);
      } else {
        setMessage('서버 연결에 실패했습니다. 인터넷 연결을 확인해주세요.');
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
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>로그인</h2>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: message.includes('환영합니다') ? '#e8f5e9' : '#ffebee',
          color: message.includes('환영합니다') ? '#2e7d32' : '#c62828',
          borderRadius: '4px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>아이디: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              boxSizing: 'border-box',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>비밀번호: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              boxSizing: 'border-box',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '12px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontSize: '16px'
          }}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>계정이 없으신가요? <Link to="/register" style={{ color: 'blue' }}>회원가입</Link></p>
      </div>
    </div>
  );
};

export default Login;
