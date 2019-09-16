import { AsyncSubject, Observable } from 'rxjs';
import { parseString } from 'xml2js';

export function parseSuggestionXml(xml: string): Observable<string[]> {
  const subject = new AsyncSubject<string[]>();

  parseString(xml, (err, result) => {
    if (err) {
      console.error(`XML parse error. ${xml}`);
      subject.next(undefined);
      subject.complete();
      return;
    }

    if (
      result === null ||
      typeof result !== 'object' ||
      typeof result['toplevel'] === 'undefined' ||
      typeof result['toplevel']['CompleteSuggestion'] === 'undefined'
    ) {
      subject.next(undefined);
      subject.complete();
      return;
    }

    try {
      const dst = result.toplevel.CompleteSuggestion.map(
        i => i.suggestion[0].$.data
      );

      subject.next(dst);
    } catch (ex) {
      console.error(`XML parse failed. ${xml}`);
      subject.next(undefined);
    }

    subject.complete();
  });

  return subject;
}
