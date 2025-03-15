import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header';

import PostList from './pages/PostList';
import PostForm from './pages/PostForm';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* 회원 관련 페이지 */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 게시판 관련 페이지 */}
        <Route path="/" element={<PostList />} /> 
        <Route path="/post/new" element={<PostForm />} />   
        <Route path="/post/:postId" element={<PostDetail />} /> 
        <Route path="/post/edit/:postId" element={<PostForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
