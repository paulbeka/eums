import React, { useEffect } from 'react';


const PageNotFound = () => {

  useEffect(() => {
    document.title = 'Not Found';
  }, []);

  return (
    <div>
      Page not found.
    </div>
  )
}

export default PageNotFound;