import React, { useEffect } from "react";


const About = () => {
  
  useEffect(() => {
    document.title = 'Not Found';
  }, []);

  return <div className="about">
    This is the About page!
  </div>
}

export default About;