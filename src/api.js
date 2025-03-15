// fetch API를 사용하는 API 클라이언트

// 프록시를 사용하므로 상대 경로로 설정
const BASE_URL = '';

// API 요청 함수들
const api = {
  // GET 요청
  async get(url, params = {}) {
    // URL 쿼리 파라미터 생성
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const requestUrl = `${BASE_URL}${url}${queryString ? `?${queryString}` : ''}`;
    
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  },
  
  // POST 요청
  async post(url, body = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status, data: errorData };
      throw error;
    }
    
    const data = await response.json();
    return { data };
  },
  
  // PUT 요청
  async put(url, body = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status, data: errorData };
      throw error;
    }
    
    const data = await response.json();
    return { data };
  },
  
  // DELETE 요청
  async delete(url) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(`HTTP error! Status: ${response.status}`);
      error.response = { status: response.status, data: errorData };
      throw error;
    }
    
    if (response.status === 204) {
      return { data: null };
    }
    
    const data = await response.json();
    return { data };
  }
};

export default api;
