$(document).ready(function() {

     $.ajax({
        type: 'get',
        url: 'pages/dashboard.html',
        success: function (result) {

            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });

     $(".home-link").click(function () {
        $('.dynamicContent').html("");
        $.ajax({
                type: 'get',
                url: 'pages/dashboard.html',
                success: function (result) {

                    $('.dynamicContent').html(result);
                    //loadDatatable();

                },
                complete: function () {
                    $('#loadingAdd').hide();
                }
            });

     });

$(".sales-link").click(function () {

	$('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/sales2.html',
        success: function (result) {

            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
         
});

$(".verify-collection-link").click(function () {
	$('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/verifyCollection.html',
        success: function (result) {
            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
});

$(".notification-link").click(function () {
    $('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/notifications.html',
        success: function (result) {
            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
});

$(".released-link").click(function () {
    $('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/releaseditems.html',
        success: function (result) {
            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
});

$(".users-link").click(function () {
    $('.dynamicContent').html("");
    console.log("loading data ....");
    $.ajax({
        type: 'get',
        url: 'pages/users.html',
        success: function (result) {
            $('.dynamicContent').html(result);
            //loadDatatable();

        },
        complete: function () {
            $('#loadingAdd').hide();
        }
    });
});


$("td.details-control").click(function () {

    console.log('expanding');
    var table = $('#userstable').DataTable();
    var tr = $(this).closest('tr');
    var row = table.row(tr);
    var d = tr.attr("title");
    var subid = "view";
    if (row.child.isShown()) {

        $('div.slider', row.child()).slideUp(function () {

            row.child.hide();
            tr.removeClass('shown');
        });
    } else {

        // data: 'key=' + d + '&sid=' + subid + '&id=' + $('#page_id').val(),

        var page_id = $('#this_page_id').val();
         displayRowDetails('<span>Testing Expansion</span>', tr, row);

        // $.ajax({
        //     type: 'get',
        //     url: '../../cmis/Shared/php/resolve.php',
        //     data: 'key=' + d + '&sid=' + subid + '&id=' + page_id,
        //     success: function (result) {
        //         console.log('key=' + d + '&sid=' + subid + '&id=' + $('#page_id').val());

        //         displayRowDetails(result, tr, row);
        //     },
        //     complete: function () {

        //     }
        // });
    }

});

















} );
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

function toggleValid(code){
    $(".untilCodeisReceived").show();
    $("#ccc").val(code);
    $("#idnumber").val('20193856');
    $("#confirmation_response").html("<div class='alert alert-success confirmed'><i class='fa fa-check'></i> Validation Successful</div>");
    $("#confirmation_customer").html("<div class='alert alert-success confirmed'> Jackson Kiarie</div>");
    $("#confirmation_item").html("<div class='alert alert-success confirmed'> Dining Table</div>");
    $("#confirmation_approvedamount").html("<div class='alert alert-success confirmed'> KES 35,000</div>");
}

function toggleInvalid(){
    $(".untilCodeisReceived").hide();
    $(".untilCodeisReceived.response").show();
    $(".untilCodeisReceived.ccc").show();
    $("#confirmation_response").html("<div class='alert alert-danger'><i class='fa fa-exclamation'></i> Validation Failed </div>");
    // $("#confirmation_customer").html("<div class='alert alert-warning'> None</div>");
    // $("#confirmation_item").html("<div class='alert alert-warning'> None</div>");
    // $("#confirmation_approvedamount").html("<div class='alert alert-warning'> N/A</div>");
}
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
