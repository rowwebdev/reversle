import { IResult } from "../../helpers"

interface MessageProps {
    data: IResult;
}

export default function Message(props: MessageProps) {
  let classNames = ['shadow-custom-small rounded-md px-3'];

  if (props.data.success)
    classNames.push('font-semibold bg-green-600 shadow-green-800')
  else 
    classNames.push('text-gray-200 bg-red-800 shadow-red-950');

  return (
    <div className={classNames.join(' ')}>{props.data.message}</div>
  )
}
