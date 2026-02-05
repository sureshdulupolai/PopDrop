from rest_framework import serializers
from django.db.models import Avg
from .models import Post, Category, UserSubscription, PostReview
from api.models import User


# =========================
# Creator
# =========================
class CreatorSerializer(serializers.ModelSerializer):
    public_id = serializers.CharField(source="profile.public_id", read_only=True)
    profile_image = serializers.SerializerMethodField()
    is_verified = serializers.BooleanField(source="profile.is_verified", read_only=True)
    followers_count = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "fullname",
            "public_id",
            "profile_image",
            "is_verified",
            "followers_count",
            "is_subscribed",
        ]

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_is_subscribed(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False

        return UserSubscription.objects.filter(
            subscriber=request.user,
            subscribed_to=obj
        ).exists()

    # ✅ Cloudinary absolute image
    def get_profile_image(self, obj):
        request = self.context.get("request")
        img = getattr(obj.profile, "profile_image", None)

        if img:
            return request.build_absolute_uri(img.url)

        return None


# =========================
# Category
# =========================
class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "post_count"]


# =========================
# Post Card (LIST VIEW)
# =========================
class PostCardSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", default=None)
    creator = serializers.CharField(source="user.fullname")
    avg_rating = serializers.FloatField(read_only=True)
    slug = serializers.CharField()

    # ✅ FIXED IMAGE
    desktop_image = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "category",
            "description",
            "creator",
            "created_at",
            "desktop_image",
            "avg_rating",
            "slug",
        ]

    # ✅ Cloudinary absolute URL
    def get_desktop_image(self, obj):
        request = self.context.get("request")
        if obj.desktop_image:
            return request.build_absolute_uri(obj.desktop_image.url)
        return None


# =========================
# Post Detail (DETAIL VIEW)
# =========================
class PostDetailSerializer(serializers.ModelSerializer):
    user = CreatorSerializer(read_only=True)
    avg_rating = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    review_count = serializers.IntegerField(source="reviews.count", read_only=True)
    user_rating = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    # ✅ FIXED IMAGES
    desktop_image = serializers.SerializerMethodField()
    mobile_image = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id", "title", "description",
            "code_content",
            "desktop_image", "mobile_image",
            "like_count", "view_count",
            "avg_rating", "review_count",
            "copy_count",
            "is_liked",
            "user_rating",
            "is_owner",
            "user", "category", "slug"
        ]

    def get_avg_rating(self, obj):
        return obj.reviews.aggregate(avg=Avg("rating"))["avg"] or 0

    def get_user_rating(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return 0

        review = obj.reviews.filter(user=request.user).first()
        return review.rating if review else 0

    def get_is_liked(self, obj):
        req = self.context.get("request")
        if not req or not req.user.is_authenticated:
            return False
        return obj.likes.filter(user=req.user).exists()

    def get_category(self, obj):
        return {
            "id": obj.category.id,
            "name": obj.category.name
        }

    def get_is_owner(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.user == request.user

    # ✅ Cloudinary absolute URLs
    def get_desktop_image(self, obj):
        request = self.context.get("request")
        if obj.desktop_image:
            return request.build_absolute_uri(obj.desktop_image.url)
        return None

    def get_mobile_image(self, obj):
        request = self.context.get("request")
        if obj.mobile_image:
            return request.build_absolute_uri(obj.mobile_image.url)
        return None
