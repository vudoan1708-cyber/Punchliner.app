/* eslint-disable guard-for-in */

enum CookieSameSite {
  strict = 'strict',
  lax = 'lax',
  none = 'none',
}

interface Cookie {
  domain?: string;
  expires?: number;
  name: string;
  path?: string;
  secure?: boolean;
  sameSite?: CookieSameSite;
  value: string | number | boolean;
}

export const localstore = {
  s: window.localStorage,
  type: 'localStorage',
  set(key, val) {
    this.s.setItem(key, JSON.stringify(val));
    return val;
  },
  get(key) {
    const value = this.s.getItem(key);
    if (typeof value !== 'string') { return undefined; }
    try { return JSON.parse(value); } catch (e) { return value || undefined; }
  },
  remove(key) { this.s.removeItem(key); },
  removeAll() { this.s.clear(); },
  getAll() {
    const ret = {};
    for (let i = 0; i < this.s.length; i += 1) {
      const key = this.s.key(i);
      ret[key] = this.get(key);
    }
    return ret;
  },
};

export const sessionstore = {
  s: window.sessionStorage,
  type: 'sessionStorage',
  set: localstore.set,
  get: localstore.get,
  remove: localstore.remove,
  removeAll: localstore.removeAll,
  getAll: localstore.getAll,
};

interface ICookieStore {
  s: string;
  type: string;
  set({ ...args }: Cookie): void;
  get(arg: string): void;
  processValue(arg: string): void;
  getAllRawOrProcessed(arg: boolean): object;
  getAll(): object;
  remove(arg: string): void;
  removeAll(): object;
}

export const cookiestore: ICookieStore = {
  s: document.cookie,
  type: 'cookie',
  set({
    name,
    value,
    expires,
    path,
    secure = (document.location.protocol === 'https:'),
    sameSite = 'lax',
  }) {
    let valueToUse;
    if (value !== undefined && typeof (value) === 'object') valueToUse = JSON.stringify(value);
    else valueToUse = encodeURIComponent(value);

    document.cookie = `${name}=${valueToUse
    }${expires ? (`; expires=${new Date(expires).toUTCString()}`) : ''
    }; path=${path || '/'
    }; samesite=${sameSite
    }${secure ? '; secure' : ''}`;
  },
  get(name) {
    const cookies = this.getAllRawOrProcessed(false);
    // eslint-disable-next-line no-prototype-builtins
    if (cookies.hasOwnProperty(name)) return this.processValue(cookies[name]);
    return undefined;
  },
  processValue(value) {
    if (value.substring(0, 1) === '{') {
      try { return JSON.parse(value); } catch (e) { return value; }
    }
    if (value === 'undefined') return undefined;
    return decodeURIComponent(value);
  },
  getAllRawOrProcessed(process) {
    // process - process value or return raw value
    const cookies = document.cookie.split('; '); const
      s = {};
    if (cookies.length === 1 && cookies[0] === '') return s;
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i].split('=');
      if (process) s[cookie[0]] = this.processValue(cookie[1]);
      else [ , s[cookie[0]] ] = cookie;
    }
    return s;
  },
  getAll() {
    return this.getAllRawOrProcessed(true);
  },
  remove(name) {
    this.set(name, '', -1);
  },
  removeAll() {
    const cookies = this.getAll();
    // eslint-disable-next-line no-restricted-syntax
    for (const i in cookies) {
      this.remove(i);
    }
    return this.getAll();
  },
};
