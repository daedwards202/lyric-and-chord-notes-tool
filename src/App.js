import './App.css';
import { TextField, IconButton } from '@material-ui/core';
import styled from "styled-components";
import React, { useState, useReducer } from "react";
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const secondaryColour = 'black';

const RightAlignedButton = styled(IconButton)`
  && { 
    display: block;
    float: right;
    background-color: whitet;
    // border: 1px solid grey;
    // color: white;
    // vertical-align: center;
    padding: 0px;
    min-width: 30px;
  }
`;

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'PT Mono'
    ].join(','),
  },
});

const ColourBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: ${secondaryColour};
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: ${secondaryColour};
    }
  }
  label: {
    backgroundColor: white;
  }
`;

const FixedTextField = styled(ColourBorderTextField)`
  && {
    margin-bottom: 60px;
  }
`;

const ExtraTextField = styled(ColourBorderTextField)`
  && {
    margin-bottom: 10px;
  }
`;

function App() {

  const arrayMove = require('array-move');

  const [extraFormIndex, setExtraFormIndex] = useState(-1)

  const changeExtraFormIndex = (index) => {
    setExtraFormIndex(index)
  }

  const insert = (arr, index, newItem) => [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index)
  ]

  const [lines, dispatchLines] = useReducer((lines, { type, value, extraValue=0 }) => {
    switch (type) {
      case "add":
        return [...lines, value];
      case "remove":
        return lines.filter((_, index) => index !== value);
      case "up":
        return arrayMove(lines, value, value-1)
      case "down":
        return arrayMove(lines, value, value+1)
      case "insert":
        return insert(lines, extraValue, value)
      default:
        return lines;
    }
  }, []);
  const [textValue, setTextValue] = useState('');
  const [extraTextValue, setExtraTextValue] = useState('');
  const [textFieldLabel,  setTextFieldLabel] = useState("Line 1")

  const enterNewLine = (e) => {
    if (e.key === 'Enter' && /\S/.test(textValue)) {
      e.preventDefault();
      dispatchLines({type: "add", value: textValue})
      setTextValue('')
      setTimeout(() => setTextFieldLabel("Line " + (lines.length + 2)), 0)
    }
  }

  const insertNewLine = (e) => {
    if (e.key === 'Enter' && /\S/.test(extraTextValue)) {
      e.preventDefault();
      dispatchLines({type: "insert", value: extraTextValue, extraValue: extraFormIndex+1})
      setExtraTextValue('')
      setExtraFormIndex(-1)
    }    
  }

  const removeLine = (index) => {
    dispatchLines({type: "remove", value: index})
    setTimeout(() => setTextFieldLabel("Line " + lines.length), 0)
  }

  const moveLine = (index, up) => {
    if (up)
      dispatchLines({type: "up", value: index})
    else
      dispatchLines({type: "down", value: index})
  }

  const updateExtraTextValue = (e) => {
    if (e.target.value === '\n') {
      e.preventDefault()
    }
    else 
      setExtraTextValue(e.target.value)
  }

  const updateTextValue = (e) => {
    if (e.target.value === '\n') {
      e.preventDefault()
    }
    else 
      setTextValue(e.target.value)
  }

  return (
    <div className="App">
      <link href="https://fonts.googleapis.com/css2?family=PT+Mono&display=swap" rel="stylesheet" />
      <ThemeProvider theme={theme}>
      <div id="body">
        <h1>Lyrics & Chords</h1>
        <div id="lines">
          {lines.map((line, index) => {
            var chords = '\xa0\xa0\xa0';
            var lyrics = '';
            var foundChord = false;
            var foundIndex = false;
            var previousWordLen = 0;
            var chord = '';
            var indexString = '';
            var indexNum = 0
            for (var i = 0; i < line.length; i++) {
              if (line.charAt(i) === '[')
                foundChord = true;
              else if (line.charAt(i) === ']') {
                foundChord = false;
                foundIndex = false;
                if (indexString.length > 0)
                  indexNum = parseInt(indexString)
                console.log('Word length: ' + previousWordLen)
                console.log('Index: ' + indexNum)
                // console.log('Prior: ' + chords.substring(0, chords.length-previousWordLen+indexNum))
                // console.log('Post: ' + chords.substring(chords.length-previousWordLen+chord.length+indexNum, chords.length))
                chords = chords.substring(0, chords.length-previousWordLen+indexNum) + chord + chords.substring(chords.length-previousWordLen+chord.length+indexNum, chords.length);
                chord = '';
                indexString = '';
              } else if (foundChord) {
                if (line.charAt(i) === ',')
                  foundIndex = true;
                else if (foundIndex) {
                  indexString += line.charAt(i);
                }
                else 
                  chord += line.charAt(i)
              } else {
                if (line.charAt(i+1) !== ' ') {
                  if (line.charAt(i) !== ' ')
                    previousWordLen += 1;
                  chords = chords + '\xa0';
                } 
                if (line.charAt(i) === ' ') {
                  previousWordLen = 0;
                }
                lyrics = lyrics + line.charAt(i);
              }
              console.log(lyrics)
              console.log(chords)
            }
            return (
              <div key={'line' + index} id="line">
                <div id="chordsLine">
                  <p key={'chord' + index}>{chords}</p>
                  { index === extraFormIndex ? 
                  <RightAlignedButton key={'remove' + index} onClick={() => changeExtraFormIndex(-1)}><RemoveIcon fontSize='small'/></RightAlignedButton> :
                  <RightAlignedButton key={'add' + index} onClick={() => changeExtraFormIndex(index)}><AddIcon fontSize='small'/></RightAlignedButton> }
                  <RightAlignedButton key={'up' + index} onClick={() => moveLine(index, true)}><KeyboardArrowUpIcon fontSize='small'/></RightAlignedButton>
                </div>
                <div id="lyricsLine">
                  <p key={'lyric' + index}>{index+1}: {lyrics}</p>
                  <RightAlignedButton key={'remove' + index} onClick={() => removeLine(index)}><ClearIcon fontSize='small'/></RightAlignedButton>
                  <RightAlignedButton key={'down' + index} onClick={() => moveLine(index, false)}><KeyboardArrowDownIcon fontSize='small'/></RightAlignedButton>
                </div>
                { (index === extraFormIndex) ?
                    <form id="extra" noValidate autoComplete="off">
                      <ExtraTextField 
                        id="outlined-basic" 
                        label={'Line ' + (extraFormIndex+2)} 
                        value={extraTextValue}
                        multiline 
                        variant="outlined" 
                        fullWidth
                        onChange={updateExtraTextValue}
                        onKeyPress={insertNewLine}
                      />
                    </form>
                    : <></>
                }
              </div>)
          })}
        </div>
        <form noValidate autoComplete="off">
          <FixedTextField 
            id="outlined-basic" 
            label={textFieldLabel} 
            value={textValue}
            multiline 
            variant="outlined" 
            fullWidth
            onChange={updateTextValue}
            onKeyPress={enterNewLine}
          />
        </form>
      </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
