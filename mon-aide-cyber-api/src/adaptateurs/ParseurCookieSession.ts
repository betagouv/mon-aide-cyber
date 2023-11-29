export type CookieDeSession = { token: string };

export interface ParseurCookieSession {
  parse(cookie: string): CookieDeSession;
}
