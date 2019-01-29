<?php
$hostname_dbConn = "localhost";
$DB_dbConn = "task-manager";
$username_dbConn = "root";
$password_dbConn = "1SUPERtitus";
$dblink= new mysqli($hostname_dbConn, $username_dbConn, $password_dbConn,$DB_dbConn );
if($dblink->connect_errno > 0){
    die('Unable to connect to database [' . $dblink->connect_error . ']');
}

?>
