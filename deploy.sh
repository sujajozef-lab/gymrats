#!/bin/bash
cd ~/gymrats
git pull origin claude/create-login-page-PtXBx
touch /var/www/sikerino_pythonanywhere_com_wsgi.py
echo "Done — app reloaded."
