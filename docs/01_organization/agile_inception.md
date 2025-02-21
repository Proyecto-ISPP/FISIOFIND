---
title: "AGILE INCEPTION"                                  # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "12/02/2025"                                        # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background1V.pdf"  # CHANGE IF NEEDED
header-left: "AGILE INCEPTION"                            # CHANGE IF NEEDED
header-right: "05/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIOFIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIOFIND  -  AGILE INCEPTION
</h1>

<br>

**ÍNDICE**
- [**1. RESUMEN**](#1-resumen)
- [**2. PROBLEMA PRINCIPAL Y RELEVANCIA**](#2-problema-principal-y-relevancia)
- [**3. CONTEXTO Y CIRCUNSTANCIAS**](#3-contexto-y-circunstancias)
- [**4. NECESIDADES DEL PROYECTO**](#4-necesidades-del-proyecto)
- [**5. ARQUITECTURA DE LA APP**](#5-arquitectura-de-la-app)
  - [**5.1. CORE**](#51-core)
  - [**5.2. MÓDULOS EXTRA (ADDONS)**](#52-módulos-extra-addons)
  - [**5.3. FUERA DEL SCOPE**](#53-fuera-del-scope)
- [**6. USUARIOS OBJETIVO**](#6-usuarios-objetivo)
- [**7. MONETIZACIÓN**](#7-monetización)
- [**8. COSTE ESTIMADO**](#8-coste-estimado)
- [**9. IMPLEMENTACIÓN Y JUSTIFICACIÓN DE LA APP**](#9-implementación-y-justificación-de-la-app)
- [**10. IMPACTO ESPERADO**](#10-impacto-esperado)
- [**11. COMPETIDORES POTENCIALES**](#11-competidores-potenciales)
- [**12. DIFERENCIACIÓN DEL PROYECTO**](#12-diferenciación-del-proyecto)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>


**Ficha del documento**

- **Nombre del Proyecto:** FISIOFIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Miguel Encina Martínez, Daniel Tortorici Bartús, Francisco Capote García

- **Fecha de Creación:** 12/02/2025  

- **Versión:** v1.4

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 12/02/2025 | v1.0    | Miguel Encina Martínez           | Primera versión de los apartados: Resumen, Problema Principal y Relevancia, Contexto y Circunstancias, Necesidades del Proyecto |
| 12/02/2025 | v1.1    | Daniel Tortorici Bartús          | Primera versión de los apartados: 6. Usuarios Objetivo y 10. Impacto Esperado|
| 12/02/2025 | v1.2    | Francisco Capote García          | Eliminado Gallery Guide de resumen y de necesidades del proyecto, Actualizada la arquitectura de la app, Actualizada la implementación y justificación de la app, corregidos pequeños errores |
| 12/02/2025 | v1.3    | Daniel Tortorici Bartús          | Primera versión del apartado 12. Diferenciación del Proyecto|
| 13/02/2025 | v1.4    | Miguel Encina Martínez           | Corrección de errores y primera versión de los apartados: Monetización, Coste Estimado, Implementación y Justificación de la App |


<br>

<!-- \newpage -->

<br>


# **1. RESUMEN**

**FisioFind es una aplicación especializada para fisioterapeutas que ofrece todo tipo de servicios esenciales para el día a día de estos especialistas de una forma cómoda, eficiente y familiar**. A diferencia de la competencia, nos centramos en la opción de realizar consultas online con los pacientes proporcionando facilidades tanto para especialistas como para los pacientes.

# **2. PROBLEMA PRINCIPAL Y RELEVANCIA**
Este proyecto aborda la evidencia de que la fisioterapia online es igual de efectiva que la consulta presencial. La mayoría de las especialidades en el ámbito sanitario disponen ya de consultas online y herramientas orientadas a ello. A menudo, se asocia al fisioterapeuta exclusivamente con la realización de tratamientos físicos para aliviar el dolor o la fatiga muscular, cuando en realidad, esto es solo una herramienta más. 

Por eso, surge la necesidad de ofrecer al fisioterapeuta un software que contenga todas las herramientas propias de estos especialistas, que se puedan realizar de forma online, sin tener que acudir a una clínica física, para así ahorrar tiempo, esfuerzo y dinero para ambas partes. Además, ofrece la posibilidad de darse a conocer a nuevos fisioterapeutas que quieran aprovechar nuestras ventajas.

# **3. CONTEXTO Y CIRCUNSTANCIAS**
Esta solución está basada en el siguiente contexto:

- Evidencia de que la fisioterapia online es igual de efectiva que la consulta presencial.

- El fisioterapeuta es un profesional sanitario que trata la pérdida de funcionalidad que realizan las estructuras del cuerpo derivadas de lesiones óseo-neuromusculares; es decir, se centran en averiguar la causa de una patología que altera la función. Para recuperar la función que se ve perdida en una patología hay que tratar la función a través del movimiento. 

- Las medidas “tradicionales” de tratamiento que se conciben como propias de este sector (terapia manual, masajes, electro punción, etc.) son en realidad herramientas analgésicas que no tratan la recuperación de la funcionalidad. 

- Las herramientas de valoración que más evidencia científica tienen son la entrevista clínica y los cuestionarios. Los tests ortopédicos los puede realizar el paciente de forma autónoma. La palpación no es un método fiable de valoración.

- Actualmente, la medida más popular es promocionarse en redes sociales. Es necesario una plataforma para darse a conocer. 

- Hay personas que no tienen un acceso fácil a clínicas de fisioterapia (zonas rurales, no tienen un horario que les permita atender a una cita presencial, etc.).


# **4. NECESIDADES DEL PROYECTO**
**¿Cómo se llegó a la necesidad de llevar a cabo el proyecto?**

Varios miembros del grupo disponen de personas cercanas que practican la profesión de la fisioterapia y surgió esta idea ante la necesidad común de todos ellos de disponer de un software especializado que pueda facilitar las tareas del día a día y que les ahorre tiempo, esfuerzo y dinero ofreciendo esta alternativa a la gran cantidad de consultas presenciales a las que se enfrentan semana tras semana.


# **5. ARQUITECTURA DE LA APP**

## **5.1. CORE** 

**PARA FISIOTERAPEUTAS**

- Digitalización del cuerpo humano y mapas de dolor:
    - Mientras el cliente y fisioterapeuta se encuentran en videollamada, el cliente tendrá la opción de mostrar mediante un mapa virtual del cuerpo humano las áreas donde sufre dolor o molestia, mejorando la comunicación y facilitando así al fisioterapeuta entender al cliente.

- Sistema de agendas y gestión de citas:
    - Los fisioterapeutas podrán administrar sus citas de forma flexible, optimizando su disponibilidad y ajustando su horario según sus necesidades.

- Ejercicios prescritos con seguimiento de dolor y progreso:
    - Los fisioterapeutas podrán prescribir ejercicios personalizados para los pacientes, quienes podrán realizar un seguimiento de su progreso y nivel de dolor. El sistema permitirá registrar el avance de los ejercicios, evaluar la intensidad del dolor y ajustar el plan de tratamiento según sea necesario.
    
- Facturación automatizada y gestión de pagos:
    - El sistema generará facturas automáticamente tras cada consulta, facilitando la gestión financiera de los fisioterapeutas. Permitirá pagos dentro de la aplicación de forma segura mediante Stripe y un historial de transacciones.

- Perfil profesional verificado:
    - Los fisioterapeutas deberán completar un proceso de verificación para garantizar su autenticidad y credibilidad. Esto incluirá la validación de certificaciones, experiencia y especialidades, asegurando confianza y calidad en el servicio.

**PARA PACIENTES**

- Búsqueda y reserva de fisioterapeutas por especialidad:
    - Los pacientes podrán buscar fisioterapeutas según su especialidad, ubicación y valoraciones. El sistema permitirá filtrar opciones y reservar citas de manera rápida y sencilla.

- Historial de consultas y plan de tratamiento personalizado:
    - Los pacientes tendrán acceso a su historial completo de consultas y tratamientos previos. Esto incluirá ejercicios recomendados, progreso y seguimiento de su evolución, asegurando un enfoque continuo y personalizado en su recuperación.

- Videoconsultas seguras con cuestionario previo:
    - Las videoconsultas se realizarán de manera segura con tecnología encriptada. Antes de la consulta, los pacientes deberán completar un cuestionario previo para proporcionar información relevante sobre su condición, permitiendo al fisioterapeuta una evaluación más precisa y eficiente durante la sesión.

- Valoraciones y seguimiento de pacientes:
    - Los pacientes podrán calificar y dejar reseñas sobre sus sesiones, ayudando a mejorar la reputación de los fisioterapeutas. Además, el sistema permitirá un seguimiento detallado del progreso del paciente, incluyendo historial de consultas, evolución del tratamiento y reportes de mejora.


## **5.2. MÓDULOS EXTRA (ADDONS)**

- Implementación de clínicas para la gestión del personal

## **5.3. FUERA DEL SCOPE**

- ❌ No contiene infraestructura más allá de la aplicación y tampoco contiene integración con Dispositivos IoT o Sensores Externos.


# **6. USUARIOS OBJETIVO**

**Meet your Neighbours (La comunidad)**

- **Pacientes**

    - Obtienen la ayuda necesaria para su bienestar y salud por parte de un experto.
    
    - Comunican a través de herramientas completas sus necesidades específicas.
    
    - Reciben un seguimiento del tratamiento.
    
    - Acceden al registro de ejercicios y movimientos pautados.
    
    - Buscan y filtran a los profesionales por especialidad, ubicación y disponibilidad.

- **Fisioterapeutas**

    - Gestionan sus perfiles y certificados.
    
    - Hacen uso de la agenda integrada con gestión de citas.
    
    - Proporcionan consultas online personalizadas a los pacientes.
    
    - Se comunican con sus clientes a través de mensajes y archivos enviados por el chat.
    
    - Gestionan los pagos con los clientes.
    
    - Visualizan las valoraciones y comentarios asociados a sus perfiles.

- **Desarrolladores**

    - Mantienen la aplicación actualizada y eficiente.
    
    - Implementan las herramientas necesarias para la correcta ejecución de las consultas.



# **7. MONETIZACIÓN**

Hemos planteado ofrecer un modelo de negocio de tipo SaS (Software as a Service) accesible a través de unos planes de suscripción para aquellos fisioterapeutas que quieran disponer de estas herramientas. A continuación, se van a describir dichos planes, especificando las ventajas que ofrece cada uno:

- **FISIO BLUE: 17,99€/mes**
  - Videoconsultas con todas las herramientas.
  - Seguimiento del paciente.
  - Chat integrado
  - Subir y compartir vídeos (hasta 15)
  - Soporte técnico limitado

- **FISIO GOLD: 24,99€/mes**
  - Videoconsultas con todas las herramientas.
  - Seguimiento del paciente.
  - Chat integrado
  - **Mayor alcance**
  - **Tick de verificación FISIO GOLD**
  - Subir y compartir vídeos (**hasta 30**)
  - Soporte técnico **personalizado**

# **8. COSTE ESTIMADO** 
Haced una estimación de las horas que vamos a hacer (10h semanales x semanas x 17 personas x X€/hora).

Tras realizar un estudio exhaustivo de los posibles costes de realizar este proyecto y mantenerlo (hasta 5 años), se ha obtenido la siguiente estimación:

- **Coste de desarrollo**: 86,487 €
- **Coste almacenamiento**: 31.30 €/año
- **Coste de transferencia**: 190.51 €/año
- **Coste de mantenimiento**: 15,000.00 €/año
- **Coste de soporte técnico**: 10,000.00 €/año
- **Coste de hardware**: 5,000.00 €/año
Total = 237,596.05 €

# **9. IMPLEMENTACIÓN Y JUSTIFICACIÓN DE LA APP**

**Qué vamos a hacer nosotros (¿Por qué una APP?)**

Mediante una aplicación online los fisioterapeutas son capaces de atender a sus clientes sin necesidad de realizar una consulta presencial, por lo que una aplicación capaz de realizar esta función puede ser clave. Además, amplía el alcance de los fisioterapeutas al permitirles atender a pacientes de otras localidades más lejanas.

Hemos recibido la motivación de varios fisioterapeutas cercanos a nosotros, que consideran totalmente necesaria la existencia de un software como el que planteamos y que estarían dispuestos a utilizar.

**Análisis de viabilidad (5 años)**

Teniendo en cuenta la estimación de los costes del apartado anterior, se ha sacado la conclusión de que, de cara a rentabilizar este modelo de negocio con un margen de 5 años, se necesitarían al menos 162 fisios, de los cuales 48 dispondrían del plan **FISIO GOLD** y los 113 restantes dispondrían del plan **FISIO BLUE**, para cubrir los gastos, aproximadamente, de la inversión inicial. De esta forma:

    48 * 35 €/mes = 1680 €/mes
    -
    113 * 20 €/mes = 2260 €/mes
    -
    **Total** = 3940 €/mes * 12 meses * 5 años = 236,400.00 €
    -

**Tecnologías y Herramientas Clave**

- Dispositivos móviles

- Web

- React Native

- Django

- PostgreSQL

<br>

<!-- \newpage -->

<br>


# **10. IMPACTO ESPERADO**

- Gran mejora de la situación actual de los tratamientos fisioterapéuticos online.

- Aumento de la comodidad de las consultas tanto para fisioterapeutas como para los pacientes.

- Reducción de problemas y tiempos excesivos de transporte para los pacientes.

- Facilidad de trabajo para los fisioterapeutas con recursos limitados o corta experiencia.

- Automatización de la gestión de citas, calendario y pagos.

- Centralización de los datos y contacto entre clientes y expertos.

- Rentabilizar la inversión inicial atrayendo a un gran número de fisioterapeutas que estén interesados en destacar frente a la competencia haciendo uso de nuestro software especializado.

# **11. COMPETIDORES POTENCIALES**

[Documento de análisis de competidores](https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/docs/01_organization/competitor_analysis.pdf)

<br>


# **12. DIFERENCIACIÓN DEL PROYECTO**

**Elementos a Tener en Cuenta:**

- No parece existir una competencia directa que explote el aspecto telemático de las consultas online.

- **FISIOFIND** se encuadra entre los sectores **Matchmaking and Innovation** y **Service and Innovation**

**Razones por las cuales no pertenecemos a los otros modelos:**
- No somos una aplicación basada únicamente en el *matchmaking*, ya que no solo conectamos personas para que, fuera de la aplicación, se lleve a cabo un servicio como _Airbnb_ o _Uber_.

- No es un proyecto de servicio que utilice la monetización basada en los datos de los usuarios, como _LinkedIn_.

- Queremos innovar en herramientas de consultas online para fisioterapeutas, funcionalidad que todavía no está disponible en el mercado.


**Razones por las cuales nos parecemos a Uber (Matchmaking and Innovation):**

- ✔ Es un servicio digital innovador que conecta personas que necesitan ayuda profesional con expertos del sector de la fisioterapia.

- ✔ Para los fisioterapeutas, su valor está en el incremento de reconocimiento y en la posibilidad de posicionarse en el mercado y darse a conocer.
  
- ✔ Para los pacientes, su valor está en la facilidad de encontrar al especialista adecuado según sus necesidades.


**Razones por las cuales nos parecemos a Netflix (Service and Innovation):**

- ✔ Es un servicio digital innovador que le permite a los fisioterapeutas y pacientes tener varias vías de comunicación efectiva y múltiples herramientas para lograr los mejores resultados en las consultas.

- ✔ Su valor está, principalmente, en las funcionalidades y servicios que se ofrecen para el desarrollo y gestión las consultas, especialmente online.
