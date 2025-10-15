import React, { useState, useEffect } from "react";
import { Backdrop } from "@mui/material";
import "./Loader.css";

const Loader = () => {
  const texts = ["Blessings are on the way…", "Loading....."]; // cycle texts
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0); // current text index
  const [subIndex, setSubIndex] = useState(0); // current letter index
  const [deleting, setDeleting] = useState(false);

  const typingSpeed = 100; // speed per letter
  const eraseSpeed = 50; // erase speed
  const pause = 1000; // pause before erase / next text

  useEffect(() => {
    if (index >= texts.length) {
      setIndex(0);
    }

    if (subIndex === texts[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }

    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? eraseSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, texts]);

  useEffect(() => {
    setDisplayText(texts[index].substring(0, subIndex));
  }, [subIndex, index, texts]);

  return (
    <Backdrop
      sx={{
        backgroundColor: "#ffffff80",
        zIndex: 1305,
      }}
      open={true}
    >
      <div className="spiritual-loader">
        <div className="loader-wrapper">
          <div className="loader-aura"></div>
          <span className="loader-om">ॐ</span>
        </div>
        <p className="loader-text">
          {displayText}
          <span className="cursor">|</span>
        </p>
      </div>
    </Backdrop>
  );
};

export default Loader;