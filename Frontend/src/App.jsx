import { useState, useEffect, useRef } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import { gsap } from 'gsap';

import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [selectedLevel, setSelectedLevel] = useState(null); 
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState(``);
  const [showReviewPage, setShowReviewPage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const [hasChosenLevel , setHasChosenLevel] = useState(false);


  useEffect(() => {
    prism.highlightAll();
  }, [review]);

  // ... rest of your code remains unchanged





  const handleGetStarted = () => {
    setShowPopup(true);
    setTimeout(() => {
      gsap.fromTo(popupRef.current,
        { opacity: 0, y: -50, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );
    }, 50);
  };

const chooseLevel = (level) => {
 console.log("User selected:", level);
  
  setSelectedLevel(level); 
   setHasChosenLevel(true);       
  setShowPopup(false);          

  setTimeout(() => {
    setShowReviewPage(true);    
  }, 300);
};


 async function reviewCode() {
  if (!selectedLevel) {
    alert("Please select your skill level first.");
    return;
  }

 
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/ai/get-review`, { code, level: selectedLevel });
  setReview(response.data);
}

  async function ExplainCode() {
   const response = await axios.post(`${process.env.REACT_APP_API_URL}/ai/explain-code`, { code, level: selectedLevel });

    setReview(response.data);
  }

  const backToLanding = () => {
    setShowReviewPage(false);
  };

  return (
    <>
      {/* ===== Skill Level Popup ===== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content" ref={popupRef}>
            <h2>Choose Your Skill Level</h2>
            <div className="levels">
              <button className="level-btn" onClick={() => chooseLevel("Beginner")}>🟢 Beginner</button>
              <button className="level-btn" onClick={() => chooseLevel("Intermediate")}>🟡 Intermediate</button>
              <button className="level-btn" onClick={() => chooseLevel("Advanced")}>🔴 Advanced</button>
            </div>
            <button className="close-popup" onClick={() => setShowPopup(false)}>✖</button>
          </div>
        </div>
      )}

      {!showReviewPage ? (
        // ===== Landing Page =====
        <div className="landing-page">
          <nav className="navbar">
            <div className="logo">AI Code Reviewer</div>
            <div className="nav-links">
              <a href="#">Home</a>
              <a href="#">Docs</a>
              <a href="#">About</a>
            </div>
          </nav>

          <div className="intro">
            <div className="intro-text">
              <h1>💡 AI Code Reviewer</h1>
              <p>Get expert-level feedback on your code. Fast. Reliable. Intelligent.</p>
              <button className="get-started" onClick={handleGetStarted}>🚀 Get Started</button>
            </div>
            <div className="intro-img">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWjgUlnju-mY3Llc9IfNFsU-DNkxk-WXVLcA&s" alt="Coding" />
            </div>
          </div>

          <footer className="footer">
            <p>© 2025 AI Code Reviewer. All rights reserved.</p>
          </footer>
        </div>
      ) : (
        // ===== Code Review Page =====
        <main className="main-layout">
          <div className="editor-panel">
            <div className="header">
              <h2>Code Editor</h2>
              <button className="back-btn" onClick={backToLanding}>← Back</button>
            </div>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={12}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 15,
                backgroundColor: '#1e1e1e',
                color: '#f8f8f2',
                borderRadius: '8px',
                height: '550px', width: '550px',
                overflowY: 'auto'
              }}
            />
            <button className="review-btn" onClick={reviewCode}>🧠 Review Code</button>
            <button className="review-btn" onClick={ExplainCode}>🧠 Explain Code</button>
          </div>

          <div className="review-panel">
            <h2>AI Review</h2>
            <div className="review-box">
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default App;
