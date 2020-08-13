import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInfo, Rank } from 'ptcg-server';
import { switchMap } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ProfileService } from '../api/services/profile.service';
import { takeUntilDestroyed } from '../shared/operators/take-until-destroyed';


@Component({
  selector: 'ptcg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  public user: UserInfo;
  public loading: boolean;

  constructor(
    private alertService: AlertService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        this.loading = true;
        const userId = parseInt(paramMap.get('userId'), 10);
        return this.profileService.getUser(userId);
      }),
      takeUntilDestroyed(this)
    )
      .subscribe(response => {
        this.loading = false;
        this.user = response.user;
      }, async error => {
        await this.alertService.error('Error while loading the profile');
        this.router.navigate(['/']);
      });
  }

  getMatchHistory() {
    this.profileService.getMatchHistory(this.user.userId)
      .subscribe({
        next: response => console.log(response)
    });
  }

  ngOnDestroy() {}

}
