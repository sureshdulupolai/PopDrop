from django.contrib import admin
from post.models import UserSubscription, PostReview, Post, Category
# Register your models here.

admin.site.register(UserSubscription)
admin.site.register(Post)
admin.site.register(PostReview)
admin.site.register(Category)