import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "./CSS/ArticlePoster.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import api, { postArticle, getTags } from "../components/api/Api";
import TagSelector from "../components/frontend_util/TagSelector";

const ArticlePoster = ({ edit }: { edit: boolean }) => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const [success, setSuccess] = useState(true);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    if (edit) {
      api.get(`/article/${articleId}`)
      .then((response) => {
        setTitle(response.data.title);
        setSelectedTags(response.data.tags);
        setEditorState(
          EditorState.createWithContent(
            convertFromRaw(JSON.parse(response.data.content))
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
    }
    getTags().then((res) => setAvailableTags(res));
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

  const handleModifyTags = () => {

  }

  const submitArticle = async () => {
    const formData = {
      title,
      content: convertToRaw(editorState.getCurrentContent()),
      thumbnail,
      selectedTags
    };

    try {
      const articleId = await postArticle(formData);
      if (articleId) {
        navigate(`/article/${articleId}`);
      }
    } catch (error) {
      console.error(error);
      setSuccess(false);
    }
  };

  return (
    <div className="article-poster">
      <div className="article-content">
        <div className="title-and-description">
          <h2>Create An Article!</h2>
          <p>Here you can create/edit an article.</p>
        </div>

        <div className="setproperties-container">
          <label>Post title:</label>
          <input
            value={title}
            className="title-input"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="setproperties-container">
          <label>Upload Thumbnail:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </div>

        {TagSelector({selectedTags, setSelectedTags})}

        <div className="editor-content">
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            editorClassName="form-control blog-editor"
          />
        </div>

        <div className="save-post-container">
          <button className="submitButton" onClick={submitArticle}>
            <span>Submit</span>
          </button>
        </div>

        {!success && (
          <p style={{ color: "red" }}>There was an error. Contact Paul.</p>
        )}
      </div>
    </div>
  );
};

export default ArticlePoster;
