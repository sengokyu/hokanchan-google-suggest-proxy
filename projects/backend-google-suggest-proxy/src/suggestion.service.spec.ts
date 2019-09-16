import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { SuggestionService } from './suggestion.service';
import { delay } from 'rxjs/operators';
import { SuggestApiWrapper } from './suggest-api-wrapper';

const letters = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわを'.split(
  ''
);

const getRandomInt = (): number => Math.floor(Math.random() * 500);

describe('SuggestionService', () => {
  let suggestApi: jasmine.SpyObj<SuggestApiWrapper>;
  let instance: SuggestionService;

  beforeEach(() => {
    suggestApi = jasmine.createSpyObj('SuggestApiWrapper', ['getSuggestion']);
    instance = new SuggestionService(suggestApi);
  });

  it('Httpアクセスして頭文字全てのサジェストを返す', done => {
    // Given
    const word = 'hoge';
    const data = `<?xml version="1.0" encoding="UTF-8"?>
    <toplevel>
    <CompleteSuggestion><suggestion data="hoge fuga"/></CompleteSuggestion>
    </toplevel>`;

    // HTTPリクエストごとにランダムな待ちを入れて、順番を保てないようにする
    const returnValues = letters.map(_ => of(data).pipe(delay(getRandomInt())));
    suggestApi.getSuggestion.and.returnValues(...returnValues);

    const expected = letters.map(i => {
      return { letter: i, result: ['hoge fuga'] };
    });

    // When
    instance.getSuggestions(word).subscribe(actual => {
      // Then
      expect(actual).toEqual(expected);
      done();
    });

    expect(suggestApi.getSuggestion).toHaveBeenCalledTimes(45);
    expect(suggestApi.getSuggestion).toHaveBeenCalledWith('hoge あ');
    expect(suggestApi.getSuggestion).toHaveBeenCalledWith('hoge い');
    expect(suggestApi.getSuggestion).toHaveBeenCalledWith('hoge う');
    expect(suggestApi.getSuggestion).toHaveBeenCalledWith('hoge え');
    expect(suggestApi.getSuggestion).toHaveBeenCalledWith('hoge お');
    // 省略
  });
});
