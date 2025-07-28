import { useContext } from 'react';
import AuthContext from './AuthContext.jsx';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
};

export default useAuth;
