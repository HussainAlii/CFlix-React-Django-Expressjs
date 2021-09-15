import requests
from django.core import serializers
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import captureData, getSession as getUserSession, getShows as getUserShows, \
    setMovieWatched as setUserMovieWatched, removeShow as removeUserShow, createTv as createUserTv, \
    setSpecificEpisodeTv as setSpecificUserEpisodeTv, setAllEpisodeTv as setAllUserEpisodeTv, \
    setFinishedValue as setUserFinishedValue, setMovieTime as setUserMovieTime, \
    setLastWatched as setUserLastWatched, setTvTime as setUserTvTime, isAdmin, Log

from django.contrib import messages

# Create your views here.
def LoginPage(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        if isAdmin(username, password):
            # here we add session data that we need for the User
            request.session['username'] = username
            Log(type="auth", uid=username, details="logged in." , ip=str(get_client_ip(request)), isAdmin=True).save()
            return redirect("logs")
        else:
            Log(type="auth", uid="Unknown",
                details="Failed to login."+ "\nUsername:" + username + ", Password:" + password, ip=str(get_client_ip(request)), alert=True,  isAdmin=True).save()
            request.session.flush()
            messages.error(request, 'Invalid credentials')
            return redirect("/")

    elif request.session.get("username"):
        Log(type="auth", uid=request.session.get("username"), details="returned from sleep session.", ip=str(get_client_ip(request)),
            isAdmin=True).save()
        return redirect("logs")

    return render(request, 'signin.html', {'title': 'Sign In'})


def Logs(request):
    logs_context = {
        'title': 'Logs',
        'logs': Log.objects.all()[::-1],
        'auth': Log.objects.filter(type="auth")[::-1],
        'action': Log.objects.filter(type="action")[::-1],
    }

    return render(request, 'logs.html', logs_context)

def login(request):
    if request.method == 'POST':
        return HttpResponse(captureData(request, ip= get_client_ip(request)))
    return HttpResponse(404)

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')
        ip = ip[len(ip)-1]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def getSession(request):
    if request.method == 'POST':
        return HttpResponse(getUserSession(request))
    return HttpResponse(404)


def getShows(request):
    if request.method == 'POST':
        return JsonResponse(getUserShows(request))
    return HttpResponse("")


# setters -----------------------

def setMovieWatched(request):
    if request.method == 'POST':
        setUserMovieWatched(request)
    return HttpResponse("")


def setSpecificEpisodeTv(request):
    if request.method == 'POST':
        setSpecificUserEpisodeTv(request)
    return HttpResponse("")


def setLastWatched(request):
    if request.method == 'POST':
        setUserLastWatched(request)
    return HttpResponse("")


def setTvTime(request):
    if request.method == 'POST':
        setUserTvTime(request)
    return HttpResponse("")


def setMovieTime(request):
    if request.method == 'POST':
        setUserMovieTime(request)
    return HttpResponse("")


def setFinishedValue(request):
    if request.method == 'POST':
        setUserFinishedValue(request)
    return HttpResponse("")


def setAllEpisodeTv(request):
    if request.method == 'POST':
        setAllUserEpisodeTv(request)
    return HttpResponse("")


def removeShow(request):
    if request.method == 'POST':
        removeUserShow(request)
    return HttpResponse("")


def createTv(request):
    if request.method == 'POST':
        createUserTv(request)
    return HttpResponse("")


def signout(request):
    Log(type="auth", uid=request.session.get("username"), details="logged out.", ip=str(get_client_ip(request)), isAdmin=True).save()
    request.session.flush()
    return redirect('/')


