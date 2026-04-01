from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Resume, UserProfile

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for handling user registration with full name and phone number.
    Splits the full name into first and last name for Django's default User model.
    """
    full_name = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'full_name', 'phone_number')

    def create(self, validated_data):
        full_name = validated_data.pop('full_name', '')
        phone_number = validated_data.pop('phone_number', '')
        
        # Split name into first and last
        name_parts = full_name.strip().split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name
        )
        
        # Create UserProfile to store the phone number
        UserProfile.objects.create(user=user, phone_number=phone_number)
        
        return user

class ResumeSerializer(serializers.ModelSerializer):
    """
    Serializer for handling resume file uploads and analysis data.
    """
    class Meta:
        model = Resume
        fields = ['id', 'file', 'uploaded_at', 'extracted_skills', 'compatibility_score', 'resume_sentiment']
        read_only_fields = ['uploaded_at', 'extracted_skills', 'compatibility_score', 'resume_sentiment']
