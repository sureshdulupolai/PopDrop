from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile, CustomerReview, TeamMember, TeamAppCategory, TeamApplication, ContactRequest
from .utils import send_otp_email
import random
from django.db import IntegrityError

# -------------------------
# SIGNUP SERIALIZER
# -------------------------
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    category = serializers.ChoiceField(choices=UserProfile.CATEGORY_CHOICES)

    class Meta:
        model = User
        fields = ["email", "fullname", "mobile", "password", "category"]

    def create(self, validated_data):
        category = validated_data.pop("category")

        # Check if email exists
        if User.objects.filter(email=validated_data["email"]).exists():
            raise serializers.ValidationError({"email": "Email already exists"})

        # Check if mobile exists
        mobile = validated_data.get("mobile")
        if mobile and User.objects.filter(mobile=mobile).exists():
            raise serializers.ValidationError({"mobile": "Mobile number already exists"})

        try:
            user = User.objects.create_user(
                email=validated_data["email"],
                fullname=validated_data["fullname"],
                mobile=mobile,
                password=validated_data["password"]
            )
        except IntegrityError as e:
            raise serializers.ValidationError({"detail": str(e)})

        profile = UserProfile.objects.create(
            user=user,
            category=category
        )

        # Only developer gets admin access
        if category == "developer":
            user.is_staff = True
            user.is_superuser = True
            user.save()
            profile.is_verified = True
            profile.save()

        # OTP
        otp = str(random.randint(100000, 999999))
        profile.set_otp(otp)
        send_otp_email(user.email, otp)

        return profile  # ✅ Return the profile instance, not a dict

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
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = UserProfile
        fields = ["email", "fullname", "mobile", "category", "profile_image", "is_verified", "next_profile_update_allowed_at"]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})

        # Cooldown check
        if not instance.can_update_profile():
            raise serializers.ValidationError({
                "detail": "Profile update not allowed yet",
                "next_allowed_at": instance.next_profile_update_allowed_at
            })

        # Update user fields
        instance.user.fullname = user_data.get("fullname", instance.user.fullname)
        instance.user.mobile = user_data.get("mobile", instance.user.mobile)
        instance.user.save()

        # Update profile fields
        instance.category = validated_data.get("category", instance.category)

        # ✅ Image update
        if "profile_image" in validated_data:
            instance.profile_image = validated_data.get("profile_image")

        instance.update_cooldown(hours=2)
        instance.save()
        return instance

    
    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image:
            return request.build_absolute_uri(obj.profile_image.url)
        return None

class CustomerReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.fullname", read_only=True)
    is_mine = serializers.SerializerMethodField()

    class Meta:
        model = CustomerReview
        fields = [
            "id",
            "user_name",
            "description",
            "rating",
            "created_at",
            "is_mine",
        ]
        read_only_fields = ["created_at"]

    def get_is_mine(self, obj):
        request = self.context.get("request")
        return request and obj.user == request.user


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = [
            "id",
            "name",
            "role",
            "image",
            "hover_image",
            "join_date",
            "ending_date",
            "is_hidden",
            "created_at",
            "updated_at",
            "status",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, attrs):
        """
        Serializer level validation
        (API / direct view se bhi enforce hoga)
        """

        # instance update ke case me existing values lena
        is_hidden = attrs.get(
            "is_hidden",
            self.instance.is_hidden if self.instance else False
        )

        image = attrs.get(
            "image",
            self.instance.image if self.instance else None
        )

        join_date = attrs.get(
            "join_date",
            self.instance.join_date if self.instance else None
        )

        ending_date = attrs.get("ending_date")

        # 🔴 Unhide hai aur image nahi di → error
        if not is_hidden and not image:
            raise serializers.ValidationError({
                "image": "Image is required when team member is visible."
            })

        # 🔴 Ending date join date se pehle nahi ho sakti
        if ending_date and join_date and ending_date < join_date:
            raise serializers.ValidationError({
                "ending_date": "Ending date cannot be before join date."
            })

        return attrs
    
class TeamApplicationSerializer(serializers.ModelSerializer):
    tech_stack = serializers.PrimaryKeyRelatedField(
        queryset=TeamAppCategory.objects.filter(status=True),
        many=True
    )

    class Meta:
        model = TeamApplication
        exclude = ("user", "created_at")

    def validate_tech_stack(self, value):
        if not value:
            raise serializers.ValidationError(
                "No active tech available right now."
            )
        return value
    
class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = [
            "id",
            "title",
            "description",
            "is_checked",
            "created_at"
        ]
        read_only_fields = ["is_checked", "created_at"]
