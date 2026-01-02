from django.db import models
from api.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

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
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name="posts")
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    code_content = models.TextField()

    desktop_image = models.ImageField(upload_to="template_previews/desktop/", null=True, blank=True)
    mobile_image = models.ImageField(upload_to="template_previews/mobile/", null=True, blank=True)

    is_visible = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False)

    view_count = models.PositiveIntegerField(default=0)
    copy_count = models.PositiveIntegerField(default=0)
    like_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        super().save(*args, **kwargs)  # ALWAYS SAVE FIRST

        if is_new and not self.slug:
            self.slug = slugify(f"{self.title}-{self.category.name}-{self.id}")
            super().save(update_fields=["slug"])

    def __str__(self):
        return self.title
    
    class Meta:
        indexes = [
            models.Index(fields=["is_visible", "is_approved"]),
        ]

class PostReview(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "user")

    def __str__(self):
        return f"{self.rating}⭐ by {self.user.email}"

class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("post", "user")

