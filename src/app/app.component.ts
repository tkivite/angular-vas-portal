import { Component, OnInit} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Lipalater VAS Portal';
  partner ='Game -Garden City';

  activeIds: string[] =[];
  panels = [0, 1,2,3]

  openAll()
  {
    this.activeIds = this.panels.map(p => "panel-"+ p);
    console.log(this.activeIds);
  }
    public isCollapsed = false;

  public ngOnInit()
  {
    $(document).ready(function(){
      
            $('#sidebarCollapse').on('click', function () {
                $('#sidebar').toggleClass('active');
            }); 
            $('.more-less').on('click', function (e) {   
            $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('fa-plus fa-minus');
            }  );
  
    //$('.panel-group').on('hidden.bs.collapse', toggleIcon);
   // $('.panel-group').on('shown.bs.collapse', toggleIcon);

    });

      function toggleIcon(e) {
        $(e.target)
            .prev('.panel-heading')
            .find(".more-less")
            .toggleClass('fa-plus fa-minus');
    }

  }
  
}
