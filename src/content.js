/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import App from './App';
import { message, Button } from 'antd';
import 'antd/dist/antd.css';

class Main extends React.Component {
  render() {
    return (
      <Frame
        frameborder="0"
        className="frame"
        width="1200px"
        height="3000px"
        head={[
          <link
            type="text/css"
            rel="stylesheet"
            href={chrome.runtime.getURL('/static/css/content.css')}
          ></link>,
          <link href="videojs.markers.plugin.css" rel="stylesheet" />,
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/videojs-markers/0.7.0/videojs.markers.css"
            rel="stylesheet"
          ></link>,
          <link
            href="//vjs.zencdn.net/6.1.0/video-js.css"
            rel="stylesheet"
          ></link>,
          <link
            href="https://players.brightcove.net/videojs-overlay/2/videojs-overlay.min.js"
            rel="stylesheet"
          ></link>,
          <link
            href="https://players.brightcove.net/videojs-overlay/2/videojs-overlay.css"
            rel="stylesheet"
          ></link>,
          <link
            href="path/to/videojs-overlay-hyperlink.css"
            rel="stylesheet"
          ></link>,
          <link
            href="https://cdn.ckeditor.com/4.16.0/standard/ckeditor.js"
            rel="stylesheet"
          ></link>,
        ]}
      >
        <FrameContextConsumer>
          {({ document, window }) => {
            return (
              <App
                document={document}
                window={window}
                videosrc={videosrc}
                isExt={true}
              />
            );
          }}
        </FrameContextConsumer>
      </Frame>
    );
  }
}

const app = document.createElement('div');
app.id = 'my-extension-root';
let test2;
let videosrc;

app.style.display = 'none';
app.style.width = '100%';
app.style.height = '100%';

ReactDOM.render(<Main />, app);
let test;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  test = request.message;
  const tagname = document.getElementsByTagName('iframe')[1];
  let mainframe = tagname.contentWindow?.document
    .getElementsByTagName('div')[0]
    .getElementsByTagName('iframe')[0];
  let mainframe2 =
    mainframe?.contentWindow?.document.getElementsByTagName('iframe')[0];
  window.open(mainframe2.getAttribute('src'));
});

setTimeout(() => {
  let playButton = document.getElementsByClassName(
    'vc-front-screen-play-btn'
  )[0];
  playButton.click();
}, 500);

setTimeout(() => {
  let playButton = document.getElementsByClassName(
    'vc-front-screen-play-btn'
  )[0];
  test2 = document
    .getElementsByClassName('vc-vplay-video1')[0]
    .getAttribute('src');
  app.style.display = 'block';
  document.body.innerHTML = '';
  document.body.appendChild(app);
  videosrc = test2;
}, 4000);
