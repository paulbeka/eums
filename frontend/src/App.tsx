import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BasePage from './pages/BasePage';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import Contact from './pages/Contact';
import Articles from './pages/Articles';
import About from './pages/About';
import VotingData from './pages/VotingData';
import Login from './pages/Login';
import AdminArticleManager from './pages/AdminArticleManager';
import ProtectedRoute from './components/auth/ProtectedRoute';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasePage />} >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="articles" element={<Articles />} />
          <Route path="votingdata" element={<VotingData />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />

          {/* Anything here needs auth access */}
          <Route
            path="article-manager"
            element={<ProtectedRoute element={<AdminArticleManager />} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
