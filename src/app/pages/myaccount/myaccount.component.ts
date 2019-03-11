import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import {HttpClient, HttpParams, HttpRequest, HttpEvent,HttpResponse,HttpEventType} from '@angular/common/http';


import { UploadService } from './../../services/fileuploader.service';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
public formAdd: FormGroup;

  constructor(public upload: UploadService,fb: FormBuilder,private elem: ElementRef) { 
this.formAdd = fb.group({
      datafile: ['', Validators.compose([Validators.required])],
      fileName: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  }

    onDropFile(event: DragEvent) {
    event.preventDefault();
   // this.uploadFile(event.dataTransfer.files);
  }

  // At the drag drop area
  // (dragover)="onDragOverFile($event)"
  onDragOverFile(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  // At the file input element
  // (change)="selectFile($event)"
 // selectFile(event) {
 //  this.uploadFile(event.target.files);
 // }
public onUserSubmit(form: FormGroup) {
    console.log('Adding File Upload');
    const files = this.elem.nativeElement.querySelector('#selectFile').files;


    let file: File = files[0];

    this.upload.uploadFile("backend url/api/flash/upload", file)
      .subscribe(
        event => {
          if (event.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${percentDone}% loaded.`);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely loaded!');
          }
        },
        (err) => {
          console.log("Upload Error:", err);
        }, () => {
          console.log("Upload done");
        }
      )
  }

}
