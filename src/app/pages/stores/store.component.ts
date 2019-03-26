import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Component, OnInit,ViewChild } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiService } from '../../services/api.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
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
    private dataservice: ApiService
  ) {
    this.router = router;
    this.getData();   
  }

  ngOnInit() {
   $(document).ready(function(){
      $('.dataTables_empty').html('');
      $('.dataTables_info').html('');
      $('.dataTables_length').html('<a class="btn btn-infor btn-sm mb-1" (click)="onAdd()" type="button"><i class="fa fa-plus"></i> Create a New Store</a>');
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
    this.blockUI.start('Loading Stores');    
  
    this.loadingIndicator = true;
    this.dataservice
        .fetchData('stores').subscribe( data => {         
          console.log(data)
          if (data.status === 200) {
             console.log(data.body);
             this.data = data.body;
             this.blockUI.stop();            
          } else {
          this.blockUI.stop();
            this.toastrService.error(data.message);
          }
        }, err => {this.toastrService.error('Could not Load Stores Data');  this.blockUI.stop();});

    this.loadingIndicator = false;
  }
  onEdit(data) {
    console.log(data);
    this.dataservice.EditFormData = data;
    this.router.navigate(['stores/update']);
  }
  onDelete(record) {
    console.log(record);
   this.blockUI.start('Deleting Store ........');    
  
    this.dataservice
        .deleteRecord('stores',record.id).subscribe( data => {       
           console.log(data);
          if (data.status === 200) {
             console.log(data.body);
             this.data = data.body;
             this.blockUI.stop();            
          } else {
          this.blockUI.stop();
            this.toastrService.error(data.message);
          }
        }, err => {console.log("Bad things happened");  this.blockUI.stop();});  
       //this.router.navigate(['onboarding']);
  }

  onAdd() {
    this.router.navigate(['stores/create']);
  }
}
   