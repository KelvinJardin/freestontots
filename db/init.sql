-- Grant permissions to user
CREATE DATABASE IF NOT EXISTS freestontots;
GRANT CREATE, ALTER, DROP, REFERENCES ON *.* TO 'mysqlUser'@'%';
FLUSH PRIVILEGES;
