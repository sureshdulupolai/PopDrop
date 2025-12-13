from django.urls import path
from .views import SignupView, LoginView, UserDetailView, UserListView, VerifyOtpView, ResendOtpView, ProfileView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("user/<int:user_id>/", UserDetailView.as_view(), name="user-detail"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("verify-otp/", VerifyOtpView.as_view(), name="verify-otp"),
    path("resend-otp/", ResendOtpView.as_view(), name="resend-otp"),
    path("profile/", ProfileView.as_view()),
]
