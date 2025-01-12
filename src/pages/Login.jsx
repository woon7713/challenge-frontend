import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`로그인 성공! ${data.username}님 환영합니다.`);
        // JWT 토큰을 받아온 경우 localStorage에 저장
        // localStorage.setItem('token', data.token);
      } else {
        alert('로그인 실패!');
      }
    } catch (error) {
      console.error(error);
      alert('에러 발생');
    }
  };

  return (
    <div style={{ margin: '50px' }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username: </label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password: </label>
          <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
