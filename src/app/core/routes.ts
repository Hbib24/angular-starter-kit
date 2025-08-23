export const PUBLIC_ROUTES = {
  LOGIN: 'auth/login',
} as const;

export const ROUTES = {
  ...PUBLIC_ROUTES,
  HOME: '',
} as const;
