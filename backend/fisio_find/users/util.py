import re

def validate_dni_structure(data_dni):
    dni_pattern = re.compile(r'^\d{8}[A-HJ-NP-TV-Z]$')
    return dni_pattern.match(data_dni)

def validate_dni_match_letter(data_dni):
    # Validar que la letra del DNI es correcta
    dni_numbers = data_dni[:-1]
    dni_letter = data_dni[-1].upper()
    
    letters = "TRWAGMYFPDXBNJZSQVHLCKE"
    return letters[int(dni_numbers) % 23] != dni_letter

def codigo_postal_no_mide_5(postal_code):
    return len(postal_code) != 5

def telefono_no_mide_9(phone_number):
    return len(phone_number) != 9