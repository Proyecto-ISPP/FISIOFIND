from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Image
from io import BytesIO
from decimal import Decimal
from reportlab.pdfgen import canvas
import io
from django.utils import timezone
from reportlab.lib.pagesizes import A4



def generate_invoice_pdf(payment):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    elements = []
    styles = getSampleStyleSheet()

    # Estilos personalizados
    title_style = styles['Heading1']
    title_style.fontSize = 16
    normal_style = styles['Normal']
    normal_style.fontSize = 10

    # Encabezado
    elements.append(Paragraph("FisioFind", title_style))
    #elements.append(Image("logo_fisio_find_smaller.PNG", width=2*inch, height=1*inch))
    elements.append(Paragraph("Datos del fisioterapeuta", normal_style))
    elements.append(Paragraph("Nombre: " + payment.appointment.physiotherapist.user.first_name + " " + payment.appointment.physiotherapist.user.last_name, normal_style))
    elements.append(Paragraph("DNI: " + payment.appointment.physiotherapist.user.dni, normal_style))
    elements.append(Paragraph("Teléfono: " +  payment.appointment.physiotherapist.user.phone_number, normal_style))
    elements.append(Spacer(1, 0.2*inch))

    # Título de la factura
    elements.append(Paragraph(f"FACTURA Nº {payment.id:05d}", styles['Heading2']))
    elements.append(Spacer(1, 0.1*inch))

    # Datos del paciente y cita
    patient_data = [
        ["Paciente:", payment.appointment.patient.user.dni or "No especificado"],
        ["Fecha de Emisión:", payment.payment_date.strftime('%d/%m/%Y') if payment.payment_date else "N/A"],
        ["Fecha de Vencimiento:", payment.payment_deadline.strftime('%d/%m/%Y')],
    ]
    patient_table = Table(patient_data, colWidths=[2*inch, 4*inch])
    patient_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(patient_table)
    elements.append(Spacer(1, 0.2*inch))

    # Detalles del servicio
    service_data = [
        ["Descripción", "Fecha", "Precio"],
        [
            f"Cita de Fisioterapia (ID: {payment.appointment.id})",
            payment.appointment.start_time.strftime('%d/%m/%Y %H:%M'),
            f"${payment.amount}",
        ],
    ]
    service_table = Table(service_data, colWidths=[2.5*inch, 1.5*inch, 0.8*inch, 1*inch, 1*inch])
    service_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
    ]))
    elements.append(service_table)
    elements.append(Spacer(1, 0.2*inch))


    iva_rate = Decimal('0.02')  
    subtotal = payment.amount
    iva_amount = subtotal * iva_rate
    total = subtotal + iva_amount

    total_data = [
        ["Subtotal:", f"${subtotal:.2f}"],
        ["Gastos de gestion (2%):", f"${iva_amount:.2f}"],
        ["TOTAL:", f"${total:.2f}"],
    ]
    total_table = Table(total_data, colWidths=[5*inch, 1.5*inch])
    total_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('LINEABOVE', (0, 0), (-1, 0), 1, colors.black),
        ('LINEBELOW', (0, -1), (-1, -1), 1, colors.black),
    ]))
    elements.append(total_table)
    elements.append(Spacer(1, 0.2*inch))

    # Información de pago
    payment_info = [
        ["Método de Pago:", payment.payment_method],
        ["Estado:", payment.status],
        ["ID Transacción:", payment.stripe_payment_intent_id or "N/A"],
    ]
    payment_table = Table(payment_info, colWidths=[2*inch, 4*inch])
    payment_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
    ]))
    elements.append(payment_table)
    elements.append(Spacer(1, 0.2*inch))

    # Pie de página
    elements.append(Paragraph("Gracias por confiar en FisioFind", normal_style))
    elements.append(Paragraph("Esta factura es válida como comprobante de pago", normal_style))

    # Construir el PDF
    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()
    return pdf



class PaymentPhysioInvoicePDF:
    def __init__(self, physiotherapist, iban, paid_payments, invoice_number):
        self.physiotherapist = physiotherapist
        self.iban = iban
        self.paid_payments = paid_payments
        self.invoice_number = invoice_number
        self.buffer = io.BytesIO()
        self.styles = getSampleStyleSheet()

    def generate_pdf(self):
        # Configurar el documento
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )

        # Elementos del PDF
        elements = []

        # Encabezado
        header_data = [
            ["FISIOFIND", f"Factura {self.invoice_number}"],
            [self.physiotherapist, f"Fecha: {timezone.now().strftime('%d/%m/%Y')}"],
            ["", f"IBAN: {self.iban}"]
        ]
        
        header_table = Table(header_data, colWidths=[300, 200])
        header_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(header_table)
        elements.append(Paragraph("<br/><br/>", self.styles['Normal']))

        # Tabla de citas
        appointments_data = [["ID Pago", "ID Cita", "Fecha", "Importe (€)"]]  # Añadí ID Pago
        total_amount = 0

        for payment in self.paid_payments:
            appointment = payment.appointment
            appointments_data.append([
                f"#{payment.id}",  # Añadí el ID del pago
                f"#{appointment.id}",
                appointment.start_time.strftime('%d/%m/%Y'),
                f"{payment.amount:.2f}"
            ])
            total_amount += payment.amount

        # Añadir fila de total
        appointments_data.append(["", "", "TOTAL", f"{total_amount:.2f}"])

        appointments_table = Table(appointments_data, colWidths=[80, 80, 200, 80])  # Ajusté los anchos
        appointments_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -2), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
            ('FONTNAME', (2, -1), (-1, -1), 'Helvetica-Bold'),
        ]))
        elements.append(appointments_table)

        # Pie de página
        def add_page_details(canvas, doc):
            canvas.saveState()
            canvas.setFont('Helvetica', 9)
            canvas.drawString(72, 40, f"Factura emitida por {self.physiotherapist}")
            canvas.drawString(72, 25, "Gracias por su confianza")
            canvas.drawRightString(A4[0] - 72, 25, f"Página {doc.page}")
            canvas.restoreState()

        # Construir el PDF
        doc.build(elements, onFirstPage=add_page_details, onLaterPages=add_page_details)
        self.buffer.seek(0)
        
        return self.buffer