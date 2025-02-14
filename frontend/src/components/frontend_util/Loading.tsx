import "./CSS/Loading.css";

const Loading = () => {
  return (
    <div style={{ margin: "auto auto", height: "100%", minHeight: "100px" }} className="loading-container">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );
};

export default Loading;
