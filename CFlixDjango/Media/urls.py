from django.urls import path
from . import views
urlpatterns = [
    path('<int:vid>/', views.info),
    path('recent/', views.getRecent),
    path('recent/<int:page>/', views.getRecent),
    path('upload', views.Upload, name="upload"),
    path('uploadFile', views.uploadFile),
    path('deleteVideos', views.deleteVideos),
]
