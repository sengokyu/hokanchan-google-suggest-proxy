import { AxiosRequestConfig } from 'axios';
import { Axios } from 'axios-observable';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SuggestApiWrapper {
  private static readonly apiUrl = 'https://www.google.com/complete/search';
  private static readonly emptyXml =
    '<?xml version="1.0" encoding="UTF-8"?><toplevel/>';

  constructor(private axios: Axios) {}

  getSuggestion(q: string): Observable<string> {
    const config: AxiosRequestConfig = {
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

    return this.axios.get(SuggestApiWrapper.apiUrl, config).pipe(
      map(response => {
        if (response.status == 200) {
          return response.data;
        } else {
          console.error(
            `Suggest API failed ${response.status} ${response.statusText}`
          );
          return SuggestApiWrapper.emptyXml;
        }
      })
    );
  }
}
