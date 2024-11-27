import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BasePage from './pages/BasePage';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasePage />} >
          <Route index element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
