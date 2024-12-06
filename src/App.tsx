import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BasePage from './pages/BasePage';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import Contact from './pages/Contact';
import Updates from './pages/Updates';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasePage />} >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="updates" element={<Updates />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
