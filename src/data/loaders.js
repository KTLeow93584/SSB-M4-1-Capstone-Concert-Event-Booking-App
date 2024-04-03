// ==============================================
const loadStartPrefix = "On Loading Start - ";
const loadEndPrefix = "On Loading End - ";
// ==============================================
export function onLoadingStart(category) {
    const apiEvent = new CustomEvent(loadStartPrefix + category);
    window.dispatchEvent(apiEvent);
}

export function onLoadingEnd(category) {
    const apiEvent = new CustomEvent(loadEndPrefix + category);
    window.dispatchEvent(apiEvent);
}
// ==============================================
export {
    loadStartPrefix, loadEndPrefix
};
// ==============================================