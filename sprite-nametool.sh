#!/usr/bin/sh

for entry in $(ls -1 static/images/*.png); do
    echo "'$entry',"
done