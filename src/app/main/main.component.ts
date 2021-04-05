import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { RepositoriesService } from '../repositories.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  public form: FormGroup;
  public dataSource = [];

  public readonly displayedColumns = ['result-column', 'actions'];

  private favouriteKey = 'favouriteKey';

  constructor(private fb: FormBuilder, private repositoryService: RepositoriesService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      search: this.fb.control('')
    });

    this.form.controls.search.valueChanges.pipe(
      debounceTime(1000),
      switchMap(filter => {
        return this.repositoryService.getRepositories(filter);
      })
    ).subscribe(value => {
      this.dataSource = value.items;
    });

    const favouriteItems = JSON.parse(localStorage.getItem(this.favouriteKey)) as any[];
    this.dataSource = favouriteItems;
  }

  public addToFavourite(element): void {
    let favouriteItems = JSON.parse(localStorage.getItem(this.favouriteKey)) as any[];
    if (favouriteItems.includes(element)) {
      return;
    }
    localStorage.removeItem(this.favouriteKey);

    if (!favouriteItems) {
      favouriteItems = [];
    }
    favouriteItems.push(element);
    localStorage.setItem(this.favouriteKey, JSON.stringify(favouriteItems));
  }

  public search(): void {
    this.repositoryService.getRepositories(this.form.controls.search.value).subscribe(value => {
      this.dataSource = value.items;
    });
  }

}

