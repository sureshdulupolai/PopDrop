from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Avg, Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Post, Category, PostReview, UserSubscription
from api.models import User
from .serializers import (
    PostDetailSerializer,
    PostCardSerializer,
    CategorySerializer,
)


# ---------- CATEGORY LIST ----------
class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.annotate(
            post_count=Count("posts")
        ).order_by("name")

        return Response(CategorySerializer(categories, many=True).data)


# ---------- POST LIST (FILTER + SEARCH) ----------
class PostListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category_slug = request.GET.get("category", "all")
        search = request.GET.get("search", "")

        qs = Post.objects.filter(
            is_visible=True,
            is_approved=True
        ).select_related(
            "user", "category"
        ).annotate(
            avg_rating=Avg("reviews__rating")
        )

        # CATEGORY FILTER
        if category_slug != "all":
            qs = qs.filter(category__slug=category_slug)

        # SEARCH FILTER
        if search:
            qs = qs.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        return Response(PostCardSerializer(qs, many=True).data)


# ---------- POST DETAIL ----------
class PostDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, post_id):
        post = get_object_or_404(
            Post,
            id=post_id,
            is_visible=True,
            is_approved=True
        )

        Post.objects.filter(id=post.id).update(
            view_count=models.F("view_count") + 1
        )

        return Response(
            PostDetailSerializer(post, context={"request": request}).data
        )

class UploadTemplateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        if not request.FILES:
            return Response({"error": "No files uploaded"}, status=400)

        post = Post.objects.create(
            user=request.user,
            title=request.data.get("title"),
            description=request.data.get("description"),
            category_id=request.data.get("category"),
            code_content=request.data.get("code_content"),
            desktop_image=request.FILES.get("desktop_image"),
            mobile_image=request.FILES.get("mobile_image"),
            is_visible=True,
            is_approved=False,
        )

        return Response({
            "success": True,
            "message": "Template uploaded successfully",
            "id": post.id
        })

# ---------- RATE POST ----------
class RatePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        rating = request.data.get("rating")

        if not rating:
            return Response({"error": "Rating required"}, status=400)

        review, created = PostReview.objects.update_or_create(
            post_id=post_id,
            user=request.user,
            defaults={"rating": rating}
        )

        return Response({
            "message": "Rating saved",
            "rating": review.rating
        })


# ---------- COPY TEMPLATE ----------
class CopyTemplateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, post_id):
        Post.objects.filter(id=post_id).update(
            copy_count=models.F("copy_count") + 1
        )
        return Response({"copied": True})


# ---------- SUBSCRIBE ----------
class ToggleSubscribeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        creator = get_object_or_404(User, id=user_id)

        if creator == request.user:
            return Response({"error": "Not allowed"}, status=400)

        qs = UserSubscription.objects.filter(
            subscriber=request.user,
            subscribed_to=creator
        )

        if qs.exists():
            qs.delete()
            subscribed = False
        else:
            UserSubscription.objects.create(
                subscriber=request.user,
                subscribed_to=creator
            )
            subscribed = True

        return Response({"subscribed": subscribed})
