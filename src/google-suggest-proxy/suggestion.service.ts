import { from, Observable, generate } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { parseSuggestionXml } from './parse-suggestion-xml';
import { SuggestApiWrapper } from './suggest-api-wrapper';
import { Suggestion } from './suggestion.model';

const letters = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわを'.split(
  ''
);
const lettersLength = letters.length;

interface TmpResult {
  index: number;
  letter: string;
  data: any;
}

export class SuggestionService {
  constructor(private suggestApi: SuggestApiWrapper) {}

  getSuggestions(word: string): Observable<Suggestion[]> {
    return generate(0, x => x < lettersLength, x => ++x).pipe(
      mergeMap(index => this.callApi(word, index)),
      mergeMap(tmp => this.parseXml(tmp)),
      toArray(),
      map(tmpArray => this.sortAndConvert(tmpArray))
    );
  }

  private callApi(word: string, index: number): Observable<TmpResult> {
    const letter = letters[index];

    return this.suggestApi.getSuggestion(word + ' ' + letter).pipe(
      map(data => {
        return { index, letter, data };
      })
    );
  }

  private parseXml(tmp: TmpResult): Observable<TmpResult> {
    return parseSuggestionXml(tmp.data).pipe(
      map(parsed => {
        return { index: tmp.index, letter: tmp.letter, data: parsed };
      })
    );
  }

  private sortAndConvert(tmpArray: TmpResult[]): Suggestion[] {
    tmpArray.sort((a, b) => a.index - b.index);

    return tmpArray.map(i => {
      return { letter: i.letter, result: i.data };
    });
  }
}
