from django.db import models


# Create your models here.
class Video(models.Model):
    vid = models.CharField(max_length=128)
    type = models.CharField(max_length=25)
    season = models.IntegerField(default=None, null=True, blank=True)
    episode = models.IntegerField(default=None, null=True, blank=True)
    quality = models.CharField(max_length=25, default=None, null=True, blank=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return "({}, {}, {}, {}, {})".format(self.vid, self.type, self.season, self.episode, self.quality)


def getVideoInfo(vid):
    video = Video.objects.filter(vid=vid)
    if video.exists():
        video = video.first()
        return {"vid": vid, "type": video.type, "season": video.season, "episode": video.episode,
                "quality": video.quality}
    return None


def get_recent(page=1):
    arr = []
    size = 20
    from_ = page * size - size
    to_ = page * size
    videos = Video.objects.all()[::][from_:to_]
    for video in videos:
        arr.append({"vid": video.vid, "type": video.type, "season": video.season, "episode": video.episode,
                    "quality": video.quality})

    return arr if len(arr) > 0 else None
