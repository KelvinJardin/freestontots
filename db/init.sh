#!/bin/bash

echo "** Waiting for MySQL to start"

# Wait until MySQL is ready to accept connections
until mysql -u root -p$MYSQL_ROOT_PASSWORD -e "status"; do
  echo "MySQL is unavailable - sleeping"
  sleep 5
done

echo "** MySQL is ready - setting privileges"

mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%';"
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "GRANT CREATE, DROP, REFERENCES, ALTER ON *.* TO '$MYSQL_USER'@'%';"
