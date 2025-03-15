import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const pageSize = 10; // 페이지당 게시글 수
  
  // URL 쿼리 파라미터에서 페이지 정보 가져오기
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 0;
    const keyword = params.get('keyword') || '';
    
    setCurrentPage(page);
    setSearchKeyword(keyword);
    
    // 로그인 상태 확인
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location.search]);

  // 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let response;
        
        if (searchKeyword) {
          // 검색어가 있는 경우 검색 API 호출
          response = await api.get('/api/posts/search', {
            keyword: searchKeyword,
            page: currentPage,
            size: pageSize
          });
        } else {
          // 일반 페이징 API 호출
          response = await api.get('/api/posts/page', {
            page: currentPage,
            size: pageSize
          });
        }
        
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        console.error('게시글을 불러오는 중 오류가 발생했습니다:', err);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchKeyword]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    params.set('page', newPage);
    
    if (searchKeyword) {
      params.set('keyword', searchKeyword);
    }
    
    navigate(`?${params.toString()}`);
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    params.set('page', 0); // 검색 시 첫 페이지로 이동
    
    if (searchKeyword) {
      params.set('keyword', searchKeyword);
    }
    
    navigate(`?${params.toString()}`);
  };

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    const pages = [];
    const maxPageButtons = 5;
    const startPage = Math.max(0, Math.min(currentPage - Math.floor(maxPageButtons / 2), totalPages - maxPageButtons));
    const endPage = Math.min(startPage + maxPageButtons, totalPages);
    
    // 이전 페이지 버튼
    if (currentPage > 0) {
      pages.push(
        <button 
          key="prev" 
          onClick={() => handlePageChange(currentPage - 1)}
          style={paginationButtonStyle}
        >
          이전
        </button>
      );
    }
    
    // 페이지 번호 버튼
    for (let i = startPage; i < endPage; i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)}
          style={{
            ...paginationButtonStyle,
            backgroundColor: i === currentPage ? '#4CAF50' : '#f1f1f1',
            color: i === currentPage ? 'white' : 'black'
          }}
        >
          {i + 1}
        </button>
      );
    }
    
    // 다음 페이지 버튼
    if (currentPage < totalPages - 1) {
      pages.push(
        <button 
          key="next" 
          onClick={() => handlePageChange(currentPage + 1)}
          style={paginationButtonStyle}
        >
          다음
        </button>
      );
    }
    
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        {pages}
      </div>
    );
  };

  // 스타일 정의
  const paginationButtonStyle = {
    margin: '0 5px',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '2px solid #4CAF50',
        paddingBottom: '10px'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>게시글 목록</h1>
        {isLoggedIn && (
          <Link 
            to="/post/new"
            style={{
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            새 게시글 작성
          </Link>
        )}
      </div>
      
      {!isLoggedIn && (
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '15px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <p style={{ margin: 0 }}>게시글을 작성하려면 로그인이 필요합니다.</p>
          <Link 
            to="/login" 
            style={{ 
              color: 'white', 
              backgroundColor: '#2196F3',
              padding: '8px 15px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            로그인하기
          </Link>
        </div>
      )}
      
      {/* 검색 폼 */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex' }}>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="제목 또는 내용 검색"
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '4px 0 0 4px',
            border: '1px solid #ddd',
            borderRight: 'none',
            fontSize: '14px'
          }}
        />
        <button 
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          검색
        </button>
      </form>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <p>게시글을 불러오는 중...</p>
        </div>
      )}
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '15px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <>
          {searchKeyword && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              padding: '10px 15px',
              borderRadius: '4px',
              marginBottom: '15px'
            }}>
              <p style={{ margin: 0 }}>
                <strong>"{searchKeyword}"</strong> 검색 결과
              </p>
              <button 
                onClick={() => {
                  setSearchKeyword('');
                  navigate('?page=0');
                }}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f1f1f1',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                검색 초기화
              </button>
            </div>
          )}
          
          {posts.length > 0 ? (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f1f1' }}>
                    <th style={tableHeaderStyle}>번호</th>
                    <th style={tableHeaderStyle}>제목</th>
                    <th style={tableHeaderStyle}>작성자</th>
                    <th style={tableHeaderStyle}>조회수</th>
                    <th style={tableHeaderStyle}>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={tableCellStyle}>{post.id}</td>
                      <td style={{ ...tableCellStyle, textAlign: 'left' }}>
                        <Link 
                          to={`/post/${post.id}`}
                          style={{ color: '#333', textDecoration: 'none' }}
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td style={tableCellStyle}>{post.username}</td>
                      <td style={tableCellStyle}>{post.viewCount}</td>
                      <td style={tableCellStyle}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <Pagination />
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '50px 20px', 
              backgroundColor: '#f9f9f9', 
              borderRadius: '8px',
              border: '1px dashed #ddd'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <svg 
                  width="64" 
                  height="64" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#9e9e9e" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              
              <h3 style={{ color: '#616161', marginBottom: '15px', fontWeight: 'normal' }}>
                아직 게시글이 없습니다
              </h3>
              
              <p style={{ 
                marginBottom: '25px', 
                fontSize: '14px', 
                color: '#757575',
                maxWidth: '400px',
                margin: '0 auto 25px'
              }}>
                {isLoggedIn 
                  ? '첫 번째 게시글을 작성해보세요!' 
                  : '로그인 후 첫 번째 게시글을 작성할 수 있습니다.'}
              </p>
              
              {isLoggedIn ? (
                <Link 
                  to="/post/new"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  첫 게시글 작성하기
                </Link>
              ) : (
                <Link 
                  to="/login"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  로그인하기
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// 테이블 스타일
const tableHeaderStyle = {
  padding: '10px',
  borderBottom: '2px solid #ddd',
  textAlign: 'center'
};

const tableCellStyle = {
  padding: '10px',
  textAlign: 'center'
};

export default PostList;
