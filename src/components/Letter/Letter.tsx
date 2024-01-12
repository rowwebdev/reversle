export enum LetterType {
    Default,
    Used,
    WrongPosition,
    Correct,
}

export interface LetterProps {
    value?: string;
    type?: LetterType;
    small?: boolean;
    className?: string;
    onClick?: (letter: string) => void;
    forClipboard?: boolean;
}
export default function Letter(props: LetterProps) {
    const letterClicked = (letter: string) => {
        props.onClick && props.onClick(letter);
    }

    let classNames = ['flex items-center justify-center font-semibold', props.className];

    if (props.value === 'ENTER')
        classNames.push('w-14 h-9 text-sm rounded-xl shadow-custom-small');
    else if (props.small)
        classNames.push('w-8 h-9 rounded-xl shadow-custom-small')
    else
        classNames.push('w-12 h-12 text-lg rounded-full shadow-custom')

    if (!props.value)
        classNames.push('bg-gray-600 shadow-gray-800');
    else {
        switch (props.type) {
            case LetterType.Correct:
                if (props.forClipboard)
                    return `🔴`;

                classNames.push('bg-red-500 shadow-red-800');
                break;
            case LetterType.WrongPosition:
                if (props.forClipboard)
                    return `🔵`;

                classNames.push('bg-blue-500 shadow-blue-700');
                break;
            case LetterType.Used:
                if (props.forClipboard)
                    return `⚫`;

                classNames.push('shadow-none');
                break;
            default:
                if (props.forClipboard)
                    return `⚫`;

                classNames.push('bg-gray-700 shadow-gray-900');
        }
    }

    return <div className={classNames.join(' ')} onClick={() => props.value && letterClicked(props.value)}>
        {props.value?.toUpperCase()}
    </div>
}

export function letterForClipboard(props: LetterProps) {
    switch (props.type) {
        case LetterType.Correct:
            return `🔴`;
        case LetterType.WrongPosition:
            return `🔵`;
        case LetterType.Used:
        default:
                return `⚫`;
    }
}