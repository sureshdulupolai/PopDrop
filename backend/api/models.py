from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from datetime import timedelta, time
import datetime
from django.core.validators import MinValueValidator, MaxValueValidator, MaxLengthValidator
from django.core.exceptions import ValidationError
from datetime import datetime, time

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
    public_id = models.CharField(
        max_length=50, unique=True, blank=True, null=True
    )
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

    def generate_public_id(self):
        prefix_map = {
            "normal": "popdrop-user",
            "developer": "popdrop-dev",
            "designer": "popdrop-des",
        }

        prefix = prefix_map.get(self.category, "popdrop-user")

        # 🔥 GLOBAL last public_id (no category filter)
        last_profile = (
            UserProfile.objects.filter(public_id__isnull=False)
            .order_by("-id")
            .first()
        )
        if last_profile and last_profile.public_id:
            try:
                last_number = int(last_profile.public_id.split("-")[-1])
                new_number = last_number + 1
            except ValueError:
                new_number = 1001
        else:
            new_number = 1001
        return f"{prefix}-{new_number}"

    def save(self, *args, **kwargs):
        if not self.public_id:
            self.public_id = self.generate_public_id()
        super().save(*args, **kwargs)

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
    # def update_cooldown(self, days=2):
    #     now = timezone.now()
    #     self.profile_last_updated = now
    #     self.next_profile_update_allowed_at = now + datetime.timedelta(days=days)
    #     self.save()

    # def can_update_profile(self):
    #     if not self.next_profile_update_allowed_at:
    #         return True
    #     return timezone.now() >= self.next_profile_update_allowed_at

    def update_cooldown(self, hours=2):
        """Set next_profile_update_allowed_at X hours from now"""
        now = timezone.now()
        self.profile_last_updated = now
        self.next_profile_update_allowed_at = now + timedelta(hours=hours)
        self.save()

    def can_update_profile(self):
        """Check if profile update is allowed"""
        if not self.next_profile_update_allowed_at:
            return True
        return timezone.now() >= self.next_profile_update_allowed_at

    def __str__(self):
        return f"Gmail: {self.user.email}"

class CustomerReview(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="reviews")
    description = models.TextField(max_length=150,validators=[MaxLengthValidator(150)])
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],default=5)
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user"],
                name="one_review_per_user"
            )
        ]

    def __str__(self):
        return f"{self.user.email} - ⭐{self.rating}"

class TeamMember(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    image = models.ImageField(upload_to="team/images/",blank=True,null=True)
    hover_image = models.ImageField(upload_to="team/hover-images/",blank=True,null=True)
    join_date = models.DateField(default=timezone.now)
    ending_date = models.DateField(blank=True,null=True,help_text="If set, member will not be shown after this date")
    is_hidden = models.BooleanField(default=False,help_text="Hide or unhide this team member")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=False)

    class Meta:
        ordering = ["-join_date"]

    def clean(self):
        if not self.is_hidden and not self.image:
            raise ValidationError({"image": "Image is required when team member is visible."})

        if self.ending_date and self.ending_date < self.join_date:
            raise ValidationError({"ending_date": "Ending date cannot be before join date."})

    def is_active(self):
        today = timezone.now().date()

        if self.is_hidden:
            return False

        if self.ending_date and self.ending_date < today:
            return False

        return True

# ✅ HUMAN READABLE JOIN TIME (DateField SAFE)
    def joined_ago(self):
        if not self.join_date:
            return "N/A"

        now = timezone.now()

        # Convert date → datetime (timezone aware)
        join_datetime = timezone.make_aware(
            datetime.combine(self.join_date, time.min)
        )

        diff = now - join_datetime
        seconds = diff.total_seconds()

        if seconds < 3600:
            minutes = int(seconds // 60)
            return f"{minutes} min ago"

        if seconds < 86400:
            hours = int(seconds // 3600)
            return f"{hours} hour{'s' if hours > 1 else ''} ago"

        days = diff.days

        if days < 30:
            return f"{days} day{'s' if days > 1 else ''} ago"

        months = days // 30
        if months < 12:
            return f"{months} month{'s' if months > 1 else ''} ago"

        years = months // 12
        return f"{years} year{'s' if years > 1 else ''} ago"

    def __str__(self):
        return f"{self.name} - {self.role} (Joined {self.joined_ago()})"
    

class TeamAppCategory(models.Model):
    CATEGORY_TYPE = (
        ("frontend", "Frontend"),
        ("backend", "Backend"),
    )

    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPE)
    tech_name = models.CharField(max_length=40)  # React, Django etc
    status = models.BooleanField(default=False,help_text="If true, users can select this tech")

    def __str__(self):
        return f"{self.tech_name} ({self.category_type})"
    
class TeamApplication(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="team_application")
    using_popdrop_since = models.PositiveIntegerField(help_text="Months using PopDrop")
    tech_stack = models.ManyToManyField(TeamAppCategory,related_name="applications")
    resume = models.FileField(upload_to="team/resumes/",blank=True,null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

class ContactRequest(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="contact_requests"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()

    is_checked = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"
    
