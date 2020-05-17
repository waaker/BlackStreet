#!/bin/bash

mongorestore dump/blackstreet_db/accounts.bson
echo "[OK] 'accounts' collection restored" 
