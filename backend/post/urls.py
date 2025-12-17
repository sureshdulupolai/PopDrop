from django.urls import path
from .views import (
    CategoryListView,
    PostListView,
    PostDetailView,
    RatePostView,
    CopyTemplateView,
    ToggleSubscribeView,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view()),
    path("posts/", PostListView.as_view()),
    path("posts/<int:post_id>/", PostDetailView.as_view()),
    path("posts/<int:post_id>/rate/", RatePostView.as_view()),
    path("posts/<int:post_id>/copy/", CopyTemplateView.as_view()),
    path("users/<int:user_id>/subscribe/", ToggleSubscribeView.as_view()),
]
