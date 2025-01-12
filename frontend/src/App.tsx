import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BasePage from './pages/BasePage';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import AdminArticleManager from './pages/AdminArticleManager';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ArticleDisplay from './pages/ArticleDisplay';
import ArticlePoster from './pages/ArticlePoster';
import AllArticles from './pages/AllArticles';
import AllVideos from './pages/AllVideos';
import AllInterviews from './pages/AllInterviews';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BasePage />} >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          
          <Route path="article/:articleId" element={<ArticleDisplay />} />
          <Route path="all-articles" element={<AllArticles />} /> 
          <Route path="all-videos" element={<AllVideos />} />     
          <Route path="all-interviews" element={<AllInterviews />} />     

          <Route path="login" element={<Login />} />
          
          <Route path="*" element={<PageNotFound />} />

          {/* Anything here needs auth access */}
          <Route path="article-manager" element={<ProtectedRoute element={<AdminArticleManager />} />} />
          <Route path="article-poster" element={<ProtectedRoute element={<ArticlePoster edit={false} />} />} />
          <Route path="article-manager/edit/:articleId" element={<ProtectedRoute element={<ArticlePoster edit={true} />} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
