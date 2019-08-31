import { from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { parseSuggestionXml } from './parse-suggestion-xml';
import { SuggestApiWrapper } from './suggest-api-wrapper';
import { Suggestion } from './suggestion.model';

const letters = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわを'.split(
  ''
);

interface TmpResult {
  letter: string;
  data: any;
}

export class SuggestionService {
  constructor(private suggestApi: SuggestApiWrapper) {}

  getSuggestions(word: string): Observable<Suggestion[]> {
    return from(letters).pipe(
      mergeMap(letter => this.callApi(word, letter)),
      mergeMap(tmp => this.parseXml(tmp)),
      toArray()
    );
  }

  private callApi(word: string, letter: string): Observable<TmpResult> {
    return this.suggestApi.getSuggestion(word + ' ' + letter).pipe(
      map(data => {
        return { letter, data };
      })
    );
  }

  private parseXml(tmp: TmpResult): Observable<Suggestion> {
    return parseSuggestionXml(tmp.data).pipe(
      map(parsed => {
        return { letter: tmp.letter, result: parsed };
      })
    );
  }
}
