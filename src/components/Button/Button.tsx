
interface ButtonProps {
    text: string;
    onClick: () => any
}

export default function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick} className="bg-blue-500 shadow-custom shadow-blue-700 rounded-md px-3 py-2 font-bold">
        {props.text}
    </button>
  )
}
