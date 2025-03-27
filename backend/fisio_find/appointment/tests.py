from django.test import TestCase

from django.shortcuts import render
from appointment.models import Appointment
from appointment.serializers import AppointmentSerializer
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser



cita1 = Appointment(start_time='2021-05-05T00:00:00Z',
                    end_time='2021-05-05T00:00:00Z',
                    is_online=True, 
                    service='{"service": "service"}', 
                    patient_id=1,
                    physiotherapist_id=1,
                    status='booked')

cita1.save()


serializer = AppointmentSerializer(cita1)
serializer.data
content = JSONRenderer().render(serializer.data)
content
