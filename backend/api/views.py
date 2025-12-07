from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import SignupSerializer, LoginSerializer, UserDetailSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from rest_framework.generics import ListAPIView

# --------------------------
# SIGNUP API
# --------------------------
class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            return Response({"status": True, "data": data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------------
# LOGIN API
# --------------------------
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