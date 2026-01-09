from django.urls import path
from .views import SignupView, LoginView, ProfileView, VerifyOtpView, ResendOtpView, UserDetailView, UserListView, ReviewDeleteView, ReviewListCreateView, TeamMemberPublicListView, TeamMemberCreateView, TeamMemberDetailView, TeamApplicationView, ContactRequestView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("signup/", SignupView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("otp/verify/", VerifyOtpView.as_view()),
    path("otp/resend/", ResendOtpView.as_view()),
    path("users/<int:user_id>/", UserDetailView.as_view()),
    path("users/", UserListView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("reviews/", ReviewListCreateView.as_view()),
    path("reviews/delete/", ReviewDeleteView.as_view()),
    path("team/members/", TeamMemberPublicListView.as_view()),
    path("team/members/create/", TeamMemberCreateView.as_view()),
    path("team/members/<int:pk>/", TeamMemberDetailView.as_view()),
    path("team/apply/", TeamApplicationView.as_view()),
    path("contact/", ContactRequestView.as_view(), name="contact-request"),
]
