import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { TotsListResponse } from '@tots/core';
import { Subject, tap } from 'rxjs';
import { TotsActionTable } from '../../entities/tots-action-table';
import { TotsColumn } from '../../entities/tots-column';
import { TotsTableConfig } from '../../entities/tots-table-config';
import { TOTS_TABLE_DEFAULT_CONFIG, TotsTableDefaultConfig } from '../../entities/tots-table-default-config';

@Component({
  selector: 'tots-table',
  templateUrl: './tots-table.component.html',
  styleUrls: ['./tots-table.component.scss']
})
export class TotsTableComponent implements OnInit {

  @Input() config = new TotsTableConfig();
  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 50;
  @Input() hasPagination: boolean = true;
  @Input() messageNotFound! : string;

  @Output() onAction = new EventEmitter<TotsActionTable>();
  privateActions = new Subject<TotsActionTable>();

  isLoading = true;
  firstLoad = true;
  dataItems?: TotsListResponse<any>;
  displayColumns: Array<String> = [];

  constructor(
    @Inject(TOTS_TABLE_DEFAULT_CONFIG) private totsTableDefaultConfig : TotsTableDefaultConfig,
    protected changeDectetor: ChangeDetectorRef
  ) {
    console.log(this.totsTableDefaultConfig.messageNotFound);
    
    this.messageNotFound = this.totsTableDefaultConfig.messageNotFound!;
  }

  ngOnInit(): void {
    this.loadConfig();
    this.loadItems();
  }

  onClickOrder(column: TotsColumn) {
    if(!column.hasOrder){ return; }
    let orderColumn = column.order;
    this.config.columns.forEach(c => c.order = undefined);
    column.order = orderColumn == 'asc' ? 'desc' : 'asc';
    this.onAction.emit({ key: 'click-order', item: column });
  }

  onClickRow(item: any) {
    this.onAction.emit({ key: 'click-row', item: item });
  }

  onPageChange(event: PageEvent) {
    this.onAction.emit({ key: 'page-change', item: event });
  }

  loadItems() {
    this.dataItems = undefined;
    this.isLoading = true;
    return this.config.obs?.pipe(tap(res => this.dataItems = res))
    .pipe(tap(res => this.onAction.emit({ key: 'loaded-items', item: undefined })))
    .subscribe(()=> this.stopLoading());
  }

  private stopLoading() {
    this.isLoading = false;
    this.firstLoad = false;
  }

  loadConfig() {
    this.loadColumns();

    this.privateActions.subscribe(action => {
      this.onAction.emit(action);
    });
  }

  loadColumns() {
    this.displayColumns = this.config.columns.filter(c => c.is_show || c.is_show == undefined).map(c => c.key);
  }

  getDataItems(): TotsListResponse<any> | undefined {
    return this.dataItems;
  }

  refreshDataItems(newData: TotsListResponse<any> | undefined) {
    this.dataItems = newData;
  }

  detectChanges() {
    this.changeDectetor.detectChanges();
  }
}
