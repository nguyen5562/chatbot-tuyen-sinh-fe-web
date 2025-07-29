export function login(fullname: any, role: any, token: any) {
  localStorage.setItem('user', fullname);
  localStorage.setItem('role', role);
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return !!localStorage.getItem('user');
}

export function isAdmin() {
  return localStorage.getItem('role') === 'admin';
} 