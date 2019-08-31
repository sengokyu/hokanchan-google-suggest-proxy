import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { SuggestionService } from './suggestion.service';

const letters = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわを'.split(
  ''
);

describe('SuggestionService', () => {
  let suggestApi;
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

    suggestApi.getSuggestion.and.returnValue(of(data));

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
