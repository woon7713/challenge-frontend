import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api';

function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams(); // URL에서 postId 파라미터 가져오기
  
  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      
      if (!token || !user) {
        setIsLoggedIn(false);
        navigate('/login', { 
          state: { from: location.pathname },
          replace: true 
        });
        return;
      }
      setIsLoggedIn(true);
    };

    checkLoginStatus();
  }, [navigate, location]);
  
  // 수정 모드인 경우 기존 게시글 정보 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        setIsEdit(true);
        try {
          setLoading(true);
          const response = await api.get(`/api/posts/${postId}`);
          const post = response.data;
          setTitle(post.title);
          setContent(post.content);
          setError(null);
        } catch (err) {
          console.error('게시글을 불러오는 중 오류가 발생했습니다:', err);
          setError('게시글을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPost();
  }, [postId]);

  // 게시글 작성 또는 수정 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const post = {
      title,
      content
    };

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        alert('로그인이 필요하거나 세션이 만료되었습니다.');
        navigate('/login');
        return;
      }

      post.memberId = user.id;
      setLoading(true);
      setError(null);
      
      let response;
      
      if (isEdit) {
        // 게시글 수정
        response = await api.put(`/api/posts/${postId}`, post);
        alert('게시글이 수정되었습니다.');
      } else {
        // 새 게시글 작성
        response = await api.post('/api/posts', post);
        alert('게시글이 작성되었습니다.');
      }
      
      // 작성/수정된 게시글 상세 페이지로 이동
      navigate(`/post/${isEdit ? postId : response.data.id}`);
    } catch (error) {
      console.error('게시글 처리 중 오류가 발생했습니다:', error);
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요하거나 세션이 만료되었습니다.');
        navigate('/login');
      } else if (error.response && error.response.status === 403) {
        alert('게시글을 수정할 권한이 없습니다.');
      } else {
        setError('게시글 처리에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <p>게시글을 불러오는 중...</p>;
  }

  if (!isLoggedIn) {
    return <p>로그인 페이지로 이동 중...</p>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '800px', 
      margin: '0 auto',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '5px'
    }}>
      <h1>{isEdit ? '게시글 수정' : '새 게시글 작성'}</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <label style={{ display: 'block', marginBottom: '5px' }}>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ 
              width: '100%', 
              minHeight: '300px', 
              padding: '10px',
              boxSizing: 'border-box',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          ></textarea>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            type="submit"
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '처리 중...' : (isEdit ? '수정하기' : '작성하기')}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(isEdit ? `/post/${postId}` : '/')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#f1f1f1', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
