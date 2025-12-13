from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, LoginSerializer, UserDetailSerializer, ProfileSerializer
from .models import User
from .utils import send_otp_email
import random
from rest_framework.permissions import IsAuthenticated

# -------------------------
# SIGNUP API
# -------------------------
class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            return Response({"status": True, "data": data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------
# LOGIN API
# -------------------------
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # Generate JWT
            refresh = RefreshToken.for_user(user)

            return Response({
                "status": True,
                "message": "Login successful",
                "token": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                },
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "fullname": user.fullname
                }
            }, status=200)

        return Response(serializer.errors, status=400)

# -------------------------
# USER DETAIL VIEW
# -------------------------
class UserDetailView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserDetailSerializer(user)
        return Response(serializer.data)

class UserListView(ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer

# -------------------------
# OTP VERIFY VIEW
# -------------------------
class VerifyOtpView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        otp_input = request.data.get("otp")

        try:
            user = User.objects.get(id=user_id)
            profile = user.profile
        except User.DoesNotExist:
            return Response({"status": False, "error": "User not found"},status=404)

        # OTP expired
        if profile.otp_expired():
            return Response({"status": False, "error": "OTP expired"},status=400)

        # OTP mismatch
        if profile.otp != otp_input:
            return Response({"status": False, "error": "Invalid OTP"},status=400)

        # ✅ OTP VERIFIED
        profile.is_verified = True
        profile.otp = None
        profile.otp_created_at = None
        profile.save(update_fields=["is_verified", "otp", "otp_created_at"])

        # JWT token
        refresh = RefreshToken.for_user(user)

        return Response({
            "status": True,
            "message": "OTP verified successfully",
            "token": {
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }
        }, status=200)


# -------------------------
# RESEND OTP VIEW
# -------------------------
class ResendOtpView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile
        except User.DoesNotExist:
            return Response({"status": False, "error": "User not found"}, status=404)

        otp = str(random.randint(100000, 999999))
        profile.set_otp(otp)
        send_otp_email(user.email, otp)

        return Response({"status": True, "message": "OTP resent successfully"}, status=200)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "status": True,
            "message": "Profile updated successfully",
            "data": serializer.data
        })
