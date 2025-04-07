from appointment.emailUtils import send_email

def send_rating_email(appointment_rating):
    """
    Envía un correo electrónico al fisioterapeuta con la valoración del paciente.
    :param appointment_rating: Objeto de valoración de cita.
    """
    physiotherapist_email = appointment_rating.physiotherapist.user.email
    patient_name = appointment_rating.patient.user.username
    physiotherapist_name = appointment_rating.physiotherapist.user.username
    appointment_date = appointment_rating.appointment.start_time.strftime("%d/%m/%Y %H:%M")
    appointment_service = appointment_rating.appointment.service.get('type', '')
    score = appointment_rating.score
    comment = appointment_rating.comment

    subject = f"Nueva valoración de {patient_name} para {physiotherapist_name}"
    message = f"""
      Hola {physiotherapist_name},<br><br>
      Has recibido una nueva valoración de <strong>{patient_name}</strong> para la cita de {appointment_service} del <strong>{appointment_date}</strong>.<br><br>
      <strong>Puntuación:</strong> {score}/5<br>
      <strong>Comentario:</strong> {comment}<br><br>
      Para más detalles, inicia sesión en tu cuenta de FisioFind y accede al apartado de valoraciones de tu perfil.<br><br>
      Saludos,<br>
      El equipo de FisioFind
    """

    send_email(subject, message, physiotherapist_email)