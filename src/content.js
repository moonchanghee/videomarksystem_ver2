/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import App from './App';
import { message, Button } from 'antd';
import 'antd/dist/antd.css';
import { element } from 'prop-types';

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

// const tagname = document.getElementsByTagName('iframe')[1];
// let mainframe = tagname.contentWindow?.document
//   .getElementsByTagName('div')[0]
//   .getElementsByTagName('iframe')[0];
// let mainframe2 =
//   mainframe?.contentWindow?.document.getElementsByTagName('iframe')[0];

ReactDOM.render(<Main />, app);
let test;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('fst');
  console.log('request1', request);
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
  console.log('클릭');
  let playButton = document.getElementsByClassName(
    'vc-front-screen-btn-container'
  )[0];
  playButton.addEventListener('click', () => {
    console.log('dd');
  });
  playButton.click();

  // playButton.click();
  console.log('playButton', playButton);
});

setTimeout(() => {
  console.log('settimeout');
  test2 = document
    .getElementsByClassName('vc-vplay-video1')[0]
    .getAttribute('src');
  console.log(test2);
  app.style.display = 'block';
  console.log(document.body);
  document.body.innerHTML = '';
  document.body.appendChild(app);
  console.log(document.body);
  videosrc = test2;
}, 3000);

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   // window.open(mainframe2.getAttribute('src'));
//   console.log('request2', request);
//   if (request.message === 'clicked_browser_action') {
//     // console.log('쿠ㅡ릭');
//     let playButton = document.getElementsByClassName(
//       'vc-front-screen-play-btn'
//     )[0];
//     console.log(playButton);
//     playButton.click();
//     setTimeout(() => {
//       test2 = document
//         .getElementsByClassName('vc-vplay-video1')[0]
//         .getAttribute('src');
//       console.log(test2);
//       app.style.display = 'block';
//       console.log(document.body);
//       document.body.innerHTML = '';
//       document.body.appendChild(app);
//       console.log(document.body);
//       videosrc = test2;
//     }, 3000);
//     // toggle();
//   }
// });
