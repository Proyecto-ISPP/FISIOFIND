from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import AppUser
from .util import *

class AppUserCreationForm(UserCreationForm):
    class Meta:
        model = AppUser
        fields = '__all__'

    def clean_username(self):
        username = self.cleaned_data.get('username')
        qs = AppUser.objects.filter(username__iexact=username)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("El nombre de usuario ya está en uso.")
        return username
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            return email
        qs = AppUser.objects.filter(email__iexact=email)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("El email ya está en uso.")
        return email

    def clean_phone_number(self):
        phone = self.cleaned_data.get('phone_number')
        if telefono_no_mide_9(phone):
            raise forms.ValidationError("El número de teléfono debe tener 9 dígitos numéricos.")
        qs = AppUser.objects.filter(phone_number=phone)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("El número de teléfono ya está en uso.")
        return phone

    def clean_postal_code(self):
        postal_code = self.cleaned_data.get('postal_code')
        if codigo_postal_no_mide_5(postal_code):
            raise forms.ValidationError("El código postal debe tener 5 dígitos numéricos.")
        return postal_code

    def clean_dni(self):
        dni = self.cleaned_data.get('dni')
        if not validate_dni_structure(dni):
            raise forms.ValidationError("El DNI debe tener 8 números y una letra válida al final.")
        if validate_dni_match_letter(dni):
            raise forms.ValidationError("La letra del DNI no coincide con el número.")
        qs = AppUser.objects.filter(dni__iexact=dni)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("El DNI ya está en uso.")
        return dni

    class Meta:
        model = AppUser
        fields = ('username', 'email', 'dni', 'phone_number', 'postal_code', 'photo', 'account_status')

class AppUserChangeForm(UserChangeForm):

    def clean_username(self):
        username = self.cleaned_data.get('username')
        qs = AppUser.objects.filter(username__iexact=username)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("El nombre de usuario ya está en uso.")
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            return email
        qs = AppUser.objects.filter(email__iexact=email)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("El email ya está en uso.")
        return email

    def clean_phone_number(self):
        phone = self.cleaned_data.get('phone_number')
        if telefono_no_mide_9(phone):
            raise forms.ValidationError("El número de teléfono debe tener 9 dígitos numéricos.")
        qs = AppUser.objects.filter(phone_number=phone)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("El número de teléfono ya está en uso.")
        return phone

    def clean_postal_code(self):
        postal_code = self.cleaned_data.get('postal_code')
        if codigo_postal_no_mide_5(postal_code):
            raise forms.ValidationError("El código postal debe tener 5 dígitos numéricos.")
        return postal_code

    def clean_dni(self):
        dni = self.cleaned_data.get('dni')
        if not validate_dni_structure(dni):
            raise forms.ValidationError("El DNI debe tener 8 números y una letra válida al final.")
        if validate_dni_match_letter(dni):
            raise forms.ValidationError("La letra del DNI no coincide con el número.")
        qs = AppUser.objects.filter(dni__iexact=dni)
        if self.instance.pk:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise forms.ValidationError("El DNI ya está en uso.")
        return dni


    class Meta:
        model = AppUser
        fields = ('username', 'email', 'dni', 'phone_number', 'postal_code', 'photo', 'account_status')
