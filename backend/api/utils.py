from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(user_email, otp):
    subject = "Your OTP for PopDrop"
    message = f"Hello,\n\nYour OTP for PopDrop is: {otp}\nIt will expire in 1 minutes.\n\nThank you!"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])
