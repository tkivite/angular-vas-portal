<?php

ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('auto_detect_line_endings', true);
include("wrqe24rt.php");
include("functions.php");

$postdata = file_get_contents('php://input');
if ($postdata == '')
    $postdata = $_POST;
$action = $_GET['action'];
session_start();
//    Extract POST to variables

//extract($clean);
GLOBAL $dblink;



foreach ($_POST as $key => $value) {
    $_POST[$key] = mysqli_real_escape_string($dblink, $value);
}
extract($_POST);
extract($_GET);
$failCount = 0;
//$action = $_GET[action];
$user = $_SESSION['user_id'];
if (preg_match('/^[-a-zA-Z0-9_ .]+$/', $_GET['f']) || empty($_GET['f'])) {

    $f = $_GET['f'];
} else {
    echo "An error encountered while processing your request";
    exit;
}

switch (strtoupper($f)) {

   
    case "POST-TASK":

           $timestamp = date('Y-m-d H:i:s', strtotime($scheduledtime));
           $sql = "insert into tasks (title,description, status,scheduled_time) values(?,?,?,?)";
            $sql = $dblink->prepare($sql);
            $sql->bind_param("ssss", $title, $description,$status,$timestamp);
            $sql->execute();
            //LogInFile("New Record", $_POST, $sql);
            // auditAction("Ticket Creation", "Created Ticket $id ", $_SERVER[
            echo "Task Created Successfully";


        break;

 case "EDIT-TASK":

             $timestamp = date('Y-m-d H:i:s', strtotime($scheduledtime));
        
            $sql = "update tasks set title = ?, description = ?, status = ?,scheduled_time = ? where ID = ? ";
            $sql = $dblink->prepare($sql);
            $sql->bind_param("sssss", $title, $description,$status,$timestamp,$cell);
            $sql->execute();
           // LogInFile("Group Update", $_POST, $sql);

            echo "Task Updated Successfully";
        
       
        break;  

 case "DELETE-TASK":

      
        
            $sql = "Delete from tasks where ID = ? ";
            $sql = $dblink->prepare($sql);
            $sql->bind_param("s",$cell);
            $sql->execute();
           // LogInFile("Group Update", $_POST, $sql);

            echo "Task Deleted Successfully";
        
        //header('Location: ../');
        break;         

  

}


?>
