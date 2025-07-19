import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './route/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { TOAST_CONTAINER_CONFIG } from './utils/toast';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />

          {/* 중앙 집중식 Toast 설정 사용 */}
          <ToastContainer {...TOAST_CONTAINER_CONFIG} />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
