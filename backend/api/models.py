from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
import datetime
from django.core.validators import MinValueValidator, MaxValueValidator


# USER MANAGER
class UserManager(BaseUserManager):
    def create_user(self, email, fullname, mobile=None, password=None):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            fullname=fullname,
            mobile=mobile,
        )

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_superuser(self, email, fullname, password=None):
        user = self.create_user(email=email, fullname=fullname, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


# MAIN USER MODEL
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    fullname = models.CharField(max_length=200)
    mobile = models.CharField(max_length=15, unique=True, null=True, blank=True)

    # Django required flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    objects = UserManager()
    USERNAME_FIELD = "email"      # Login using email
    REQUIRED_FIELDS = ["fullname"]

    def __str__(self):
        return self.email


class UserProfile(models.Model):
    CATEGORY_CHOICES = [
        ("normal", "Normal User"),
        ("developer", "Developer"),
        ("designer", "Designer"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    # OTP fields
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)

    is_verified = models.BooleanField(default=False)
    is_blocked = models.BooleanField(default=False)
    category = models.CharField(max_length=20,choices=CATEGORY_CHOICES,default="normal")
    profile_image = models.ImageField(upload_to="profile_images/",blank=True,null=True)

    # Profile update cooldown
    profile_last_updated = models.DateTimeField(null=True, blank=True)
    next_profile_update_allowed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # -------- OTP Utilities --------
    def set_otp(self, otp):
        self.otp = otp
        self.otp_created_at = timezone.now()
        self.save()

    def otp_expired(self):
        if not self.otp_created_at:
            return True
        return timezone.now() > self.otp_created_at + datetime.timedelta(minutes=5)

    # ------- Profile update timer -------
    def update_cooldown(self, days=14):
        now = timezone.now()
        self.profile_last_updated = now
        self.next_profile_update_allowed_at = now + datetime.timedelta(days=days)
        self.save()

    def can_update_profile(self):
        if not self.next_profile_update_allowed_at:
            return True
        return timezone.now() >= self.next_profile_update_allowed_at

    def __str__(self):
        return f"{self.user.email} Profile"

class CustomerReview(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="reviews",help_text="The user who wrote this review")
    description = models.TextField(default="No description provided.",help_text="Write your review here")
    rating = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)],help_text="Rating must be between 0 and 5 stars",default=0)
    is_visible = models.BooleanField(default=True,help_text="If disabled, this review will be hidden from public view")
    created_at = models.DateTimeField(auto_now_add=True,help_text="Date and time when the review was created")

    class Meta:
        verbose_name = "Review"
        verbose_name_plural = "Reviews"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review by {self.user.email} - {self.rating}⭐"


class Category(models.Model):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# POST (Main Content)
class Post(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="posts")
    title = models.CharField(max_length=255)

    # New field → category
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True,related_name="posts")

    # Raw code/text
    content = models.TextField(default="")

    # New field → Post hide/show
    is_visible = models.BooleanField(default=True)

    # New field → Admin approval
    is_approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# MULTIPLE IMAGES for Each Post
class PostImage(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name="images")
    image = models.ImageField(upload_to="post_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.post.title}"


# REVIEWS for Each Post
class PostReview(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name="reviews")
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="post_reviews")
    rating = models.IntegerField(validators=[MinValueValidator(0),MaxValueValidator(5)],help_text="Rating 0 se 5 ke beech honi chahiye")
    review_text = models.TextField(default="")
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.email} on {self.post.title}"


# COMMENTS for Each Post
class PostComment(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE,related_name="comments")
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="post_comments")
    comment = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.email} on {self.post.title}"
