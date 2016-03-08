#!/bin/bash

#=========================================================================================
#  @file         run.js
#  @path         /
#  @description  script para rodar o projeto em ambiente de desenvolvimento
#                configurando o banco, servidor de envio de e-mail e a porta de execução.
#  @author       MateusDeveloper
#  @contact      mateus.developer@gmail.com
#  @copyright    Copyright Mateus Cardoso Nunes
#=========================================================================================

# LOCAL
export MONGO_URL=mongodb://userdp:passdp@0.0.0.0:27017/systemmonitormachinedb
export MAIL_URL=smtp://sendgrid40703@modulus.io:gi0vvnct@smtp.sendgrid.net:587
meteor --port 3011
