
/**
 * Static class using for sharing states between all of components. 
 * These states are not effect to component presenting
 */
export default class SharedStates {
    public static hasOnMouseUpEvent = false;
    public static hasOnFocusEvent = false;
    public static selectedInput = null;
}
