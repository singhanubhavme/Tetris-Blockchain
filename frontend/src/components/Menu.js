import React from "react";
import './Menu.css';
const Menu = ({ onClick, text, isButtonDisabled }) => {
    return (
        <div className="Menu">
            <button className="Button" onClick={onClick} disabled={isButtonDisabled}>
                {isButtonDisabled ? <>Please Wait</> : text}
            </button>
        </div>
    );
}

export default Menu;