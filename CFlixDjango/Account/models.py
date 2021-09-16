import random
import string

from django import forms
from django.contrib.auth.hashers import make_password, check_password
from django.db import models
import json


# Create your models here.
class User(models.Model):
    uid = models.CharField(max_length=128, primary_key=True)
    email = models.EmailField()
    tvTime = models.IntegerField(default=0)
    tvCount = models.IntegerField(default=0)
    movieTime = models.IntegerField(default=0)
    movieCount = models.IntegerField(default=0)
    session_id = models.CharField(max_length=128, default=None, null=True, blank=True)

    def __str__(self):
        return "({}, {})".format(self.uid, self.email)


class Admin(models.Model):
    admin_id = models.CharField(max_length=128, primary_key=True)
    password = models.CharField(max_length=128)

    def save(self, *args, **kwargs):
        self.password = make_password(self.password)
        super(Admin, self).save(*args, **kwargs)

    def __str__(self):
        return self.admin_id


class LastWatchedShow(models.Model):
    uid = models.ForeignKey(User, on_delete=models.CASCADE)  # primary key as well
    show_id = models.CharField(max_length=128, default=None, null=True, blank=True)
    show_type = models.CharField(max_length=25, default=None, null=True, blank=True)


class Movie(models.Model):
    uid = models.ForeignKey(User, on_delete=models.CASCADE)
    movie_id = models.CharField(max_length=128, default=None)
    watched = models.BooleanField(default=False)

    class Meta:
        unique_together = ('uid', 'movie_id')

    def __str__(self):
        return "{}, {}, {}".format(self.uid, self.movie_id, self.watched)


class Tv(models.Model):
    uid = models.ForeignKey(User, on_delete=models.CASCADE)
    tv_id = models.CharField(max_length=128, default=None)
    finished = models.FloatField(default=0)

    class Meta:
        unique_together = ('uid', 'tv_id')

    def __str__(self):
        return "({}, {}), {}".format(self.uid, self.tv_id, self.finished)


class WatchedTv(models.Model):
    watched_id = models.ForeignKey(Tv, on_delete=models.CASCADE)
    season = models.IntegerField()
    episode = models.IntegerField()
    watched = models.BooleanField(default=False)

    def __str__(self):
        return "{}, {}, {}, {}".format(self.watched_id, self.season, self.episode, self.watched)


class Log(models.Model):
    log_id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=25)
    uid = models.CharField(max_length=128)
    details = models.CharField(max_length=200, default=None, null=True, blank=True)
    isAdmin = models.BooleanField(default=False)
    happens_date = models.DateTimeField(auto_now_add=True)
    ip = models.CharField(max_length=25, default=None, null=True, blank=True)
    alert = models.BooleanField(default=False)

    def __str__(self):
        return "{}, {}, {}, {}, {}, alert:{}, {}".format(self.log_id, self.type, self.uid, self.happens_date, self.isAdmin, self.alert, self.ip)


def Decode_Json_Request(request):
    body_unicode = request.body.decode('utf-8')
    body_data = json.loads(body_unicode)
    return body_data


def generateSessionId():
    while True:
        code = ''.join(random.choice(string.ascii_letters) for _ in range(12))
        session_id_count = User.objects.filter(session_id=code).count()
        if session_id_count == 0:
            return code


def captureData(json, ip=None):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email'))
    sessionID = generateSessionId()
    if user.exists():
        user = user.first()

    else:  # create new user
        user = User(uid=data["uid"], email=data["email"])
        user.save()
        Log(type="auth", uid=user.uid, details="New User Registered.", ip=str(ip), isAdmin=False).save()

    # manage session:
    if user.session_id is None or user.session_id != data.get('session_id'):
        Log(type="auth", uid=user.uid, details="User logged in.", ip=str(ip), isAdmin=False).save()
        user.session_id = sessionID
        user.save()

    return sessionID


def getSession(json):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email'))
    return user.first().session_id if user.exists() else 404


def get_seasons(contents):
    max_season = 0
    for e in contents:
        if e.season > max_season:
            max_season = e.season
    return [{} for _ in range(max_season + 1)]


def getShows(json):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email'))
    if user.exists():
        movies_obj = {}
        tv_obj = {}
        user = user.first()

        movies = Movie.objects.filter(uid=user).all()
        for movie in movies:
            movies_obj[movie.movie_id] = {"watched": movie.watched}

        tvs = Tv.objects.filter(uid=user).all()
        for tv in tvs:
            contents = WatchedTv.objects.filter(watched_id=tv).all()
            watched_obj = get_seasons(contents)

            for content in contents:
                watched_obj[int(content.season)][content.episode] = content.watched
            tv_obj[tv.tv_id] = {"watched": watched_obj, "finished": tv.finished}

        lastWatched = LastWatchedShow.objects.filter(uid=user)
        if lastWatched.exists():
            lastWatched = lastWatched.first()
            lastWatched_obj = {"id": lastWatched.show_id, "type": lastWatched.show_type}
        else:
            lastWatched_obj = None

        # print({"lastWatched": lastWatched_obj,
        #        "movie": movies_obj,
        #        "tv": tv_obj,
        #        "tvTime": user.tvTime,
        #        "tvCount": user.tvCount,
        #        "movieTime": user.movieTime,
        #        "movieCount": user.movieCount,
        #        })

        return {"lastWatched": lastWatched_obj,
                "movie": movies_obj,
                "tv": tv_obj,
                "tvTime": user.tvTime,
                "tvCount": user.tvCount,
                "movieTime": user.movieTime,
                "movieCount": user.movieCount,
                }

    return None


def setMovieWatched(json):
    data = Decode_Json_Request(json)

    user = User.objects.filter(uid=data.get('uid'), email=data.get('email')).first()
    movie = Movie.objects.filter(uid=user, movie_id=data.get('id'))

    is_watched = ""
    if not bool(data.get('type')):
        is_watched = "Un"

    Log(type="action", uid=user.uid,
        details="User Marked a movie as " + is_watched + "watched.\n movieID:" + str(data.get('id')),
        isAdmin=False).save()

    if movie.exists():
        movie = movie.first()
        movie.watched = bool(data.get('type'))
        movie.save()
    else:
        Movie(uid=user, movie_id=data.get('id'), watched=bool(data.get('type'))).save()


def removeShow(json):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email')).first()
    Movie.objects.filter(uid=user, movie_id=data.get('id')).delete() if data.get(
        'type') == 'movie' else Tv.objects.filter(uid=user, tv_id=data.get('id')).delete()

    Log(type="action", uid=user.uid,
        details="User Removed a {0}.\n {0}ID:{1}".format(data.get('type'), str(data.get('id'))), isAdmin=False).save()


def createTv(json):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email')).first()
    tv = Tv(uid=user, tv_id=data.get('id'), finished=0)
    tv.save()
    Log(type="auth", uid=user.uid, details="User Just added a Show to the MyList.\n ShowID: " + str(data.get('id')),
        isAdmin=False).save()


def setSpecificEpisodeTv(json):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email')).first()
    tv = Tv.objects.filter(uid=user, tv_id=data.get('id')).first()
    watchedTv = WatchedTv.objects.filter(watched_id=tv, episode=data.get('e'), season=data.get('s'))
    if watchedTv.exists():
        watchedTv = watchedTv.first()
        watchedTv.watched = data.get('val')
        watchedTv.save()
    else:
        watched_Tv = WatchedTv(watched_id=tv, season=data.get('s'), episode=data.get('e'), watched=data.get('val'))
        watched_Tv.save()


def setAllEpisodeTv(json):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email')).first()
    tv = Tv.objects.filter(uid=user, tv_id=data.get('id')).first()
    for e in range(1, int(data.get('totalEpisodes')) + 1):
        watchedTv = WatchedTv.objects.filter(watched_id=tv, episode=e, season=data.get('s'))
        if watchedTv.exists():
            watchedTv = watchedTv.first()
            if bool(data.get('val')):
                watchedTv.watched = bool(data.get('val'))
                watchedTv.save()
            else:
                watchedTv.delete()

        else:
            watched_Tv = WatchedTv(watched_id=tv, season=data.get('s'), episode=e, watched=data.get('val'))
            watched_Tv.save()


def setFinishedValue(json):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email')).first()
    tv = Tv.objects.filter(uid=user, tv_id=data.get('id'))
    if tv.exists():
        tv = tv.first()
        tv.finished = data.get('val')
        tv.save()
        if int(data.get('val')) == 100.0:
            Log(type="action", uid=user.uid,
                details="User Just Finished a Show.\n ShowID:{0}".format(str(data.get('id'))), isAdmin=False).save()


def setMovieTime(json):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email')).first()
    
    movie = Movie.objects.filter(uid=user, movie_id=data.get('movie').get('id'), watched=True)

    if movie.exists():
        return


    user.movieTime = data.get('time')
    user.movieCount = data.get('count')
    user.save()
    setLastWatched({"user": user, "id": data.get("movie")["id"], "type": data.get("movie")["type"],
                    "removeLastWatched": data.get("removeLastWatched")})


def setTvTime(json):
    data = Decode_Json_Request(json)
    user = User.objects.filter(uid=data.get('uid'), email=data.get('email')).first()
    user.tvTime = data.get('time')
    user.tvCount = int(data.get('count'))
    user.save()
    setLastWatched({"user": user, "id": data.get("tv")["id"], "type": data.get("tv")["type"],
                    "removeLastWatched": data.get("removeLastWatched")})


def setLastWatched(data):
    last_watched = LastWatchedShow.objects.filter(uid=data.get("user"))

    if not data.get("removeLastWatched"):  # add it to last watch
        if last_watched.exists():
            last_watched = last_watched.first()
            last_watched.show_id = data.get('id')
            last_watched.show_type = data.get('type')
            last_watched.save()
        else:
            lastWatched_obj = LastWatchedShow(uid=data.get("user"), show_id=data.get('id'), show_type=data.get('type'))
            lastWatched_obj.save()
    else:
        if last_watched.first().show_id == data.get('id'):
            last_watched.delete()


def isAdmin(aid, password):
    admin = Admin.objects.filter(admin_id=aid)
    if admin.exists():
        admin = admin.first()
        return check_password(password, admin.password)
    return False
