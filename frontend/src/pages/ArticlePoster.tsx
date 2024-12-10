import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js'
import "./CSS/ArticlePoster.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { postArticle } from "../components/api/Api";
import { useNavigate } from "react-router-dom";


// this page is only adapted to desktop
const ArticlePoster = () => {

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [success, setSuccess] = useState(true);

  const submitArticle = () => {
    postArticle({
      title: title,
      content: convertToRaw(editorState.getCurrentContent())
    }).then(articleId => {
      if (articleId) {
        navigate(`/article/${articleId}`);
      }
      setSuccess(false);
    })
  }

  return (
    <div className="article-poster">
      <div className="article-content">
        <div className="title-and-description">
          <h2>Create An Article!</h2>
          <p>Here you can create/edit an article.</p>  
        </div>

        <div className="setproperties-container">
          <label>Post title:</label>
          <input className="title-input" type="text" onChange={e => setTitle(e.target.value)} />
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
        {success ? <></> : 
          <p style={{color: "red"}}>There was an error. Contact Paul.</p>
        }
      </div>
    </div>
  )
}

export default ArticlePoster;