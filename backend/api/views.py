from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer, LoginSerializer, UserDetailSerializer, ProfileSerializer, CustomerReviewSerializer, TeamMemberSerializer, TeamApplicationSerializer, ContactRequestSerializer
from .models import User, UserProfile, CustomerReview, TeamMember, TeamAppCategory, TeamApplication, ContactRequest
from .utils import send_otp_email
import random
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from django.db.models import Q

# -------------------------
# SIGNUP API
# -------------------------
class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response({
                "status": True,
                "data": {
                    "user_id": profile.user.id,
                    "email": profile.user.email,
                    "category": profile.category
                }
            }, status=status.HTTP_201_CREATED)

        # DRF sends proper validation errors
        return Response({"status": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# -------------------------
# LOGIN API
# -------------------------
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            refresh = RefreshToken.for_user(user)

            category = None
            if hasattr(user, "profile"):
                category = user.profile.category
            
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
                    "fullname": user.fullname,
                    "category": category
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

        if profile.otp_expired():
            return Response({"status": False, "error": "OTP expired"},status=400)

        if profile.otp != otp_input:
            return Response({"status": False, "error": "Invalid OTP"},status=400)

        profile.is_verified = True
        profile.otp = None
        profile.otp_created_at = None
        profile.save(update_fields=["is_verified", "otp", "otp_created_at"])

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

# -------------------------
# PROFILE VIEW
# -------------------------
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(
            profile,
            context={"request": request}
        )
        return Response(serializer.data)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
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
    
class ReviewListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_review = CustomerReview.objects.filter(
            user=request.user,
            is_visible=True
        ).first()

        other_reviews = CustomerReview.objects.filter(
            is_visible=True
        ).exclude(user=request.user)

        data = []

        if user_review:
            data.append(
                CustomerReviewSerializer(
                    user_review,
                    context={"request": request}
                ).data
            )

        data += CustomerReviewSerializer(
            other_reviews,
            many=True,
            context={"request": request}
        ).data

        return Response(data)

    def post(self, request):
        if CustomerReview.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "You have already submitted a review"},
                status=400
            )

        serializer = CustomerReviewSerializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(serializer.data, status=201)

class ReviewDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        review = CustomerReview.objects.filter(user=request.user).first()
        if not review:
            return Response(
                {"detail": "Review not found"},
                status=404
            )

        review.delete()
        return Response(status=204)

class TeamMemberPublicListView(APIView):
    def get(self, request):
        today = timezone.now().date()

        queryset = TeamMember.objects.filter(
            is_hidden=False, status = True
        ).filter(
            Q(ending_date__isnull=True) | Q(ending_date__gte=today)
        )

        serializer = TeamMemberSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TeamMemberDetailView(APIView):
    def get_object(self, pk):
        return TeamMember.objects.get(pk=pk)

    def get(self, request, pk):
        member = self.get_object(pk)
        serializer = TeamMemberSerializer(member)
        return Response(serializer.data)

    def put(self, request, pk):
        member = self.get_object(pk)
        serializer = TeamMemberSerializer(
            member, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        member = self.get_object(pk)
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class TeamMemberCreateView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        serializer = TeamMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TeamApplicationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Already applied check
        if TeamApplication.objects.filter(user=request.user).exists():
            return Response({
                "already_applied": True,
                "message": "You have already submitted your application."
            })

        techs = TeamAppCategory.objects.filter(status=True)

        if not techs.exists():
            return Response({
                "no_category": True,
                "message": "No open roles right now."
            })

        return Response({
            "already_applied": False,
            "techs": [
                {
                    "id": t.id,
                    "name": t.tech_name,
                    "type": t.category_type
                } for t in techs
            ]
        })

    def post(self, request):
        if TeamApplication.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "Already applied"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TeamApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)

        return Response(
            {"message": "Application submitted successfully"},
            status=status.HTTP_201_CREATED
        )

class ContactRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pending = ContactRequest.objects.filter(
            user=request.user,
            is_checked=False
        ).exists()

        return Response({
            "has_pending": pending
        })

    def post(self, request):
        pending = ContactRequest.objects.filter(
            user=request.user,
            is_checked=False
        ).exists()

        if pending:
            return Response(
                {
                    "detail": "⏳ Your previous request is still pending. Please wait."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ContactRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message": "✅ Request submitted successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)