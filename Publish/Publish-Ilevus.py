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

# CONFIGURAÇÕES
solutionPath = "C:\\Users\\Ivan\\Source\\Repos\\Ilevus\\"
raiz = solutionPath + "Ilevus\\"
msbuild = "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\msbuild.exe"
config = ["/t:Build;PipelinePreDeployCopyAllFilesToOneFolder", "/p:VisualStudioVersion=14.0;Configuration=Debug;SolutionDir=\"" + solutionPath + "\";_PackageTempDir=", "/tv:14.0"]
dirDeployLocal = "C:\\deploy\\"
dirDeploy = "C:\\projects\\Publish\\Ilevus\\"
zipUuidName = str(uuid.uuid4())

# List of e-mails to notify about publication on lan-dev-mereo
email_notify = "ivan.feliciano@ilevus.com";
mailsubject= "Ilevus Publish Notice:"
send_emails=False
dirzip = "C:\\projects\\Publish\\"
dir_on_ftp = "/VERSAO/"

#7ip
sz = "C:\\Program Files\\7-Zip\\7z.exe"
source = dirDeployLocal
target = dirzip + "Ilevus_" + zipUuidName + ".zip"

# Options less often changed
solution = raiz
extensao = ".csproj"
dirLocalBin = dirDeployLocal + "bin\\"

# PROJETOS
projetos = [""]
plugins = [""]

# Rule here is: project name (Ilevus. is prefixed to it) and path relative to 'raiz' defined above.
other = [[""]]
ignoreDirs = [""]
ignoreFiles = [""]

# Get the id of 'Web' on the initial list
pid=0
for nomeProj in projetos:
    if ("Ilevus" == projetos[pid]):
        pwebid=pid
    else:
        pid+=1

# FUNÇÕES
def build(projeto):
    printseq ("Building '"+projeto+"': ");
    caminhoProj = raiz + projeto + extensao
    printseq ("Path: '"+caminhoProj+"'");
    caminhoDeploy = dirDeployLocal
    logFileHandle = open("buildLog.txt",'w')
    process = subprocess.Popen([msbuild, caminhoProj, config[2], config[0], config[1] + caminhoDeploy], stdout=logFileHandle)
    logFileHandle.close()
    procstat = process.wait()
    if (procstat != 0):
        print(" *** return status: " + str(procstat) + " *** ")
        exit("Error trying to build a project. Please refer to buildLog.txt for the compile log.")
    print("done.")

def mailFail():
    print("Process will fail. Sending e-mail notifying of failure.")
    if send_emails:
        print("Process failure - sending e-mail notification to: "+email_notify)
        os.system("cscript //nologo sendemail.vbs \""+email_notify+"\" \""+mailsubject+" finish/failure publishing to lan-dev-mereo\" \"The publishing process has interrupted. The system should be working now, but it was not updated.\"")
        print("e-mail sent.")

def printseq(what):
    print(what, end="", flush=True)
    
def install_file(source,destination,verbose=False):
    if (verbose):
        printseq("Copying '" + os.path.basename(source) + "': ")
    if not os.path.exists(source):
        if (not verbose):
            printseq("Unable to copy '" + os.path.basename(source) + "': ")
        print ("source does not exist.")
        mailFail()
        return
    if os.path.isdir(source):
        if (not verbose):
            printseq("Unable to copy '" + os.path.basename(source) + "': ")
        print ("source is a directory.")
        mailFail()
        return
    if os.path.exists(destination) and os.path.isdir(destination):
        destination = destination + os.path.basename(source) # try to get the file name

    if os.path.exists(destination):
        # check if files are the same
        srcstat = os.stat(source)
        dststat = os.stat(destination)
        if srcstat.st_size != dststat.st_size or srcstat.st_mtime != dststat.st_mtime: # files are different
            if (verbose):
                printseq("overwriting: ")
            os.remove(destination)
        else:
            if (verbose):
                print("files are the same.")
            return

    instdir = os.path.dirname(destination)
    if not os.path.exists(instdir):
        if (not verbose):
            printseq("Unable to copy '" + os.path.basename(source) + "': ")
        print("destination directory '" + instdir + "' does not exist.")
        exit()
        
    shutil.copy2(source, destination)
    if (verbose):
        print ("done.")

if send_emails:
    print("Process start - sending e-mail notification to: "+email_notify)
    os.system("cscript //nologo sendemail.vbs \""+email_notify+"\" \""+mailsubject+" begin publishing to lan-dev-mereo\" \"The publishing process has been initiated. Please hold on before using the system.\"")
    print("e-mail sent.")
	
def zipdir(path, zip):
    for root, dirs, files in os.walk(path):
        for file in files:
            zip.write(os.path.join(root, file))

# PUBLICAÇÃO
print("Deleting Files.")
for the_file in os.listdir(dirDeployLocal):
    file_path = os.path.join(dirDeploy, the_file)
    if os.path.isfile(file_path):    
	    os.unlink(file_path)  
    elif os.path.isdir(file_path):
	    shutil.rmtree(file_path)

print("Deleting Files.")
for the_file in os.listdir(dirDeploy):
    file_path = os.path.join(dirDeploy, the_file)
    if os.path.isfile(file_path):    
	    os.unlink(file_path)  
    elif os.path.isdir(file_path):
	    shutil.rmtree(file_path)	

print("Building solution.")
for nomeProj in projetos:
    projeto = "Ilevus" + nomeProj
    build(projeto)
    for dllfile in glob.glob(dirDeployLocal + projeto + "\\bin\\" + projeto + "*"):
        install_file(dllfile, dirLocalBin, True)
print("Done building solution")

# CÓPIA DE ARQUIVOS
print("Publishing solution: ")
if os.path.exists(dirDeployLocal + "Web.config"):
    os.remove(dirDeployLocal + "Web.config") # removendo o arquivo Web.config do deploy
for src_dir, dirs, files in os.walk(dirDeployLocal, topdown=True):
    # Removes from the dirs list the excluded directories
    dirs[:] = [dir for dir in dirs if dir.replace(dirDeployLocal,"") not in ignoreDirs]
    dst_dir = src_dir.replace(dirDeployLocal, dirDeploy)
    if not os.path.exists(dst_dir):
        os.mkdir(dst_dir)
    
    # Removes from the files list the excluded file names.
    files[:] = [file for file in files if file not in ignoreFiles]
    for file_ in files:
        src_file = os.path.join(src_dir, file_)
        dst_file = os.path.join(dst_dir, file_)
        install_file(src_file,dst_file,True)
print("Publishing done.")

#FUNÇÃO CUSTOMIZADA
def copytree(src, dst, symlinks=False, ignore=None):
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, symlinks, ignore)
        else:
            shutil.copy2(s, d)

#MOVER ARQUIVOS PARA FORMATO DE PUBLICAÇÃO
printseq("Moving '" + dirDeployLocal + "\\bin\\build\\Release' to " + "'" + dirDeployLocal + "'. ")
copytree(dirDeployLocal + "\\bin\\build\\Release", dirDeployLocal)
print("done.")

#REMOVER DIRETÓRIO DESNECESSÁRIOS PARA PRODUÇÃO
printseq("Removing '" + projeto + "\\bin\\build': ")
shutil.rmtree(dirDeployLocal + "\\bin\\build")
print("done.")

printseq("Removing '" + projeto + "\\bin\\roslyn': ")
shutil.rmtree(dirDeployLocal + "\\bin\\roslyn")
print("done.")

if send_emails:
    print("Process finish - sending e-mail notification to: "+email_notify)
    os.system("cscript //nologo sendemail.vbs \""+email_notify+"\" \""+mailsubject+" finish/success publishing to lan-dev-mereo\" \"The publishing process has finished successfully. You can now access it normally.\"")
    print("e-mail sent.")

#Salva diretorio de trabalho atual
patch_atual = os.getcwd()	
 
print("Zipping Files.")

#Troca o diretorio de trabalho atual
os.chdir(dirzip)

#use 7zip
subprocess.call(sz + " a -t7z \"" + target + "\" \"" + source + "\" -mx=9")

#Retorna ao diiretorio de trabalho anterior
os.chdir(patch_atual)

##print("Connecting to FTP")
##session = ftplib.FTP("52.67.61.254", "USER", "SENHA")
###Troca o diretorio de trabalho atual
##os.chdir(dirzip)
##file = open('Ilevus_' + zipUuidName + '.zip','rb') 
##print("Sending File...")
##ftp_destino = session.pwd() + dir_on_ftp;
##session.cwd(ftp_destino)
##session.storbinary('STOR Ilevus_' + zipUuidName + '.zip', file)
##print("Done!")
##file.close()
##session.quit()
##print("Connection Closed")

#Retorna ao diiretorio de trabalho anterior
os.chdir(patch_atual)
