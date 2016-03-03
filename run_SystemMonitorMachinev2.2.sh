#!/bin/bash

# LOCAL
export MONGO_URL=mongodb://userdp:passdp@0.0.0.0:27017/systemmonitormachinedb
export MAIL_URL=smtp://sendgrid40703@modulus.io:gi0vvnct@smtp.sendgrid.net:587
meteor --port 3011
