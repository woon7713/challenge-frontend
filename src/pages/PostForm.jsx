import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  // 게시글 작성 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = {
      title,
      content,
      memberId: 1, // 작성자 ID (임시로 1번 member 고정)
    };

    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        alert('게시글 작성 완료!');
        navigate('/'); // 작성 후 게시글 목록으로 이동
      } else {
        alert('게시글 작성 실패!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('에러 발생!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>새 게시글 작성</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}

export default PostForm;
