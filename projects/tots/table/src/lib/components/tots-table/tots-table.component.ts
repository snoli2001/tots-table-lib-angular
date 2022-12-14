import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TotsListResponse } from '@tots/core';
import { Subject, tap } from 'rxjs';
import { TotsActionTable } from '../../entities/tots-action-table';
import { TotsTableConfig } from '../../entities/tots-table-config';

@Component({
  selector: 'tots-table',
  templateUrl: './tots-table.component.html',
  styleUrls: ['./tots-table.component.scss']
})
export class TotsTableComponent implements OnInit {

  @Input() config = new TotsTableConfig();
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 50;

  @Output() onAction = new EventEmitter<TotsActionTable>();

  isLoading = true;
  dataItems?: TotsListResponse<any>;
  displayColumns: Array<String> = [];

  ngOnInit(): void {
    this.loadConfig();
  }

  onClickRow(item: any) {
    this.onAction.emit({ key: 'click-row', item: item });
  }

  onPageChange(event: PageEvent) {
    this.onAction.emit({ key: 'page-change', item: event });
    this.loadItems();
  }

  loadItems() {
    this.isLoading = true;
    this.config.obs?.
    pipe(tap(res => this.dataItems = res)).
    subscribe(res => this.isLoading = false);
  }

  loadConfig() {
    this.loadColumns();
  }

  loadColumns() {
    this.displayColumns = this.config.columns.filter(c => c.is_show || c.is_show == undefined).map(c => c.key);
  }
}
