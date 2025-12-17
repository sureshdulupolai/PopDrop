from django.db import models
from api.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class UserSubscription(models.Model):
    subscriber = models.ForeignKey(User,on_delete=models.CASCADE,related_name="following")
    subscribed_to = models.ForeignKey(User,on_delete=models.CASCADE,related_name="followers")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("subscriber", "subscribed_to")

    def __str__(self):
        return f"{self.subscriber.email} → {self.subscribed_to.email}"

class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Post(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="posts")
    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True,related_name="posts")
    description = models.TextField()
    code_content = models.TextField(help_text="HTML/CSS/JS template code")

    # Preview Images (ONLY 2)
    desktop_image = models.ImageField(upload_to="template_previews/desktop/",null=True,blank=True)
    mobile_image = models.ImageField(upload_to="template_previews/mobile/",null=True,blank=True)

    # Visibility & moderation
    is_visible = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False)

    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    copy_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class PostReview(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name="reviews")
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="template_reviews")
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "user")

    def __str__(self):
        return f"{self.rating}⭐ by {self.user.email}"
