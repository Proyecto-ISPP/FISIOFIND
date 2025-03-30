---
title: "REGISTRO DE CASOS DE USO"                         # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "13/02/2025"                                        # CHANGE IF NEEDED
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
header-left: "REGISTRO DE CASOS DE USO"                   # CHANGE IF NEEDED
header-right: "13/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  REGISTRO DE CASOS DE USO
</h1>

<br>

**ÍNDICE**
- [1. ESTRUCTURA DE LOS CASOS DE USO](#1-estructura-de-los-casos-de-uso)
- [2. CASOS DE USO](#2-casos-de-uso)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>


---

**Ficha del documento**

- **Nombre del Proyecto:** FisioFind

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Alberto Carmona Sicre](https://github.com/albcarsic) (autor), [Daniel Ruiz López](https://github.com/Danielruizlopezcc) (revisor), [Rafael Pulido Cifuentes](https://github.com/rafpulcif) (revisor), [Daniel Fernández Caballero](https://github.com/DaniFdezCab) (autor), [Daniel Alors Romero](https://github.com/DanielAlors) (autor)

- **Fecha de Creación:** 13/02/2025  

- **Versión:** v1.1

<br>


---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 12/02/2025 | v1.0    | Daniel Ruiz López, Rafael Pulido Cifuentes, Daniel Fernández Caballero      | Añadidos los casos de uso. |
| 13/02/2025 | v1.1    | Alberto Carmona Sicre, Daniel Fernández Caballero       | Añadidos los apartados: Estructura de los casos de uso y Casos de uso |

<br>

<!-- \newpage -->

<br>


# 1. ESTRUCTURA DE LOS CASOS DE USO

Para cada caso de uso, se define lo siguiente:    

- **Identificador (ID)**: un identificador con la estructura: CU-XXX, seguido de un breve título para el caso de uso.     

- **Versión**: indica las distintas fases por las que pasa el requisito. La versión empieza en la V1.0 y va aumentando en función de las modificaciones.  

- **Descripción**: una breve descripción de lo que se busca implementar o tener en cuenta con el requisito. 

- **Prioridad**: se definen cuatro distintas prioridades, de mayor a menor importancia: Crítica, Importante, Deseable o Baja. Se define según el requisito [1] del que provenga el caso de uso.  

- **Escenario**: serie de pasos por los que se debe pasar para iniciar y terminar el caso de uso.   

- **Resultado Esperado**: resultados esperados tras la finalización del caso de uso.    

[1] Puede encontrar más información acerca de la descripción de cada prioridad en el documento Documento de Requisitos (Requirements Document).  

<br>  

<!-- \newpage -->

<br>

# 2. CASOS DE USO

| **ID**                 | CU-001: Perfil profesional con certificaciones verificadas |
| ---------------------- | --------------------------------------------------------- |
| **Versión**            | V1.0                                                      |
| **Prioridad**          | Importante                                                |
| **Escenario**          | 1. Un profesional se registra en la plataforma desde la sección de fisios.<br>2. Deberá añadir el número de colegiado y sus datos.<br>3. El sistema valida los datos mediante un proceso de verificación.<br>4. Si las certificaciones son válidas, se marcan como "Verificadas".<br>5. Se muestra un mensaje de confirmación: "Certificaciones verificadas exitosamente".<br>6. Se finaliza el registro del profesional. |
| **Resultado Esperado** | - Las certificaciones del profesional se almacenan correctamente en la base de datos.<br>- El profesional puede mostrar sus certificaciones verificadas en su perfil.<br>- Se cumple el requisito de validación de experiencia y conocimientos. |

<div align="center"> <b>Tabla 1: Caso de uso positivo de RF-001</b></div>

<br>

| **ID**                 | CU-002: Perfil profesional con certificaciones no verificadas |
| ---------------------- | --------------------------------------------------------- |
| **Versión**            | V1.0                                                      |
| **Prioridad**          | Importante                                                |
| **Escenario**          | 1. Un profesional se registra en la plataforma desde la sección de fisios.<br>2. Deberá añadir el número de colegiado y sus datos.<br>3. El sistema no es capaz de validar las certificaciones.<br>4. Las certificaciones se marcan como "No Verificadas".<br>5. Se muestra un mensaje de error: "Certificaciones no verificadas".<br>6. No es posible finalizar el proceso de registro. |
| **Resultado Esperado** | - Las certificaciones del profesional no se almacenan en la base de datos.<br>- El profesional no puede registrarse en la aplicación. |

<div align="center"> <b>Tabla 2: Caso de uso negativo de RF-001</b></div>

<br>

| **ID**                 | CU-003: Gestión exitosa de citas en la agenda integrada |
| ---------------------- | ------------------------------------------------------ |
| **Versión**            | V1.0                                                   |
| **Prioridad**          | Crítica                                                |
| **Escenario**          | 1. Un profesional accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de agenda integrada.<br>3. Crea una nueva cita seleccionando la fecha, hora y paciente.<br>4. El sistema valida la disponibilidad del horario y guarda la cita.<br>5. Se muestra un mensaje de confirmación: "Cita registrada exitosamente".<br>6. Tanto el profesional como el paciente reciben una notificación de la cita programada. |
| **Resultado Esperado** | - La cita se almacena correctamente en la base de datos.<br>- El profesional puede ver y gestionar su agenda con citas confirmadas.<br>- Se cumplen los requisitos de gestión eficiente de citas. |

<div align="center"> <b>Tabla 3: Caso de uso positivo de RF-002</b></div>

<br>

| **ID**                 | CU-004: Fallo en la gestión de citas en la agenda integrada |
| ---------------------- | ------------------------------------------------------ |
| **Versión**            | V1.0                                                   |
| **Prioridad**          | Crítica                                                |
| **Escenario**          | 1. Un profesional accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de agenda integrada.<br>3. Intenta crear una cita en un horario ya ocupado.<br>4. El sistema detecta el conflicto y rechaza la solicitud de cita.<br>5. Se muestra un mensaje de error: "El horario seleccionado no está disponible".<br>6. El profesional debe elegir otro horario para registrar la cita. |
| **Resultado Esperado** | - La cita en conflicto no se almacena en la base de datos.<br>- El profesional recibe una notificación sobre el error y debe reprogramar la cita.<br>- Se evita la sobrecarga de citas en horarios no disponibles. |

<div align="center"> <b>Tabla 4: Caso de uso negativo de RF-002</b></div>

<br>

| **ID**                 | CU-005: Uso exitoso de videollamadas con herramientas avanzadas |
| ---------------------- | -------------------------------------------------------------- |
| **Versión**            | V1.0                                                           |
| **Prioridad**          | Crítica                                                        |
| **Escenario**          | 1. Un profesional accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de videollamadas e inicia una sesión con un paciente.<br>3. Durante la videollamada, el profesional usa herramientas avanzadas como dibujos en pantalla, atlas 3D, presentación de pantalla y cuestionarios de valoración.<br>4. El paciente interactúa con el profesional usando las herramientas de consulta.<br>5. La videollamada se desarrolla sin interrupciones ni errores.<br>6. Al finalizar, se muestra un mensaje de confirmación: "Videollamada finalizada con éxito". |
| **Resultado Esperado** | - La videollamada se desarrolla correctamente sin interrupciones.<br>- Todas las herramientas avanzadas funcionan según lo esperado.<br>- Se registra el historial de la consulta con los elementos utilizados en la videollamada. |

<div align="center"> <b>Tabla 5: Caso de uso positivo de RF-003</b></div>

<br>

| **ID**                 | CU-006: Fallo en la funcionalidad de videollamadas |
| ---------------------- | -------------------------------------------------- |
| **Versión**            | V1.0                                               |
| **Prioridad**          | Crítica                                            |
| **Escenario**          | 1. Un profesional accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de videollamadas e inicia una sesión con un paciente.<br>3. Durante la videollamada, intenta usar herramientas avanzadas como el atlas 3D o la presentación de pantalla.<br>4. El sistema experimenta fallos y las herramientas no se cargan correctamente.<br>5. Se muestra un mensaje de error: "No se ha podido cargar la herramienta seleccionada. Inténtelo de nuevo más tarde".<br>6. La videollamada se ve afectada y el profesional no puede utilizar todas las funcionalidades previstas. |
| **Resultado Esperado** | - Se notifica al usuario sobre el fallo en la carga de herramientas.<br>- La videollamada sigue activa, pero sin acceso a todas las funcionalidades.<br>- El profesional debe buscar una alternativa para continuar la consulta. |

<div align="center"> <b>Tabla 6: Caso de uso negativo de RF-003</b></div>

<br>

| **ID**                 | CU-007: Uso exitoso del mapa de dolor interactivo |
| ---------------------- | ------------------------------------------------- |
| **Versión**            | V1.0                                              |
| **Prioridad**          | Importante                                        |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección del mapa de dolor interactivo.<br>3. Utiliza la herramienta para señalar las zonas afectadas en el modelo del cuerpo.<br>4. El sistema registra la información y permite agregar comentarios adicionales.<br>5. El profesional de salud accede al registro del paciente y visualiza los datos del mapa de dolor. |
| **Resultado Esperado** | - El paciente puede marcar las zonas de dolor sin problemas.<br>- El profesional de salud puede visualizar y analizar la información proporcionada. |

<div align="center"> <b>Tabla 7: Caso de uso positivo de RF-004</b></div>

<br>

| **ID**                 | CU-008: Fallo en la funcionalidad del mapa de dolor interactivo |
| ---------------------- | ---------------------------------------------------------------- |
| **Versión**            | V1.0                                                             |
| **Prioridad**          | Importante                                                      |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección del mapa de dolor interactivo.<br>3. Intenta señalar las zonas afectadas en el modelo del cuerpo, pero la herramienta no responde.<br>4. El sistema no guarda la información correctamente.<br>5. Se muestra un mensaje de error: "No se ha podido registrar la información. Inténtelo de nuevo más tarde".<br>6. El paciente no puede mostrar los datos de su dolor al profesional de salud. |
| **Resultado Esperado** | - El paciente es notificado del error y no se muestra la información correctamente.<br>- Se solicita soporte técnico para corregir el fallo en la funcionalidad. |

<div align="center"> <b>Tabla 8: Caso de uso negativo de RF-004</b></div>

<br>

| **ID**                 | CU-009: Gestión exitosa de pagos y facturación automatizada |
| ---------------------- | ----------------------------------------------------------- |
| **Versión**            | V1.0                                                        |
| **Prioridad**          | Crítica                                                     |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de pagos y selecciona un servicio a pagar.<br>3. El sistema redirige al paciente a un servicio externo y este completa el pago.<br>4. El sistema procesa el pago y genera automáticamente la factura asociada.<br>5. Se muestra un mensaje de confirmación: "Pago realizado con éxito. Su factura ha sido generada".<br>6. El paciente y el profesional pueden acceder a la factura desde su historial de transacciones. |
| **Resultado Esperado** | - El pago se procesa correctamente sin errores.<br>- Se genera una factura automatizada con los datos correspondientes.<br>- El usuario puede visualizar y descargar la factura desde la plataforma. |

<div align="center"> <b>Tabla 9: Caso de uso positivo de RF-005</b></div>

<br>

| **ID**                 | CU-010: Fallo en la gestión de pagos y facturación automatizada |
| ---------------------- | ---------------------------------------------------------------- |
| **Versión**            | V1.0                                                             |
| **Prioridad**          | Crítica                                                          |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de pagos y selecciona un servicio a pagar.<br>3. Ingresa los datos de pago y confirma la transacción.<br>4. El sistema intenta procesar el pago, pero se produce un error en la transacción.<br>5. Se muestra un mensaje de error: "No se ha podido procesar el pago. Inténtelo de nuevo más tarde".<br>6. No se genera ninguna factura y el usuario debe volver a intentar el pago. |
| **Resultado Esperado** | - La transacción no se completa y el sistema notifica al usuario del error.<br>- No se genera ninguna factura errónea o incompleta.<br>- El usuario puede reintentar el pago o cambiar de método de pago. |

<div align="center"> <b>Tabla 10: Caso de uso negativo de RF-005</b></div>

<br>

| **ID**                 | CU-011: Publicación exitosa de valoraciones y comentarios |
| ---------------------- | --------------------------------------------------------- |
| **Versión**            | V1.0                                                      |
| **Prioridad**          | Importante                                                |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de valoraciones de un profesional.<br>3. Escribe un comentario y asigna una calificación con estrellas.<br>4. El sistema guarda la valoración y la publica en el perfil del profesional.<br>5. Se muestra un mensaje de confirmación: "Valoración publicada con éxito". |
| **Resultado Esperado** | - La valoración y el comentario se almacenan correctamente en la base de datos.<br>- La información es visible en el perfil del profesional.<br>- El profesional puede responder a la valoración si es necesario. |

<div align="center"> <b>Tabla 11: Caso de uso positivo de RF-006</b></div>

<br>

| **ID**                 | CU-012: Fallo en la publicación de valoraciones y comentarios |
| ---------------------- | ------------------------------------------------------------- |
| **Versión**            | V1.0                                                          |
| **Prioridad**          | Importante                                                    |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de valoraciones de un profesional.<br>3. Intenta dejar una valoración para un profesional.<br>4. El sistema detecta un error y no puede guardar la valoración.<br>5. Se muestra un mensaje de error: "No se ha podido publicar la valoración. Inténtelo más tarde".<br>6. El comentario y la calificación no se guardan en la base de datos. |
| **Resultado Esperado** | - La valoración no se almacena incorrectamente en la base de datos.<br>- El paciente es notificado del error y puede intentar nuevamente más tarde.<br>- Se evita la publicación de comentarios duplicados o incompletos. |

<div align="center"> <b>Tabla 12: Caso de uso negativo de RF-006</b></div>

<br>

| **ID**                 | CU-013: Seguimiento exitoso del paciente |
| ---------------------- | ---------------------------------------- |
| **Versión**            | V1.0                                     |
| **Prioridad**          | Importante                               |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de seguimiento.<br>3. Selecciona la fecha y registra su nivel de dolor en la escala visual.<br>4. El sistema almacena la información y la asocia a su historial clínico.<br>5. El profesional accede a los datos y visualiza la evolución del paciente.<br>6. Se muestra un mensaje de confirmación: "Seguimiento registrado con éxito". |
| **Resultado Esperado** | - El paciente puede registrar su nivel de dolor sin problemas.<br>- Los datos se almacenan correctamente en la base de datos.<br>- El profesional de salud tiene acceso al historial del paciente para evaluar su evolución. |

<div align="center"> <b>Tabla 13: Caso de uso positivo de RF-007</b></div>

<br>

| **ID**                 | CU-014: Fallo en el seguimiento del paciente |
| ---------------------- | -------------------------------------------- |
| **Versión**            | V1.0                                         |
| **Prioridad**          | Importante                                   |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de seguimiento.<br>3. Intenta registrar su nivel de dolor, pero la plataforma no guarda la información.<br>4. Se muestra un mensaje de error: "No se ha podido registrar el seguimiento. Inténtelo más tarde".<br>5. El paciente no puede visualizar su evolución en el historial.<br>6. El profesional de salud no recibe la información actualizada. |
| **Resultado Esperado** | - El sistema no almacena datos erróneos o incompletos.<br>- Se notifica al usuario del error y puede intentarlo más tarde.<br>- Se revisa el sistema para corregir posibles fallos en la funcionalidad. |

<div align="center"> <b>Tabla 14: Caso de uso negativo de RF-007</b></div>

<br>

**CORREGIR SI FUERA NECESARIO**

| **ID**                 | CU-015: Búsqueda y filtrado exitoso de fisioterapeutas |
| ---------------------- | ------------------------------------------------------ |
| **Versión**            | V1.0                                                   |
| **Prioridad**          | Crítica                                                |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de búsqueda de fisioterapeutas.<br>3. Aplica filtros avanzados como especialidad, localidad, disponibilidad y tipo de consulta.<br>4. Ordena los resultados por valoración y precio.<br>5. Visualiza los fisioterapeutas disponibles en la lista y en el mapa interactivo.<br>6. Se muestra un mensaje de confirmación: "Resultados actualizados según los filtros seleccionados". |
| **Resultado Esperado** | - El paciente puede buscar fisioterapeutas de manera eficiente.<br>- Los resultados se muestran correctamente en la lista y en el mapa interactivo.<br>- El sistema permite modificar filtros sin necesidad de recargar la página. |

<div align="center"> <b>Tabla 15: Caso de uso positivo de RF-008</b></div>

<br>

| **ID**                 | CU-016: Fallo en la búsqueda y filtrado de fisioterapeutas |
| ---------------------- | --------------------------------------------------------- |
| **Versión**            | V1.0                                                      |
| **Prioridad**          | Crítica                                                   |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de búsqueda de fisioterapeutas.<br>3. Intenta aplicar filtros avanzados, pero el sistema no devuelve resultados.<br>4. Intenta visualizar los fisioterapeutas en el mapa interactivo, pero no se cargan correctamente.<br>5. Se muestra un mensaje de error: "No se han encontrado resultados con los filtros seleccionados".<br>6. El paciente debe restablecer los filtros o intentar la búsqueda nuevamente. |
| **Resultado Esperado** | - Se notifica al usuario sobre la ausencia de resultados.<br>- Se evita mostrar datos incorrectos o desactualizados.<br>- Se permite restablecer los filtros para realizar una nueva búsqueda. |

<div align="center"> <b>Tabla 16: Caso de uso negativo de RF-008</b></div>

<br>

| **ID**                 | CU-017: Visualización exitosa del historial de consultas y agendamiento de sesiones recurrentes |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| **Versión**            | V1.0                                                                                             |
| **Prioridad**          | Importante                                                                                       |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de historial de consultas.<br>3. Visualiza la lista de consultas previas con detalles como fecha, profesional y notas.<br>4. Selecciona la opción de agendar una sesión recurrente con el mismo fisioterapeuta.<br>5. Configura la frecuencia de las sesiones (semanal, quincenal, mensual) y confirma la reserva.<br>6. Se muestra un mensaje de confirmación: "Sesión recurrente agendada con éxito". |
| **Resultado Esperado** | - El paciente puede revisar su historial de consultas sin problemas.<br>- El sistema permite configurar y almacenar sesiones recurrentes.<br>- Se envían notificaciones recordatorias al paciente sobre sus próximas sesiones. |

<div align="center"> <b>Tabla 17: Caso de uso positivo de RF-009</b></div>

<br>

| **ID**                 | CU-018: Fallo en la visualización del historial de consultas o en la configuración de sesiones recurrentes |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                                                            |
| **Prioridad**          | Importante                                                                                                      |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de historial de consultas.<br>3. Intenta visualizar sus consultas previas, pero el sistema no carga la información.<br>4. Selecciona la opción de agendar una sesión recurrente, pero la configuración no se guarda.<br>5. Se muestra un mensaje de error: "No se han podido recuperar los datos del historial de consultas. Inténtelo más tarde".<br>6. El paciente no puede consultar sus citas previas ni programar sesiones recurrentes. |
| **Resultado Esperado** | - Se informa al usuario del error sin mostrar datos incompletos.<br>- Se evita la duplicación o pérdida de información de citas previas.<br>- Se permite reintentar la acción cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 18: Caso de uso negativo de RF-009</b></div>

<br>

| **ID**                 | CU-019: Completar exitosamente el cuestionario predefinido de valoración previa |
| ---------------------- | ------------------------------------------------------------------------------ |
| **Versión**            | V1.0                                                                          |
| **Prioridad**          | Crítica                                                                       |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Antes de su consulta, se dirige a la sección del cuestionario de valoración previa.<br>3. Completa todas las preguntas sobre su estado de salud y síntomas actuales.<br>4. Revisa las respuestas y envía el cuestionario.<br>5. El sistema almacena la información y la asocia a la consulta agendada.<br>6. Se muestra un mensaje de confirmación: "Cuestionario enviado correctamente". |
| **Resultado Esperado** | - El paciente completa y envía el cuestionario sin problemas.<br>- El fisioterapeuta recibe la información antes de la consulta.<br>- Se mejora la preparación del profesional antes de la sesión. |

<div align="center"> <b>Tabla 19: Caso de uso positivo de RF-010</b></div>

<br>

| **ID**                 | CU-020: Fallo en el envío del cuestionario predefinido de valoración previa |
| ---------------------- | -------------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                      |
| **Prioridad**          | Crítica                                                                   |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Antes de su consulta, se dirige a la sección del cuestionario de valoración previa.<br>3. Intenta completar el formulario, pero el sistema no carga las preguntas.<br>4. Intenta enviar el cuestionario, pero el sistema no guarda las respuestas.<br>5. Se muestra un mensaje de error: "No se ha podido enviar el cuestionario. Inténtelo más tarde".<br>6. El fisioterapeuta no recibe información previa sobre el estado del paciente. |
| **Resultado Esperado** | - Se notifica al usuario del error sin perder datos ingresados.<br>- Se evita el almacenamiento de información incorrecta o incompleta.<br>- Se permite reintentar el envío cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 20: Caso de uso negativo de RF-010</b></div>

<br>

| **ID**                 | CU-021: Acceso exitoso a la plataforma para visualizar ejercicios y registrar progresos |
| ---------------------- | -------------------------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                                   |
| **Prioridad**          | Crítica                                                                                |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de ejercicios prescritos.<br>3. Visualiza los ejercicios asignados con vídeos y descripciones detalladas.<br>4. Registra su progreso indicando el número de series, repeticiones realizadas y nivel de dolor.<br>5. El sistema almacena la información y la asocia a su historial de tratamiento.<br>6. Se muestra un mensaje de confirmación: "Progreso registrado correctamente". |
| **Resultado Esperado** | - El paciente puede visualizar los ejercicios sin problemas.<br>- La información del progreso se almacena correctamente.<br>- El fisioterapeuta puede consultar los datos para ajustar el tratamiento. |

<div align="center"> <b>Tabla 21: Caso de uso positivo de RF-011</b></div>

<br>

| **ID**                 | CU-022: Fallo en el acceso a la plataforma o en el registro de progresos |
| ---------------------- | ------------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                      |
| **Prioridad**          | Crítica                                                                   |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de ejercicios prescritos.<br>3. Intenta visualizar los ejercicios, pero los vídeos no se cargan correctamente.<br>4. Intenta registrar su progreso, pero el sistema no guarda los datos ingresados.<br>5. Se muestra un mensaje de error: "No se ha podido registrar el progreso. Inténtelo más tarde".<br>6. El paciente no puede hacer un seguimiento preciso de su evolución. |
| **Resultado Esperado** | - Se notifica al usuario del error sin perder datos ingresados.<br>- Se evita almacenar información incorrecta o incompleta.<br>- Se permite reintentar el registro cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 22: Caso de uso negativo de RF-011</b></div>

<br>

| **ID**                 | CU-023: Visualización exitosa de la agenda de citas en la plataforma |
| ---------------------- | ------------------------------------------------------------------ |
| **Versión**            | V1.0                                                              |
| **Prioridad**          | Importante                                                        |
| **Escenario**          | 1. Un profesional accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de agenda de citas.<br>3. Visualiza su calendario con las citas programadas.<br>4. Las consultas online aparecen con enlaces de acceso a la videollamada.<br>5. Las consultas presenciales incluyen información detallada de la ubicación.<br>6. Se muestra un mensaje de confirmación: "Agenda actualizada correctamente". |
| **Resultado Esperado** | - El profesional puede visualizar su agenda sin problemas.<br>- Las citas online y presenciales están correctamente diferenciadas.<br>- Se facilita el acceso rápido a la videollamada o a la ubicación de la consulta. |

<div align="center"> <b>Tabla 23: Caso de uso positivo de RF-012</b></div>

<br>

| **ID**                 | CU-024: Fallo en la visualización de la agenda de citas en la plataforma |
| ---------------------- | ---------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                  |
| **Prioridad**          | Importante                                                            |
| **Escenario**          | 1. Un profesional accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de agenda de citas.<br>3. Intenta visualizar su calendario, pero las citas no se cargan correctamente.<br>4. Las consultas online no muestran el enlace de acceso a la videollamada.<br>5. Las consultas presenciales no contienen la información de ubicación.<br>6. Se muestra un mensaje de error: "No se ha podido cargar la agenda. Inténtelo más tarde". |
| **Resultado Esperado** | - Se notifica al usuario del error sin mostrar datos incorrectos.<br>- Se evita la pérdida de información sobre citas programadas.<br>- Se permite reintentar la carga de la agenda cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 24: Caso de uso negativo de RF-012</b></div>

<br>

| **ID**                 | CU-025: Inicio de sesión exitoso de pacientes con correo y contraseña o autenticación social |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Versión**            | V1.1                                                                          |
| **Prioridad**          | Crítica                                                                       |
| **Escenario**          | 1. Un paciente accede a la plataforma e ingresa su correo y contraseña.<br>2. El sistema valida las credenciales y permite el acceso.<br>3. Alternativamente, el usuario selecciona el inicio de sesión con un proveedor de autenticación social (Google, Facebook, etc.).<br>4. Es redirigido a la plataforma del proveedor, donde otorga los permisos necesarios.<br>5. El sistema recibe la validación del proveedor y concede el acceso al usuario.<br>6. Se muestra un mensaje de confirmación: "Inicio de sesión exitoso". |
| **Resultado Esperado** | - El paciente puede acceder correctamente mediante distintos métodos de autenticación.<br>- El sistema almacena la sesión de manera segura.<br>- Se garantiza una experiencia de inicio de sesión fluida y segura. |

<div align="center"> <b>Tabla 25: Caso de uso positivo de RF-013</b></div>

<br>

| **ID**                 | CU-026: Fallo en el inicio de sesión de pacientes con correo y contraseña o autenticación social |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **Versión**            | V1.1                                                                               |
| **Prioridad**          | Crítica                                                                            |
| **Escenario**          | 1. Un paciente accede a la plataforma e ingresa su correo y contraseña.<br>2. Introduce credenciales incorrectas y el sistema las rechaza.<br>3. Alternativamente, intenta acceder con un proveedor de autenticación social.<br>4. La autenticación con el proveedor falla debido a credenciales inválidas o falta de permisos.<br>5. Se muestra un mensaje de error: "Inicio de sesión fallido. Verifique sus credenciales e inténtelo de nuevo".<br>6. El usuario no puede acceder a la plataforma hasta ingresar credenciales válidas. |
| **Resultado Esperado** | - Se impide el acceso con credenciales incorrectas.<br>- Se notifica al paciente del error sin comprometer la seguridad.<br>- Se permite reintentar el inicio de sesión sin exponer información sensible. |

<div align="center"> <b>Tabla 26: Caso de uso negativo de RF-013</b></div>

<br>

| **ID**                 | CU-027: Inicio de sesión exitoso para fisios mediante credenciales |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                          |
| **Prioridad**          | Crítica                                                                       |
| **Escenario**          | 1. Un paciente accede a la plataforma e ingresa sus credenciales.<br>2. El sistema valida las credenciales y permite el acceso.<br>3. Se muestra un mensaje de confirmación: "Inicio de sesión exitoso". |
| **Resultado Esperado** | - El fisio puede acceder correctamente.<br>- El sistema almacena la sesión de manera segura.<br>- Se garantiza una experiencia de inicio de sesión fluida y segura. |

<div align="center"> <b>Tabla 27: Caso de uso positivo de RF-013</b></div>

<br>

| **ID**                 | CU-028: Fallo en el inicio de sesión para fisios mediante credenciales |
| ---------------------- | ---------------------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                               |
| **Prioridad**          | Crítica                                                                            |
| **Escenario**          | 1. Un fisioterapeuta accede a la plataforma e ingresa su correo y contraseña.<br>2. Introduce credenciales incorrectas y el sistema las rechaza.<br>3.Se muestra un mensaje de error: "Inicio de sesión fallido. Verifique sus credenciales e inténtelo de nuevo".<br>4. El usuario no puede acceder a la plataforma hasta ingresar credenciales válidas. |
| **Resultado Esperado** | - Se impide el acceso con credenciales incorrectas.<br>- Se notifica al usuario del error sin comprometer la seguridad.<br>- Se permite reintentar el inicio de sesión sin exponer información sensible. |

<div align="center"> <b>Tabla 28: Caso de uso negativo de RF-013</b></div>

<br>

| **ID**                 | CU-029: Cierre de sesión exitoso |
| ---------------------- | -------------------------------- |
| **Versión**            | V1.0                             |
| **Prioridad**          | Crítica                          |
| **Escenario**          | 1. Un usuario (paciente o fisioterapeuta) accede a la plataforma y está autenticado.<br>2. Se dirige a la opción de "Cerrar sesión" en el menú de usuario.<br>3. Hace clic en la opción de cierre de sesión.<br>4. El sistema invalida la sesión y redirige al usuario a la pantalla de inicio de sesión.<br>5. Se muestra un mensaje de confirmación: "Sesión cerrada correctamente". |
| **Resultado Esperado** | - La sesión del usuario se cierra correctamente.<br>- No se mantiene información de sesión activa en la plataforma.<br>- Se garantiza la seguridad evitando accesos no autorizados tras el cierre de sesión. |

<div align="center"> <b>Tabla 29: Caso de uso positivo de RF-014</b></div>

<br>

| **ID**                 | CU-030: Fallo en el cierre de sesión |
| ---------------------- | ----------------------------------- |
| **Versión**            | V1.0                                |
| **Prioridad**          | Crítica                             |
| **Escenario**          | 1. Un usuario (paciente o fisioterapeuta) accede a la plataforma y está autenticado.<br>2. Se dirige a la opción de "Cerrar sesión" en el menú de usuario.<br>3. Hace clic en la opción de cierre de sesión, pero el sistema no responde.<br>4. Intenta cerrar sesión nuevamente, pero sigue en la plataforma.<br>5. Se muestra un mensaje de error: "No se ha podido cerrar la sesión. Inténtelo de nuevo".<br>6. El usuario debe cerrar la sesión manualmente o reiniciar la aplicación. |
| **Resultado Esperado** | - Se notifica al usuario del error sin comprometer la seguridad.<br>- Se evita que la sesión siga activa después del intento de cierre.<br>- Se permite reintentar el cierre de sesión hasta que se complete correctamente. |

<div align="center"> <b>Tabla 30: Caso de uso negativo de RF-014</b></div>

<br>

| **ID**                 | CU-031: Gestión exitosa de usuarios (listado, edición y eliminación) |
| ---------------------- | ------------------------------------------------------------------ |
| **Versión**            | V1.0                                                              |
| **Prioridad**          | Importante                                                        |
| **Escenario**          | 1. Un administrador accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de gestión de usuarios.<br>3. Visualiza el listado de usuarios con sus respectivas cuentas y roles.<br>4. Selecciona un usuario para editar su información y guarda los cambios.<br>5. Alternativamente, selecciona un usuario para eliminarlo de la plataforma.<br>6. Se muestra un mensaje de confirmación: "Usuario actualizado/eliminado correctamente". |
| **Resultado Esperado** | - El administrador puede listar, editar y eliminar usuarios sin problemas.<br>- Los cambios se reflejan correctamente en la base de datos.<br>- Se garantiza que solo los administradores con permisos puedan realizar estas acciones. |

<div align="center"> <b>Tabla 31: Caso de uso positivo de RF-015</b></div>

<br>

| **ID**                 | CU-032: Fallo en la gestión de usuarios (listado, edición o eliminación) |
| ---------------------- | ----------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                    |
| **Prioridad**          | Importante                                                              |
| **Escenario**          | 1. Un administrador accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de gestión de usuarios.<br>3. Intenta visualizar el listado de usuarios, pero el sistema no carga los datos.<br>4. Intenta editar la información de un usuario, pero los cambios no se guardan correctamente.<br>5. Intenta eliminar un usuario, pero el sistema muestra un error.<br>6. Se muestra un mensaje de error: "No se ha podido completar la operación. Inténtelo más tarde". |
| **Resultado Esperado** | - Se notifica al administrador del error sin afectar la integridad de los datos.<br>- Se evita la eliminación accidental o edición incorrecta de usuarios.<br>- Se permite reintentar la acción cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 32: Caso de uso negativo de RF-015</b></div>

<br>

| **ID**                 | CU-033: Recuperación exitosa de contraseña |
| ---------------------- | ----------------------------------------- |
| **Versión**            | V1.0                                      |
| **Prioridad**          | Importante                                |
| **Escenario**          | 1. Un usuario accede a la plataforma y selecciona la opción "¿Olvidaste tu contraseña?".<br>2. Introduce su correo electrónico registrado en la plataforma.<br>3. El sistema verifica la existencia del correo y envía un enlace de recuperación.<br>4. El usuario accede a su correo, abre el enlace y establece una nueva contraseña.<br>5. El sistema guarda la nueva contraseña y permite el inicio de sesión.<br>6. Se muestra un mensaje de confirmación: "Contraseña restablecida con éxito". |
| **Resultado Esperado** | - El usuario recibe el enlace de recuperación sin problemas.<br>- Puede restablecer su contraseña y acceder nuevamente.<br>- La seguridad del proceso está garantizada con validaciones adecuadas. |

<div align="center"> <b>Tabla 33: Caso de uso positivo de RF-016</b></div>

<br>

| **ID**                 | CU-034: Fallo en la recuperación de contraseña |
| ---------------------- | --------------------------------------------- |
| **Versión**            | V1.0                                          |
| **Prioridad**          | Importante                                    |
| **Escenario**          | 1. Un usuario accede a la plataforma y selecciona la opción "¿Olvidaste tu contraseña?".<br>2. Introduce su correo electrónico registrado.<br>3. El sistema intenta enviar el correo de recuperación, pero ocurre un error.<br>4. El usuario no recibe el correo en su bandeja de entrada ni en spam.<br>5. Se muestra un mensaje de error: "No se ha podido enviar el enlace de recuperación. Inténtelo más tarde".<br>6. El usuario no puede restablecer su contraseña en ese momento. |
| **Resultado Esperado** | - Se notifica al usuario del error sin comprometer la seguridad.<br>- Se evita el envío de correos a direcciones no registradas.<br>- Se permite reintentar la recuperación en otro momento. |

<div align="center"> <b>Tabla 34: Caso de uso negativo de RF-016</b></div>

<br>

| **ID**                 | CU-035: Gestión exitosa de roles y permisos de usuario |
| ---------------------- | ------------------------------------------------------ |
| **Versión**            | V1.0                                                   |
| **Prioridad**          | Crítica                                                |
| **Escenario**          | 1. Un usuario accede a la plataforma e inicia sesión.<br>2. El sistema verifica su rol (paciente, fisioterapeuta o administrador).<br>3. Se le muestran únicamente las funcionalidades permitidas según su rol.<br>4. Un administrador accede a la sección de gestión de usuarios y cambia el rol de un usuario.<br>5. El sistema actualiza los permisos del usuario en tiempo real.<br>6. Se muestra un mensaje de confirmación: "Roles y permisos actualizados correctamente". |
| **Resultado Esperado** | - El sistema diferencia correctamente los permisos de cada rol.<br>- Se evita que un usuario acceda a funciones no autorizadas.<br>- Los administradores pueden modificar roles y permisos sin errores. |

<div align="center"> <b>Tabla 35: Caso de uso positivo de RF-017</b></div>

<br>

| **ID**                 | CU-036: Fallo en la gestión de roles y permisos de usuario |
| ---------------------- | --------------------------------------------------------- |
| **Versión**            | V1.0                                                      |
| **Prioridad**          | Crítica                                                   |
| **Escenario**          | 1. Un usuario accede a la plataforma e inicia sesión.<br>2. El sistema intenta verificar su rol, pero ocurre un error.<br>3. El usuario recibe un acceso incorrecto (por ejemplo, un paciente visualiza opciones de administrador).<br>4. Un administrador intenta modificar los permisos de un usuario, pero los cambios no se guardan.<br>5. Se muestra un mensaje de error: "No se han podido actualizar los roles y permisos. Inténtelo más tarde".<br>6. El usuario afectado mantiene permisos incorrectos, lo que puede comprometer la seguridad del sistema. |
| **Resultado Esperado** | - Se notifica al usuario del error sin comprometer la seguridad.<br>- Se evita que los usuarios accedan a funciones no autorizadas.<br>- Se permite reintentar la actualización de roles cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 36: Caso de uso negativo de RF-017</b></div>

<br>

| **ID**                 | CU-037: Verificación exitosa de cuenta |
| ---------------------- | ------------------------------------- |
| **Versión**            | V1.0                                  |
| **Prioridad**          | Importante                            |
| **Escenario**          | 1. Un usuario completa el proceso de registro en la plataforma.<br>2. El sistema envía un correo de verificación con un enlace de activación.<br>3. El usuario accede a su bandeja de entrada y abre el correo.<br>4. Hace clic en el enlace de verificación y es redirigido a la plataforma.<br>5. El sistema confirma la verificación y activa la cuenta del usuario.<br>6. Se muestra un mensaje de confirmación: "Cuenta verificada correctamente". |
| **Resultado Esperado** | - La cuenta del usuario se activa correctamente.<br>- El usuario puede iniciar sesión y acceder a todas las funcionalidades de su rol.<br>- Se garantiza la autenticidad del usuario antes de permitirle el acceso completo. |

<div align="center"> <b>Tabla 37: Caso de uso positivo de RF-018</b></div>

<br>

| **ID**                 | CU-038: Fallo en la verificación de cuenta |
| ---------------------- | ----------------------------------------- |
| **Versión**            | V1.0                                      |
| **Prioridad**          | Importante                                |
| **Escenario**          | 1. Un usuario completa el proceso de registro en la plataforma.<br>2. El sistema intenta enviar un correo de verificación, pero ocurre un error.<br>3. El usuario no recibe el correo de activación en su bandeja de entrada ni en spam.<br>4. Intenta registrarse nuevamente, pero el sistema le indica que el correo ya está en uso.<br>5. Se muestra un mensaje de error: "No se ha podido verificar la cuenta. Inténtelo más tarde o solicite un nuevo enlace".<br>6. El usuario no puede acceder a la plataforma hasta completar la verificación. |
| **Resultado Esperado** | - Se notifica al usuario del error sin comprometer la seguridad.<br>- Se evita la activación de cuentas no verificadas.<br>- Se permite reenviar el correo de verificación para solucionar el problema. |

<div align="center"> <b>Tabla 38: Caso de uso negativo de RF-018</b></div>

<br>

| **ID**                 | CU-039: Eliminación exitosa de cuenta |
| ---------------------- | ------------------------------------- |
| **Versión**            | V1.0                                  |
| **Prioridad**          | Importante                            |
| **Escenario**          | 1. Un usuario accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de configuración de cuenta.<br>3. Selecciona la opción "Eliminar cuenta" y confirma la acción.<br>4. El sistema solicita una última confirmación antes de proceder.<br>5. El usuario confirma y el sistema elimina su cuenta junto con todos sus datos.<br>6. Se muestra un mensaje de confirmación: "Su cuenta ha sido eliminada correctamente". |
| **Resultado Esperado** | - La cuenta y todos los datos asociados se eliminan conforme a la normativa de protección de datos.<br>- El usuario no puede volver a acceder con las mismas credenciales.<br>- Se garantiza la eliminación irreversible de la información personal. |

<div align="center"> <b>Tabla 39: Caso de uso positivo de RF-019</b></div>

<br>

| **ID**                 | CU-040: Fallo en la eliminación de cuenta |
| ---------------------- | ----------------------------------------- |
| **Versión**            | V1.0                                      |
| **Prioridad**          | Importante                                |
| **Escenario**          | 1. Un usuario accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de configuración de cuenta.<br>3. Selecciona la opción "Eliminar cuenta" y confirma la acción.<br>4. El sistema intenta eliminar la cuenta, pero ocurre un error en la base de datos.<br>5. Se muestra un mensaje de error: "No se ha podido eliminar su cuenta. Inténtelo más tarde".<br>6. La cuenta sigue activa y el usuario debe intentarlo nuevamente. |
| **Resultado Esperado** | - Se notifica al usuario del error sin comprometer la seguridad de sus datos.<br>- Se evita la eliminación parcial de información.<br>- Se permite reintentar la acción cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 40: Caso de uso negativo de RF-019</b></div>

<br>

| **ID**                 | CU-041: Uso exitoso de escalas de dolor avanzadas |
| ---------------------- | ------------------------------------------------- |
| **Versión**            | V1.0                                              |
| **Prioridad**          | Importante                                        |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de evaluación del dolor.<br>3. Selecciona una de las escalas de dolor disponibles (EVA, Borg, McGill, etc.).<br>4. Completa la evaluación indicando la intensidad y características de su dolor.<br>5. El sistema almacena la información y la asocia a su historial clínico.<br>6. Se muestra un mensaje de confirmación: "Evaluación del dolor registrada correctamente". |
| **Resultado Esperado** | - El paciente puede seleccionar y completar la evaluación del dolor sin problemas.<br>- Los datos se almacenan correctamente en la base de datos.<br>- El profesional de salud puede visualizar y analizar la información para mejorar el tratamiento. |

<div align="center"> <b>Tabla 41: Caso de uso positivo de RF-020</b></div>

<br>

| **ID**                 | CU-042: Fallo en la funcionalidad de escalas de dolor avanzadas |
| ---------------------- | ---------------------------------------------------------------- |
| **Versión**            | V1.0                                                             |
| **Prioridad**          | Importante                                                      |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de evaluación del dolor.<br>3. Intenta seleccionar una escala de dolor, pero la interfaz no responde.<br>4. Completa la evaluación, pero el sistema no guarda la información correctamente.<br>5. Se muestra un mensaje de error: "No se ha podido registrar la evaluación del dolor. Inténtelo más tarde".<br>6. El paciente no puede enviar los datos al profesional de salud. |
| **Resultado Esperado** | - Se notifica al usuario del error sin perder los datos ingresados.<br>- Se evita el almacenamiento de información incorrecta o incompleta.<br>- Se permite reintentar la evaluación cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 42: Caso de uso negativo de RF-020</b></div>

<br>

| **ID**                 | CU-043: Compartición exitosa de diagnósticos e imágenes con pacientes |
| ---------------------- | --------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                 |
| **Prioridad**          | Importante                                                           |
| **Escenario**          | 1. Un fisioterapeuta accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de historial del paciente.<br>3. Selecciona la opción de compartir diagnóstico e imágenes.<br>4. Adjunta archivos (informes, imágenes de pruebas médicas, etc.) y confirma el envío.<br>5. El paciente recibe una notificación y accede a la información desde su perfil.<br>6. Se muestra un mensaje de confirmación: "Diagnóstico e imágenes compartidos correctamente". |
| **Resultado Esperado** | - El fisioterapeuta puede compartir información de manera eficiente.<br>- El paciente recibe acceso inmediato a sus diagnósticos y pruebas.<br>- La plataforma garantiza la seguridad y privacidad de los datos compartidos. |

<div align="center"> <b>Tabla 43: Caso de uso positivo de RF-021</b></div>

<br>

| **ID**                 | CU-044: Fallo en la compartición de diagnósticos e imágenes con pacientes |
| ---------------------- | ------------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                     |
| **Prioridad**          | Importante                                                               |
| **Escenario**          | 1. Un fisioterapeuta accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de historial del paciente.<br>3. Intenta compartir un diagnóstico o imágenes, pero el sistema no carga los archivos.<br>4. Intenta enviar la información, pero el sistema muestra un error.<br>5. Se muestra un mensaje de error: "No se ha podido compartir la información. Inténtelo más tarde".<br>6. El paciente no recibe los diagnósticos ni las imágenes en su perfil. |
| **Resultado Esperado** | - Se notifica al usuario del error sin comprometer la seguridad de los datos.<br>- Se evita la duplicación o pérdida de información médica.<br>- Se permite reintentar la acción cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 44: Caso de uso negativo de RF-021</b></div>

<br>

| **ID**                 | CU-045: Gestión exitosa de videollamadas |
| ---------------------- | ---------------------------------------- |
| **Versión**            | V1.0                                     |
| **Prioridad**          | Crítica                                  |
| **Escenario**          | 1. Un fisioterapeuta accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de agenda y selecciona una videollamada programada.<br>3. Inicia la videollamada en el horario previamente agendado.<br>4. Durante la sesión, activa la opción de grabación con el consentimiento del paciente.<br>5. La videollamada se desarrolla sin interrupciones y se almacena la grabación de forma segura.<br>6. Se muestra un mensaje de confirmación: "Videollamada completada y grabación guardada correctamente". |
| **Resultado Esperado** | - El fisioterapeuta puede iniciar y gestionar videollamadas sin problemas.<br>- La grabación se almacena de manera segura según los permisos configurados.<br>- Se garantiza la comunicación fluida y segura entre el profesional y el paciente. |

<div align="center"> <b>Tabla 45: Caso de uso positivo de RF-022</b></div>

<br>

| **ID**                 | CU-046: Fallo en la gestión de videollamadas |
| ---------------------- | -------------------------------------------- |
| **Versión**            | V1.0                                         |
| **Prioridad**          | Crítica                                      |
| **Escenario**          | 1. Un fisioterapeuta accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de agenda y selecciona una videollamada programada.<br>3. Intenta iniciar la videollamada, pero el sistema no responde.<br>4. La opción de grabación no se activa correctamente o la videollamada se corta inesperadamente.<br>5. Se muestra un mensaje de error: "No se ha podido establecer la videollamada. Inténtelo más tarde".<br>6. El fisioterapeuta y el paciente no pueden completar la consulta virtual. |
| **Resultado Esperado** | - Se notifica al usuario del error sin comprometer la seguridad de la información.<br>- Se evita la grabación de sesiones defectuosas o incompletas.<br>- Se permite reintentar la conexión cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 46: Caso de uso negativo de RF-022</b></div>

<br>

| **ID**                 | CU-049: Envío exitoso de confirmación y recordatorio de citas |
| ---------------------- | ------------------------------------------------------------ |
| **Versión**            | V1.0                                                         |
| **Prioridad**          | Importante                                                   |
| **Escenario**          | 1. Un paciente agenda una cita en la plataforma.<br>2. El sistema genera automáticamente una notificación de confirmación.<br>3. Se envía un mensaje o correo electrónico al paciente y al fisioterapeuta confirmando la cita.<br>4. Días antes de la cita, el sistema envía recordatorios automáticos.<br>5. El paciente recibe el recordatorio y puede confirmar o cancelar la cita.<br>6. Se muestra un mensaje de confirmación: "Cita confirmada y recordatorio enviado exitosamente". |
| **Resultado Esperado** | - El sistema envía correctamente las notificaciones de confirmación y recordatorio.<br>- El paciente y el fisioterapeuta reciben información clara sobre la cita.<br>- Se reduce el riesgo de cancelaciones o ausencias debido a olvidos. |

<div align="center"> <b>Tabla 49: Caso de uso positivo de RF-023</b></div>

<br>

| **ID**                 | CU-050: Fallo en la notificación de confirmación y recordatorio de citas |
| ---------------------- | ---------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                  |
| **Prioridad**          | Importante                                                            |
| **Escenario**          | 1. Un paciente agenda una cita en la plataforma.<br>2. El sistema intenta generar una notificación de confirmación, pero ocurre un error.<br>3. El paciente no recibe el mensaje o correo electrónico de confirmación.<br>4. Días antes de la cita, el sistema no envía recordatorios automáticos.<br>5. Se muestra un mensaje de error: "No se ha podido enviar la notificación. Inténtelo más tarde".<br>6. El paciente no recibe información sobre la cita y puede olvidarla. |
| **Resultado Esperado** | - Se notifica al usuario del error sin comprometer la gestión de citas.<br>- Se evita la falta de comunicación entre paciente y fisioterapeuta.<br>- Se permite reintentar el envío de notificaciones cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 50: Caso de uso negativo de RF-023</b></div>

<br>

| **ID**                 | CU-051: Visualización exitosa del perfil profesional completo |
| ---------------------- | ------------------------------------------------------------ |
| **Versión**            | V1.0                                                         |
| **Prioridad**          | Importante                                                   |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de búsqueda de fisioterapeutas.<br>3. Selecciona un fisioterapeuta y accede a su perfil profesional.<br>4. Visualiza la información detallada del fisioterapeuta, incluyendo ubicación, contacto, especialidades, tarifas y horarios.<br>5. Puede consultar multimedia, valoraciones y modalidad de consulta.<br>6. Se muestra un mensaje de confirmación: "Perfil profesional cargado correctamente". |
| **Resultado Esperado** | - El paciente puede ver toda la información relevante del fisioterapeuta sin problemas.<br>- Los datos se muestran correctamente y se actualizan en tiempo real.<br>- Se mejora la confianza del paciente al tener un perfil detallado antes de reservar una consulta. |

<div align="center"> <b>Tabla 51: Caso de uso positivo de RF-024</b></div>

<br>

| **ID**                 | CU-052: Fallo en la visualización del perfil profesional completo |
| ---------------------- | ---------------------------------------------------------------- |
| **Versión**            | V1.0                                                             |
| **Prioridad**          | Importante                                                       |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de búsqueda de fisioterapeutas.<br>3. Intenta acceder al perfil de un fisioterapeuta, pero el sistema no carga la información.<br>4. Algunos datos como tarifas, contacto o especialidades aparecen incompletos o incorrectos.<br>5. Se muestra un mensaje de error: "No se ha podido cargar el perfil profesional. Inténtelo más tarde".<br>6. El paciente no puede visualizar la información necesaria para tomar una decisión sobre su consulta. |
| **Resultado Esperado** | - Se notifica al usuario del error sin mostrar información incorrecta.<br>- Se evita que los pacientes accedan a datos desactualizados o incompletos.<br>- Se permite reintentar la carga del perfil cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 52: Caso de uso negativo de RF-024</b></div>

<br>

| **ID**                 | CU-053: Gestión exitosa del apartado para profesionales de clínica |
| ---------------------- | ---------------------------------------------------------------- |
| **Versión**            | V1.0                                                             |
| **Prioridad**          | Baja                                                       |
| **Escenario**          | 1. Un administrador de una clínica accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de gestión de profesionales.<br>3. Visualiza la lista de fisioterapeutas que trabajan en la clínica.<br>4. Puede agregar, editar o eliminar perfiles de profesionales dentro de la clínica.<br>5. Se guardan los cambios y la lista de profesionales se actualiza correctamente.<br>6. Se muestra un mensaje de confirmación: "Gestión de profesionales actualizada correctamente". |
| **Resultado Esperado** | - La clínica puede visualizar y gestionar sus fisioterapeutas sin problemas.<br>- Se actualizan correctamente los datos de cada profesional.<br>- Se garantiza una administración eficiente dentro de la plataforma. |

<div align="center"> <b>Tabla 53: Caso de uso positivo de RF-025</b></div>

<br>

| **ID**                 | CU-054: Fallo en la gestión del apartado para profesionales de clínica |
| ---------------------- | -------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                |
| **Prioridad**          | Baja                                                          |
| **Escenario**          | 1. Un administrador de una clínica accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de gestión de profesionales.<br>3. Intenta visualizar la lista de fisioterapeutas, pero el sistema no carga los datos.<br>4. Intenta agregar o modificar un profesional, pero los cambios no se guardan correctamente.<br>5. Se muestra un mensaje de error: "No se ha podido actualizar la información. Inténtelo más tarde".<br>6. La clínica no puede gestionar adecuadamente a sus profesionales en la plataforma. |
| **Resultado Esperado** | - Se notifica al usuario del error sin afectar la integridad de los datos.<br>- Se evita la pérdida de información sobre los profesionales de la clínica.<br>- Se permite reintentar la acción cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 54: Caso de uso negativo de RF-025</b></div>

<br>

| **ID**                 | CU-055: Reserva exitosa de cita con selección de horario y precio |
| ---------------------- | ---------------------------------------------------------------- |
| **Versión**            | V1.0                                                             |
| **Prioridad**          | Importante                                                       |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de reserva de citas.<br>3. Selecciona un fisioterapeuta y elige un servicio específico.<br>4. Se muestran las fechas e intervalos horarios disponibles para ese servicio.<br>5. El paciente selecciona un horario y visualiza el precio antes de confirmar la reserva.<br>6. Se muestra un mensaje de confirmación: "Cita reservada con éxito". |
| **Resultado Esperado** | - El paciente puede elegir el horario y ver el precio antes de confirmar.<br>- La cita queda registrada correctamente en la plataforma.<br>- Se garantiza una reserva clara y transparente para el usuario. |

<div align="center"> <b>Tabla 55: Caso de uso positivo de RF-026</b></div>

<br>

| **ID**                 | CU-056: Fallo en la reserva de cita con selección de horario y precio |
| ---------------------- | ------------------------------------------------------------------ |
| **Versión**            | V1.0                                                              |
| **Prioridad**          | Importante                                                        |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de reserva de citas.<br>3. Selecciona un fisioterapeuta y elige un servicio específico.<br>4. Intenta seleccionar una fecha y horario, pero el sistema no muestra disponibilidad.<br>5. Intenta confirmar la reserva, pero el sistema no permite completar el proceso.<br>6. Se muestra un mensaje de error: "No se ha podido completar la reserva. Inténtelo más tarde". |
| **Resultado Esperado** | - Se notifica al usuario del error sin generar una reserva incompleta.<br>- Se evita mostrar información incorrecta sobre disponibilidad o precios.<br>- Se permite reintentar la reserva cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 56: Caso de uso negativo de RF-026</b></div>

<br>

| **ID**                 | CU-057: Marcado exitoso de un profesional como favorito |
| ---------------------- | ------------------------------------------------------ |
| **Versión**            | V1.0                                                   |
| **Prioridad**          | Baja                                                   |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de búsqueda de fisioterapeutas.<br>3. Visualiza el perfil de un fisioterapeuta y selecciona la opción de "Marcar como favorito".<br>4. El sistema guarda la selección y el profesional se añade a la lista de favoritos del paciente.<br>5. El paciente puede acceder rápidamente a su lista de fisioterapeutas favoritos en su perfil.<br>6. Se muestra un mensaje de confirmación: "Profesional añadido a favoritos correctamente". |
| **Resultado Esperado** | - El paciente puede marcar fisioterapeutas como favoritos sin problemas.<br>- La lista de favoritos se almacena correctamente y permite un acceso rápido.<br>- Se facilita la reserva con fisioterapeutas previamente seleccionados. |

<div align="center"> <b>Tabla 57: Caso de uso positivo de RF-027</b></div>

<br>

| **ID**                 | CU-058: Fallo en el marcado de un profesional como favorito |
| ---------------------- | -------------------------------------------------------- |
| **Versión**            | V1.0                                                     |
| **Prioridad**          | Baja                                                     |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de búsqueda de fisioterapeutas.<br>3. Visualiza el perfil de un fisioterapeuta e intenta marcarlo como favorito.<br>4. El sistema intenta guardar la selección, pero ocurre un error y no se almacena.<br>5. El paciente revisa su lista de favoritos y el fisioterapeuta no aparece en ella.<br>6. Se muestra un mensaje de error: "No se ha podido añadir el profesional a favoritos. Inténtelo más tarde". |
| **Resultado Esperado** | - Se notifica al usuario del error sin afectar su experiencia.<br>- Se evita almacenar datos incorrectos o inconsistentes en la lista de favoritos.<br>- Se permite reintentar la acción cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 58: Caso de uso negativo de RF-027</b></div>

<br>

| **ID**                 | CU-059: Envío exitoso de mensajes entre usuarios |
| ---------------------- | ----------------------------------------------- |
| **Versión**            | V1.0                                            |
| **Prioridad**          | Deseable                                        |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de mensajería y selecciona un fisioterapeuta con el que desea comunicarse.<br>3. Escribe un mensaje y lo envía.<br>4. El fisioterapeuta recibe una notificación y puede responder.<br>5. Ambos usuarios pueden intercambiar mensajes en tiempo real.<br>6. Se muestra un mensaje de confirmación: "Mensaje enviado correctamente". |
| **Resultado Esperado** | - El paciente y el fisioterapeuta pueden comunicarse sin problemas.<br>- Los mensajes se envían y reciben correctamente.<br>- La plataforma facilita la coordinación previa a la reserva de citas. |

<div align="center"> <b>Tabla 59: Caso de uso positivo de RF-028</b></div>

<br>

| **ID**                 | CU-060: Fallo en el envío de mensajes entre usuarios |
| ---------------------- | --------------------------------------------------- |
| **Versión**            | V1.0                                                |
| **Prioridad**          | Deseable                                            |
| **Escenario**          | 1. Un paciente accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de mensajería y selecciona un fisioterapeuta con el que desea comunicarse.<br>3. Escribe un mensaje e intenta enviarlo, pero el sistema no responde.<br>4. El fisioterapeuta no recibe ninguna notificación del mensaje.<br>5. Se muestra un mensaje de error: "No se ha podido enviar el mensaje. Inténtelo más tarde".<br>6. El paciente debe intentar nuevamente la comunicación. |
| **Resultado Esperado** | - Se notifica al usuario del error sin comprometer la información.<br>- Se evita la pérdida de mensajes no enviados.<br>- Se permite reintentar el envío cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 60: Caso de uso negativo de RF-028</b></div>

<br>

| **ID**                 | CU-061: Visualización exitosa del listado de pacientes para profesionales |
| ---------------------- | ---------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                  |
| **Prioridad**          | Importante                                                            |
| **Escenario**          | 1. Un fisioterapeuta accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de "Mis Pacientes".<br>3. Visualiza el listado de sus pacientes con información básica.<br>4. Selecciona un paciente y accede a su historial de citas y estado del tratamiento.<br>5. Puede consultar datos de contacto y otra información relevante del paciente.<br>6. Se muestra un mensaje de confirmación: "Listado de pacientes cargado correctamente". |
| **Resultado Esperado** | - El fisioterapeuta puede visualizar la lista de sus pacientes sin problemas.<br>- Los datos se cargan correctamente, mostrando historial de citas y estado del tratamiento.<br>- Se facilita el acceso rápido a la información del paciente para mejorar la consulta. |

<div align="center"> <b>Tabla 61 : Caso de uso positivo de RF-029</b></div>

<br>

| **ID**                 | CU-062: Fallo en la visualización del listado de pacientes para profesionales |
| ---------------------- | ------------------------------------------------------------------------ |
| **Versión**            | V1.0                                                                    |
| **Prioridad**          | Importante                                                              |
| **Escenario**          | 1. Un fisioterapeuta accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de "Mis Pacientes".<br>3. Intenta visualizar el listado, pero los datos no cargan correctamente.<br>4. Intenta acceder a la información de un paciente, pero el sistema muestra un error.<br>5. Se muestra un mensaje de error: "No se ha podido cargar la lista de pacientes. Inténtelo más tarde".<br>6. El fisioterapeuta no puede consultar el historial ni el estado del tratamiento de sus pacientes. |
| **Resultado Esperado** | - Se notifica al usuario del error sin mostrar datos incorrectos.<br>- Se evita la carga de información incompleta o errónea.<br>- Se permite reintentar la visualización cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 62: Caso de uso negativo de RF-029</b></div>

<br>

| **ID**                 | CU-063: Programación exitosa de citas con asignación individual a profesionales |
| ---------------------- | --------------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                        |
| **Prioridad**          | Baja                                                                        |
| **Escenario**          | 1. Un administrador de clínica accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de agenda clínica.<br>3. Selecciona una franja horaria y visualiza los profesionales disponibles.<br>4. Asigna una cita a un paciente y selecciona un profesional específico.<br>5. El sistema guarda la cita y actualiza la agenda con la asignación correcta.<br>6. Se muestra un mensaje de confirmación: "Cita programada exitosamente con asignación individual". |
| **Resultado Esperado** | - La clínica puede programar múltiples citas en una misma franja horaria.<br>- Cada cita se asigna correctamente a un profesional disponible.<br>- La agenda refleja con claridad la distribución de citas por profesional. |

<div align="center"> <b>Tabla 63: Caso de uso positivo de RF-030</b></div>

<br>

| **ID**                 | CU-64: Fallo en la programación de citas con asignación individual a profesionales |
| ---------------------- | -------------------------------------------------------------------------------- |
| **Versión**            | V1.0                                                                             |
| **Prioridad**          | Baja                                                                             |
| **Escenario**          | 1. Un administrador de clínica accede a la plataforma e inicia sesión.<br>2. Se dirige a la sección de agenda clínica.<br>3. Intenta seleccionar una franja horaria, pero el sistema no carga la disponibilidad de los profesionales.<br>4. Intenta asignar una cita a un profesional, pero el sistema muestra un error.<br>5. Se muestra un mensaje de error: "No se ha podido programar la cita. Inténtelo más tarde".<br>6. La clínica no puede gestionar la asignación de citas correctamente. |
| **Resultado Esperado** | - Se notifica al usuario del error sin afectar la disponibilidad real de los profesionales.<br>- Se evita la asignación errónea de citas o la duplicación de horarios.<br>- Se permite reintentar la acción cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 64: Caso de uso negativo de RF-030</b></div>

<br>

| **ID**                 | CU-65: Integración exitosa del modelo 3D en videollamadas |
| ---------------------- | --------------------------------------------------------- |
| **Versión**            | V1.0                                                      |
| **Prioridad**          | Deseable                                                  |
| **Escenario**          | 1. El fisioterapeuta inicia una videollamada con el paciente.<br>2. Durante la llamada, activa la opción de visualizar el modelo 3D del cuerpo (atlas).<br>3. El sistema carga el modelo 3D correctamente en la interfaz.<br>4. El fisioterapeuta interactúa con el modelo, señalando, rotando y resaltando áreas específicas.<br>5. El paciente observa la interacción y entiende mejor la explicación. |
| **Resultado Esperado** | - El modelo 3D se carga sin inconvenientes.<br>- La interacción (señalar, rotar y resaltar) funciona correctamente.<br>- Se mejora la comunicación y comprensión entre fisioterapeuta y paciente. |

<div align="center"> <b>Tabla 65: Caso de uso positivo de RF-031</b></div>

<br>

| **ID**                 | CU-66: Fallo en la integración del modelo 3D en videollamadas |
| ---------------------- | -------------------------------------------------------------- |
| **Versión**            | V1.0                                                           |
| **Prioridad**          | Deseable                                                       |
| **Escenario**          | 1. El fisioterapeuta inicia una videollamada con el paciente.<br>2. Durante la llamada, intenta activar la opción de visualizar el modelo 3D del cuerpo (atlas).<br>3. El sistema no carga el modelo 3D o se produce un error durante la interacción.<br>4. Se muestra un mensaje de error: "Error al cargar el modelo 3D".<br>5. El fisioterapeuta no puede utilizar la funcionalidad durante la llamada. |
| **Resultado Esperado** | - Se notifica de forma clara el error al usuario.<br>- Se evita la interacción defectuosa con el modelo 3D.<br>- Se permite reintentar la carga o se ofrece una alternativa para gestionar la situación. |

<div align="center"> <b>Tabla 66: Caso de uso negativo de RF-031</b></div>

<br>

| **ID**                 | CU-67: Fisioterapeuta elige y paga plan de manera exitosa |
| ---------------------- | -------------------------------------------------------------- |
| **Versión**            | V1.0                                                           |
| **Prioridad**          | Importante                                                       |
| **Escenario**          | 1. El fisioterapeuta accede a su perfil dentro de la plataforma.<br>2. En la sección de planes, se presentan las opciones disponibles: "Plan de Fisio Básico" y "Plan de Fisio Premium".<br>3. El fisioterapeuta selecciona el Plan que quiera.<br>4. El sistema muestra el precio y los beneficios del plan seleccionado.<br>5. El fisioterapeuta procede al pago del plan mediante uno de los métodos disponibles (tarjeta de crédito, transferencia, etc.).<br>6. Tras completar el pago, el sistema actualiza el perfil del fisioterapeuta, otorgándole las ventajas del Plan pagado. |
| **Resultado Esperado** | - Se permite el visualizar y pagar los distintos planes de la aplicación.<br>- Se actualiza el perfil del fisioterapeuta con el plan que haya comprado. |

<div align="center"> <b>Tabla 67: Caso de uso negativo de RF-032</b></div>

<br>

| **ID**                 | CU-68: Fallo en la elección y pago del plan del fisioterapeuta |
| ---------------------- | -------------------------------------------------------------- |
| **Versión**            | V1.0                                                           |
| **Prioridad**          | Importante                                                       |
| **Escenario**          | 1. El fisioterapeuta accede a su perfil dentro de la plataforma.<br>2. En la sección de planes, se presentan las opciones disponibles: "Plan de Fisio Básico" y "Plan de Fisio Premium".<br>3. El fisioterapeuta selecciona el Plan que quiera.<br>4. El sistema muestra el precio y los beneficios del plan seleccionado.<br>5. El fisioterapeuta procede al pago del plan mediante uno de los métodos disponibles (tarjeta de crédito, transferencia, etc.).<br>6. Ocurre un error en el proceso de pago o en la selección del plan.<br>7. Se muestra un mensaje de error: "Error al intentar cambiar de Plan. Inténtelo más tarde". |
| **Resultado Esperado** | - Se notifica al fisioterapeuta del error sin generar ningún cambio en el perfil.<br>- Se evita mostrar información incorrecta sobre disponibilidad o precios.<br>- Se permite reintentar el cambio de Plan cuando el sistema esté disponible. |

<div align="center"> <b>Tabla 68: Caso de uso negativo de RF-032</b></div>
