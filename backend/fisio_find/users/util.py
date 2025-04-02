import re
import json

def validate_dni_structure(data_dni):
    dni_pattern = re.compile(r'^\d{8}[A-HJ-NP-TV-Z]$')
    return dni_pattern.match(data_dni)

def validate_dni_match_letter(data_dni):
    # Validar que la letra del DNI es correcta
    try:
        dni_numbers = data_dni[:-1]
        dni_letter = data_dni[-1].upper()
        
        letters = "TRWAGMYFPDXBNJZSQVHLCKE"
        return letters[int(dni_numbers) % 23] != dni_letter
    except ValueError:
        return False

def codigo_postal_no_mide_5(postal_code):
    return len(postal_code) != 5

def telefono_no_mide_9(phone_number):
    return len(phone_number) != 9

def check_service_json(service_json):
    
    # Comprueba si la entrada es str o dict, si es str intenta parsearlo
    # si es dict directamente lo coge, sino simplemente lanza error
    if isinstance(service_json, str):
        new_service = json.loads(service_json)
    elif isinstance(service_json, dict):
        new_service = service_json
    else:
        raise json.JSONDecodeError()

    required_fields = {"title", "price", "description", "duration", "tipo", "custom_questionnaire"}

    if not isinstance(new_service, dict):
        raise json.JSONDecodeError()
    if not required_fields.issubset(new_service.keys()):
        raise json.JSONDecodeError()

    if not isinstance(new_service["title"], str):
        raise json.JSONDecodeError()
    
    if not isinstance(new_service["description"], str):
        raise json.JSONDecodeError()
    
    if not isinstance(new_service["tipo"], str) or new_service["tipo"] not in ["PRIMERA_CONSULTA", "CONTINUAR_TRATAMIENTO", "OTRO"]:
        raise json.JSONDecodeError()
    
    if new_service["tipo"] == "PRIMERA_CONSULTA" and new_service["title"] != "Primera consulta":
        raise json.JSONDecodeError()
    
    if new_service["tipo"] == "CONTINUAR_TRATAMIENTO" and new_service["title"] != "Continuación de tratamiento":
        raise json.JSONDecodeError()
    
    if not isinstance(new_service["price"], int):
        raise json.JSONDecodeError()
    
    if not isinstance(new_service["duration"], int):
        raise json.JSONDecodeError()
    
    if new_service["custom_questionnaire"] not in [None, {}]:
        
        if not isinstance(new_service["custom_questionnaire"],dict):
            raise json.JSONDecodeError()
        elif not "UI Schema" in new_service["custom_questionnaire"]:
            raise json.JSONDecodeError()
        elif not isinstance(new_service["custom_questionnaire"]["UI Schema"],dict):
            raise json.JSONDecodeError()
            
        questionaries = new_service["custom_questionnaire"]["UI Schema"]
        if not "type" in questionaries or questionaries["type"] != "Group":
            raise json.JSONDecodeError()
        elif not "label" in questionaries or not isinstance(questionaries["label"],str):
            raise json.JSONDecodeError()
        elif not "elements" in questionaries or not isinstance(questionaries["elements"],list):
            raise json.JSONDecodeError()
            
        questionaries = questionaries["elements"]
        necesary = [{'type': 'Number', 'label': 'Peso (kg)', 'scope': '#/properties/peso'}, {'type': 'Number', 'label': 'Altura (cm)', 'scope': '#/properties/altura'}, {'type': 'Number', 'label': 'Edad', 'scope': '#/properties/edad'}, {'type': 'Control', 'label': 'Nivel de actividad física', 'scope': '#/properties/actividad_fisica'}, {'type': 'Control', 'label': 'Motivo de la consulta', 'scope': '#/properties/motivo_consulta'}]
       
        removed_duplicated = set()
       
        for quest in questionaries:
            if quest in necesary:
                necesary.remove(quest)
                removed_duplicated.add((quest["type"],quest["label"],quest["scope"]))
            else:
                if not "type" in quest or quest["type"] not in ["Number","Control"]:
                    raise json.JSONDecodeError()
                elif not "label" in quest or not isinstance(quest["label"],str):
                    raise json.JSONDecodeError()
                elif not "scope" in quest or not isinstance(quest["scope"],str) or not quest["scope"].startswith("#/properties/"):
                    raise json.JSONDecodeError()
                removed_duplicated.add((quest["type"],quest["label"],quest["scope"]))
        if len(necesary) != 0:
            raise json.JSONDecodeError()
        elif len(questionaries) != len(removed_duplicated):
            # Hay duplicados
            raise json.JSONDecodeError()
    
    return new_service