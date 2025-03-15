import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function PostDetail() {
  const { postId } = useParams(); // URL의 postId 파라미터 가져오기
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 게시글 상세 조회 API 호출
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        // 게시글 정보 가져오기
        const postResponse = await api.get(`/api/posts/${postId}`);
        setPost(postResponse.data);
        
        // 댓글 정보 가져오기
        const commentsResponse = await api.get(`/api/comments/post/${postId}`);
        setComments(commentsResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  // 게시글 삭제
  const handleDelete = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await api.delete(`/api/posts/${postId}`);
      alert('게시글이 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('게시글 삭제 중 오류가 발생했습니다:', error);
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요하거나 세션이 만료되었습니다.');
        navigate('/login');
      } else if (error.response && error.response.status === 403) {
        alert('게시글을 삭제할 권한이 없습니다.');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await api.post('/api/comments', {
        content: newComment,
        postId: postId,
        memberId: 1 // 실제로는 로그인한 사용자의 ID를 사용해야 합니다
      });
      
      // 새 댓글을 목록에 추가
      setComments([...comments, response.data]);
      setNewComment(''); // 입력 필드 초기화
    } catch (error) {
      console.error('댓글 작성 중 오류가 발생했습니다:', error);
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요하거나 세션이 만료되었습니다.');
        navigate('/login');
      } else {
        alert('댓글 작성에 실패했습니다.');
      }
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await api.delete(`/api/comments/${commentId}`);
      // 삭제된 댓글을 목록에서 제거
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 중 오류가 발생했습니다:', error);
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요하거나 세션이 만료되었습니다.');
        navigate('/login');
      } else if (error.response && error.response.status === 403) {
        alert('댓글을 삭제할 권한이 없습니다.');
      } else {
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <p>데이터를 불러오는 중...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!post) {
    return <p>게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{post.title}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <p>작성자: {post.username}</p>
        <p>조회수: {post.viewCount}</p>
      </div>
      
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '5px',
        minHeight: '200px',
        marginBottom: '20px'
      }}>
        {post.content}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <button onClick={() => navigate('/')}>목록으로</button>
        {isLoggedIn && (
          <div>
            <button 
              onClick={() => navigate(`/post/edit/${postId}`)}
              style={{ 
                backgroundColor: '#2196F3', 
                color: 'white',
                marginRight: '10px',
                padding: '8px 15px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              수정하기
            </button>
            <button 
              onClick={handleDelete} 
              style={{ 
                backgroundColor: '#ff6b6b', 
                color: 'white',
                padding: '8px 15px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div style={{ marginTop: '30px' }}>
        <h3>댓글 ({comments.length})</h3>
        
        {/* 댓글 작성 폼 */}
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '20px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 작성해주세요"
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              rows="3"
            />
            <button type="submit">댓글 작성</button>
          </form>
        ) : (
          <p>댓글을 작성하려면 <a href="/login" style={{ color: 'blue' }}>로그인</a>이 필요합니다.</p>
        )}
        
        {/* 댓글 목록 */}
        {comments.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {comments.map((comment) => (
              <li key={comment.id} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #eee',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{comment.username}</strong>
                  {isLoggedIn && (
                    <button 
                      onClick={() => handleCommentDelete(comment.id)}
                      style={{ 
                        backgroundColor: 'transparent', 
                        border: 'none',
                        color: 'red',
                        cursor: 'pointer'
                      }}
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p>{comment.content}</p>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
