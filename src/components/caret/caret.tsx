import React from "react";

interface CaretProps{
    caretPosition: {left: number, top:number};
    visibility: boolean;
}
const Caret = React.memo(({caretPosition, visibility}: CaretProps) => {
    return (
        <div id="caret" style={{
            left: caretPosition.left + "px",
            top: caretPosition.top + "px",
            visibility: visibility ? "visible" : "hidden"
        }}></div>
    );
});

export default Caret;