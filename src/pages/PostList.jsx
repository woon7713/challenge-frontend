import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);

  // 게시글 목록 가져오기
  useEffect(() => {
    fetch('http://localhost:8080/api/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>게시글 목록</h1>
      <Link to="/post/new">➕ 새 게시글 작성하기</Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`}>{post.title}</Link>
            <p>작성자: {post.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;
