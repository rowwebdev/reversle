import Letter, { LetterType } from '../Letter/Letter';

export interface ILetter {
    value: string;
    type: LetterType;
    index?: number;
}

interface WordProps {
    letters: ILetter[];
    forClipboard?: boolean
}
export default function Word(props: WordProps) {
    const letters = [...props.letters];
    for (let i = props.letters.length; i < 5; i++) {
        letters.push({value: '', type: LetterType.Default});
    }

    return (
        <div className="flex justify-center gap-2">
            {letters.map((letter, i) => <Letter key={i} {...letter} />)}
            {}
        </div>
    )
}