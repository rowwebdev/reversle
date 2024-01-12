import { LetterType, letterForClipboard } from "../components/Letter/Letter";
import { ILetter } from "../components/Word/Word";
import words from '../../words.json';

export interface IResult {
  success: boolean;
  message?: string;
}

export function setLetterTypes(correctWord: {letter: string, found: boolean}[], submittedWords: ILetter[][]) {
  const lettersUsed: ILetter[] = [];
  submittedWords.forEach(sw => {
    // get correct letters in right spot
    for (let i = 0; i < sw.length; i++) {
      if (correctWord[i].letter === sw[i].value) {
        correctWord[i].found = true;
        sw[i].type = LetterType.Correct;
        lettersUsed.push({ value: sw[i].value, type: LetterType.Correct, index: i });
      }
    }

    // get letters in incorrect spot (if they have not already been found)
    sw.forEach((sl, i) => {
      if (sl.type !== LetterType.Correct) {
        if (correctWord.filter(cl => !cl.found).some(cl => cl.letter === sl.value)) {
          // make sure we only highlight this letter as many times as it appears in the word
          const matchingCount = correctWord.filter(l => l.letter === sl.value && !l.found).length;
          const wrongPosCount = sw.filter(l => l.value === sl.value && l.type === LetterType.WrongPosition).length;
          if (wrongPosCount < matchingCount) {
            sl.type = LetterType.WrongPosition;
            lettersUsed.push({ value: sl.value, type: LetterType.WrongPosition, index: i });
          }
        }
      }
    });

    // get incorrect letters and set them to used in the lettersUsed array
    sw.filter(sl => sl.type === LetterType.Default && !lettersUsed.some(lu => lu.value === sl.value && lu.type === LetterType.Used)).forEach(sl => lettersUsed.push({ value: sl.value, type: LetterType.Used }));
  });

  return lettersUsed;
}

export function checkWordIsValid(word: string[], usedLetters: ILetter[]):IResult[] {
  const errors:IResult[] = [];

  const usedChecks = usedLetters.map(l => {
    return { ...l, valid: false}
  });

  const wordChecks = word.map((value, index) => {
    return { value, checked: false, index }
  })

  if (usedChecks.length > 0) {
    // ensure correct letters are back in the right place
    usedChecks.filter(l => l.type === LetterType.Correct).forEach(l => {
      if (wordChecks[l.index!].value === l.value) {
        l.valid = true;
        wordChecks[l.index!].checked = true;
      } else {
        errors.push({ success: false, message: `Letter #${l.index! + 1} must be ${l.value}`});
      }
    });

    // letters that are in the wrong place and need to be reused
    usedChecks.filter(l => l.type === LetterType.WrongPosition).forEach(l => {
      if (wordChecks[l.index!].value !== l.value) {
        const usedLetter = wordChecks.find(ul => ul.value === l.value && !ul.checked);
        if (!usedLetter) {
          errors.push({ success: false, message: `You need to use the letter ${l.value} in your guess`})
        } else {
          usedLetter.checked = true;
          l.valid = true;
        }
      } else {
        errors.push({ success: false, message: `You cannot use ${l.value} as letter #${l.index!} again`})
      }
    });
  }

  if (words.indexOf(word.join('').toLowerCase()) === -1)
    errors.push({ success: false, message: 'This is not a valid word' });

  return errors;
}
  
export function checkLetterIsValid(letter: string, position: number, usedLetters: ILetter[]):IResult {
  // correct letter for current position already found
  const correctLetterForPosition = usedLetters.find(l => l.index === position && l.type === LetterType.Correct);
  if (correctLetterForPosition) {
    if (correctLetterForPosition.value === letter)
      return { success: true }
    else 
      return { success: false, message: `Letter ${correctLetterForPosition.value} must be used in this position` };
  }
  // it's a letter used previously in the wrong position
  // make sure they don't put it in the same position again
  if (usedLetters.some(l => l.value === letter && l.type === LetterType.WrongPosition)) {
    if (!usedLetters.some(l => l.value === letter && l.index === position && l.type === LetterType.WrongPosition))
      return { success: true }
    else 
      return { success: false, message: `You can't use ${letter} in this position again` };
  }

  // letter has not been used yet
  if (!usedLetters.some(l => l.value === letter && l.type === LetterType.Used))
    return { success: true };
  else 
    return { success: false, message: `${letter} cannot be used again` };
}

export function shareToClipboard(words: ILetter[][]) {
  const wordsPart = words.map(w => {
    return w.map(l => letterForClipboard({ value: l.value, type: l.type })).join('');
  }).join('\n');

  navigator.clipboard.writeText(`I got ${words.length} words in Reversle!\n\n${wordsPart}`);
}