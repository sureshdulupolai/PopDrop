from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile
import random


# ---------------------------------------------------------
# SIGNUP SERIALIZER
# ---------------------------------------------------------
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ["email", "fullname", "mobile", "password"]

    def create(self, validated_data):
        # Create user
        user = User.objects.create_user(
            email=validated_data["email"],
            fullname=validated_data["fullname"],
            mobile=validated_data.get("mobile"),
            password=validated_data["password"]
        )

        # Create Profile
        profile = UserProfile.objects.create(user=user)

        # Generate OTP
        otp = str(random.randint(100000, 999999))
        profile.set_otp(otp)

        return {
            "user_id": user.id,
            "email": user.email,
            "fullname": user.fullname,
            "otp": otp  # optional, if you want to show OTP in response
        }


# ---------------------------------------------------------
# LOGIN SERIALIZER
# ---------------------------------------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # Check user
        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("Account disabled")

        # Check profile block
        if hasattr(user, "profile") and user.profile.is_blocked:
            raise serializers.ValidationError("User is blocked by admin")

        data["user"] = user
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "otp",
            "otp_created_at",
            "is_verified",
            "is_blocked",
            "category",
            "profile_image",
            "profile_last_updated",
            "next_profile_update_allowed_at",
            "created_at"
        ]

class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "fullname",
            "mobile",
            "is_active",
            "is_staff",
            "created_at",
            "profile"
        ]