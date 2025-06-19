import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CSS/ArticlePoster.css";
import api, { postArticle, editArticle, getTags } from "../components/api/Api";
import TagSelector from "../components/frontend_util/TagSelector";

const ArticlePoster = ({ edit }: { edit: boolean }) => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [success, setSuccess] = useState(true);
  const [error, setError] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    getTags().then((res) => setAvailableTags(res));
    if (edit) {
      api.get(`/article/${articleId}`)
      .then((response) => {
        setTitle(response.data.title);
        setSelectedTags(response.data.tags.map((item: any) => item.tag));
        setEditorState(JSON.parse(response.data.content));
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }, [articleId, edit]);

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64String = result.split(",")[1]; 
        setThumbnail(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateArticle = () => {
    if (title.trim() === "") {
      setSuccess(false);
      setError("Title cannot be empty.");
    }
    if (editorState.trim() === "") {
      setSuccess(false);
      setError("Content cannot be empty.");
    }
    if (thumbnail === null) {
      setSuccess(false);
      setError("Thumbnail cannot be empty.");
    }
    if (getNumberOfWords(editorState) > 3000) {
      setSuccess(false);
      setError("Content exceeds the maximum word limit of 3000.");
    }
    if (getNumberOfWords(title) > 10) {
      setSuccess(false);
      setError("Title exceeds the maximum word limit of 10.");
    }
    if (selectedTags.length === 0) {
      setSuccess(false);
      setError("At least one tag must be selected.");
    }
    if (selectedTags.length > 5) {
      setSuccess(false);
      setError("You can select a maximum of 5 tags.");
    }
    return true;
  };

  const submitArticle = async () => {
    if (!validateArticle()) return;
    
    const formData = {
      title,
      content: editorState,
      thumbnail,
      selectedTags
    };

    try {
      const idResponse = edit ? await editArticle(articleId!, formData) : await postArticle(formData);
      if (idResponse) {
        navigate(`/article/${idResponse}`);
      }
    } catch (error) {
      console.error(error);
      setSuccess(false);
    }
  };

  const getNumberOfWords = (str: string) => {
    return str.split(" ").filter(value => value !== "").length;
  }

  let numberOfWords = getNumberOfWords(editorState);
  return (
    <div className="article-poster">
      <div className="article-content">
        <div className="title-and-description">
          <h2>Create An Article!</h2>
          <p>Here you can create/edit an article.</p>
        </div>

        <div className="setproperties-container">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>Post title:</p>
            <p style={{
              color: `${getNumberOfWords(title) > 10 ? "red" : ""}`
            }}>{getNumberOfWords(title)}/10</p>
          </div>
          <input
            value={title}
            className="title-input"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <br />

        <div className="setproperties-container">
          <label>Upload Thumbnail (choose a landscape image, ie bigger width smaller height is best):</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </div>

        {TagSelector({selectedTags, setSelectedTags})}

        <div className="article-content-metadata">
          <h3>Article Content</h3>
          <p style={{
            color: `${numberOfWords > 3000 ? "red" : ""}`
          }}>{numberOfWords}/3000 words</p>
        </div>
        <textarea 
          className="editor-content" 
          value={editorState}
          onChange={(e) => setEditorState(e.target.value)}
        />

        <div className="save-post-container">
          <button className="submitButton" onClick={submitArticle}>
            <span>{edit ? "Edit" : "Post"}</span>
          </button>
        </div>

        {!success && (
          <p style={{ color: "red" }}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default ArticlePoster;
