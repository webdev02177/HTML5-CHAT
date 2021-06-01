<?php
session_start();
include ('../Config.php');
include_once('protect.php');
checkCanEnter('adminpanelForbiddenWords');

$webmasterid = $_SESSION['admin'];
$webmaster = Webmaster::get($webmasterid);

include ('lng/language.php');
!empty($_GET['lang']) ? $lng = new Language($_GET['lang']) : $lng = new Language();
$lng = $lng->getData();
$lngPage = $lng['forbiddenWords'];

include("../chatadmin/xcrud/xcrud.php");
$xcrud = Xcrud::get_instance();
$table = 'chat_forbiddenwords';
$xcrud->table($table);
$xcrud->pass_var('webmasterid', $webmasterid);
$xcrud->where('webmasterid =', $webmasterid);

$xcrud->columns('word');
$xcrud->fields('word');

$xcrud->field_tooltip('word', $lngPage['word']);

$xcrud->hide_button('save_new');
$xcrud->hide_button('return');
$xcrud->unset_title();
$xcrud->unset_view();
$xcrud->unset_csv();
$xcrud->unset_limitlist();
$xcrud->unset_numbers();
$xcrud->unset_print();
$xcrud->unset_sortable();

//	$xcrud->emails_label(' email');
//$xcrud->show_primary_ai_column(true);
?>
<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name=viewport content="width=device-width, initial-scale=1">
    <?php include 'css.php';?>
    <?php include 'js.php';?>

		<link rel="stylesheet" type="text/css" href="../css/common.css">

    <title><?php echo $lngPage['metaTtitle']; ?></title>
</head>

<body>
 <div class="panel panel-default admin-panel">
  <div class="panel-heading">
  	<Button class="btn a-header-btn" id="logout"><i class="fa fa-sign-out"></i> <?php echo $lng['menu']['logout']; ?></Button>
    <ul class="breadcrumb">
        <li><a href="loggedon.php"><?php echo $lng['menu']['loggedon']; ?></a></li>
        <li class="active"><?php echo $lng['menu']['forbiddenWords']; ?></li>
    </ul>
  </div>
  <div class="panel-body">
		<div class="flex-property adition-box margin-btm">
	    <?php include 'freeAccount.php';?>
		</div>
        <div>
            In <a href="config.php">Config pannel</a>, you can define what action to take when bad word is found: [nothing, hide, kick].
            <br><b>Warning</b>: Rude word filter users regular expression. Make sure you know how to user special chars only when you understand regex. Special chars to be avoided : <pre><b>/ ? * { ^ $ [ ] } ( ) </b></pre>
        </div>

		<div class="admin-table rooms-table">
    	    <?php echo $xcrud->render($webmasterid); ?>
		</div>
  </div>
</div>


<?php include 'footer.php';?>
</body>
</html>
