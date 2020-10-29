function removeChildren(node)
{
    while(node.hasChildNodes()) {
       node.removeChild(node.lastChild);
    }
}

function setText(node, text)
{
    removeChildren(node);
    appendText(node, text);
}

function appendText(node, text)
{
    node.appendChild(document.createTextNode(text));
}

function addClass(node, cl)
{
    if(!node.classList.contains(cl)) {
        node.classList.add(cl);
    }
}

function removeClass(node, cl)
{
    node.classList.remove(cl);
}

function show(node, flag)
{
    node.style.display = flag ? "block" : "none";
}

function visible(node)
{
    return node.style.display != "none";
}

function addEvent(c, event, handler) {
    c.addEventListener(event, handler);    
}

function appendNewNode(c, tag) {
    var el = document.createElement(tag);
    c.appendChild(el);
    return el;
}

function removeSelf(c) {
    c.parentNode.removeChild(c);
}

function byTagFirst(tag, parent) {
    return getFirst((parent ? parent : document).getElementsByTagName(tag));
}

function byClassFirst(cl, parent) {
    return getFirst((parent ? parent : document).getElementsByClassName(cl));    
}

function eventFire(target, evtype) {
    var evObj = document.createEvent('Events');
    evObj.initEvent(evtype, true, false);
    target.dispatchEvent(evObj);    
}

function addOnClick(id, handler) {
    addEvent(byId(id), "click", handler);
}