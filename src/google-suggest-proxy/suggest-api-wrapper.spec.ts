import { SuggestApiWrapper } from './suggest-api-wrapper';
import { of } from 'rxjs';
describe('SuggestApiWrapper', () => {
  let axios;
  let instance: SuggestApiWrapper;

  beforeEach(() => {
    axios = jasmine.createSpyObj('axios', ['get']);
    instance = new SuggestApiWrapper(axios);
  });

  it('Google suggest を呼び出します', done => {
    // Given
    const q = 'query';
    const response = { status: 200, data: 'test' };

    axios.get.and.returnValue(of(response));

    // When
    instance.getSuggestion(q).subscribe(actual => {
      // THen
      expect(actual).toBe('test');
      done();
    });

    // Then
    const expected = {
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      params: {
        hl: 'en',
        output: 'toolbar',
        q
      }
    };

    expect(axios.get).toHaveBeenCalledWith(
      'https://www.google.com/complete/search',
      expected
    );
  });
});
