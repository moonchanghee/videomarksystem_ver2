import React, { useRef, useState, useEffect, useMemo } from 'react';
import regeneratorRuntime from 'regenerator-runtime';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import videojs from 'video.js';
import 'videojs-markers';
import Axios from 'axios';
import { Input, Button, Spin, Alert, Switch } from 'antd';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

const { TextArea } = Input;

const App = ({ hi }) => {
  const [markers, setmarkers] = useState([{}]);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const videoPlayerRef = useRef(null); // Instead of ID
  const text = useRef(null); // Instead of ID
  const [currentTime, setCurrentTime] = useState(null);
  // const videoSrc = `../${Video.fileName}`;
  // const videoSrc ="https://dongseo.commonscdn.com/contents3/dongseol01/606c570419ce9/contents/media_files/mobile/ssmovie.mp4"
  const [currentVal, setCurrentVal] = useState(0);
  const [memotime, setMemotime] = useState();
  const [Values, setValues] = useState();
  const [newMarkers, setNewMarkers] = useState([{}]);
  const [player, setPlayer2] = useState();
  const [dbData, setDbData] = useState([{}]);
  const [memoBool, setMemoBool] = useState(false);
  //////////////
  const [inputtest, setInputest] = useState();
  const [inputdata, setinputdata] = useState();

  ////
  const videoJSOptions = {
    autoplay: true,
    controls: true,
    // width: 500,
    // height: 500,
    userActions: { hotkeys: true },
    playbackRates: [0.5, 1, 1.5, 2],
  };

  let id;

  useEffect(() => {
    console.log('dddddddddddd');
    function sibal() {
      Axios.get('http://localhost:3002/marker')
        .then((e) => {
          return setDbData(e.data.markers);
        })
        .then((e) => console.log('성공'));
    }
    sibal();

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      return null;
    }

    if (videoPlayerRef.current) {
      let player = videojs(videoPlayerRef.current, videoJSOptions, () => {
        player.src(hi);
        player.on('ended', () => {
          console.log('ended');
        });
        player.on('play', function () {
          console.log(markers);
          console.log(newMarkers);
          //  id = Axios.get('/marker').then(async e => {return e}).then(e => {return e.data.markers})
          // id = await Axios.get('/marker').then(async e => {return e.data.markers})
        });

        player.on('timeupdate', function () {
          setCurrentTime(player.currentTime());
        });

        player.on('pause', function () {
          //현재 비디오 정지 체크
          // console.log(id[0].time)
          // console.log("stop")
          var isPaused = player.paused();
          if (isPaused) {
            //정지 되었다면 현재 멈춘만큼의 시간을 체크해서 저장.
            setCurrentVal(Number(player.cache_.currentTime));
          }
          return false;
        });

        // player.overlay({
        //   overlays: [
        //     {
        //       content: 'dddddddddddddddddddddddd',
        //       // This overlay appears at 3 seconds and disappears at 15 seconds.
        //       start: 3,
        //       end: 15,
        //     },
        //     {
        //       content: 'dddddddddddddddddddddddd',
        //       // This overlay appears at 7 seconds and disappears at 22 seconds.
        //       start: 7,
        //       end: 22,
        //       align: 'bottom',
        //     },
        //   ],
        // });
        // player.markers.
      });

      setPlayer2(player);
      player.markers({
        markerStyle: {
          width: '7px',
          'border-radius': '30%',
          'background-color': 'red',
        },
        markerTip: {
          display: true,
          text: function (markers) {
            return '제목: ' + markers.text;
          },
          time: function (markers) {
            return markers.time;
          },
        },
        // breakOverlay: {
        //   display: true,
        //   displayTime: 3,
        //   style: {
        //     width: '100%',
        //     height: '20%',
        //     'background-color': 'red',
        //     color: 'white',
        //     'font-size': '17px',
        //   },
        //   text: function (markers) {
        //     return 'Break overlayddddddd: ' + markers.overlayText;
        //   },
        // },
        onMarkerClick: function (marker) {
          console.log('Ddddddddddddddddddd');
        },
        onMarkerReached: function (marker) {
          setValues(marker.val);
        },

        markers: [],
      });

      let dd = inputtest;
      console.log(id);
    }
  }, []);

  const checkc = () => {
    console.log('저장저장');
    console.log(hi);
    player.markers.add([
      {
        time: player.cache_.currentTime,
        text: 'Dddddddd',
        val: inputtest,
      },
    ]);
  };

  const InsertMemo = () => {
    setMemoBool(true);
    setMemotime(currentVal);
  };

  const test = (e) => {
    setInputest(e.currentTarget.value);
    console.log(inputtest);
  };

  const dbOn = () => {
    console.log(dbData);
    dbData.map((e) => {
      return player.markers.add([
        {
          time: e.time,
          text: 'Dddddddd',
          val: e.val,
        },
      ]);
    });
  };

  const memocheck = () => {
    setMemoBool(false);
  };

  const inputChange = (e) => {
    setinputdata(e.currentTarget.value);
  };

  return (
    <>
      <div style={{ width: '100%' }}>
        <div>
          <div style={{ float: 'left' }}>
            <video
              style={{ width: '700px', height: '400px' }}
              ref={videoPlayerRef}
              src={hi}
              controls
              className="video-js"
            />
            <p>메모 내용 : {Values} </p>

            <Button onClick={InsertMemo}>메모장</Button>
            <Button onClick={checkc} className="insert">
              마크표시
            </Button>
            <Button onClick={dbOn} className="target">
              데이터베이스
            </Button>
            {/* <GlobalStyle /> */}
          </div>
          <div style={{ float: 'right', width: '20%', marginRight: '10%' }}>
            {memoBool ? (
              <TextArea
                placeholder="textarea with clear icon"
                allowClear
                onChange={test}
                value={inputtest || transcript}
              />
            ) : (
              ''
            )}
            {memoBool ? (
              <div>
                <Button onClick={memocheck}>저장</Button>
                <Button onClick={SpeechRecognition.startListening}>
                  Start
                </Button>
                <Button onClick={SpeechRecognition.stopListening}>Stop</Button>
                <Button onClick={resetTranscript}>Reset</Button>
                <p>{transcript}</p>
              </div>
            ) : (
              ''
            )}
            <br />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
