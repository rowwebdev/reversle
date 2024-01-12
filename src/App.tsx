import Keyboard from './components/keyboard/Keyboard';
import Word, {ILetter} from './components/Word/Word';
import './App.css'
import { useEffect, useRef, useState } from 'react';
import { LetterType } from './components/Letter/Letter';
import { checkLetterIsValid, checkWordIsValid, setLetterTypes, IResult, shareToClipboard } from './helpers';
import Message from './components/Message/Message';
import Button from './components/Button/Button';

function App() {
  const [submittedWords, setSubmittedWords] = useState<ILetter[][]>([]);
  const [currentWord, setCurrentWord] = useState<ILetter[]>([]);
  const [usedLetters, setUsedLetters] = useState<ILetter[]>([]);
  const [errors, setErrors] = useState<IResult[]>([]);
  const [complete, setComplete] = useState(false);
  let todaysWord = useRef<{letter:string, found:boolean}[]>([]);

  useEffect(() => {
    todaysWord.current = [
      {letter: 'P', found: false},
      {letter: 'A', found: false},
      {letter: 'I', found: false},
      {letter: 'N', found: false},
      {letter: 'T', found: false}
    ];
  }, []);

  const letterClicked = (letter: string) => {
    const word = [...currentWord];

    if (letter === '<') {
      word.pop();
      setCurrentWord(word);
      return;
    }

    if (letter === 'ENTER'){
      if (word.length === 5) {
        const wordCheckResult = checkWordIsValid(word.map(l => l.value), usedLetters);
        if (wordCheckResult.length === 0) {
          setErrors([]);
          const newSubmittedWords = [...submittedWords, currentWord];
          const lettersUsed = setLetterTypes(todaysWord.current, newSubmittedWords);
          setUsedLetters(lettersUsed);
          setSubmittedWords(newSubmittedWords);
          setCurrentWord([]);

          if (currentWord.map(l => l.value).join('') === todaysWord.current.map(l => l.letter).join('')) {
            setComplete(true);
          }

        } else {
          setErrors([...wordCheckResult]);
        }
      }
      return;
    }

    if (word.length === 5)
      return;

    const checkResult = checkLetterIsValid(letter, word.length, usedLetters);
    if (checkResult.success) {
      word.push({ value: letter, type: LetterType.Default });
      setCurrentWord(word);
    } else {
      setErrors([checkResult]);
    }
  }

  return (
    <>
      <div className="text-gray-50 flex flex-col items-center font-mono pt-10">
        <h1 className="text-lg">Your Words</h1>
        <div className="flex flex-col justify-center py-5 gap-2">
          {submittedWords.map((word, i) => <Word key={i} letters={word} />)}
        </div>
        {complete ? <div className="py-5 flex flex-col gap-12 items-center">
          <Message data={{ success: true, message: `You got ${submittedWords.length} word${submittedWords.length > 1 ? 's' : ''}!`}} />
          <Button text="Share" onClick={() => shareToClipboard(submittedWords)} />
        </div> : <>
          <h1 className="text-lg">Your Guess</h1>
          <div className="flex justify-center py-5 gap-2">
            <Word letters={currentWord} />
          </div>
          <Keyboard onClick={letterClicked} usedLetters={usedLetters} />
        </>}
        {errors && <div className="flex flex-col justify-center py-5 gap-2">
          {errors.map(error => <Message data={error} />)}  
        </div>}
      </div>
    </>
  )
}

export default App
