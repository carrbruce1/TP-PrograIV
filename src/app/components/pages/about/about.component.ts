import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../../services/github.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  githubData: any;

  constructor(private githubService: GithubService) {}

  ngOnInit(): void {

    this.githubService.getGithubProfile().subscribe({
      next: (data) => {
        console.log(data);
        this.githubData = data;
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

}