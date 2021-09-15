import json

import requests
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

from Account.models import Log
from .models import getVideoInfo, get_recent, Video

express = "http://localhost:3000/"

def Decode_Json_Request(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return body['data']

# Create your views here.
def info(request, vid):
    return JsonResponse(getVideoInfo(vid))

def getRecent(request, page=1):
    json_stuff = json.dumps(get_recent(page))
    return HttpResponse(json_stuff, content_type="application/json")


def uploadFile(request):
    if request.method == 'POST' and request.FILES:
        season = None
        episode = None
        if request.POST.get('season') != '' or request.POST.get('episode') !='':
            try:
                season = int(request.POST.get('season'))
                episode = int(request.POST.get('episode'))
            except Exception:
                messages.error(request, 'Season/Episode is not a number!')
                return redirect('upload')

        file = request.FILES.get('file')

        contentOfFile = file.chunks()

        files = {'file': contentOfFile, "name":file}

        node_response = requests.post(express+'upload', files=files)

        vid = str(request.POST.get('vid')).replace(' ','_')
        if node_response:
            Video(vid=vid , type= request.POST.get('type'), quality= request.POST.get('quality'), season= season, episode= episode).save()
            Log(type="action", uid=request.session['username'], details="Uploaded new "+request.POST.get('type')+"\nvid: " + str(request.POST.get('vid')),isAdmin = True).save()

            messages.info(request, 'Uploaded successfully')
        else:
            messages.error(request, 'Something went wrong!')
    else:
        messages.error(request, 'Something went wrong!')

    return redirect('upload')

def Upload(request):
    upload_context = {
        'title': 'Upload',
        'selectList' : getVideosDetails(),
    }
    return render(request, 'upload.html', upload_context)


def getVideosDetails():
    node_response = requests.request(method="GET", url=express+'getVideos')
    videos =  node_response.json()['data']
    details = []
    for video in videos:
        video_obj = Video.objects.filter(vid=extract_string(str(video)))
        if video_obj.exists():
            video_obj = video_obj.first()
            video_details =  {'type':video_obj.type,'quality':video_obj.quality, 'name':video }
            video_details['season'] = 'S'+str(video_obj.season) + ' - ' if video_obj.season else ''
            video_details['episode'] = 'E'+str(video_obj.episode)+ ' - '  if video_obj.episode else ''
            details.append(video_details)
        else:
            details.append({'name':video})
    return details


def extract_string(s):
    string = ""
    temp = ""
    for char in s:
        if char == '.':
            string += temp
            temp = ""
        temp += char

    return string

def deleteVideos(request):
    if request.method == 'POST':
        videos = Decode_Json_Request(request)
        for video in videos:
            video = str(video)
            Log(type="action", uid=request.session['username'], details="Deleted Video\n" + video,isAdmin = True).save()
            v = Video.objects.filter(vid=extract_string(video))
            if v.exists():
                v.first().delete()


    return HttpResponse('')