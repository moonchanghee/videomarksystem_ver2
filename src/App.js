import React, { useRef, useState, useEffect } from 'react';
import videojs from 'video.js';
import 'videojs-markers';
import Axios from 'axios';
import { Input, Button, Typography } from 'antd';
import styled from 'styled-components';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import parse from 'html-react-parser';

const { TextArea } = Input;
const { Text } = Typography;
const App = ({ videosrc }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { transcript, resetTranscript } = useSpeechRecognition();
  const videoPlayerRef = useRef(null); // Instead of ID
  const [currentTime, setCurrentTime] = useState(null);
  const [currentVal, setCurrentVal] = useState(0);
  const [memotime, setMemotime] = useState();
  const [Values, setValues] = useState('');
  const [player, setPlayer2] = useState();
  const [dbData, setDbData] = useState([{}]);
  const [memoBool, setMemoBool] = useState(false);
  const [inputtest, setInputest] = useState();
  const [inputdata, setinputdata] = useState();
  const [voiceBool, setVoiceBool] = useState(false);
  const [indexNum, setIndex] = useState();
  const [removeTime, setRemoveTime] = useState();
  const [duration, setduration] = useState();
  const [time, settime] = useState();
  const scrArr = videosrc.split('/');
  const [rangeBool, rangesetBool] = useState(false);
  const [startch, setstartch] = useState();
  const [endch, setendch] = useState();

  const [startMinute, setstartMinute] = useState(0);
  const [startSecond, setstartSecond] = useState(0);

  const [endMinute, setendMinute] = useState(0);
  const [endSecond, setendSecond] = useState(0);

  const onEditorStateChange = (editorState) => {
    // editorState에 값 설정
    setEditorState(editorState);
  };

  const videoJSOptions = {
    autoplay: false,
    controls: true,
    userActions: { hotkeys: true },
    playbackRates: [0.5, 1, 1.5, 2],
  };

  useEffect(() => {
    let dataArr = [];
    function GetDb() {
      Axios.get('http://localhost:3002/marker/' + scrArr[5])
        .then((e) => {
          return setDbData(e.data.markers);
        })
        .then((e) => console.log('dataArr', dataArr));
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      return null;
    }

    if (videoPlayerRef.current) {
      let player = videojs(videoPlayerRef.current, videoJSOptions, () => {
        player.src(videosrc);
        player.on('ended', () => {
          console.log('ended');
        });
        player.on('play', function () {
          console.log('play');
        });

        player.on('timeupdate', function () {
          setCurrentTime(player.currentTime());
        });

        player.on('pause', function () {
          //현재 비디오 정지 체크
          var isPaused = player.paused();
          if (isPaused) {
            //정지 되었다면 현재 멈춘만큼의 시간을 체크해서 저장.
            setCurrentVal(Number(player.cache_.currentTime));
          }
          return false;
        });
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
            return 'Title : ' + markers.text;
          },
          time: function (markers) {
            return markers.time;
          },
        },
        onMarkerClick: function (marker) {},
        onMarkerReached: function (marker, index) {
          setValues(marker.val);
          setRemoveTime(marker.time);
          setIndex(index);
          setduration(marker.duration);
          settime(marker.time);
        },
        markers: [],
      });
    }
    GetDb();
  }, []);

  const markerPost = (time, text, val, duration) => {
    const body = {
      time: time,
      text: text,
      val: val,
      src: scrArr[5],
      duration: duration,
    };
    console.log(body);
    Axios.post('http://localhost:3002/marker', body);
  };
  const checkc = () => {
    player.markers.add([
      {
        time: player.cache_.currentTime,
        text: '',
        // duration: 60,
        val: inputtest,
      },
    ]);
    markerPost(player.cache_.currentTime, '', inputtest);
  };
  const checkc2 = () => {
    let title = prompt('title 입력');
    let du;
    // rangeBool
    if (rangeBool) {
      du = endch - startch;
    } else {
      du = 10;
    }

    player.markers.add([
      {
        time: player.cache_.currentTime,
        duration: du,
        text: title,
        val: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      },
    ]);

    markerPost(
      player.cache_.currentTime,
      title,
      draftToHtml(convertToRaw(editorState.getCurrentContent())),
      du
    );
    setMemoBool(false);
  };

  const InsertMemo = () => {
    setMemoBool(true);
    setMemotime(currentVal);
  };

  const test = (e) => {
    setInputest(e.currentTarget.value);
  };

  const dbOn = () => {
    dbData.map((e) => {
      return player.markers.add([
        {
          time: e.time,
          text: e.text,
          val: e.val,
          duration: e.du,
        },
      ]);
    });
  };

  const memocheck = () => {
    setMemoBool(false);
    rangesetBool(false);
  };

  const voiceOn = () => {
    setVoiceBool(true);
  };

  const voiceOk = () => {
    setVoiceBool(false);
  };

  const remove = () => {
    player.markers.remove([indexNum]);
    Axios.delete('http://localhost:3002/marker/' + removeTime);
    setValues('');
  };

  const range_mark = () => {
    rangesetBool(true);
  };

  const startM = () => {
    setstartch(currentTime);
    setstartMinute(Math.floor(currentTime / 60));
    setstartSecond(
      Math.round(
        (Math.floor(currentTime) / 60 - Math.floor(currentTime / 60)).toFixed(
          2
        ) * 60
      )
    );
  };

  const endM = () => {
    setendch(currentTime);
    setendMinute(Math.floor(currentTime / 60));
    setendSecond(
      Math.round(
        (Math.floor(currentTime) / 60 - Math.floor(currentTime / 60)).toFixed(
          2
        ) * 60
      )
    );
  };

  let bool;

  if (
    Math.floor(currentTime) >= Math.floor(time) &&
    Math.floor(currentTime) <= Math.floor(time + duration)
  ) {
    bool = true;
    console.log(true);
  } else {
    bool = false;
    console.log(false);
  }

  return (
    <>
      <div style={{ width: '100%' }}>
        <div>
          <div style={{ float: 'left', width: '50%' }}>
            <video
              style={{ width: '100%', height: '500px' }}
              ref={videoPlayerRef}
              src={videosrc}
              controls
              className="video-js"
            />
            <Button shape="round" onClick={InsertMemo}>
              {memoBool ? <p>Text Editor on</p> : <p>Text Editor off</p>}
            </Button>
            <Button shape="round" onClick={voiceOn} className="target">
              {voiceBool ? <p>speech on</p> : <p>speech off</p>}
            </Button>
            <Button onClick={dbOn} className="target">
              마크 불러오기
            </Button>

            <Button shape="round" onClick={remove}>
              삭제
            </Button>

            <br />
            <br />
            {voiceBool ? (
              <div>
                <TextArea
                  placeholder="textarea with clear icon"
                  onChange={test}
                  row={100}
                  value={inputtest || transcript}
                />
                <br />
                <Button onClick={SpeechRecognition.startListening}>
                  Start
                </Button>
                <Button onClick={SpeechRecognition.stopListening}>Stop</Button>
                <Button onClick={resetTranscript}>Reset</Button>
                <Button onClick={checkc} className="insert">
                  저장
                </Button>
                <Button onClick={voiceOk}>닫기</Button>
              </div>
            ) : (
              ''
            )}
          </div>
          <div style={{ float: 'right', width: '50%' }}>
            <br />
            {memoBool ? (
              <div
                style={{
                  height: '450px',
                  overflow: 'scroll',
                  marginLeft: '5%',
                  marginRight: '5%',
                }}
              >
                <MyBlock>
                  <Editor
                    // 에디터와 툴바 모두에 적용되는 클래스
                    // wrapperClassName="wrapper-class"
                    wrapperClassName="wrapperClassName"
                    // 에디터 주변에 적용된 클래스
                    // editorClassName="editor"
                    editorClassName=" editorClassName"
                    // 툴바 주위에 적용된 클래스
                    // toolbarClassName="toolbar-class"
                    toolbarClassName="toolbarClassName"
                    // 툴바 설정
                    toolbar={{
                      // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
                      list: { inDropdown: true },
                      textAlign: { inDropdown: true },
                      link: { inDropdown: true },
                      history: { inDropdown: false },
                    }}
                    placeholder=""
                    // 한국어 설정
                    localization={{
                      locale: 'ko',
                    }}
                    // 초기값 설정
                    editorState={editorState}
                    // 에디터의 값이 변경될 때마다 onEditorStateChange 호출
                    onEditorStateChange={onEditorStateChange}
                  />
                </MyBlock>
              </div>
            ) : (
              ''
            )}

            {memoBool ? (
              <div
                style={{
                  float: 'right',
                  display: 'inline-block',
                  marginRight: '5%',
                }}
              >
                {rangeBool ? (
                  <div style={{ display: 'inline-block' }}>
                    <Button onClick={startM}>시작</Button>
                    {startMinute} 분 {startSecond}초{' '}
                    <Button onClick={endM}>끝</Button>
                    {endMinute} 분 {endSecond}초{' '}
                    <Button
                      onClick={checkc2}
                      className="insert"
                      // style={{ marginLeft: '5%' }}
                    >
                      저장
                    </Button>
                    <Button onClick={memocheck}>닫기</Button>
                  </div>
                ) : (
                  <div>
                    <Button onClick={checkc2} className="insert">
                      저장
                    </Button>
                    <Button onClick={memocheck}>닫기</Button>
                    <Button onClick={range_mark} className="insert">
                      마킹범위
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              ''
            )}

            {bool ? (
              <div
                style={{
                  marginTop: '10%',
                  display: 'flex',
                  justifyContent: 'center',
                  height: '50%',
                }}
              >
                <Text mark>{parse(`${Values}`)}</Text>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const MyBlock = styled.div`
  .wrapper-class {
    width: 50%;
    margin: 0 auto;
    margin-bottom: 4rem;
  }
  .editor {
    height: 500px !important;
    border: 1px solid #f1f1f1 !important;
    padding: 5px !important;
    border-radius: 2px !important;
  }
`;

export default App;
