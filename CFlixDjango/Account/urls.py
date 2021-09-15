from django.urls import path
from . import views
urlpatterns = [
    path('', views.LoginPage, name="login"),
    path('logs', views.Logs, name="logs"),
    path('signout/', views.signout, name="signout"),

    path('login', views.login),
    path('getSession', views.getSession),
    path('getShows', views.getShows),

    # setters---------------------------------
    path('setMovieWatched', views.setMovieWatched),
    path('removeShow', views.removeShow),
    path('createTv', views.createTv),
    path('setSpecificEpisodeTv', views.setSpecificEpisodeTv),
    path('setAllEpisodeTv', views.setAllEpisodeTv),
    path('setFinishedValue', views.setFinishedValue),
    path('setMovieTime', views.setMovieTime),
    path('setLastWatched', views.setLastWatched),
    path('setTvTime', views.setTvTime),

]
