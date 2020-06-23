import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Creator } from '@module/data/types/creator';
import { CreatorService } from '@module/data/service/creator.service';
import { IdentifierService } from '@module/data/service/identifier.service';
import { HalIdentifier } from '@module/data/types/hal-identifier';
import { Location } from '@angular/common';
import { DatabaseService } from '@module/data/service/database.service';

@Component({
  selector: 'app-creator-identifier-performance-date',
  templateUrl: './creator-identifier-performance-date.component.html',
  styleUrls: ['./creator-identifier-performance-date.component.scss']
})
export class CreatorIdentifierPerformanceDateComponent {
  public creator: Creator;
  public performanceDate: string;
  public halIdentifier: HalIdentifier;
  public keys: string[];

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private creatorService: CreatorService,
    private identifierService: IdentifierService,
    private database: DatabaseService
  ) {

    this.route.params.subscribe(params => {
      this.creatorService.find(params.creator_id).subscribe(creator => {
        this.creator = creator;
        this.performanceDate = params.performance_date;
        this.titleService.setTitle(creator.name + ' · ' + params.performance_date);

        this.database.keys().subscribe(keys => this.keys = keys);

        this.identifierService.findByCreatorAndPerformanceDate(creator.name, params.performance_date)
          .subscribe(halIdentifier => {
            if (halIdentifier._embedded.identifier.length === 1) {
              this.router.navigate(['/trove/identifier', halIdentifier._embedded.identifier[0].id]);
              this.location.replaceState('/trove/identifier/' + halIdentifier._embedded.identifier[0].id);
              return;
            }

            console.log(halIdentifier);

            this.halIdentifier = halIdentifier;
          });
      });
    });
  }

  public identifierDetail(id) {
    this.router.navigate(['/trove/identifier',  id]);
  }
}
