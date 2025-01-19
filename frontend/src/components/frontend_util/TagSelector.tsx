import React, { useEffect, useState } from "react";
import { getTags } from "../api/Api";

const TagSelector = ({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(""); 
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  useEffect(() => {
    getTags().then((res) => setAvailableTags(res));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    setFilteredTags(
      availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !selectedTags.includes(tag)
      )
    );
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTags((prevTags: string[]) => [...prevTags, tag]);
    setInputValue("");
    setFilteredTags([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (filteredTags.length > 0) {
        handleSelectTag(filteredTags[0]); // Select the first filtered tag
      } else if (inputValue.trim() !== "") {
        handleSelectTag(inputValue.trim()); // Add the current input as a new tag
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags((prevTags: string[]) =>
      prevTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <div className="article-poster-set-tags-container">
      <label>Tags:</label>
      <div className="tag-input-wrapper">
        <div className="selected-tags">
          {selectedTags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <button onClick={() => handleRemoveTag(tag)} className="remove-tag">
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Add a tag..."
        />
        {filteredTags.length > 0 || inputValue.trim() !== "" ? (
          <ul className="dropdown">
            {filteredTags.map((tag) => (
              <li key={tag} onClick={() => handleSelectTag(tag)}>
                {tag}
              </li>
            ))}
            {inputValue.trim() !== "" && !filteredTags.includes(inputValue) && (
              <li onClick={() => handleSelectTag(inputValue.trim())}>
                Add "{inputValue.trim()}"
              </li>
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default TagSelector;
