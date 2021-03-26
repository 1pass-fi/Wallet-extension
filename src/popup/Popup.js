import React from 'react';
import './Popup.css';

const TechStackLogos = () => {
  return (
    <div className="tech-logos">
      <img className="logo" src="/img/react.svg" alt="ReactJS logo" title="ReactJS" />
      <img className="logo" src="/img/webpack.svg" alt="Webpack logo" title="Webpack" />
      <img className="logo" src="/img/eslint.svg" alt="ESLint logo" title="ESLint" />
      <img className="logo" src="/img/jest.svg" alt="Jest logo" title="Jest" />
    </div>
  );
};

const Popup = () => {
  return (
    <div className="popup">
      <p className="popup-greet">Welcome to Koi</p>
      <TechStackLogos />
    </div>
  );
};


export default Popup;
