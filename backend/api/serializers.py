from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile
from .utils import send_otp_email
import random

# -------------------------
# SIGNUP SERIALIZER
# -------------------------
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "fullname", "mobile", "password"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            fullname=validated_data["fullname"],
            mobile=validated_data.get("mobile"),
            password=validated_data["password"]
        )

        profile = UserProfile.objects.create(user=user)

        otp = str(random.randint(100000, 999999))
        profile.set_otp(otp)
        send_otp_email(user.email, otp)

        return {
            "user_id": user.id,
            "email": user.email,
            "fullname": user.fullname,
        }

# -------------------------
# LOGIN SERIALIZER
# -------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        if not user.is_active:
            raise serializers.ValidationError("Account disabled")
        if hasattr(user, "profile") and user.profile.is_blocked:
            raise serializers.ValidationError("User is blocked by admin")

        data["user"] = user
        return data

# -------------------------
# USER PROFILE SERIALIZER
# -------------------------
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

# -------------------------
# USER DETAIL SERIALIZER
# -------------------------
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

# -------------------------
# PROFILE SERIALIZER
# -------------------------
class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    fullname = serializers.CharField(source="user.fullname")
    mobile = serializers.CharField(source="user.mobile")

    class Meta:
        model = UserProfile
        fields = [
            "email",
            "fullname",
            "mobile",
            "category",
            "profile_image",
            "is_verified",
            "next_profile_update_allowed_at",
        ]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        # cooldown check
        if not instance.can_update_profile():
            raise serializers.ValidationError(
                "Profile update not allowed yet"
            )

        # Update user table
        instance.user.fullname = user_data.get("fullname", instance.user.fullname)
        instance.user.mobile = user_data.get("mobile", instance.user.mobile)
        instance.user.save()

        # Update profile table
        instance.category = validated_data.get("category", instance.category)
        if validated_data.get("profile_image"):
            instance.profile_image = validated_data.get("profile_image")

        instance.update_cooldown(days=14)
        instance.save()
        return instance
