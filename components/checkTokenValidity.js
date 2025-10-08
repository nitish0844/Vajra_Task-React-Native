import { refreshToken } from '@/services/refreshtokenCall.service';
import useAuthStore from '@/store/authStore';
import { isJwtExpired } from '@/utils/helper-utils';

/**
 * Check Token Validity
 * This function checks if the token is valid or refreshes it if expired.
 */
export const checkTokenValidity = async () => {
  const authState = useAuthStore.getState();
  const { auth, saveAuth, logout } = authState;

  if (!auth?.access_token || isJwtExpired(auth?.access_token)) {
    try {
      const newAuthData = await refreshToken();
      if (newAuthData?.data?.access_token) {
        saveAuth({
          ...auth,
          access_token: newAuthData?.data?.access_token,
        });
        return true; // ✅ Token refreshed successfully
      } else {
        return false; // ❌ Token refresh failed
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false; // ❌ Token refresh failed
    }
  }
  
  return true; // ✅ Token is valid
};
