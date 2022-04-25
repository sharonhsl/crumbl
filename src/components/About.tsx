import React from 'react';
import './About.css';

const AboutCrumbl = () => {
  return (
    <div className="aboutstyle">
      <p>Crumbl monitors web requests and records all domains a tab communicates with, then calculates the total number of cookies that the relevant domains store on your browser.
        <br></br>
        <br></br>
        Learn more about cookies on <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank">Wikipedia: HTTP COOKIES</a>.</p>
    </div>
  )
}

export default AboutCrumbl;
