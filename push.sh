#!/bin/bash
git add -A
git commit -m "${1:-update}"
git push -u origin claude/create-login-page-PtXBx
