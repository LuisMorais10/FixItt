from django.db import models


class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name




