import './App.css';
import { TextField } from '@material-ui/core';
import styled from "styled-components";
import React, { useState, useReducer } from "react";

export const secondaryColour = '#474853';

const ColorBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: ${secondaryColour};
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: ${secondaryColour};
    }
  }
`;

function App() {

  const [lyrics, dispatchLyrics] = useReducer((lyrics, { type, value }) => {
    switch (type) {
      case "add":
        return [...lyrics, value];
      case "remove":
        return lyrics.fiter((_, index) => index !== value);
      default:
        return lyrics;
    }
  }, []);
  const [textValue, setTextValue] = useState('');

  const enterNewLine = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      dispatchLyrics({type: "add", value: textValue})
      setTextValue('')
    }
  }

  const updateTextValue = (e) => {
    setTextValue(e.target.value)
  }

  return (
    <div className="App">
      <body>
        <h1>Lyrics & Chords</h1>
        <ol id="lyrics">
          {lyrics.map((lyric, index) =>  
            <li key={index}>{index+1}: {lyric}</li>
          )}
        </ol>
        <form noValidate autoComplete="off">
          <ColorBorderTextField 
            id="outlined-basic" 
            label="" 
            value={textValue}
            multiline 
            variant="outlined" 
            fullWidth="true"
            onChange={updateTextValue}
            onKeyPress={enterNewLine}
          />
        </form>
      </body>
    </div>
  );
}

export default App;
