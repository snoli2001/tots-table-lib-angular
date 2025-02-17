import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TotsListResponse } from '@tots/core';
import { TotsDateColumn } from 'projects/tots/date-column/src/lib/column-factories/tots-date-column';
import { DateColumnComponent } from 'projects/tots/date-column/src/public-api';
import { TotsInputColumn } from 'projects/tots/editable-columns/src/lib/column-factories/tots-input-column';
import { TotsValidator } from 'projects/tots/editable-columns/src/lib/entities/tots-validator';
import { InputColumnComponent, TotsSelectColumn, TotsTableFullGroupComponent } from 'projects/tots/editable-columns/src/public-api';
import { TotsBalanceColumn } from 'projects/tots/table/src/lib/column-factories/tots-balance-column';
import { TotsBooleanColumn } from 'projects/tots/table/src/lib/column-factories/tots-boolean-column';
import { TotsCheckboxColumn } from 'projects/tots/table/src/lib/column-factories/tots-checkbox-column';
import { TotsIconButtonColumn } from 'projects/tots/table/src/lib/column-factories/tots-icon-button-column';
import { TotsMoreMenuColumn } from 'projects/tots/table/src/lib/column-factories/tots-more-menu-column';
import { TotsOptionColumn } from 'projects/tots/table/src/lib/column-factories/tots-option-column';
import { TotsStatusIconColumn } from 'projects/tots/table/src/lib/column-factories/tots-status-icon-column';
import { TotsStringColumn } from 'projects/tots/table/src/lib/column-factories/tots-string-column';
import { TotsTwoStringColumn } from 'projects/tots/table/src/lib/column-factories/tots-two-string-column';
import { TotsColumnOption } from 'projects/tots/table/src/lib/entities/tots-column-option';
import { TotsMoreMenuItem } from 'projects/tots/table/src/lib/entities/tots-more-menu-item';
import { TotsStatusIconColumnOption } from 'projects/tots/table/src/lib/entities/tots-status-icon-column-option';
import { BalanceCurrencyColumnComponent, BooleanColumnComponent, CheckboxColumnComponent, IconButtonColumnComponent, MoreMenuColumnComponent, OptionColumnComponent, StatusColumnComponent, StringColumnComponent, TotsActionTable, TotsColumn, TotsLinkColumn, TotsTableComponent, TotsTableConfig, TwoStringColumnComponent } from 'projects/tots/table/src/public-api';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @ViewChild('tableComp') tableComp!: TotsTableComponent;
  @ViewChild('tableCompGroup') tableCompGroup!: TotsTableFullGroupComponent;

  config = new TotsTableConfig();

  private id = 0;

  items = [
    { id: this.id++, title: 'Item 1, pedro', active: 1, subtitle: 'AB232', date: '2021-01-01', debit: 1000, credit: 500, website: "https://www.youtube.com/watch?v=5kMsykEAcjg" },
    { id: this.id++, title: 'Item 2', active: 1, subtitle: 'AB232', date: '2021-01-01', debit: 500, credit: 1000, edit_field: 'Pedro', website: "https://www.youtube.com/watch?v=5kMsykEAcjg" },
    { id: this.id++, title: 'Item 3', active: 0, subtitle: 'AB232', date: '2021-01-01' },
    { id: this.id++, title: 'Item 4', active: 0, subtitle: 'AB232', date: '2021-01-01', classCustom: 'tots-cell-item-green', edit_field: "dsdada", website: "https://www.youtube.com/watch?v=5kMsykEAcjg" },
    { id: this.id++, title: 'Item 5', active: 1, subtitle: 'AB232', date: '2021-01-01' },
  ];

  formGroup = new FormGroup({});

  ngOnInit(): void {
    //this.legacyConfig();
    //this.configThroughFactories();
    this.miniConfig();
  }

  onOrder(column: TotsColumn) {
    let response = new TotsListResponse();

    if(column.order == 'asc'){
      response.data = this.items.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    } else {
      response.data = this.items.sort((a,b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0))
    }

    this.config.obs = of(response);
    this.tableComp.loadItems();
  }

  onTableAction(action: TotsActionTable) {
    if(action.key == 'click-order'){
      this.onOrder(action.item);
    }else if (action.key == 'select-item') {
      action.item.isSelected = true;
    }else if (action.key == 'unselect-item') {
      action.item.isSelected = false;
    } else if (action.key == "form-change") {
      console.log(action.item.valid);
      console.log(action.item.values);
    } else if (action.key == "delete") {
      this.removeItem(action.item);
    } else if (action.key == "page-change") {
      this.changePage(action.item);
    }
  }

  legacyConfig() {
    this.config.id = 'table-example';
    this.config.columns = [
      { key: 'check', component: CheckboxColumnComponent, title: '', },
      { key: 'title', component: StringColumnComponent, title: 'Titulo', field_key: 'title', hasOrder: true, extra: { cutSeparator: ',' } },
      { key: 'subtitle', component: TwoStringColumnComponent, title: 'Titulo', field_key: 'title', hasOrder: false, extra: { field_subtitle_key: 'subtitle' } },
      { key: 'include', component: BooleanColumnComponent, title: 'Activo', field_key: 'active', hasOrder: false },
      { key: 'home', component: IconButtonColumnComponent, title: 'asd', field_key: 'active', hasOrder: false, extra: { icon: 'home', action: 'click-home' } },
      { key: 'balance', component: BalanceCurrencyColumnComponent, title: 'Balance', hasOrder: false, extra: { field_key_debit: 'debit', field_key_credit: 'credit' } },
      { key: 'active', component: OptionColumnComponent, title: 'Activo', field_key: 'active', hasOrder: false, extra: {
        field_rel_key: 'id',
        field_print_key: 'name',
        options: [
          { id: 1, name: 'Activo A' },
          { id: 0, name: 'Inactivo B' },
        ]
      } },
      { key: 'active2', component: StatusColumnComponent, title: 'Activo2', field_key: 'active', hasOrder: false, extra: {
        field_rel_key: 'id',
        field_print_key: 'name',
        options: [
          { id: 1, name: 'Activo A' },
          { id: 0, name: 'Inactivo B', background_color: 'rgba(128, 188, 0, 1)', font_color: 'white' },
        ]
      } },
      { key: 'date', component: DateColumnComponent, title: 'Date', field_key: 'date', hasOrder: false, extra: { format_in: 'YYYY-MM-DD', format_out: 'MM/DD/YYYY' } },
      { key: 'edit_field', component: InputColumnComponent, title: 'Edit', field_key: 'edit_field', extra: { validators: [Validators.required] } },
      { key: 'more', component: MoreMenuColumnComponent, title: '', extra: { stickyEnd: true, width: '60px', actions: [
        { icon: 'add', title: 'Editar', key: 'edit' },
        { icon: 'add', title: 'Eliminar', key: 'remove' },
      ]} },
    ];

    let data = new TotsListResponse();
    data.data = this.items;

    this.config.obs = of(data).pipe(delay(1000));
  }
  configThroughFactories() {
    this.config.id = 'table-example';

    this.config.columns = [
      new TotsCheckboxColumn("check"),
      new TotsStringColumn("title", "title", "Título", true),
      new TotsTwoStringColumn("subtitle", "title", "subtitle", "Título / Subtítulo"),
      new TotsBooleanColumn("include", "active", "Activo"),
      new TotsIconButtonColumn("home", "home", "click-home", "primary"),
      new TotsBalanceColumn("balance", "credit", "debit", "Balance"),
      new TotsOptionColumn("active", "active", [
        new TotsColumnOption(1, "Activo"),
        new TotsColumnOption(0, "Inactivo")
      ], "Activo"),
      new TotsStatusIconColumn("active2", "active", [
        new TotsStatusIconColumnOption(1, "person", "green"),
        new TotsStatusIconColumnOption(0, "clear", "red"),
      ], "Activo2"),
      new TotsDateColumn("date", "date", "Fecha", "YYYY-MM-DD", 'MM/DD/YYYY'),
      new TotsInputColumn("title", "title", [
        new TotsValidator(Validators.required, "required", "Requerido"),
      ], "Title input", undefined, "Ingrese un título"),
      new TotsInputColumn("edit_field", "edit_field", [
        new TotsValidator(Validators.required, "required", "Requerido"),
        new TotsValidator(Validators.min(0.0000001), "min", "Debe ser positivo"),
        new TotsValidator(Validators.pattern("^[0-9]*$"), "pattern", "Inválido")
      ], "Input", undefined, "Ingrese un número"),
      new TotsIconButtonColumn("delete", "delete", "delete", "warn"),
      new TotsMoreMenuColumn("more", [
        new TotsMoreMenuItem("edit", "Editar", "edit", "a_css_class"),
        new TotsMoreMenuItem("delete", "Eliminar", "delete"),
      ])
    ];

    let data = new TotsListResponse();
    data.data = [...this.items];

    this.config.obs = of(data);
  }
  miniConfig() {
    this.config.id = 'table-example';

    this.config.columns = [
      new TotsInputColumn("title", "title", [
        new TotsValidator(Validators.required, "required", "Requerido"),
      ], "Title input", this.formGroup, "Ingrese un título"),
      new TotsSelectColumn("active", "active", [
        new TotsColumnOption(1, "Activo"),
        new TotsColumnOption(0, "Inactivo"),
      ], [
        new TotsValidator(Validators.max(0), "max", "Max 0")
      ], "Active", this.formGroup, "Label", "Placeholder")
    ];

    let data = new TotsListResponse();
    data.data = [...this.items];
    data.total = 50;

    this.config.obs = of(data).pipe(delay(2000));
  }

  addItem() {
    this.items = [
      ...this.items,
      { id:this.id++, title: 'Item 5', active: 1, subtitle: 'AB232', date: '2021-01-01', edit_field: "pushed item" } as any
    ];

    let data = new TotsListResponse();
    data.data = this.items;

    this.config.obs = of(data);
    this.tableCompGroup?.loadItems();
  }

  removeItem(item:any) {
    this.items = this.items.filter(i=> i.id != item.id)
    let data = new TotsListResponse();
    data.data = this.items;

    this.config.obs = of(data);
    this.tableCompGroup?.loadItems();
  }

	private changePage(pageEvent:PageEvent) {
    let data = new TotsListResponse();
    data.data = [...this.items];
    data.total = 50;

    this.config.obs = of(data).pipe(delay(2000));
    this.tableComp.loadItems();
	}
}