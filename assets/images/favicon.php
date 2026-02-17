<?php
header('Content-type: image/svg+xml');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

$color = isset($_GET['c']) ? $_GET['c'] : 'e9f2ea';
$color = preg_replace('/[^0-9a-fA-F]/', '', $color);
if ($color === '' || !preg_match('/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', $color)) {
	$color = 'e9f2ea';
}
$color = strtolower($color);
if (strlen($color) === 3) {
	$color = $color[0].$color[0].$color[1].$color[1].$color[2].$color[2];
}

// If the selected background is too bright, force black for visibility.
$r = hexdec(substr($color, 0, 2));
$g = hexdec(substr($color, 2, 2));
$b = hexdec(substr($color, 4, 2));
$luminance = (0.2126 * $r) + (0.7152 * $g) + (0.0722 * $b);
if ($luminance >= 225) {
	$color = '000000';
}
?>
<svg id="Calque_2" data-name="Calque 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 263.52 263.52">
	<title>favicon</title>
	<path fill="#<?php echo $color; ?>" d="M131.76,0A131.77,131.77,0,0,0,85.22,255.05c0-4.91.1-9.82.19-14.74.35-19.47.76-38.94,1.13-58.41.35-18.14.8-36.27,1-54.41.06-5.8-.61-11.61-1-17.42-.27-4.47,1.25-6.64,6.29-6.51,11.48.32,23,.1,34.48.1,10.16,0,20.34.28,30.49-.06,18.23-.61,32.57,11.52,37.49,27.92,4.22,14.06,5.26,28.38,1.11,42.74-4.62,16-20.52,27.88-37.11,28.62-12.28.55-24.53,1.87-36.77,3.13-1.1.12-2.83,2.29-2.83,3.51q0,26.73.31,53.47c3.87.34,7.79.53,11.76.53A131.76,131.76,0,0,0,131.76,0Z"/>
	<path fill="#<?php echo $color; ?>" d="M138.35,184.53c4.33,0,8.67.12,13,0,13.81-.46,22.7-7.6,24.7-20a41,41,0,0,0,.23-10c-1.05-11.76-4.86-22.58-17.16-26.2C147.89,125,136,123.86,124.4,122c-.75-.12-2.6,2.15-2.7,3.41-.57,7-.88,13.94-1,20.92-.26,11.62-.28,23.25-.5,34.87-.06,2.77,1.32,3.36,3.7,3.32C128.69,184.48,133.52,184.53,138.35,184.53Z"/>
</svg>
