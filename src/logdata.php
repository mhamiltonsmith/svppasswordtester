<br />
<b>Notice</b>:  Undefined index: system in <b>/var/www/svp3008/logdata.php</b> on line <b>4</b><br />
<br />
<b>Notice</b>:  Undefined index: user in <b>/var/www/svp3008/logdata.php</b> on line <b>5</b><br />
<br />
<b>Notice</b>:  Undefined index: scheme in <b>/var/www/svp3008/logdata.php</b> on line <b>6</b><br />
<br />
<b>Notice</b>:  Undefined index: mode in <b>/var/www/svp3008/logdata.php</b> on line <b>7</b><br />
<br />
<b>Notice</b>:  Undefined index: data in <b>/var/www/svp3008/logdata.php</b> on line <b>9</b><br />
<br />
<b>Fatal error</b>:  Uncaught Error: Call to undefined function mysql_connect() in /var/www/svp3008/databasefunctions.php:10
Stack trace:
#0 /var/www/svp3008/databasefunctions.php(68): connectDB()
#1 /var/www/svp3008/logdata.php(11): queryDB('INSERT INTO log...')
#2 {main}
  thrown in <b>/var/www/svp3008/databasefunctions.php</b> on line <b>10</b><br />
