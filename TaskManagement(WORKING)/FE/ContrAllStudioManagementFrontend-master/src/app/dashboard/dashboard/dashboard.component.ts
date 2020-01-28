import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthorizationService } from 'src/app/authorization.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  expand = true;
  displaySize: number;
  tabSelected = 1;
  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              public authorization: AuthorizationService) { }

  ngOnInit() {}

  Expand() {
    if (this.expand === true) {
      this.expand = false;
    } else {
      this.expand = true;
    }
  }

  tabSelect(nr: number) {
    this.tabSelected = nr;
  }

}
