import { capitalizeFirstLetter } from "../../utils/text";
import './styles.css';

/**
 * 
 * @param props 
 * @returns 
 */
function MainMenu(props:{[k:string]: any}) {

    let {visible, onCloseButtonClickHandler, position, maxLength, services, tone, disabled, onToneChangeHandler, onMaxLengthChangeHandler, onMenuItemClickHandler} = props;
      
    const toneOptions:string[] = [
        'solemn',
        'cheerful',
        'sarcastic',
        'angry'
    ]

    return (
        <div id="xth-main-menu" className="xth-menu-icon" style={{
            display: visible ? 'block' : 'none',
            top: `${position?.top}px`,
            left: `${position?.left}px`
        }}>
            <h2>Text Helper Tools</h2>
            <div className="xth-option-max-length">
                <span>Max Length of Result:</span>
                <input type="number" value={maxLength} onChange={onMaxLengthChangeHandler}/>
            </div>
            
            <div className="xth-option-tone">
                <span>Essay Tone: </span>
                <select name="tone" value={tone} onChange={onToneChangeHandler}>
                    {toneOptions.map((item: string, i: number) => (<option key={item}>{capitalizeFirstLetter(item.replaceAll('-', ' '))}</option>)) }
                </select>
            </div>
            
            <h3>Select a function below:</h3>
            <ul>
                {services.map((element: string, i: number) => (<li id={'xth-menu-' + element} key={element} onClick={(e) => onMenuItemClickHandler(e, element)}>{capitalizeFirstLetter(element.replaceAll('-', ' '))}</li>))}
            </ul>
            <button onClick={onCloseButtonClickHandler}>CLOSE</button>
        </div>
    )
}

export default MainMenu;
