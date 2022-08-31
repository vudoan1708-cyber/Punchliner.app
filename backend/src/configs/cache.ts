import NodeCache from "node-cache";
import { JWT_EXPIRATION_IN_SECOND } from "../shared/expiration";

const _cache = new NodeCache();

interface ICacheManager {
  setUserJWT(userId: string, jwt: string): void;
  hasJWT(userId: string, tokenBody?: string): boolean;
  removeJWT(userId: string): string | undefined;
}

function CacheManager(): ICacheManager {
  return {
    setUserJWT(userId: string, jwt: string) {
      _cache.set(userId, jwt, JWT_EXPIRATION_IN_SECOND);
      return;
    },
    hasJWT(userId: string, tokenBody?: string) {
      const jwt = _cache.get(userId);
      if (!jwt) return false;
      return jwt === tokenBody;
    },
    removeJWT(userId: string) {
      return _cache.take(userId);
    },
  };
}

export default CacheManager();
