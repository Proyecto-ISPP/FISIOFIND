<!-- ---
title: "SPRINT PLANNING SPRINT 3"                         # UPDATED FOR SPRINT 3
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 3"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "28/03/2025"                                        # UPDATED FOR SPRINT 3
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../../.backgrounds/background4V.pdf"  # CHANGE IF NEEDED
header-left: "SPRINT PLANNING SPRINT 3"                   # UPDATED FOR SPRINT 3
header-right: "28/03/2025"                                # UPDATED FOR SPRINT 3
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
--- -->

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<p align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  SPRINT PLANNING SPRINT 3
</p>

<br>


**ÍNDICE**
- [**1. OBJETIVOS DEL SPRINT**](#1-objetivos-del-sprint)
- [**2. SPRINT BACKLOG**](#2-sprint-backlog)
  - [**Épica 12: Cifrado de datos**](#épica-12-cifrado-de-datos)
  - [**Épica 13: Mejoras de UX/UI**](#épica-13-mejoras-de-uxui)
  - [**Épica 14: Analíticas y métricas**](#épica-14-analíticas-y-métricas)
  - [**Épica 15: Correcciones del Sprint 2**](#épica-15-correcciones-del-sprint-2)
  - [**Épica 16: Tests**](#épica-16-tests)
- [**3. METODOLOGÍA INTERNA**](#3-metodología-interna)
  - [3.1. Gestión de Tareas en GitHub Project](#31-gestión-de-tareas-en-github-project)
  - [3.2. Flujo de Trabajo](#32-flujo-de-trabajo)
  - [3.3. Flujo de desarrollo](#33-flujo-de-desarrollo)
  - [3.4. Definición de Hecho (DoD) de una Historia de Usuario](#34-definición-de-hecho-dod-de-una-historia-de-usuario)
  - [3.5. Gestión de la Configuración](#35-gestión-de-la-configuración)
  - [3.6. Gestión del Cambio](#36-gestión-del-cambio)
  - [3.7. Gestión de los Riesgos](#37-gestión-de-los-riesgos)
  - [3.8. Uso de la Inteligencia Artificial](#38-uso-de-la-inteligencia-artificial)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>


---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 3

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Antonio Macías Ferrera](https://github.com/antoniommff) (autor) [Delfín Santana Rubio](https://github.com/DelfinSR) (revisor)

- **Fecha de Creación:** 28/03/2025

- **Versión:** v1.0

<br>


---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por          | Descripción de los cambios                       |
| ---------- | ------- | ---------------------- | ------------------------------------------------ |
| 28/03/2025 | v1.0    | Antonio Macías Ferrera | Elaboración de la primera versión del documento. |


<br>


---

**Participantes**

| Nombre completo           | Rol                                              | Contacto              |
| ------------------------- | ------------------------------------------------ | --------------------- |
| Antonio Macías Ferrera    | Scrum Master, analista, programador              | antmacfer1@alum.us.es |
| Delfín Santana Rubio      | Secretario, analista, programador                | delsanrub@alum.us.es  |
| Guadalupe Ridruejo Pineda | Analista, programadora                           | guaridpin@alum.us.es  |
| Miguel Encina Martínez    | Representante grupo 3, analista, programador, QA | migencmar@alum.us.es  |
| Ramón Gavira Sánchez      | Representante grupo 2, analista, programador     | ramgavsan@alum.us.es  |
| Pablo Fernández Pérez     | Representante grupo 1, analista, programador     | pabferper3@alum.us.es |


<br>

<!-- \newpage -->

<br>


# **1. OBJETIVOS DEL SPRINT**

El propósito de este informe es definir los objetivos a lograr durante el Sprint #3 y describir la metodología para alcanzarlos.

**🔴 Sprint Goal:** SECURITY & OPTIMIZATION (Seguridad, optimización y mejoras de experiencia de usuario)

Los objetivos marcados para este Sprint son los siguientes:

- ✅ **Objetivo 1:** Implementar cifrado de datos sensibles de usuarios
- ✅ **Objetivo 2:** Mejorar la experiencia de usuario y la interfaz
- ✅ **Objetivo 3:** Implementar analíticas y métricas de uso
- ✅ **Objetivo 4:** Corrección de errores del Sprint 2
- ✅ **Objetivo 5:** Realización de pruebas formales


| Épica | Tarea | Objetivo | Asignados | Prioridad |
|------|------|-----------|-----------|----------|
| E-012: Cifrado de datos | [RFC-010: Cifrado de Datos de Usuario](https://github.com/Proyecto-ISPP/FISIOFIND/issues/285) | 1: Implementar cifrado de datos sensibles | [Delfin Santana Rubio](https://github.com/DelfinSR) | LOW 🟢 |
| E-013: Mejoras de UX/UI | [RFC-011: Refactorización frontend II](https://github.com/Proyecto-ISPP/FISIOFIND/issues/383) | 2: Mejorar experiencia de usuario | [Daniel Ruiz](https://github.com/Danielruizlopezcc), [Rafael Pulido](https://github.com/rafpulcif) | MEDIUM 🟡 |
| E-013: Mejoras de UX/UI | [RFC-012: Búsqueda avanzada de fisioterapeuta](https://github.com/Proyecto-ISPP/FISIOFIND/issues/387) | 2: Mejorar experiencia de usuario | [Daniel Fernández](https://github.com/DaniFdezCab), [Alberto Carmona](https://github.com/albcarsic), [Francisco Capote](https://github.com/franciiscocg) | HIGH 🔴 |
| E-013: Mejoras de UX/UI | [HI-003: Valoración de otros fisioterapeutas](https://github.com/Proyecto-ISPP/FISIOFIND/issues/390) | 2: Mejorar experiencia de usuario | [Antonio Macías](https://github.com/antoniommff) | MEDIUM 🟡 |
| E-013: Mejoras de UX/UI | [HF-005: Valoración del fisioterapeuta](https://github.com/Proyecto-ISPP/FISIOFIND/issues/391) | 2: Mejorar experiencia de usuario | [Daniel Tortoricci](https://github.com/DanTorBar), [Daniel Vela](https://github.com/danvelcam) | MEDIUM 🟡 |
| E-013: Mejoras de UX/UI | [HF-018: Accesibilidad](https://github.com/Proyecto-ISPP/FISIOFIND/issues/394) | 2: Mejorar experiencia de usuario | -- | LOW 🟢 |
| E-013: Mejoras de UX/UI | [Sistema de Soporte y Comunicación](https://github.com/Proyecto-ISPP/FISIOFIND/issues/396) | 2: Mejorar experiencia de usuario | [Daniel Alors](https://github.com/DanielAlors), [Pablo Fernández](https://github.com/Letee2) | LOW 🟢 |
| E-013: Mejoras de UX/UI | [Verificación de Identidad](https://github.com/Proyecto-ISPP/FISIOFIND/issues/397) | 2: Mejorar experiencia de usuario | [Benjamín I. Maureira](https://github.com/benjimrfl), [Ramón Gavira](https://github.com/rgavira123) | LOW 🟢 |
| E-014: Analíticas y métricas | [Changelog automático](https://github.com/Proyecto-ISPP/FISIOFIND/issues/398) | 3: Implementar analíticas de uso | [Daniel Alors](https://github.com/DanielAlors), [Julen Redondo](https://github.com/Julenrp) | LOW 🟢 |
| E-015: Correcciones Sprint 2 | [RFC-013: Modificaciones de perfil de usuario](https://github.com/Proyecto-ISPP/FISIOFIND/issues/384) | 4: Corregir errores Sprint 2 | [Benjamín I. Maureira](https://github.com/benjimrfl), [Ramón Gavira](https://github.com/rgavira123) | HIGH 🔴 |
| E-015: Correcciones Sprint 2 | [Videollamadas y Citas](https://github.com/Proyecto-ISPP/FISIOFIND/issues/389) | 4: Corregir errores Sprint 2 | [Pablo Fernández](https://github.com/Letee2) | HIGH 🔴 |
| E-015: Correcciones Sprint 2 | [HF-016: Recordatorios de ejercicio](https://github.com/Proyecto-ISPP/FISIOFIND/issues/392) | 4: Corregir errores Sprint 2 | [Guadalupe Ridruejo](https://github.com/guaridpin), [Rafael Pulido](https://github.com/rafpulcif) | MEDIUM 🟡 |
| E-015: Correcciones Sprint 2 | [HF-017: Compartir archivos clínicos](https://github.com/Proyecto-ISPP/FISIOFIND/issues/393) | 4: Corregir errores Sprint 2 | [Julen Redondo](https://github.com/Julenrp), [Paco Mateos](https://github.com/pacomateos10) | HIGH 🔴 |
| E-015: Correcciones Sprint 2 | [Seguimiento de Pacientes y Ejercicios](https://github.com/Proyecto-ISPP/FISIOFIND/issues/395) | 4: Corregir errores Sprint 2 | [Guadalupe Ridruejo](https://github.com/guaridpin), [Rafael Pulido](https://github.com/rafpulcif) | MEDIUM 🟡 |
| E-015: Correcciones Sprint 2 | [Verificación de perfil de fisio](https://github.com/Proyecto-ISPP/FISIOFIND/issues/399) | 4: Corregir errores Sprint 2 | [Miguel Encina](https://github.com/MiguelEncina), [Paco Mateos](https://github.com/pacomateos10) | MEDIUM 🟡 |
| E-015: Correcciones Sprint 2 | [Servidor TURN videollamadas](https://github.com/Proyecto-ISPP/FISIOFIND/issues/400) | 4: Corregir errores Sprint 2 | [Benjamín I. Maureira](https://github.com/benjimrfl), [Ramón Gavira](https://github.com/rgavira123) | HIGH 🔴 |
| E-015: Correcciones Sprint 2 | [Corregir envíos de correos automáticos](https://github.com/Proyecto-ISPP/FISIOFIND/issues/401) | 4: Corregir errores Sprint 2 | [Daniel Vela](https://github.com/danvelcam) | HIGH 🔴 |
| E-016: Tests formales | [Pruebas de JSON y validación](https://github.com/Proyecto-ISPP/FISIOFIND/issues/388) | 5: Realizar pruebas formales | [Delfín Santana](https://github.com/DelfinSR), [Miguel Encina](https://github.com/MiguelEncina) | HIGH 🔴 |
| E-016: Tests formales | [Tests unitarios](https://github.com/Proyecto-ISPP/FISIOFIND/issues/385) | 5: Realizar pruebas formales | [Delfín Santana](https://github.com/DelfinSR), [Miguel Encina](https://github.com/MiguelEncina), [Francisco Capote](https://github.com/franciiscocg) | MEDIUM 🟡 |
| E-016: Tests formales | [Test de API](https://github.com/Proyecto-ISPP/FISIOFIND/issues/386) | 5: Realizar pruebas formales | -- | LOW 🟢 |

<br>

<!-- \newpage -->

<br>


# **2. SPRINT BACKLOG**

## **Épica 12: Cifrado de datos**

[***[REQUEST FOR CHANGE] Cifrado de Datos de Usuario #285***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/285)

**Descripción del cambio:**  
Implementación de un sistema de cifrado end-to-end para los datos sensibles de usuarios en la plataforma FisioFind, cifrando los datos sensibles DEL USUARIO (email, dni, contraseña)

**Motivación e Impacto:**  
Garantizar la seguridad y privacidad de la información personal y médica de los usuarios, cumpliendo con los estándares de protección de datos y regulaciones aplicables.

**Instrucciones:**  
N/A


<br>

<br>

## **Épica 13: Mejoras de UX/UI**

[***[REQUEST FOR CHANGE] Refactorización frontend II #383***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/383)

**Descripción del cambio:**  
- Revisar que el modal de cookies aparece en todas las pestañas que debe, y no solo en la home.

- Ajustar la sidebar para que se adapte mejor al movil 

- Opcionalmente, a petición de un par de usuarios piloto, se podría añadir una opción en pantallas grandes para que la sidebar estuviera siempre desplegada "fija".

- Repasar los botones para que se adapten al estilo establecido en la anterior refactorización

- Comprobar que todas las fechas que se guardan, y especialmente, las que se muestran en la aplicación, **SON SIEMPRE EN FORMATO ESPAÑOL dd/mm/aaaa**.

- Modificar mensajes de error, alerta y confirmación siempre con los mismos destinos (YA EXISTE UN COMPONENTE ALERT.TSX, QUE SE DEBE REUTILIZAR PARA ESTO)

- Remarcar la fecha seleccionada en el calendario de pedir una cita.

- Hacer que el mes cambie cuando se avanza o se retrocede de mes en el calendario

- Realizar, si se considera oportuno, otros cambios menores en las pantallas que correspondan

- Hacer que la duración de un servicio sean números redondos (de 5 en 5, por ejemplo)

- En el perfil de fisio, cambiar el espacio en el que se ve la foto para que sea tan grande y tenga la misma forma que las tarjetas de fisio:

<img width="426" alt="Image" src="https://github.com/user-attachments/assets/d32f1658-f233-4d34-86ca-7035c7e6e688" />

- Por último, cuando la tarea de @DaniFdezCab , @albcarsic  y @franciiscocg  (https://github.com/Proyecto-ISPP/FISIOFIND/issues/387) esté terminada, deberíais retocar un poco esa búsqueda y filtro para que esa más aesthetic y chula, para que se adapte a los estilo de vuestra refactorización. Poneros de acuerdo para que se pongan ellos con eso manos a la obra ASAP.

**Motivación:**  
- Mejorar la experiencia de usuario
- Unificar interfaz
- Mejorar la responsabilidad de la web movil

**Instrucciones:**  
- Se recomienda realizar esta tarea entre dos personas
- Si pensáis realizar la tarea en varias partes, podéis hacer que esta sea una ÉPICA y dividir esta tarea en otras más pequeñas. Organizadla ya como veáis oportuno. Yo me encargaré de revisárolsa

<br>

<br>

[***[Feature] Búsqueda avanzada de fisioterapeuta #387***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/387)

**Descripción de la funcionalidad:**
Rediseñar la Home Page tomando como referencia la landing actual y la página de “TU FISIO”. Incluir:

- Barra de búsqueda o botón que redirija a búsqueda avanzada.

- Filtros de búsqueda: Especialidad, Preferencia horaria, Precio máximo por consulta, Cercanía (por código postal de referencia o CP del paciente registrado), Género del profesional (por si prefieres que te atienda una Mujer, un Hombre o si te da igual), Nombre del fisioterapeuta (opcional). Estos parámetros deben ser independientes. En el caso de que no haya un resultado que se ajuste a todos los parámetros, mostrar un mensaje que indique que no se encontraron resultados para sus preferencias de búsqueda pero que SÍ devuelva el resultado de fisioterapeutas más aproximado.

- Hacer que las búsquedas tengan un parámetro de probabilidad para que las búsquedas no salgan siempre ordenadas de la misma forma.

- La probabilidad de aparición deberá ser mayor para los usuarios gold

- Integración de esta lógica en el módulo `sesión_invitado`.

- Vista de resultados en **carrusel horizontal** con tarjetas resumen de fisioterapeutas manteniendo el diseño de las tarjetas actuales.

- Vista intermedia de **perfil detallado del fisioterapeuta**, con:
- Botón para reservar cita.
- Opción de seleccionar servicio directamente → flujo de 5 pasos ya definido.

**Consideraciones adicionales:**
- Realizar entre 2 personas


<br>

<br>


[***HI-003: Valoración de otros fisioterapeutas #390***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/390)

> **Como** usuario invitado,
> **Quiero** poder conocer la opinión de otros fisioterapeutas registrados en la plataforma,
> **Para** saber si los servicios que ofrece Fisio Find merecen la pena.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:
- Acceso a valoraciones de fisioterapeutas:
  - El usuario invitado puede visualizar las opiniones y valoraciones dejadas por fisioterapeutas registrados sobre la plataforma Fisio Find.
  - La información mostrada debe ser clara y destacada para facilitar la comprensión de la experiencia de otros profesionales.

- Seguridad y veracidad de las opiniones:
  - Solo se mostrarán valoraciones verificadas de fisioterapeutas registrados en la plataforma.
  - Se indicará si la opinión proviene de un usuario con una suscripción activa.

- Restricción de interacción:
  - El usuario invitado solo podrá leer valoraciones, sin la posibilidad de dejar comentarios o responder a opiniones.
  - Para dejar una opinión o interactuar con ellas, se requerirá estar registrado como fisioterapeuta en la plataforma.

- Compatibilidad con múltiples dispositivos:
  - La funcionalidad debe ser accesible tanto desde dispositivos móviles como de escritorio sin pérdida de información o usabilidad.

<br>

<br>

[***HF-005: Valoración del fisioterapeuta #391***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/391)

> **Como** fisioterapeuta,  
> **Quiero** que los pacientes puedan evaluar la consulta realizada y dejar comentarios en mi perfil,
> **Para** que futuros pacientes puedan tener referencias de mi trabajo.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Sistema de valoración:
  - Los pacientes podrán valorar la consulta con un sistema de estrellas (1 a 5).
  - Se permitirá dejar comentarios adicionales junto con la valoración.
  - Las valoraciones y comentarios serán visibles en el perfil del fisioterapeuta.

- Publicación y moderación:
  - Solo los pacientes que hayan tenido una consulta confirmada podrán dejar una valoración.
  - Los fisioterapeutas no podrán eliminar valoraciones, pero podrán responder a los comentarios.

- Visualización de las valoraciones:
  - Las valoraciones estarán organizadas cronológicamente en el perfil del fisioterapeuta.
  - Se mostrará el promedio de estrellas basado en todas las valoraciones recibidas.
  - Los comentarios podrán filtrarse por puntuación (más altas, más bajas, recientes).

- Notificaciones y alertas:
  - El fisioterapeuta recibirá una notificación cuando un paciente deje una valoración.
  - Se enviará una solicitud de valoración automáticamente al paciente después de la consulta.
  - Si un paciente no deja una valoración en 48 horas, se podrá enviar un recordatorio opcional.

- Protección contra abuso:
  - Un paciente solo podrá valorar una consulta realizada, evitando spam o múltiples valoraciones sobre la misma.
  - Se permitirá reportar comentarios ofensivos o falsos para revisión por el equipo de soporte.
  - Se aplicarán políticas contra valoraciones fraudulentas o manipuladas.

<br>

<br>

[***HF-018: Accesibilidad #394***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/394)

> **Como** fisioterapeuta,  
> **Quiero** que la aplicación sea accesible, especialmente para personas con discapacidad que suelen constituir un gran porcentaje de los pacientes, 
> **Para** ofrecer un servicio inclusivo a todos los perfiles de usuarios de la plataforma.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Cumplimiento con estándares de accesibilidad:
  - La aplicación debe cumplir con los estándares internacionales de accesibilidad (WCAG 2.1, ADA, etc.) para garantizar que todos los usuarios, incluidos los pacientes con discapacidad, puedan acceder y utilizar la plataforma sin barreras.
  - Deben realizarse auditorías de accesibilidad periódicas para identificar y corregir posibles problemas en la plataforma.

- Soporte para tecnología asistiva:
  - La aplicación debe ser compatible con tecnologías asistivas, como lectores de pantalla, ampliadores de pantalla, y teclados alternativos.
  - Las funcionalidades clave de la plataforma, como el registro, la búsqueda de fisioterapeutas y la gestión de citas, deben ser accesibles mediante solo el teclado, sin necesidad de usar un ratón.

- Contrastes de color:
  - La interfaz de usuario debe proporcionar suficiente contraste entre el texto y el fondo para facilitar la lectura de los pacientes con deficiencias visuales.
  - El diseño debe ser ajustable para permitir que los usuarios puedan cambiar los colores y las fuentes según sus necesidades (por ejemplo, modo alto contraste).

- Texto alternativo para imágenes:
  - Todas las imágenes, botones e iconos deben tener texto alternativo (alt text) descriptivo para que los usuarios con discapacidad visual que usan lectores de pantalla puedan entender su contenido.
  - Las imágenes decorativas deben estar marcadas correctamente para ser ignoradas por los lectores de pantalla.

- Subtítulos y transcripciones:
  - Las videollamadas y otros contenidos multimedia deben ofrecer subtítulos o transcripciones para personas con discapacidad auditiva.
  - Los subtítulos deben ser sincronizados correctamente con el contenido hablado y ofrecer opciones para ajustar su tamaño y color.

- Diseño adaptable:
  - La plataforma debe ser completamente adaptable a diferentes tamaños de pantalla y dispositivos (responsive design), permitiendo que los usuarios con diversas discapacidades puedan interactuar con ella de forma efectiva, ya sea en móviles, tabletas o computadoras de escritorio.
  
- Facilidad de navegación:
  - La navegación debe ser clara y sencilla, con etiquetas descriptivas y botones de acción bien identificados.
  - El flujo de navegación debe ser intuitivo, de modo que cualquier usuario, independientemente de su discapacidad, pueda completar tareas como reservar citas, acceder a la información de contacto de un fisioterapeuta, etc.

- Pruebas de accesibilidad:
  - La aplicación debe ser probada con usuarios reales que tengan discapacidades para verificar que la accesibilidad esté completamente implementada.
  - Las pruebas de accesibilidad deben incluir personas con discapacidades visuales, auditivas, motrices y cognitivas para asegurar que la plataforma sea inclusiva.

- Mensajes y notificaciones accesibles:
  - Todos los mensajes de la plataforma, como las notificaciones de confirmación de citas, deben ser accesibles, ya sea por medio de voz (para usuarios con discapacidad visual) o texto ampliado (para usuarios con discapacidad cognitiva).
  - Las alertas o notificaciones deben tener un comportamiento claro y ser fácilmente entendidas por todas las personas, incluidas aquellas con discapacidades.

- Documentación de accesibilidad:
  - La plataforma debe proporcionar documentación sobre cómo configurar y utilizar la aplicación de manera accesible, especialmente para pacientes con discapacidades, incluyendo guías para usuarios de tecnologías asistivas.

<br>

<br>


[***[Feature] Sistema de Soporte y Comunicación #396***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/396)

**Descripción de la funcionalidad:**
Integrar un ChatBot de soporte que pueda responder preguntas frecuentes, guiar a los usuarios en el uso de la aplicación y proporcionar asistencia básica automatizada.

**Motivación e impacto:**
Se ha mejorado la experiencia del usuario al ofrecer respuestas rápidas y asistencia 24/7.

**Intrucciones adicionales:**
- [@DanielAlors](https://github.com/DanielAlors), habla con [@Letee2](https://github.com/Letee2) para que te de indicaciones sobre cómo integrarlo. Y con [@antoniommff](https://github.com/antoniommff) para obtener información sobre los términos y condiciones.

<br>

<br>

[***[Feature] Verificación de Identidad #397***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/397)

**Descripción de la funcionalidad:**
Integrar:
- API de comprobación de DNI para validar la identidad del usuario de manera automática.
- Verificación de dirección de correo mediante email de confirmación para asegurar la autenticidad del registro.

**Motivación e impacto:**
- Mejorar la seguridad y fiabilidad del sistema al evitar registros con datos falsos o incorrectos.
- Cumplir con los requerimientos exigidos por los profesores para este Sprint 3


<br>

<br>

## **Épica 14: Analíticas y métricas**

[***[Feature] Changelog automático #398***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/398)

**Descripción de la funcionalidad:**
- Changelog automático: Generación automática de registros de cambios con cada nueva versión.
- Codium AI: Integración con Codium AI para mejorar la generación de código y optimización de desarrollos.
 
**Consideraciones adicionales:**
- Se debe comprobar que la integración con Codium AI funciona sin afectar el rendimiento del sistema.
- Revisar la compatibilidad con herramientas actuales del proyecto.

**Instrucciones adicionales:**
- Que cada uno de los miembros asignados a esta tarea se encargue de cada uno de los punto. Uno changelog y el otro sodium ai

<br>

<br>


## **Épica 15: Correcciones del Sprint 2**

[***[REQUEST FOR CHANGE] Modificaciones de perfil de usuario #384***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/384)

**Descripción del cambio:**  
- Asegurarse de que, cuando se inicie sesión o algún usuario se registre, siempre se devuelve a la "Home" y no a la página de "Mi perfil".

- Añadir confirmaciones ALERTAS DE SUCCESS de **confirmación de inicio de sesión / creación de cuentas**

- Añadir confirmación de aceptación de términos y condiciones 

- Arreglar los perfiles de fisio y paciente para que funcione la edición de foto y la la edición de contraseña y DNI

- Avisar en el registro sobre el porqué necesitamos el DNI

- En ambos perfiles, (fisio y paciente) hacer que el "username" se establezca automáticamente al meter el correo y se avise de ello en el registro (aunque luego se permita el nombre de usuario en el perfil)

- Hacer que para el inicio de sesión, se pueda loguear tanto con username como con correo indistintamente

- En el registro del paciente, hacer que el numero de teléfono no sea un requisito obligatorio, pero se pueda añadir en el perfil.

- Comprobar que nombre-colegiado-comunidad autónoma sea algo unico

- Avisar de la política de contraseñas a priori en el registro

- Avisar en el registro de que el DNI sea único 

- Arreglar input de fecha de nacimiento para que no se puedan poner fechas futuras y restringir menores de edad

- Poner como género por defecto (seleccionar o otro)

- Añadir campo de "prefiero no decirlo" en el género

- Aceptar también NIE

- Añadir, tanto en el registro como en el perfil de fisio un enlace (que se abra en una nueva ventana) al perfil a la BBDD oficial de la comunidad autónoma para verificar número de colegiado.

- Arreglar select de especialidad

- Realizar pruebas exhaustivas del sistema de colegiación: Verificar correcto funcionamiento para **todos los formatos de número de colegiado** y **todas las comunidades autónomas**.

- Renombrar opciones del select de comunidades autónomas para que sean **más coherentes**, ya que por ejemplo, no aparecen ni ordenadas por orden alfabético.

- Cuando hay un error en los formularios de register redirigir al error

**Motivación:**  
- Responder al feedback de los usuarios piloto
- Mejorar la UX

**Instrucciones** 
- Tarea para dos personas a realizar en la semana 1 del Sprint 3


<br>

<br>


[***[Feature] Videollamadas y Citas #389***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/389)

**Descripción del cambio:**  
- Integrar sistema de **videollamadas** en las citas confirmadas.
- En la cita, deberá aparecer en botón para acceder a la videollamada
- En la página de "Videollamadas" también deberán aparecer las próximas llamadas que tenga un paciente o fisio

**Motivación:**  
- Terminar el flujo correcto de cita.videoconsulta
- Crear un entorno realista en el que un paciente no tenga que meter un código que previamente le haya tenido que pasar un fisio. 

**Instrucciones:**  
- Realizar tarea en la semana 1 del Sprint 3

<br>

<br>


[***HF-016: Recordatorios de ejercicio #392***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/392)

> **Como** fisioterapeuta,  
> **Quiero** poder enviar un recordatorio de “inicio de sesión de ejercicio” a los pacientes que tengan asignado como tratamiento una sesión de entrenamiento,  
> **Para** que no se olviden de realizar el ejercicio pautada.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Configuración de recordatorios:
  - El fisioterapeuta debe poder configurar recordatorios para los ejercicios que el paciente debe realizar.
  - Los recordatorios deben incluir detalles sobre el ejercicio, como el nombre del ejercicio, el objetivo y la duración o repeticiones recomendadas.

- Frecuencia de los recordatorios:
  - El fisioterapeuta debe poder elegir la frecuencia con la que se envían los recordatorios (por ejemplo, diario, semanal, antes de la sesión programada).
  - Los pacientes deben recibir recordatorios a una hora específica, seleccionada por el fisioterapeuta, para garantizar que los ejercicios se realicen en el momento adecuado.

- Notificación del recordatorio:
  - Los pacientes deben recibir una notificación (en la aplicación o por correo electrónico) con los detalles del ejercicio a realizar.
  - La notificación debe ser clara y visible para que el paciente sepa qué ejercicio realizar y cómo acceder a los detalles del tratamiento.

- Confirmación de ejercicio realizado:
  - El paciente debe tener la opción de marcar el ejercicio como realizado una vez completado.
  - Los fisioterapeutas deben tener acceso a una visualización de los ejercicios completados y no completados por cada paciente.

- Historial de recordatorios:
  - Los fisioterapeutas deben poder revisar el historial de los recordatorios enviados a cada paciente, verificando si han sido recibidos y si los ejercicios se han realizado.

- Seguimiento de cumplimiento:
  - El sistema debe permitir al fisioterapeuta visualizar estadísticas de cumplimiento de los ejercicios, mostrando cuántos ejercicios fueron realizados en tiempo y forma por cada paciente.

- Posibilidad de modificación de recordatorios:
  - Los fisioterapeutas deben poder modificar los recordatorios, como la fecha, la hora y la descripción del ejercicio, en caso de que cambien las pautas del tratamiento.

- Personalización de recordatorios:
  - El fisioterapeuta debe poder personalizar el mensaje del recordatorio, incluyendo instrucciones específicas o motivacionales para cada paciente.

- Reenvío de recordatorios:
  - Los pacientes deben tener la opción de recibir un recordatorio adicional si no han marcado el ejercicio como realizado después de un tiempo determinado (por ejemplo, si no han completado el ejercicio en las primeras horas del día).

- Accesibilidad del recordatorio:
  - Los pacientes deben poder acceder a los detalles del ejercicio directamente desde el recordatorio, permitiéndoles visualizar las instrucciones y la información relevante sin tener que buscarla en otro lugar de la plataforma.

<br>

<br>

[***HF-017: Compartir archivos clínicos #393***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/393)

> **Como** fisioterapeuta,  
> **Quiero** poder recibir archivos de mis pacientes, principalmente imágenes de diagnóstico (ecografías, radiografías, etc.) y que se almacenen en un lugar de su perfil de pacientes al que yo pueda acceder,  
> **Para** consultarlos en cualquier momento y tomar decisiones sobre su valoración y tratamiento.

**Comentarios**: Vacío intencionadamente.

**Criterios de aceptación**:

- Recepción de archivos:
  - El fisioterapeuta debe poder recibir archivos de los pacientes a través de la plataforma, principalmente imágenes de diagnóstico como ecografías, radiografías, etc.
  - Los archivos deben poder ser cargados directamente en el perfil del paciente desde la interfaz de la aplicación.
  
- Tipos de archivo soportados:
  - La plataforma debe soportar los tipos de archivo más comunes para imágenes de diagnóstico, como JPG, PNG, PDF, DICOM, entre otros.
  - Se debe informar a los pacientes sobre los tipos de archivos aceptados y su tamaño máximo permitido para garantizar que se puedan cargar sin problemas.

- Acceso a los archivos:
  - Los fisioterapeutas deben poder acceder a los archivos cargados por los pacientes directamente desde su perfil o desde el historial de consultas.
  - Los archivos deben estar organizados de forma clara y fácil de encontrar, etiquetados por fecha o tipo de archivo (por ejemplo, "Radiografía", "Ecografía", etc.).

- Almacenamiento seguro:
  - Los archivos deben ser almacenados de manera segura, cumpliendo con las normativas de protección de datos y privacidad como GDPR (si aplica) o cualquier otra legislación vigente relacionada con la protección de datos médicos.
  - La plataforma debe cifrar los archivos en tránsito y en reposo para garantizar su seguridad.

- Notificaciones al paciente:
  - Los pacientes deben recibir una notificación (por ejemplo, correo electrónico o mensaje dentro de la aplicación) cuando su archivo haya sido recibido y esté disponible para el fisioterapeuta.
  
- Acceso restringido:
  - El acceso a los archivos debe ser restringido al fisioterapeuta asignado al paciente, garantizando que solo las personas autorizadas puedan consultarlos.
  - Los pacientes deben tener la opción de eliminar o actualizar sus archivos en cualquier momento desde su perfil, con las notificaciones correspondientes al fisioterapeuta.

- Historial de archivos:
  - La plataforma debe permitir que tanto el paciente como el fisioterapeuta tengan acceso a un historial de los archivos enviados, con la posibilidad de visualizar las versiones anteriores de los archivos (si hay actualizaciones).
  
- Visualización de imágenes:
  - Los fisioterapeutas deben poder visualizar las imágenes de diagnóstico sin necesidad de descargarlas, con opciones de zoom y desplazamiento para una revisión detallada.
  - En caso de formatos específicos como DICOM, debe ser posible visualizarlos correctamente dentro de la plataforma.

- Compatibilidad con dispositivos móviles:
  - Los fisioterapeutas deben poder acceder y visualizar los archivos de los pacientes en dispositivos móviles, con una interfaz adecuada para pantallas más pequeñas.
  
- Cumplimiento normativo:
  - La plataforma debe cumplir con las normativas legales sobre el almacenamiento y compartición de archivos clínicos en la región donde se utilice (por ejemplo, HIPAA en EE. UU., GDPR en Europa, etc.).


<br>

<br>


[***[Feature] Seguimiento de Pacientes y Ejercicios #395***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/395)

**Descripción de la funcionalidad:**
Finalizar implementación de:
- **Seguimiento del paciente**.
- **Cuestionarios personalizables**.

Realizar las siguientes mejoras en ejercicios:
- Añadir **imagen del grupo muscular** afectado.
- Posibilidad de **enlazar sesión o ejercicio a un vídeo subido por el paciente**.


<br>

<br>


[***[Feature] Verificación de perfil de fisio #399***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/399)

**Descripción de la funcionalidad:**
- Para los usuarios logueados como fisioterapeutas, añadir estos nuevos campos al perfil (que no aparecerán en la pestaña del registro de fisio) pero que sí podrá completar en el apartado de perfil:
  * Titulación.
  * Universidad y promoción.
  * Experiencia laboral.
  * Lugar de trabajo presencial.

- Mostrar un modal cuando se acceda a la aplicación como fisio (al estilo del de las cookies)  que muestre un aviso **claro y visible** para fomentar verificación de los fisioterapeutas que no haya completado su perfil con los datos anteriores.

<br>

<br>

[***[REQUEST FOR CHANGE] Servidor TURN videollamadas #400***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/400)

**Descripción del cambio:**  
Se solicita cambiar de servidor STUN a servidor TURN en las videollamadas

**Motivación:**  
Permitir que las videollamadas funcionen en el despliegue


<br>

<br>


[***[Feature] Corregir envios de correos automáticos #401***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/401)

**Descripción de la funcionalidad:**
 Corregir envíos de correos automáticos: Ajustar el sistema de notificaciones por correo para garantizar que los mensajes se envían correctamente y sin errores.

<br>

<br>

## **Épica 16: Tests**

[***[Feature] Pruebas de JSON y validación #388***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/388)

**Descripción de la funcionalidad:**
- Validar **todos los JSONs** (frontend y backend) para que los datos se envíen y se reciban de forma esperada.

**Consideraciones adicionales:**
-  Realizar entre dos o tres personas 
- Esta tarea debería estar realizada para la primera semana del Sprint 3, para no incurrir en errores de envíos de formulario en las nuevas pruebas con UP


<br>

<br>

[[Feature] Tests unitarios #385](https://github.com/Proyecto-ISPP/FISIOFIND/issues/385)

**Descripción de la funcionalidad:**
Realizar test unitarios de todos los módulos del backend

**Motivación e impacto:**
- Cumplir con los requisitos de la asignatura para el sprint 3.
- Mejorar la fiabilidad e integridad de la aplicación

**Consideraciones adicionales:**
- Obtener una cobertura de tests **> 65%** al final del Sprint 3.
- Son 9 módulos, así que se podría repartir la tarea entre 3 personas


<br>

<br>


[[Feature] Test de API #386](https://github.com/Proyecto-ISPP/FISIOFIND/issues/386)

**Descripción de la funcionalidad:**
Completar la suite de tests del hopscotch añadiendo llamadas a las todas las APIS con pruebas positivas y negativas

**Motivación e impacto:**
- Cumplir con los requisitos de la asignatura para el sprint 3.
- Mejorar la fiabilidad e integridad de la aplicación

**Consideraciones adicionales:**
Obtener una cobertura de tests **> 65%** al final del Sprint 3.

<br>

<!-- \newpage -->

<br>


# **3. METODOLOGÍA INTERNA**

En el siguiente apartado se resumirá la metodología interna seguida por el equipo de desarrollo. Para consultar la metodología con más detalle ver el *Sprint Planning General*.

## 3.1. Gestión de Tareas en GitHub Project

El equipo utiliza *GitHub Project* como herramienta de gestión de tareas donde las actividades están organizadas en distintas columnas que reflejan su estado dentro del flujo de trabajo. Esta herramienta cuenta con un **tablero Kanban** para facilitar el seguimiento de las tareas, generación de **gráficas Burn-down** que nos serán útiles en las retrospectivas, y asignación y **estimación de tareas** además de otras funciones que procurarán una buena organización del trabajo.

## 3.2. Flujo de Trabajo

La organización del trabajo, dado el gran número de participantes del proyecto, se ha llevado a cabo siguiendo una estructura doble: por un lado, una **división horizontal** en 3 subgrupos, y por otro lado, una **división transversal** en función de las tareas a realizar. Para ver en más detalle la división del trabajo, consultar el *Plan de Recursos Humanos*. 

La **organización horizontal** está compuesta por tres grupos de trabajo, en los que cada uno tiene un representante y un secretario.
Cada miembro del equipo será responsable de gestionar el estado de sus tareas ateniéndose al siguiente procedimiento:

| GRUPO 1                                 | GRUPO 2                               | GRUPO 3                                |
| --------------------------------------- | ------------------------------------- | -------------------------------------- |
| ALBERTO CARMONA SICRE (secretario)      | ANTONIO MACÍAS FERRERA (Scrum Master) | DANIEL TORTORICI BARTUS                |
| DANIEL ALORS ROMERO                     | BENJAMÍN I. MAUREIRA FLORES           | DANIEL VELA CAMACHO (secretario)       |
| DANIEL FERNÁNDEZ CABALLERO              | DELFÍN SANTANA RUBIO (secretario)     | FRANCISCO CAPOTE GARCÍA                |
| DANIEL RUIZ LÓPEZ                       | GUADALUPE RIDRUEJO PINEDA             | Francisco Mateos Villarejo             |
| PABLO FERNÁNDEZ PÉREZ                   | JULEN REDONDO PACHECO                 | MIGUEL ENCINA MARTÍNEZ (representante) |
| RAFAEL PULIDO CIFUENTES (representante) | RAMÓN GAVIRA SÁNCHEZ (representante)  |                                        |



Por otro lado, la **organización transversal** a lo largo de los equipos asignará distintos **roles** a los miembros del equipo para realizar tareas más ajenas al desarrollo de la aplicación. Estas serán tareas de planificación, documentación, publicidad...:


| RRSS Y PUBLICIDAD  | PLANIFICACIÓN      | SECRETARIOS     | QA                   |
| ------------------ | ------------------ | --------------- | -------------------- |
| ANTONIO MACÍAS     | ANTONIO MACÍAS     | ALBERTO CARMONA | BENJAMÍN I. MAUREIRA |
| FRANCISCO CAPOTE   | GUADALUPE RIDRUEJO | DANIEL VELA     | DANIEL ALORS         |
| FRANCISCO MATEOS   | MIGUEL ENCINA      | DELFÍN SANTANA  | FRANCISCO MATEOS     |
| GUADALUPE RIDRUEJO | PABLO FERNÁNDEZ    |                 | MIGUEL ENCINA        |
| PABLO FERNÁNDEZ    | RAFAEL PULIDO      |                 |                      |
| RAFAEL PULIDO      | RAMÓN GAVIRA       |                 |                      |
| DANIEL RUIZ        |                    |                 |                      |



| PRESENTACIONES     | TIEMPO          | IA               | FORMACIÓN     |
| ------------------ | --------------- | ---------------- | ------------- |
| ANTONIO MACÍAS     | ALBERTO CARMONA | DANIEL FERNÁNDEZ | RAFAEL PULIDO |
| GUADALUPE RIDRUEJO | RAFAEL PULIDO   | DANIEL RUIZ      | RAMÓN GAVIRA  |
|                    |                 |                  |               |


## 3.3. Flujo de desarrollo

1. **Inicio de la Tarea**
    - El desarrollador selecciona una tarea de la columna "Product Backlog" y la traslada a "Todo".
    - Esta acción indica que la tarea ha sido priorizada para su ejecución.

2. **Trabajo en Progreso**
    - Cuando se comienza a trabajar en la tarea, se mueve a la columna "In Progress".
    - Se debe registrar el tiempo de trabajo en **Clockify** de acuerdo al protocolo y la política de nombrado especificada en el ***Plan De Gestión De La Configuración***.

3. **Revisión de Código: Revisión por pares**
    - Al finalizar la implementación, el responsable de la tarea crea una *Pull Request (PR)* y traslada la tarea a la columna "In Review".
    - El otro miembro del equipo asignado se encarga de analizar el código y verificar su calidad.
    - Si la revisión es satisfactoria, el revisor aprueba la PR y fusiona los cambios.
    - Si se identifican errores o mejoras necesarias, la tarea se devuelve a "In Progress", notificando los ajustes requeridos.
    - Por norma general, el *testing* será realizado también acorde a la revisión por pares.


## 3.4. Definición de Hecho (DoD) de una Historia de Usuario

Para que una historia de usuario (HU) se considere terminada, debe cumplir con los siguientes requisitos:

- La funcionalidad **debe** estar completamente desarrollada y *cumplir con los requisitos* especificados en la *HU*.

- Se deben **satisfacer** las **expectativas** del producto en términos de **comportamiento y usabilidad**.

- El código **debe seguir las buenas prácticas** establecidas por el equipo.

- Se debe **garantizar** la **legibilidad**, **mantenibilidad** y escalabilidad del código fuente.

- Todo el código **debe ser revisado por al menos un miembro distinto** al desarrollador original.

- El revisor debe verificar que el código funciona correctamente y cumple con los estándares definidos.

- Cada issue debe contar con al menos **un comentario positivo** de otro miembro del equipo antes de su aprobación final.


## 3.5. Gestión de la Configuración

Desde la **política de versionado** de documentos y de código, hasta la **política de nombrado de ramas**, pasando por el **criterio de mensajes de commits** y el **flujo** de trabajo **GitHub Project - GitHub - Clockify** se encuentra definido en detalle en el ***Plan De Gestión De La Configuración***.



## 3.6. Gestión del Cambio

Los cambios no pueden ser implementados de manera arbitraria, sino que deben de seguir un proceso que cubra las fases de registro, análisis, aceptación, implantación, evaluación y seguimiento. La gestión del cambio se hará tal y como se describe en el documento *Plan de Gestión del Cambio*. 

<br>

## 3.7. Gestión de los Riesgos

La gestión del riesgo se hará tal y como se describe en el documento *Plan de Gestión de los Riesgos*. En este documento, entre otras cosas, se explica que se deberá de hacer seguimiento a los riesgos y actualizar el registro de riesgos periódicamente.

<br>

## 3.8. Uso de la Inteligencia Artificial

El uso de la inteligencia artificial estará regulado por el *Acuerdo de IA* y se deberán de hacer informes periódicos de su uso. Uno de los puntos a destacar de este acuerdo es la importancia de la intervención humana en la aplicación de soluciones IA en el proyecto.


<br>

<br>


---
**Aprobado por:**  

**Scrum Master:** Antonio Macías Ferrera  
**Rol:** Scrum Master, analista, programador

**Representante grupo 3:** Miguel Encina Martínez  
**Rol:** Representante grupo 3, analista, programador, QA

**Representante grupo 2:** Ramón Gavira Sánchez  
**Rol:** Representante grupo 2, analista, programador

**Representante grupo 1:** Pablo Fernández Pérez
**Rol:** Representante grupo 1, analista, programador
