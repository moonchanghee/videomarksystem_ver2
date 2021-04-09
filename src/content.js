/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import App from "./App";
class Main extends React.Component {
    render() {
        return (
            <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>,<link href="videojs.markers.plugin.css" rel="stylesheet"/>, <link href="https://cdnjs.cloudflare.com/ajax/libs/videojs-markers/0.7.0/videojs.markers.css" rel="stylesheet"></link>, <link href="//vjs.zencdn.net/6.1.0/video-js.css" rel="stylesheet"></link>]}> 
               <FrameContextConsumer>
               {
                  ({document, window}) => {
                    return <App document={document} window={window} hi = {hi} isExt={true}/> 
                  }
                }
                </FrameContextConsumer>
            </Frame>
        )
    }
}

const app = document.createElement('div');
app.id = "my-extension-root";
const hi = "hi"
document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";
app.style.width = "40%"

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
        toggle();
      }
   }
);

function toggle(){
   if(app.style.display === "none"){
     app.style.display = "block";
   }else{
     app.style.display = "none";
   }
}
