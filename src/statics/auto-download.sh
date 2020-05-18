#!/bin/bash
wgetExists=$(dpkg-query -l | grep wget)
curlExists=$(dpkg-query -l | grep curl)

if [ -z "$wgetExists" ]
then
    pkexec sudo apt-get install wget
fi

if [ -z "$curlExists" ]
then
   pkexec sudo apt-get install curl
fi

repoUrl="https://api.github.com/repos/rochismo/port-scanner/releases/latest"
curl "$repoUrl" | grep "browser_download_url.*deb" | cut -d : -f 2,3 | tr -d \" | wget -qi -
pkexec sudo dpkg -i portscanner*.deb
rm -f portscanner*.deb