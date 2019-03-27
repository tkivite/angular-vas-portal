import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements  OnInit {
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
       $(document).ready(function() {
          $('.dataTables_empty').html('');
          $('.dataTables_info').html('');
          $('.dataTables_length').
          html('<a class="btn btn-infor btn-sm mb-1" (click)="onAdd()" type="button"><i class="fa fa-plus"></i> Add user</a>');
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
        this.blockUI.start('Loading Users .............');

        this.loadingIndicator = true;
        this.dataservice
            .fetchData('users').subscribe( data => {
              if (data.status === 200) {
                console.log(data.body);
                this.data = data.body;
                this.blockUI.stop();
             } else {
             this.blockUI.stop();
             this.toastrService.error('Something Went Wrong, We could not complete the request');
             }
           }, err =>
           {
             console.log('Something Went Wrong, We could not complete the request');
             this.blockUI.stop();
             this.toastrService.error('Something Went Wrong, We could not complete the request');
           });
       // this.blockUI.stop();
        this.loadingIndicator = false;
      }
      onEdit(data) {
        console.log(data);
        this.dataservice.EditFormData = data;
        this.router.navigate(['users/update']);
      }
      onDelete(record) {
        console.log(record);
        this.blockUI.start('Deleting User ........');

        this.dataservice
            .deleteRecord('users', record.id).subscribe( data => {
               console.log(data);
               if (data.status === 200) {
                console.log(data.body);
                this.data = data.body;
                this.blockUI.stop();
                this.toastrService.success('Record has been trashed');
             } else {
             this.blockUI.stop();
             this.toastrService.error('Something Went Wrong, We could not complete the request')
             }
           }, err =>
           {
             console.log('Something Went Wrong, We could not complete the request');
             this.blockUI.stop();
             this.toastrService.error('Something Went Wrong, We could not complete the request');
           });
           // this.router.navigate(['onboarding']);
      }

      onAdd() {
        this.router.navigate(['users/create']);
      }
    }
