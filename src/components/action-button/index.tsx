import Icon from '../../resources/img/icon-32.png';
import './styles.css';
/**
 * Float action button that show when user select a text or forcus to input field
 * @param props: {visible, position, onClickHandler}
 * @returns 
 */
function ActionButton(props:{[k:string]: any}) {

    let {visible, position, onClickHandler} = props;

    return (<button id="xth-action-button" className="xth-action-button" onClick={onClickHandler} style={{
        display: visible ? 'block' : 'none',
        top: `${position?.top}px`,
        left: `${position?.left}px`,
        // background: `url(${chrome.runtime? chrome.runtime.getURL('img/xth-icon-32.png') : Icon})`
        }}>
    </button>)
}
export default ActionButton;
