export const codeSyntax = `
import { Card, Input, Select, Form, Button, Slider } from 'antd';
import './App.css';
import { useEffect, useState } from 'react';
import { PlayCircleTwoTone } from '@ant-design/icons';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { codeSyntax } from './code';

function App() {
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState(null);
  const [text, setText] = useState('');
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);
  const [paused, setPaused] = useState(false);

  const loadVoices = () => {
    setVoices(window.speechSynthesis.getVoices().filter(voice => voice.lang === "en-US"));
  }

  const onStart = () => {
    setSpeaking(true);
  }

  const onEnd = () => {
    setSpeaking(false);
  }

  const speak = () => {
    console.log({ speechUtterance });
    speechUtterance.voice = voices.find(voice => voice.name === selectedVoiceName);
    speechUtterance.pitch = pitch;
    speechUtterance.volume = volume;
    speechUtterance.rate = rate;
    window.speechSynthesis.speak(speechUtterance);
  }

  console.log({ voices });
  

  // Hint: useEffect with text as dependency

  useEffect(() => {
    setSpeechUtterance(new SpeechSynthesisUtterance(text));
  }, [text]);

  useEffect(() => {
    if (window.speechSynthesis.onvoiceschanged) { // Check if chrome
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, []);

  // setStae is asynchronous

  const handlePauseResume = () => {
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  useEffect(() => {
    if (speechUtterance) {
      speechUtterance.addEventListener("start", onStart);
      speechUtterance.addEventListener("end", onEnd);
    }
  }, [speechUtterance]);

  return speechUtterance ? (
    <div className="App">
        <Card
          title="React Speech Synthesis"
          id="card"
          extra={(
            <>
              {speaking && <Button onClick={handlePauseResume}>{paused ? '▶️ Resume' : '⏸ Pause'}</Button>}
              {(text && selectedVoiceName && !speaking) && <Button onClick={speak}>{'🗣️ Speak'}</Button>}
            </>
          )}
        >
            <Input.TextArea
              id="text-area"
              placeholder='Enter text'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Form.Item label="Select a voice">
              <Select
                defaultValue={voices.length > 0 ? voices[0].name : null}
                style={{ width: 300 }}
                options={voices.map(voice => ({
                  label: voice.name,
                  value: voice.name
                }))}
                value={selectedVoiceName}
                onChange={setSelectedVoiceName}
              />
            </Form.Item>
            <Form.Item label="Pitch">
                <Slider min={0} max={2} value={pitch} onChange={setPitch} step={0.1} />
            </Form.Item>
            <Form.Item label="Volume">
                <Slider min={0} max={1} value={volume} onChange={setVolume} step={0.01} />
            </Form.Item>
            <Form.Item label="Rate">
                <Slider min={0} max={10} value={rate} onChange={setRate} step={0.1} />
            </Form.Item>
        </Card>
        <SyntaxHighlighter language="javascript" style={docco}>
          {codeSyntax}
        </SyntaxHighlighter>
        {
          speaking && !paused && (
            <div class="ocean">
              <div class="wave"></div>
              <div class="wave"></div>
              <div class="wave"></div>
            </div>
          )
        }
    </div>
  ) : <span>Loading....</span>;
}

export default App;
`