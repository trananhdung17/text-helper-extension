import React, { useRef, useState } from 'react';
import './App.css';
import MainMenu from './components/main-menu';
import ActionButton from './components/action-button';
import { getSelectionInfo, wordsCount } from './utils/text';
import SharedStates from './utils/shared';
import OpenAITextProcessor from './services/openai';
import Config from './appconfig.json';

function App() {
  console.log('Initial App component');

  let [menuVisible, setMenuVisible] = useState(false);
  let [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
  let [menuDisabled, setMenuDisabled] = useState(false);

  let [buttonVisible, setButtonVisible] = useState(false);
  let [buttonPosition, setButtonPosition] = useState({top: 0, left: 0});

  let [selectedText, setSelectedText] = useState('');

  let [maxLength, setMaxLength] = useState(500);
  let [tone, setTone] = useState('solemn');

  let selectedInput = useRef({value: '', deselected: true});

  let [hasMouseUpEventListener, setHasMouseUpEventListener] = useState(false);

  const OpenAI = new OpenAITextProcessor(Config.OpenAI_API_TOKEN);

  const NLPServices: {[key:string]: Function} = {
    'words-count':       (text:string, tone:string, max_length:number) => wordsCount(text), 
    'text-summary':      (text:string, tone:string, max_length:number) => OpenAI.summary(text, max_length), 
    'text-completion':   (text:string, tone:string, max_length:number) => OpenAI.compose(text, tone, max_length), 
    'text-correction':   (text:string, tone:string, max_length:number) => OpenAI.correct(text), 
    'text-paraphrasing': (text:string, tone:string, max_length:number) => OpenAI.paraphrase(text), 
    'text-shorten':      (text:string, tone:string, max_length:number) => OpenAI.shorten(text)
  }

  const onMouseUpEventHandler = (target:any) => {
    /**
     * Handle text selection on web page
     */
    // if (buttonVisible && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.className != 'xth-menu-icon'){
    //   setButtonVisible(false);
    // }
    let {bottom, right, text} = getSelectionInfo();
    console.log('Selected Text', text);
    if (text) {
      console.log('Show Button');
      setSelectedText(text);
      setButtonPosition({top: bottom || 0, left: right || 0});
      setButtonVisible(true);
      if (target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
        selectedInput.current = {value: '', deselected: true};
      }
    } 
    else if (target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' && target.className != 'xth-menu-icon'){
        console.log('Hide Button');
        // console.log('target.className', target.className);
        setButtonVisible(false);
      
    }
  }

  const onInputFocusHandler = (target:any) => {
    // SharedStates.selectedInput = target;
    selectedInput.current = target;
    console.log('Show Button');
    setSelectedText(target.innerText);
    let {x, y, width, height} = target.getClientRects()[0]
    setButtonPosition({top: y + height, left: x + width});
    setButtonVisible(true);
  }

  if (!SharedStates.hasOnMouseUpEvent) {
    document.addEventListener('mouseup', (e) => {
      console.log('Add MouseUp Event Handler');
      onMouseUpEventHandler(e.target);
    });
    SharedStates.hasOnMouseUpEvent = true;
  }

  if (!SharedStates.hasOnFocusEvent) {
    let inputs = document.getElementsByTagName('input');
    let textareas = document.getElementsByTagName('textarea');
    
    for (var i = 0; i < inputs.length; i++) {
      let input = inputs.item(i);
      input?.addEventListener('focus', (e) => {
        let target = e.target;
        onInputFocusHandler(target);
      });
    }
    for (var i = 0; i < textareas.length; i++) {
      let textarea = textareas.item(i);
      textarea?.addEventListener('focus', (e) => {
        let target = e.target;
        onInputFocusHandler(target);
      });
    }
    SharedStates.hasOnFocusEvent = true;
  }
  
  /**
   * 
   * @param event 
   */
  const onButtonClick = (event:any) => {
    console.log(event);
    let position = buttonPosition;
    if (window.innerWidth < 600) {
      position = {top: (window.innerHeight / 2) - 300, left: (window.innerWidth) - 125}
    } else {
      if (window.innerWidth < position.left + 250) {
        position.left = position.left - 250;
      }
    }
    if (window.innerHeight < position.top + 400) {
      position.top = position.top - 400;
    }
    setMenuPosition(position);
    setMenuVisible(true);
    setButtonVisible(false);
  }

  const onMaxLengthChangeHandler = (e:any) => {
    setMaxLength(parseInt(e.target.value));
  }

  const onToneChangeHandler = (e:any) => {
    setTone(e.target.value);
  }

  /**
   * 
   * @param targetAction 
   */
  const onMenuItemClickHandler = (e:any, targetAction:string) => {
    setMenuDisabled(true);
    const serviceFunction = NLPServices[targetAction];
    console.log('selectedInput', selectedInput);
    console.log('selectedInput.current', selectedInput.current);
    let prompt;
    if (!selectedInput.current.deselected) {
      prompt = selectedInput.current.value;
    } else {
      prompt = selectedText;
    }

    serviceFunction(prompt, tone, maxLength)
    .then((result:any) => {
      console.log('Result: ', result);
      console.log(selectedInput);
      console.log(selectedInput.current);
      if (selectedInput.current.deselected){
        window.alert(result);
      } else {
        selectedInput.current.value = result;
      }
      
    })
    .catch((error:any) => {
      console.log('Error: ', error);
    });
  }

  const onCloseButtonClickHandler = (e:any) => {
    setMenuVisible(false);
  }

  return (
    <div id="xth-app-container" style={{position: 'fixed'}}>
      <ActionButton visible={buttonVisible}
                    position={buttonPosition} 
                    onClickHandler={onButtonClick}/>
      <MainMenu visible={menuVisible} 
                position={menuPosition} 
                disabled={menuDisabled} 
                services={Object.keys(NLPServices)}
                maxLength={maxLength}
                tone={tone}
                onToneChangeHandler={onToneChangeHandler}
                onMaxLengthChangeHandler={onMaxLengthChangeHandler}
                onMenuItemClickHandler={onMenuItemClickHandler}
                onCloseButtonClickHandler={onCloseButtonClickHandler}/>
    </div>
  );
}

export default App;
