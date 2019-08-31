import { AsyncSubject, Observable } from 'rxjs';
import { parseString } from 'xml2js';

export function parseSuggestionXml(xml: string): Observable<string[]> {
  const subject = new AsyncSubject<string[]>();

  parseString(xml, (err, result) => {
    if (err) {
      subject.error(err);
      return;
    }

    try {
      const dst = result.toplevel.CompleteSuggestion.map(
        i => i.suggestion[0].$.data
      );

      subject.next(dst);
    } catch (ex) {
      console.log(ex);
      subject.next([]);
    }

    subject.complete();
  });

  return subject;
}
