import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth.service';
import {ButtonService} from './button.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  userName = '';

  buttonActive = false;

  constructor(public userService: AuthService, private buttonService: ButtonService, private datePipe: DatePipe) { }

  logout() {
    this.userService.logout();
  }

  ngOnInit() {
    this.userService.userName$.subscribe(name => this.userName = name);
    this.buttonService.getButtonState(this.datePipe.transform(Date.now(), 'medium')).then(
        response => {this.buttonActive = (response === '1');
                     console.log(this.buttonActive);
                     console.log(response);
        }
    );
    console.log(this.userName);
  }

  clocking() {
  console.log('intra');
  this.buttonService.addClocking(this.datePipe.transform(Date.now(), 'medium')).then(
  response => {this.buttonActive = (response === '1'); console.log(response); }

    );
  }
  // get userName(): any {
  //   return localStorage.getItem('name');
}


