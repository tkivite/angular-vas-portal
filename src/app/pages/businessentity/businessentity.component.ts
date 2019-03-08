import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Component, OnInit,ViewChild } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
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
  public currentActive: any = 'GRID';
  public noDataDisplay: any = { emptyMessage: 'No data to display' };
  public recordCount = 0;
  
  loadingIndicator: any = false;
  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};
  @ViewChild('myTable') table: any;
  constructor(
    router: Router,
    public toastrService: ToastrService,
    public datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private dataservice: ApiService
  ) {
    this.router = router;
    this.getData();   
  }

  ngOnInit() {
   $(document).ready(function(){
      $('.dataTables_empty').html('');
      $('.dataTables_info').html('');
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
    //load data
    this.loadingIndicator = true;
    this.dataservice
        .fetchData('partners').subscribe( data => {
          console.log(data);
          this.data = data;
         /* this.blockUI.stop();
          if (data.status === 200) {
            this.data = data.result;
            
          } else {
            this.toastrService.error(data.message);
          }*/
        });
    this.noDataDisplay.emptyMessage = "No data to display";
    this.blockUI.stop();
    this.loadingIndicator = false;
  }
  onEdit(data) {
    // console.log(data);
   // this.dataService.EditFormData = data;
    this.router.navigate(['onboarding/update']);
  }

  onAdd() {
    this.router.navigate(['onboarding/create']);
  }
}
   