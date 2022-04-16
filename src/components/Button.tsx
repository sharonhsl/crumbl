import React from "react";
import './Button.css'

interface ButtonProps {
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = (props: ButtonProps) => {
    return <div>
        <button className="button" onClick={props.onClick}>{props.text}</button>
    </div>
}

export default Button;