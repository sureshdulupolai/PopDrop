from rest_framework import serializers
from django.db.models import Avg
from .models import Post, Category, UserSubscription, PostReview
from api.models import User


class CreatorSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source="profile.profile_image", read_only=True)
    is_verified = serializers.BooleanField(source="profile.is_verified", read_only=True)
    followers_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "fullname", "profile_image", "is_verified", "followers_count"]

    def get_followers_count(self, obj):
        return obj.followers.count()



class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "post_count"]


class PostCardSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", default=None)
    creator = serializers.CharField(source="user.fullname")
    avg_rating = serializers.FloatField(read_only=True)
    slug = serializers.CharField()
    
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

class PostDetailSerializer(serializers.ModelSerializer):
    user = CreatorSerializer(read_only=True)
    avg_rating = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    review_count = serializers.IntegerField(source="reviews.count", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id", "title", "description",
            "code_content",
            "desktop_image", "mobile_image",
            "like_count", "view_count",
            "avg_rating", "review_count",
            "copy_count",
            "is_liked", "user"
        ]

    def get_avg_rating(self, obj):
        return obj.reviews.aggregate(avg=Avg("rating"))["avg"] or 0

    def get_is_liked(self, obj):
        req = self.context.get("request")
        if not req or not req.user.is_authenticated:
            return False
        return obj.likes.filter(user=req.user).exists()


