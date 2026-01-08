from django.contrib import admin
from api.models import User, CustomerReview, UserProfile, TeamMember
# Register your models here.

admin.site.register(User)
admin.site.register(UserProfile)
admin.site.register(CustomerReview)
admin.site.register(TeamMember)