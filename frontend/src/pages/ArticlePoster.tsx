import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "./CSS/ArticlePoster.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import api, { postArticle } from "../components/api/Api";

const ArticlePoster = ({ edit }: { edit: boolean }) => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    if (edit) {
      api
        .get(`/article/${articleId}`)
        .then((response) => {
          setTitle(response.data.title);
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

  const submitArticle = async () => {
    const formData = {
      title,
      content: convertToRaw(editorState.getCurrentContent()),
      thumbnail,
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
