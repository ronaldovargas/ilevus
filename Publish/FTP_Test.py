#!/usr/bin/python3
# -*- coding: utf-8 -*-
"""
Created on Frusday Jun 30 13:48:38 2016

@author: Ivan Nascimento Feliciano
"""
import glob
import os
import shutil
import subprocess
import zipfile
import ftplib
import uuid

print("Connecting to FTP!")
session = ftplib.FTP('ftp.ilevus.com', 'ivan', 'agnus.001', 'acct')
#session = ftplib.FTP("209.126.127.168", "administrator", "col?.002_Mereo")
print("Conectado!")

files = session.dir()

print(files)
#Troca o diretorio de trabalho atual
##os.chdir(dirzip)
##file = open('Ilevus_' + zipUuidName + '.zip','rb') 
##
##print("Sending File...")
##
##ftp_destino = session.pwd() + dir_on_ftp;
##session.cwd(ftp_destino)
##session.storbinary('STOR Ilevus_' + zipUuidName + '.zip', file)
##
##print("Done!")
##
##file.close()
##session.quit()
##
##print("Connection Closed")
