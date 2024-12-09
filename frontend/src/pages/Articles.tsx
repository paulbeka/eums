import React, { useEffect } from "react";


const Articles = () => {

  useEffect(() => {
    document.title = 'Articles';
  }, []);

  return <div className="articles">
    This is the Articles page!
  </div>
}

export default Articles;