import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';

import {Song} from '../models/song.model';

@Injectable()
export class SongService {

  api_url    = environment.api_url;
  top50_url = this.api_url + '/lfm/top50/';

  constructor(private http: HttpClient) { }

  /**
   * @description gets the top50 songs from lastFM for the supplied contry
   * @param {string} country the country to get top50 from
   * @returns {array} array with 50 songs from lastFM
   */
  getTop50(country): Observable<Song[]> {
    return this.http.get(this.top50_url + country).map(res => {
      return res as Song[];
    });
  }
}
