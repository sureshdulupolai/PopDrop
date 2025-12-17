from rest_framework import serializers
from django.db.models import Avg
from .models import Post, Category, UserSubscription, PostReview
from api.models import User


class CreatorSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source="profile.profile_image", read_only=True)
    is_verified = serializers.BooleanField(source="profile.is_verified", read_only=True)
    followers_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "fullname",
            "profile_image",
            "is_verified",
            "followers_count",
        ]


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "post_count"]


class PostCardSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", default=None)
    creator = serializers.CharField(source="user.fullname")
    avg_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "category",
            "creator",
            "created_at",
            "desktop_image",
            "avg_rating",
        ]


class PostDetailSerializer(serializers.ModelSerializer):
    user = CreatorSerializer(read_only=True)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.IntegerField(source="reviews.count", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "description",
            "code_content",
            "category",
            "desktop_image",
            "mobile_image",
            "like_count",
            "view_count",
            "copy_count",
            "created_at",
            "avg_rating",
            "review_count",
            "user",
        ]

    def get_avg_rating(self, obj):
        avg = obj.reviews.aggregate(a=Avg("rating"))["a"]
        return round(avg, 1) if avg else 0
