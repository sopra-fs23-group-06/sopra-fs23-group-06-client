import React from "react";
import ReactDOM from "react-dom";
import "styles/index.scss";
import App from "App";
import { BackgroundProvider } from "./helpers/BackgroundContext.js";


const updateBodyBackground = (selectedBackground) => {
    document.body.style.background = `url("../styles/images/backgrounds/${selectedBackground}.png"), linear-gradient(135deg, #3b9496 10%, #1b373a 100%)`;
    document.body.style.backgroundSize = `cover`;  
};
  
updateBodyBackground('skully_bg1');
/**
 * This is the entry point of your React application where the root element is in the public/index.html.
 * We call this a “root” DOM node because everything inside it will be managed by React DOM.
 * Applications built with just React usually have a single root DOM node.
 * More: https://reactjs.org/docs/rendering-elements.html
 */
ReactDOM.render(
    <React.StrictMode>
      <BackgroundProvider>
        <App />
      </BackgroundProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );