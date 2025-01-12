import React, { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });
      if (response.ok) {
        alert('회원가입 성공!');
      } else {
        alert('회원가입 실패!');
      }
    } catch (error) {
      console.error(error);
      alert('에러');
    }
  };

  return (
    <div style={{ margin: '50px' }}>
      <h2>회원가입</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username: </label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password: </label>
          <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Email: </label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Register;
