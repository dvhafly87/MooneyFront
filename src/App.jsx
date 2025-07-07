import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@route/AppRouter.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
