import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PostDetail() {
  const { postId } = useParams(); // URL의 postId 파라미터 가져오기
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  // 게시글 상세 조회 API 호출
  useEffect(() => {
    fetch(`http://localhost:8080/api/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error('Error fetching post:', error));
  }, [postId]);

  // 게시글 삭제
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('게시글 삭제 완료!');
        navigate('/');
      } else {
        alert('삭제 실패!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('에러 발생!');
    }
  };

  if (!post) {
    return <p>게시글을 불러오는 중...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>작성자: {post.username}</p>
      <button onClick={handleDelete}>삭제하기</button>
    </div>
  );
}

export default PostDetail;
