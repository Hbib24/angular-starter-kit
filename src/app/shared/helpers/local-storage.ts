export class LocalStorage {
  static setAuthToken(token: string): void {
    this.setItem('token:auth', token);
  }

  static getAuthToken(): string | null {
    return this.getItem('token:auth');
  }

  static clearAuthToken(): void {
    this.removeItem('token:auth');
  }

  static setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  static getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
