import React from 'react';

import Letter from '../Letter/Letter';
import { ILetter } from '../Word/Word';

interface KeyboardProps {
    onClick: (letter: string) => void;
    usedLetters: ILetter[];
}

export default function Keyboard(props: KeyboardProps) {
    const rows: Array<string[]> = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<']];

    return (
        <div className="flex flex-col items-center gap-1">
            {rows.map((row, i) => <div key={i} className="flex gap-1">
                {row.map(key => {
                    const type = props.usedLetters.find(l => l.value === key)?.type;
                    return <Letter key={key} value={key} small onClick={props.onClick} type={type}/>
                })}
            </div>)}            
        </div>
    )
}
