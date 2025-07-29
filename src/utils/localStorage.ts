export function login(fullname: any, role: any, token: any, userId: any) {
  localStorage.setItem('user', fullname);
  localStorage.setItem('role', role);
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
}

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
}

export function isLoggedIn() {
  return !!localStorage.getItem('user');
}

export function isAdmin() {
  return localStorage.getItem('role') === 'admin';
} 