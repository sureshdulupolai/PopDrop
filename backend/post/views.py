from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Avg, Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Post, Category, PostReview, UserSubscription, PostLike
from api.models import User
from .serializers import (
    PostDetailSerializer,
    PostCardSerializer,
    CategorySerializer,
    CreatorSerializer
)


# ---------- CATEGORY LIST ----------
class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.annotate(
            post_count=Count("posts")
        )
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

    def get(self, request, slug):
        post = get_object_or_404(
            Post,
            slug=slug,
            is_visible=True,
            # is_approved=True
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

        avg_rating = PostReview.objects.filter(
            post_id=post_id
        ).aggregate(avg=Avg("rating"))["avg"] or 0

        review_count = PostReview.objects.filter(post_id=post_id).count()

        return Response({
            "rating": review.rating,
            "avg_rating": avg_rating,
            "review_count": review_count,
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
            return Response(
                {"error": "You cannot subscribe to yourself"},
                status=400
            )

        obj = UserSubscription.objects.filter(
            subscriber=request.user,
            subscribed_to=creator
        )

        if obj.exists():
            obj.delete()
            subscribed = False
        else:
            UserSubscription.objects.create(
                subscriber=request.user,
                subscribed_to=creator
            )
            subscribed = True

        return Response({"subscribed": subscribed})


class SubscriptionStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        creator = get_object_or_404(User, id=user_id)
        subscribed = UserSubscription.objects.filter(
            subscriber=request.user,
            subscribed_to=creator
        ).exists()
        return Response({"subscribed": subscribed})


class ToggleLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)

        like = PostLike.objects.filter(post=post, user=request.user)

        if like.exists():
            like.delete()
            post.like_count -= 1
            liked = False
        else:
            PostLike.objects.create(post=post, user=request.user)
            post.like_count += 1
            liked = True

        post.save()

        return Response({
            "liked": liked,
            "like_count": post.like_count
        })


class SubscribedCreatorsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        creators = User.objects.filter(
            followers__subscriber=request.user
        ).distinct()

        serializer = CreatorSerializer(
            creators,
            many=True,
            context={"request": request}
        )
        return Response(serializer.data)

class CreatorTemplatesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, public_id):
        creator = get_object_or_404(
            User,
            profile__public_id=public_id
        )

        templates = (
            Post.objects.filter(
                user=creator,
                is_visible=True,
                is_approved=True
            )
            .select_related("category")
            .annotate(avg_rating=Avg("reviews__rating"))
            .order_by("-created_at")
        )

        return Response({
            "creator": CreatorSerializer(
                creator,
                context={"request": request}
            ).data,
            "template_count": templates.count(),
            "templates": PostCardSerializer(
                templates,
                many=True,
                context={"request": request}
            ).data
        })

class DeletePostView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, slug):
        post = get_object_or_404(
            Post,
            slug=slug,
            user=request.user
        )
        post.delete()
        return Response({"deleted": True})

    
class MyPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = (
            Post.objects.filter(user=request.user)
            .annotate(avg_rating=Avg("reviews__rating"))
            .order_by("-created_at")
        )
        return Response(PostCardSerializer(posts, many=True).data)

class UpdatePostView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, slug):
        post = get_object_or_404(Post, slug=slug, user=request.user)

        post.title = request.data.get("title", post.title)
        post.description = request.data.get("description", post.description)
        post.code_content = request.data.get("code_content", post.code_content)

        category = request.data.get("category")
        if category:
            post.category_id = int(category)

        if request.FILES.get("desktop_image"):
            post.desktop_image = request.FILES.get("desktop_image")

        if request.FILES.get("mobile_image"):
            post.mobile_image = request.FILES.get("mobile_image")

        post.save()
        return Response({"updated": True})

