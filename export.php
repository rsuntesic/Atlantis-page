<?php

define('BASE_URL', $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].pathinfo($_SERVER['SCRIPT_NAME'], PATHINFO_DIRNAME));

// function copyDir($src ,$dest){
	
// mkdir($dest.DIRECTORY_SEPARATOR.$src.DIRECTORY_SEPARATOR.$value);

// $scan = scandir($src);
// foreach ($scan as $key => $value) {
	
// 	if (is_dir($src.DIRECTORY_SEPARATOR.$value)) {
// 		if ($value !== '.' && $value !== '..') {
// 			copyDir($src.DIRECTORY_SEPARATOR.$value, $dest.DIRECTORY_SEPARATOR.$src.DIRECTORY_SEPARATOR.$value);
// 		}
// 	}else{
// 		$file = file_get_contents($src.DIRECTORY_SEPARATOR.$value);
// 		file_put_contents($dest.DIRECTORY_SEPARATOR.$src.DIRECTORY_SEPARATOR.$value, $file);
// 		$newfile = file_get_contents($dest.DIRECTORY_SEPARATOR.$src.DIRECTORY_SEPARATOR.$value);

// 		if (file_exists($dest.DIRECTORY_SEPARATOR.$src.DIRECTORY_SEPARATOR.$value) && $file === $newfile ) {
// 			echo "<pre> file ".$value.'<strong> copied to </strong>'.$dest.DIRECTORY_SEPARATOR.$src ;
// 			}else{
// 				echo "<pre> file ".$value.'<strong> failed to copy </strong>' ;
// 			}
// 		}
// 	}
// }

define('DS', DIRECTORY_SEPARATOR); // I always use this short form in my code.

    function copyDir( $path, $dest )
    {
        if( is_dir($path) )
        {
            @mkdir( $dest );
            $objects = scandir($path);
            if( sizeof($objects) > 0 )
            {
                foreach( $objects as $file )
                {
                    if( $file == "." || $file == ".." )
                        continue;
                    // go on
                    if( is_dir( $path.DS.$file ) )
                    {
                        copyDir( $path.DS.$file, $dest.DS.$file );
                    }
                    else
                    {
                        copy( $path.DS.$file, $dest.DS.$file );
                    }
                }
            }
            return true;
        }
        elseif( is_file($path) )
        {
            return copy($path, $dest);
        }
        else
        {
            return false;
        }
    }


function deleteDir($dir){

$scan = scandir($dir);
foreach ($scan as $key => $value) {
if (is_dir($dir.DIRECTORY_SEPARATOR.$value)) {
	if ($value !== '.' && $value !== '..') {
		deleteDir($dir.DIRECTORY_SEPARATOR.$value);
	}
}else{
	unlink($dir.DIRECTORY_SEPARATOR.$value);
	}
}
rmdir($dir);
}

function exportPhp($src, $dest){
	
$scan = scandir($src,1);
mkdir($dest);

foreach ($scan as $key => $value) {
	
	if (is_file($src.'/'.$value)) {
				
		if ($value === 'home.php') {
			$filename = str_replace('.php' , '' , $value);		
			$url = BASE_URL.'/'.$filename.'?export';
			$file = file_get_contents($url, true);
			$newFile = str_replace('home.php' , 'index.html' , $value);
			$newfile = $dest.DIRECTORY_SEPARATOR.$newFile;
			file_put_contents($newfile, $file );
		}else{
			$filename = str_replace('.php' , '' , $value);	
			$url = BASE_URL.'/'.$filename.'?export';
			$file = file_get_contents($url, true);
			$newFile = str_replace('.php' , '.html' , $value);
			$newfile = $dest.DIRECTORY_SEPARATOR.$newFile;
			file_put_contents($newfile, $file );
		}
		if (file_exists($newfile)) {
			echo "<pre> file ".$value.'<strong> exported to</strong>  '.$newfile ;
			}
		}
	}
}


$scan = scandir(__DIR__);

?>
<form action="" method="post">

	<h2>Chose folders to copy to exported-html</h2>
	<h2>All .php files from template folder are being exported to .html in exported-html folder</h2>
	
<?php

foreach ($scan as $key => $value) {
	if (is_dir(__DIR__ .DIRECTORY_SEPARATOR.$value) && $value !== 'template' && $value !== 'exported-html') {
		if ($value !== '.' && $value !== '..') {
			?>
			<input type="checkbox" name="dirs[]" value="<?= $value ?>" >: <?= $value ?>
			<br>	
			<?php
		}
	}
}
	?>
	<br>
	<input type="submit">
</form>
<?php  	
if (isset($_POST['dirs']) && !empty($_POST) ) {
	
	if (file_exists('exported-html')) {
		deleteDir('exported-html');
		mkdir('exported-html');
		$dir = 'exported-html';
}else{
	mkdir('exported-html');
	$dir = 'exported-html';
}
foreach ($_POST['dirs'] as $key => $src) {
	copyDir($src ,$dir.'/'.$src);
	}
exportPhp('template' , $dir);
echo "<h1>Files succesfully exported to exported-html</h1>";
}

?>