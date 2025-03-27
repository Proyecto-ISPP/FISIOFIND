from django.urls import path
from .views import create_payment, confirm_payment, cancel_payment_patient, get_payment_details, invoice_pdf_view, total_money, create_payment_setup, update_payment_method, charge_payment, process_due_payments_api, get_physio_invoices, cancel_payment_pyshio, get_refund_status
urlpatterns = [
    #pagos
    path('create/', create_payment, name='create_payment'),
    path('<int:payment_id>/confirm/', confirm_payment, name='confirm_payment'),
    path('<int:payment_id>/cancel/', cancel_payment_patient, name='cancel_payment'),
    path('<int:appointment_id>/cancel-physio/', cancel_payment_pyshio, name='cancel_payment_physio'),
    path('<int:payment_id>/', get_payment_details, name='get_payment_details'),
    path('total/', total_money, name='total_money'),
    path('create-setup/', create_payment_setup, name='create_payment_setup'),
    path('update-payment-method/<int:payment_id>/', update_payment_method, name='update_payment_method'),
    path('<int:payment_id>/charge/', charge_payment, name='charge_payment'),
    path('process-due/', process_due_payments_api, name='process_due_payments'),
    path('refund-status/<int:payment_id>/', get_refund_status, name='get_refund_status'),

    #facturas
    path('invoices/pdf/', invoice_pdf_view, name='invoice_pdf'),
    path('invoices/physio/', get_physio_invoices, name='get_physio_invoices'),
]