import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'Lipalater VAS Portal';
  partner ='Game -Garden City';

  activeIds: string[] =[];
  panels = [0, 1,2,3]
  public currentActive: any = 'DISABLED';

  public itemsList: Object[] = [
    {
      title: 'Collapsible Group Item #1',
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS.'
    },
    {
      title: 'Collapsible Group Item #2',
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS.'
    },
    {
      title: 'Collapsible Group Item #3',
      description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS.'
    }
  ];

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
