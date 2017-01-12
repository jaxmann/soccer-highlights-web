from __future__ import print_function
import csv
from random import randint
import sys
from urllib2 import Request, urlopen, URLError
import json
import email.mime.text
import httplib2
from apiclient import errors
import base64
import sys, os, re, StringIO
import email, mimetypes
import csv
import sys #maybe used in the future
import requests
import time

############################### FILE 1 #########################################

g=open("1.csv","w")
w=csv.writer(g, lineterminator='\n')
w.writerow(('Team','League'))

headers = {'X-Auth-Token': 'd801fd51be9f4b74bfbb868c65b44043'}

allRequest = Request('http://api.football-data.org/v1/competitions', headers = headers)
print(allRequest)
try:
	allResponse = urlopen(allRequest)
	# print(json.dumps(json.loads(allResponse.read()), indent=4, sort_keys=True))
except URLError, e:
    print('Failed to connect to all leagues', e)

allReadResponse = allResponse.read()


for league in json.loads(allReadResponse):
    leagueCaption = league['caption'] #"Premier League 16/17'
    leagueTeams = league['_links']['teams']['href']

    if not ("European Championships France" in leagueCaption or "DFB-Pokal" in leagueCaption or "Champions League" in leagueCaption):

        leagueRequest = Request(leagueTeams, headers = headers)

        try:
            leagueResponse = urlopen(leagueRequest)
            # print(json.dumps(json.loads(response.read()), indent=4, sort_keys=True))
        except URLError, e:
            print('Failed to connect to a team', e)

        leagueReadResponse = leagueResponse.read()

        for team in json.loads(leagueReadResponse)['teams']:

            teamName = team['name'].encode("utf-8")

            w.writerow((
                leagueCaption,
                teamName
            ))

############################### FILE 2 ######################################

g2=open("2.csv","w")
w2=csv.writer(g2, lineterminator='\n')
w2.writerow(('League','Team', 'Player'))

headers = {'X-Auth-Token': 'd801fd51be9f4b74bfbb868c65b44043'}

allRequest = Request('http://api.football-data.org/v1/competitions', headers = headers)
print(allRequest)
try:
	allResponse = urlopen(allRequest)
	# print(json.dumps(json.loads(allResponse.read()), indent=4, sort_keys=True))
except URLError, e:
    print('Failed to connect to all leagues', e)

allReadResponse = allResponse.read()


for league in json.loads(allReadResponse):
    leagueCaption = league['caption'] #"Premier League 16/17'
    leagueLink = league['_links']['teams']['href']

    print("league link is " + leagueLink)

    if not ("European Championships France" in leagueCaption or "DFB-Pokal" in leagueCaption or "Champions League" in leagueCaption):

        leagueRequest = Request(leagueLink, headers = headers)

        try:
            leagueResponse = urlopen(leagueRequest)
        except URLError, e:
            print('Failed to connect to a team', e)

        leagueReadResponse = leagueResponse.read()

        print("sleeping")
        time.sleep(60) #api limit is 50 calls/min - each league has roughly 30 teams so do 1 per min (too many for 2/min)
        print("waking up")

        for team in json.loads(leagueReadResponse)['teams']:

            teamName = team['name'].encode("utf-8")
            teamLink = team['_links']['players']['href']

            teamRequest = Request(teamLink, headers=headers)

            try:
                teamResponse = urlopen(teamRequest)
            except URLError, e:
                print('Failed to connect to a team', e)

            teamReadResponse = teamResponse.read()

            if 'players' in json.loads(teamReadResponse):
                for player in json.loads(teamReadResponse)['players']:

                    playerName = player['name'].encode("utf-8")

                    w2.writerow((
                        leagueCaption,
                        teamName,
                        playerName
                    ))


