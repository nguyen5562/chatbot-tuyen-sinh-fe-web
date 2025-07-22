export function login(username: string, password: string) {
  // Giả lập: nếu username là 'admin' thì role là admin
  const role = username === 'admin' ? 'admin' : 'user';
  localStorage.setItem('user', username);
  localStorage.setItem('password', password);
  localStorage.setItem('role', role);
}

export function register(username: string, password: string) {
  // Giả lập: chỉ lưu vào localStorage
  localStorage.setItem('user', username);
  localStorage.setItem('password', password);
  localStorage.setItem('role', 'user');
}

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('password');
  localStorage.removeItem('role');
}

export function isLoggedIn() {
  return !!localStorage.getItem('user');
}

export function isAdmin() {
  return localStorage.getItem('role') === 'admin';
} 