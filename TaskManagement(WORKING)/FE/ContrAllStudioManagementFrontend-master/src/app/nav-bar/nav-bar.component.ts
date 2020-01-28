import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserData } from '../dashboard/models/user-data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  userName: string = null;

  constructor(private userService: AuthService) { }

  logout() {
    this.userService.logout();
  }

  ngOnInit() {
    this.userService.userName$.subscribe(name => this.userName = name);
  }

}
