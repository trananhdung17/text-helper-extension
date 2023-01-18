/**
 * 
 * @returns JSON object
 */
export function getSelectionInfo() {
    let selection = document.getSelection();
    let selectionRect = selection?.getRangeAt(0).getBoundingClientRect();
    return {
        text: selection?.toString() || '',
        top: selectionRect?.top,
        left: selectionRect?.left,
        bottom: selectionRect?.bottom,
        right: selectionRect?.right
    };
}

/**
 * 
 * @param text 
 * @returns string
 */
export function capitalizeFirstLetter(text:string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * 
 * @param text 
 * @returns 
 */
export function wordsCount(text: string) {
    text = text.replace(/(^\s*)|(\s*$)/gi,"");    // exclude  start and end white-space
    text = text.replace(/[ ]{2,}/gi," ");         // 2 or more space to 1
    text = text.replace(/\n /,"\n");              // exclude newline with a start spacing
    const result = text.split(' ').filter(function(str){return str!="";}).length;
    return new Promise((resolve, reject) => {
        if (text) {
            return resolve(result);
        } else {
            return reject(0)
        }
        
    })
}
