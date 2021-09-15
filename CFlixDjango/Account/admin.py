from django.contrib import admin
from .models import LastWatchedShow,WatchedTv,Tv,Movie,User, Admin, Log
# Register your models here.
admin.site.register(Admin)
admin.site.register(User)
admin.site.register(LastWatchedShow)
admin.site.register(Movie)
admin.site.register(Tv)
admin.site.register(WatchedTv)
admin.site.register(Log)
