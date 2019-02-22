import { SweetAlertService } from 'angular-sweetalert-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, AbstractControl,FormBuilder,Validators, FormArray} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DomSanitizer } from '@angular/platform-browser';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';

@Component({
  selector: 'app-businessentity',
  templateUrl: './businessentity.component.html',
  styleUrls: ['./businessentity.component.css']
})
export class BusinessentityComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  public masterLocations;
  public currentActive: any = 'GRID';
  public noDataDisplay: any = { emptyMessage: 'No data to display' };
  public EditData: any;
  public ActiveLinkID: any;
  public settings: any;
  public storesBE: any;
  public recordCount = 0;
  public contactsBE: any;
  public beContacts: any[] = [];
  public perPage: number = 25;
  public advancedFilters: FormGroup;
  public items: FormArray;
  public formBuilder: FormBuilder;
  public FormItem: FormArray;
  public filterList: any;
  public entityFilters = [];
  public entityFiltersleftSide = [];
  public entityFiltersrightSide = [];
  public daterange: any = {};
  public startDateRange: any;
  public endDateRange: any;
  loadingIndicator: any = false;
  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};
  @ViewChild('myTable') table: any;
  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private alertService: SweetAlertService
  ) {
    this.router = router;
    this.ActiveLinkID = sessionStorage.getItem('ActiveMenuId');
    this.getData();
    this.advancedFilters = fb.group({
      name: [''],
      code: [''],
      location: [''],
      status: [''],
      entityCategory: [''],
      approvalStatus: ['']
    });
  }

  ngOnInit() {
   $(document).ready(function(){

      $('.dataTables_length').html('<a class="btn btn-infor btn-sm mb-1" (click)="onAdd()" type="button"><i class="fa fa-plus"></i> Add Business Orgnisation</a>');
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      dom: 'rtip',
      pageLength: 10,
      processing: true
    };

  }
  // Load Grid Data
  getData() {
    this.blockUI.start('Loading Business Organisations');
    this.masterLocations = [ { "id": 1,"name": "Nairobi"},
                             { "id": 2,"name": "Mombasa"}]
    this.data = [
    { "id": 1,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 1,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 2,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 3,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 4,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 5,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 6,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 7,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 8,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 9,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 10,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 11,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 1,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 2,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 3,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 4,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 5,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 6,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 7,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 8,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 9,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 10,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 11,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 1,"name": "Titus" ,"country": "Uganda","telephone": "(020) 734519999","email": "tkivite@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 2,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 3,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 4,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 5,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 6,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 7,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 8,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 9,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 10,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1},
    { "id": 11,"name": "Game" ,"country": "Kenya","telephone": "(020) 7345182882","email": "infor@company.lipalater.com","status":1, "approvalStatus":1}
  ];
    this.loadingIndicator = true;
    const searchParams = {
      orderBy: 'id',
      orderDir: 'Desc',
      likeFields: []
    };
    this.noDataDisplay.emptyMessage = "No data to display";
    const strParams = encodeURIComponent(JSON.stringify(searchParams));
    this.blockUI.stop();
    this.loadingIndicator = false;
  }
  onEdit(data) {
    // console.log(data);
   // this.dataService.EditFormData = data;
    this.router.navigate(['pages/businessentity/update']);
  }

  onAdd() {
    this.router.navigate(['pages/businessentity/create']);
  }
}
   