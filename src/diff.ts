import diff_match_patch from 'diff-match-patch';

type Diff = [-1 | 0 | 1, string];

// Thanks @kangchengkun. This function was copied from repo: https://github.com/kangchengkun/diff-lines-words
function diff_wordsToChars_(text1: string, text2: string) {
  let lineArray = [];
  let lineHash: { [char: string]: number } = {};
  let maxLines = 65535;
  lineArray[0] = '';

  function diff_linesToCharsMunge_(text: string) {
    let chars = '';
    let lineStart = 0;
    let lineEnd = -1;
    let lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf(' ', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      let line = text.substring(lineStart, lineEnd + 1);

      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== undefined) {
        chars += String.fromCharCode(lineHash[line]);
      } else {
        if (lineArrayLength == maxLines) {
          line = text.substring(lineStart);
          lineEnd = text.length;
        }
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
      lineStart = lineEnd + 1;
    }
    return chars;
  }
  let chars1 = diff_linesToCharsMunge_(text1);
  let chars2 = diff_linesToCharsMunge_(text2);
  return {chars1, chars2, lineArray};
};

// Thanks @kangchengkun. This function was refered from repo: https://github.com/kangchengkun/diff-lines-words
function diff_charsToWords_(diffs: Diff[], wordsArray: string[]) {
  for (let i = 0; i < diffs.length; i++) {
    let chars = diffs[i][1];
    let text = [];
    for (let j = 0; j < chars.length; j++) {
      text[j] = wordsArray[chars.charCodeAt(j)];
    }
    diffs[i][1] = text.join('');
  }
};

// Thanks @kangchengkun. This function was refered from repo: https://github.com/kangchengkun/diff-lines-words
function diff_chars(text1: string, text2: string) : Diff[] {
  return new diff_match_patch().diff_main(text1, text2);
};

// Thanks @kangchengkun. This function was refered from repo: https://github.com/kangchengkun/diff-lines-words
function diff_words(text1: string, text2: string) : Diff[] {
  let diff = new diff_match_patch();
  let w2c = diff_wordsToChars_(text1, text2);
  let diffs = diff.diff_main(w2c.chars1, w2c.chars2, false);
  diff_charsToWords_(diffs, w2c.lineArray);
  return diffs;
};

// Thanks @kangchengkun. This function was refered from repo: https://github.com/kangchengkun/diff-lines-words
function diff_lines(text1: string, text2: string) : Diff[] {
  let diff = new diff_match_patch();
  let l2c = diff.diff_linesToChars_(text1, text2);
  let diffs = diff.diff_main(l2c.chars1, l2c.chars2, false);
  diff.diff_charsToLines_(diffs, l2c.lineArray);
  return diffs;
};

const INSERT = 1;
const EQUAL = 0;
const DELETE = -1;

export {diff_chars, diff_words, diff_lines, Diff, INSERT, EQUAL, DELETE};