from django.urls import path
from .views import (
    CategoryListView,
    PostListView,
    PostDetailView,
    RatePostView,
    CopyTemplateView,
    ToggleSubscribeView,
    UploadTemplateView,
    ToggleLikeView,
    SubscriptionStatusView,
    SubscribedCreatorsView,
    CreatorTemplatesView,
    DeletePostView,
    MyPostsView,
    UpdatePostView,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view()),
    path("posts/", PostListView.as_view()),
    path("posts/<slug:slug>/", PostDetailView.as_view()),
    path("posts/<int:post_id>/rate/", RatePostView.as_view()),
    path("posts/<int:post_id>/copy/", CopyTemplateView.as_view()),
    path("users/<int:user_id>/subscribe/", ToggleSubscribeView.as_view()),
    path("upload/", UploadTemplateView.as_view(), name="upload-template"),
    path("posts/<int:post_id>/like/", ToggleLikeView.as_view()),
    path("users/<int:user_id>/subscribe-status/", SubscriptionStatusView.as_view()),
    path("users/subscriptions/", SubscribedCreatorsView.as_view()),
    path("creator/<str:public_id>/templates/", CreatorTemplatesView.as_view()),
    path("posts/my/page/", MyPostsView.as_view()),
    path("posts/<slug:slug>/delete/", DeletePostView.as_view()),
    path("posts/<slug:slug>/update/", UpdatePostView.as_view()),
]
