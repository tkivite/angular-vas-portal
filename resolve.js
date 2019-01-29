$(document).ready(function() {


     $.ajax({
        type: 'get',
        url: 'pages/tasklist.php',
        success: function (result) {

            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });


$(".all-tasks-link").click(function () {

	$('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/tasklist.php',
        success: function (result) {

            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
         
});

$(".new-tasks-link").click(function () {
	$('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/taskform.php',
        success: function (result) {

            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
});


} );

function deleteTask(id){
if(confirm("Are you sure you want to delete this task?")){
$.ajax({
        type: 'get',
        url: 'global/process-form.php?f=delete-task',
        data: 'cell=' + id+'&action=delete',
        success: function (result) {

         alert(result);
          $('.dynamicContent').html("");
            console.log("loading data ....");
            $.ajax({
                type: 'get',
                url: 'pages/tasklist.php',
                data: 'id=' + id,
                success: function (result) {

                    $('.dynamicContent').html(result);
                }
            });
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
}
       
}

function sendData(){


    var form = $("#taskform");
    var formname = form.attr("name");
     $.ajax({
            type: 'post',
            url: 'global/process-form.php?f=' + formname ,
            data: $("[name='" + formname + "']").serialize() ,
            success: function (result) {
                alert(result);
                $('.dynamicContent').html("");
            console.log("loading data ....");
            $.ajax({
                type: 'get',
                url: 'pages/tasklist.php',
              
                success: function (result) {

                    $('.dynamicContent').html(result);
                }
            });
            },
            complete: function () {
            }
        });

};
function editData(){


    var form = $("#taskeditform");
    var formname = form.attr("name");
     $.ajax({
            type: 'post',
            url: 'global/process-form.php?f=' + formname ,
            data: $("[name='" + formname + "']").serialize() ,
            success: function (result) {
                alert(result);
                $('.dynamicContent').html("");
            console.log("loading data ....");
            $.ajax({
                type: 'get',
                url: 'pages/tasklist.php',
              
                success: function (result) {

                    $('.dynamicContent').html(result);
                }
            });
            },
            complete: function () {
            }
        });

};

function editTask(id){

    $('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/edittask.php',
        data: 'cell=' + id,
        success: function (result) {

            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
}

function closeForm(){

    $('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/tasklist.php',
        
        success: function (result) {

            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
}

function displayRowDetails(result, tr, row) {
    var returnVal = '<div id = "slider" class="slider">' + result + '</div>';
    //// console.log("returnval: "+returnVal);
    // alert(row.child().val());
    row.child(returnVal).show();
    //  // console.log('here');
    tr.addClass('shown');
    //// console.log('here2'); 

    $('div.slider', row.child()).slideDown();
    // // console.log('here3'); 


}

function dataCategory(category) {

    $('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/tasklist.php',
        data: 'category=' + category,
        success: function (result) {

            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
         
}
