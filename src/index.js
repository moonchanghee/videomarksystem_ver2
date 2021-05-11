import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Popup from './Popup';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App isExt={false} />, document.getElementById('root'));
ReactDOM.render(<Popup />, document.getElementById('popup'));

registerServiceWorker();
