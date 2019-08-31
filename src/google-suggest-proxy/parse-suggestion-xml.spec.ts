import { parseSuggestionXml } from './parse-suggestion-xml';

const validXml = `
<?xml version="1.0" encoding="UTF-8"?>
<toplevel>
<CompleteSuggestion><suggestion data="東京駅前"/></CompleteSuggestion>
<CompleteSuggestion><suggestion data="東京駅前駅"/></CompleteSuggestion>
<CompleteSuggestion><suggestion data="東京駅"/></CompleteSuggestion>
<CompleteSuggestion><suggestion data="東京駅前 ラーメン"/></CompleteSuggestion>
<CompleteSuggestion><suggestion data="東京駅前 賃貸"/></CompleteSuggestion>
<CompleteSuggestion><suggestion data="東京駅前 ランチ"/></CompleteSuggestion>
<CompleteSuggestion><suggestion data="東京駅 タピオカ"/></CompleteSuggestion>
<CompleteSuggestion><suggestion data="東京駅前 居酒屋"/></CompleteSuggestion>
<CompleteSuggestion><suggestion data="東京駅 銭湯"/></CompleteSuggestion>
<CompleteSuggestion><suggestion data="東京駅 焼肉"/></CompleteSuggestion>
</toplevel>
`;

describe('parseSuggestionXml', () => {
  it('正常XMLをパースできる', done => {
    const expected = [
      '東京駅前',
      '東京駅前駅',
      '東京駅',
      '東京駅前 ラーメン',
      '東京駅前 賃貸',
      '東京駅前 ランチ',
      '東京駅 タピオカ',
      '東京駅前 居酒屋',
      '東京駅 銭湯',
      '東京駅 焼肉'
    ];

    parseSuggestionXml(validXml).subscribe(result => {
      expect(result).toEqual(expected);
      done();
    });
  });

  it('期待されないXMLは空配列', done => {
    const invalidXml =
      '<?xml version="1.0" encoding="UTF-8"?><xmlroot></xmlroot>';

    parseSuggestionXml(invalidXml).subscribe(actual => {
      expect(actual).toEqual([]);
      done();
    });
  });

  it('XMLでなければ空配列', done => {
    parseSuggestionXml('').subscribe(actual => {
      expect(actual).toEqual([]);
      done();
    });
  });
});
