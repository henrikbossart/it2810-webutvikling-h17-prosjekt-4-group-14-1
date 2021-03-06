import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Song} from '../models/song.model';
import {MatGridListModule} from '@angular/material/grid-list';
import {SongService} from '../services/song.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
    selector: 'app-top50',
    templateUrl: './top50.component.html',
    styleUrls: ['./top50.component.css'],
    animations: [
        trigger('Animation', [
            state('small', style({
                transform: 'scale(1)',
            })),
            transition('* <=> *', animate('400ms ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(0%)', offset: 0}),
                style({opacity: 0.5, transform: 'translateY(0px)',  offset: 0.5}),
                style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
            ]))),
        ])
    ]
})

export class Top50Component implements OnInit {
    state: 'small';
    // Assigning how many elements that should be displayed in a row
    column: number = 5;
    // List for displaying items in elements
    displayedElements: Song[] = [];
    // Defines how many elements that should be displayed at a time
    limit = 15;

    songs: Song[] = [];

    country: string;
    constructor(private route: ActivatedRoute, private router: Router, private songService: SongService) { }

    /**
     * @description retreives the top 50 songs from the country supplied in the url parameter
     */
    getTop50Songs(): void {
      this.songService.getTop50(this.country).subscribe(data => {
        this.songs = data;
        // makes sure the most popular of the top 50 is displayed first
        this.songs.sort((n1, n2) => {
            return parseInt(n2.listeners, 10) - parseInt(n1.listeners, 10);
        });
      });
    }

    animateMe() {
        this.state = ('small');
    }

    /**
     * @description adds a new row of artists to be displayed if there's room
     */
    addItems() {
        for (let i = 0; i < this.songs.length; i++) {
            if (this.songs.length !== this.displayedElements.length) {
                this.displayedElements.push(this.songs[i]);
                this.animateMe();
            }
        }
    }

    /**
     * @description triggers everytime a scroll event is performed, will increase the amount of artists that are displayed
     */
    onScroll() {
        // Detects when you reach the bottom, and then adds 5 more results.
        if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
            this.limit = this.limit + 5;
            this.addItems();
        }
    }

    /**
     * @description changes the amount of columns used in the grid display
     * @param event the triggering event
     */
    onResize(event) {
        const element = event.target.innerWidth;
        if (element > 1500) {
            this.column = 5;
        } else if (element > 1200) {
            this.column = 4;
        } else if (element > 900) {
            this.column = 3;
        } else if (element > 600) {
            this.column = 2;
        } else if (element > 300) {
            this.column = 1;
        }
    }

    ngOnInit() {
        this.country = this.route.snapshot.paramMap.get('country');
        this.getTop50Songs();
        this.addItems();
        this.animateMe();
    }
}
