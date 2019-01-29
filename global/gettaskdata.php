<?php

include_once('wrqe24rt.php');

$requestData= $_REQUEST;
 
 
$columns = array(
    0 =>'title',
    1 => 'description',
    2=> 'status'
);
 
$sql = "SELECT title,description, status FROM tasks";
$query=mysqli_query($conn, $sql);
$totalData = mysqli_num_rows($query);
$totalFiltered = $totalData;
 
$searchKeyWord = htmlspecialchars($requestData['search']['value']);
if( !empty($searchKeyWord) ) {
    $sql.=" WHERE title LIKE '".$searchKeyWord."%' ";
    $sql.=" OR description LIKE '".$searchKeyWord."%' ";
    $sql.=" OR status LIKE '".$searchKeyWord."%' ";
    $query=mysqli_query($conn, $sql);
    $totalFiltered = mysqli_num_rows($query);
 
}
    $sql.=" ORDER BY ". $columns[$requestData['order'][0]['column']]."   ".$requestData['order'][0]['dir']."   LIMIT ".$requestData['start']." ,".$requestData['length']."   ";
    $query=mysqli_query($conn, $sql);
 
 
$data = array();
while( $row=mysqli_fetch_array($query) ) {
    $data[] = ['id'=>$row['ID'],'title'=>$row['title'],'description'=>$row['description'],'status'=>$row['status']];
}
 
 
 
$json_data = array(
    "draw"            => intval( $requestData['draw'] ),
    "recordsTotal"    => intval( $totalData ),
    "recordsFiltered" => intval( $totalFiltered ),
    "data"            => $data
);
 
echo json_encode($json_data);