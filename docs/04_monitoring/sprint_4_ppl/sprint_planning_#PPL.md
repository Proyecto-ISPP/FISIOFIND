<!-- ---
title: "SPRINT PLANNING SPRINT 4"
subtitle: "FISIO FIND - Grupo 6 - #PPL"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "20/04/2025"
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
header-left: "SPRINT PLANNING SPRINT 4"                   # UPDATED FOR SPRINT 3
header-right: "20/04/2025"                                # UPDATED FOR SPRINT 3
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
--- -->

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<p align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  SPRINT PLANNING SPRINT 4
</p>

<br>


**ÍNDICE**
- [**1. OBJETIVOS DEL SPRINT**](#1-objetivos-del-sprint)
- [**2. SPRINT BACKLOG**](#2-sprint-backlog)
  - [**Épica 17: Correcciones #S3**](#épica-17-correcciones-s3)
  - [**Épica 18: Plan de pruebas**](#épica-18-plan-de-pruebas)
  - [**Épica 19: Funcionalidades extra**](#épica-19-funcionalidades-extra)
  - [**Épica 20: Corrección de bugs**](#épica-20-corrección-de-bugs)
  - [**Épica 21: Campaña de lanzamiento**](#épica-21-campaña-de-lanzamiento)
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

- **Entregable:** #PPL

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Antonio Macías Ferrera](https://github.com/antoniommff) (autor) [Delfín Santana Rubio](https://github.com/DelfinSR) (revisor)

- **Fecha de Creación:** 20/04/2025

- **Versión:** v1.1

<br>


---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por          | Descripción de los cambios                       |
| ---------- | ------- | ---------------------- | ------------------------------------------------ |
| 20/04/2025 | v1.0    | [Antonio Macías Ferrera](https://github.com/antoniommff) | Elaboración de la primera versión del documento. |
| 27/04/2025 | v1.1    | [Antonio Macías Ferrera](https://github.com/antoniommff) | Adición de nuevas tareas de marketing y seo. Eliminación de tarea de changelog. |


<br>


---

**Participantes**

| Nombre completo           | Rol                                              | Contacto              |
| ------------------------- | ------------------------------------------------ | --------------------- |
| Antonio Macías Ferrera    | Scrum Master, analista, programador              | antmacfer1@alum.us.es |


<br>

<!-- \newpage -->

<br>


# **1. OBJETIVOS DEL SPRINT**

El propósito de este informe es definir los objetivos a lograr durante el Sprint 4 y describir la metodología para alcanzarlos. Este Sprint pertenece a la fase de preparación de lanzamiento del proyecto (Prepare Project Launch - #PPL) y durará desde el viernes 18/04/2025 hasta el jueves 01/05/2025.

**🔴 Sprint Goal:** PREPARE PROJECT LAUNCH (Pruebas finales, refactorización, funcionalidades extra)

Los objetivos marcados para este Sprint son los siguientes:

- ✅ **Objetivo 1:** Correcciones y tareas del Sprint 3
- ✅ **Objetivo 2:** Plan de pruebas
- ✅ **Objetivo 3:** Funcionalidades extra
- ✅ **Objetivo 4:** Corrección de bugs
- ✅ **Objetivo 5:** Campaña de lanzamiento


| Épica | Tarea | Objetivo | Asignados | Prioridad |
|------|------|-----------|-----------|----------|
| E-017: Correcciones #S3 | [RFC-011: Refactorización frontend II](https://github.com/Proyecto-ISPP/FISIOFIND/issues/383) | 1: Correcciones y tareas del Sprint 3 | [Daniel Ruiz](https://github.com/Danielruizlopezcc), [Rafael Pulido](https://github.com/rafpulcif) | HIGH 🔴 |
| E-017: Correcciones #S3 | [HF-018: Accesibilidad](https://github.com/Proyecto-ISPP/FISIOFIND/issues/394) | 1: Correcciones y tareas del Sprint 3 | [Ramón Gavira](https://github.com/rgavira123), [Benjamín Maureira](https://github.com/benjimrfl) | MEDIUM 🟡 |
| E-017: Correcciones #S3 | [Sistema de Soporte y Comunicación](https://github.com/Proyecto-ISPP/FISIOFIND/issues/396) | 1: Correcciones y tareas del Sprint 3 | [Daniel Alors](https://github.com/DanielAlors), [Pablo Fernández](https://github.com/Letee2) | HIGH 🔴 |
| E-017: Correcciones #S3 | [HF-017: Compartir archivos clínicos](https://github.com/Proyecto-ISPP/FISIOFIND/issues/393) | 1: Correcciones y tareas del Sprint 3 | [Julen Redondo](https://github.com/Julenrp), [Paco Mateos](https://github.com/pacomateos10), [Antonio Macías](https://github.com/antoniommff) | HIGH 🔴 |
| E-017: Correcciones #S3 | [Actualizar README](https://github.com/Proyecto-ISPP/FISIOFIND/issues/522) | 1: Correcciones y tareas del Sprint 3 | [Daniel Fernández](https://github.com/DaniFdezCab) | LOW 🟢 |
| E-018: Plan de pruebas | [Tests de frontend](https://github.com/Proyecto-ISPP/FISIOFIND/issues/509) | 2: Plan de pruebas | [Delfín Santana](https://github.com/DelfinSR) | MEDIUM 🟡 |
| E-018: Plan de pruebas | [Tests informales](https://github.com/Proyecto-ISPP/FISIOFIND/issues/511) | 2: Plan de pruebas | [Daniel Tortoricci](https://github.com/DanTorBar), [Paco Mateos](https://github.com/pacomateos10) | HIGH 🔴 |
| E-019: Funcionalidades extra | [Historial del Paciente](https://github.com/Proyecto-ISPP/FISIOFIND/issues/512) | 3: Funcionalidades extra | [Daniel Alors](https://github.com/DanielAlors), [Miguel Encina](https://github.com/MiguelEncina), [Daniel Vela](https://github.com/danvelcam) | MEDIUM 🟡 |
| E-020: Corrección de bugs | [Corrección de bugs](https://github.com/Proyecto-ISPP/FISIOFIND/issues/510) | 4: Corrección de bugs | [Daniel Fernández](https://github.com/DaniFdezCab), [Francisco Capote](https://github.com/franciiscocg), [Alberto Carmona](https://github.com/albcarsic) | HIGH 🔴 |
| E-021: Campaña de lanzamiento | [Video y presentación para el #PPL](https://github.com/Proyecto-ISPP/FISIOFIND/issues/508) | 5: Campaña de lanzamiento | [Antonio Macías](https://github.com/antoniommff), [Guadalupe Ridruejo](https://github.com/guaridpin) | HIGH 🔴 |
| E-021: Campaña de lanzamiento | [Campaña mediática y de lanzamiento I](https://github.com/Proyecto-ISPP/FISIOFIND/issues/507) | 5: Campaña de lanzamiento | [Antonio Macías](https://github.com/antoniommff), [Guadalupe Ridruejo](https://github.com/guaridpin) | HIGH 🔴 |
| E-021: Campaña de lanzamiento | [Primera versión documento Stock Pitch](https://github.com/Proyecto-ISPP/FISIOFIND/issues/537) | 5: Campaña de lanzamiento | [Daniel Alors](https://github.com/DanielAlors) y [Alberto Carmona](https://github.com/albcarsic) | LOW 🟢 |
| E-021: Campaña de lanzamiento | [SEO on page](https://github.com/Proyecto-ISPP/FISIOFIND/issues/550) | 5: Campaña de lanzamiento | [Ramón Gavira](https://github.com/rgavira123), [Benjamín Maureira](https://github.com/benjimrfl) | MEDIUM 🟡 |






<br>

<!-- \newpage -->

<br>


# **2. SPRINT BACKLOG**


## **Épica 17: Correcciones #S3**

[***[Feature] Actualizar README #522***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/522)

**Descripción de la funcionalidad:**
Modificar el README para actualizarlo a todos los nuevos cambios del #PPL y nueva estructura del proyecto: Actualizar `Project Scruture` con todas las nuevas apps añadidas desde la última versión del readme. ¡HAY QUE TENER MUCHO CUIDADO CON ESTA SECCIÓN!

**Motivación e impacto:**
- Mejorar la calidad y claridad del código y la documentación

**Consideraciones adicionales:**
Se recomienda ver este vídeo para orientar sobre cómo ejecutar este cambio (a partir de min 8 aprox): https://www.youtube.com/watch?v=GEilyFK2n8Y 

<br></br>

[***HF-017: Compartir archivos clínicos #393***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/393)

> **Como** fisioterapeuta,  
> **Quiero** poder recibir archivos de mis pacientes, principalmente imágenes de diagnóstico (ecografías, radiografías, etc.) y que se almacenen en un lugar de su perfil de pacientes al que yo pueda acceder,  
> **Para** consultarlos en cualquier momento y tomar decisiones sobre su valoración y tratamiento.


<br></br>

[***HF-018: Accesibilidad #394***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/394)

> **Como** fisioterapeuta,  
> **Quiero** que la aplicación sea accesible, especialmente para personas con discapacidad que suelen constituir un gran porcentaje de los pacientes, 
> **Para** ofrecer un servicio inclusivo a todos los perfiles de usuarios de la plataforma.


<br></br>

[***[REQUEST FOR CHANGE] Refactorización frontend II #383***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/383)

**Descripción del cambio:**  
- Modificar los emojis de las opciones de registro para que tengan una estética más 3D y coherente con el resto de elementos de la app.

![Registro](https://github.com/user-attachments/assets/ba04f5a2-5f36-4e8c-a36d-f403c9c7ef27)

- Revisar que el modal de cookies aparece en todas las pestañas que debe, y no solo en la home.

- Repasar los botones para que se adapten al estilo establecido en la anterior refactorización

- Comprobar que todas las fechas que se guardan, y especialmente, las que se muestran en la aplicación, **SON SIEMPRE EN FORMATO ESPAÑOL dd/mm/aaaa**.

- Asegurarse de que todas las pantallas usan el fondo de color rgb(238, 251, 250). Puede ser una buena idea añadir esto al layout.

- Modificar mensajes de error, alerta y confirmación siempre con los mismos destinos (YA EXISTE UN COMPONENTE ALERT.TSX, QUE SE DEBE REUTILIZAR PARA ESTO)

- Remarcar la fecha seleccionada en el calendario de pedir una cita.

- Hacer que el mes cambie cuando se avanza o se retrocede de mes en el calendario

- Realizar, si se considera oportuno, otros cambios menores en las pantallas que correspondan

- Hacer que la duración de un servicio sean números redondos (de 5 en 5, por ejemplo)

- En el cuestionario preintervención de un paciente, añadir al lado del campo de "actividad física" un botón de información en el que se especifique qué se espera responder en este campo: "Una **actividad física leve o baja** implica las típicas actividades de ir a comprar o pasear. Una **actividad física moderada** implica realizar ejercicio activo varias veces en semana. Una **actividad física elevada** implica sesiones de ejercicio prologadas casi todos los días de la semana. Una actividad física nula implica no salir de casa o no tener una movilidad plena del cuerpo por algún motivo."

- En el registro de usuarios (tanto pacientes como fisios), añadir al lado del campo de "DNI" un botón de información en el que se especifique porqué es necesario este dato para el correcto uso de la aplicación, especificando que estos datos serán almacenados de forma segura.

- En el perfil de fisio, cambiar el espacio en el que se ve la foto para que sea tan grande y tenga la misma forma que las tarjetas de fisio:

<img width="426" alt="Image" src="https://github.com/user-attachments/assets/d32f1658-f233-4d34-86ca-7035c7e6e688" />

**Motivación:**  
- Mejorar la experiencia de usuario
- Unificar interfaz
- Mejorar la responsividad de la web móvil

**Instrucciones:**  
- Se recomienda realizar esta tarea entre dos personas
- Si pensáis realizar la tarea en varias partes, podéis ir actualizando la descripción de esta tarea poniendo un ✅ en las que estén completadas.  

<br></br>

<hr>

<br></br>



## **Épica 18: Plan de pruebas**

[***Pruebas de frontend (Selenium) #509***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/509)

**Descripción de tarea**

Diseñar e implementar un conjunto de **pruebas de frontend** para Fisio Find utilizando **Selenium** u otra herramienta compatible (por ejemplo, Playwright o Cypress si se prefiere una alternativa moderna).  

**Consideraciones adicionales**

- Priorizar los siguientes flujos:
  - Registro y login de usuarios.
  - Búsqueda y filtrado de fisioterapeutas.
  - Solicitud de cita/reserva.
  - Gestión de perfil.
- Considerar el uso de `seleniumbase` o `pytest-selenium` para facilitar la escritura y mantenimiento de tests.

<br></br>

[***Test informales #511***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/511)

**Descripción de la funcionalidad:**
Realizar test informales en los que se prueben:
- Limite superior
- Límite inferior 
- Valores de tipo no permitido
- etc

Esto se debe hacer en general a través de toda la aplicación, pero de forma especialmente exhaustiva en los formularios de inicio de sesión, creación de cuenta y edición de perfil. 

Se deberán de registrar las pruebas que se hagan en un documento para así poder repasar que no se ha pasado ninguna prueba por hacer y poder repetirlas en un futuro. Además, los supuestos errores que se vayan detectando se deberán de notificar por el canal de bugs y decir que se van a solucionar, para evitar que otro compañero que encuentre casualmente el bug lo solucione también.  Los bugs que se solucionen deberán de documentarse también en el documento de las pruebas hechas, para así en caso de que suceda algo inesperado, se pueda saber qué cambios se han hecho.

**Consideraciones adicionales:**
- Como son muchas cosas pequeñas que probar, podéis repartiros entre los dos el trabajo como veáis y podéis ir actualizando la issue poco a poco con cada formulario que vayáis probándo. Podéis ir poniendo comentario, o actualizando la descripción de la Issue indicando lo que vayáis teniendo probado.


<br></br>

<hr>

<br></br>



## **Épica 19: Funcionalidades extra**

[***[Feature] Sistema de Soporte y Comunicación #396***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/396)

**Descripción de la funcionalidad:**
Integrar un ChatBot de soporte que pueda responder preguntas frecuentes, guiar a los usuarios en el uso de la aplicación y proporcionar asistencia básica automatizada.

**Motivación e impacto:**
Se ha mejorado la experiencia del usuario al ofrecer respuestas rápidas y asistencia 24/7.

<br></br>

[***[Feature] Historial del paciente #512***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/512)

**Descripción de tarea**

Implementar la funcionalidad de **Historial del Paciente** en Fisio Find, de modo que el fisioterapeuta pueda consultar de forma ordenada y completa todo el registro clínico y de citas de cada usuario.  
Debe incluir:
- Visualización cronológica de citas realizadas y próximas.
- Notas y observaciones registradas en cada sesión por videollamada.
- Cuestionarios contestados por el paciente en la videoconsulta.
- Tratamientos y protocolos aplicados.
- Documentos o archivos adjuntos (informes, radiografías, etc.).
- Filtros por fecha, tipo de sesión y estado (completada, pendiente, cancelada).



<br></br>

<hr>

<br></br>



## **Épica 20: Corrección de bugs**

[***Arreglo de bugs #510***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/510)

**Descripción del cambio:**  
Se solicita arreglar los siguientes bugs encontrados en la aplicación tanto por los usuarios piloto como por distintos miembros del grupo:

- Cuando un paciente se registra, no se avisa de que para activar la cuenta se te envía un correo para hacer el registro y hasta que no lo aceptas no se activa (sin embargo el usuario sí se crea). Esto ocasiona que si la validación del perfil falla, el usuario tenga la falsa sensación de que ha iniciado sesión en la plataforma pero realmente no tiene permisos para hacer nada.

- Si intentas subir una imagen de más de 5 MB a tu perfil no se actualiza, el servidor está dando un error pero no se avisa al usuario de que no puede actualizarse y cuando recarga la página la imagen desaparece.

- Actualmente, la búsqueda avanzada no está identificando correctamente a los fisioterapeutas disponibles según la franja horaria seleccionada por el usuario. El sistema compara de forma exacta la franja horaria definida por el usuario en el frontend (por ejemplo, "MAÑANA 6-14") con la franja de disponibilidad configurada por el fisioterapeuta (por ejemplo, de 9:00 a 15:00). Como resultado, si no coinciden exactamente, aunque haya solapamiento, el fisioterapeuta no aparece como opción en los resultados de búsqueda.
La lógica debería modificarse para que un fisioterapeuta sea mostrado si tiene alguna disponibilidad próxima dentro de la franja horaria seleccionada. Es decir, no se debería requerir una coincidencia exacta, sino detectar si existe intersección entre la franja horaria seleccionada y el horario laboral del fisioterapeuta.

- En la reserva de citas, cuando seleccionas un día, las horas deberían salir en algún modal en el centro de la pantalla, en lugar de debajo del calendario. No sucede nada en la vista que le indique al paciente que esas horas han aparecido debajo y no es intuitivo saber que hay que scrollear.

- No hay modal de confirmación de cancelación de cita (salta error de cita no encontrada directamente).

- Usar router.push("pagina") en vez de un window.location.href cuando se hagan cambios de páginas.

- En la pantalla de gestión de vídeos del fisio, añadir un botón de volver atrás, y arreglar el modal de edición de videos para que aparezca realmente como un modal y no abajo de la página como aparece ahora.

- Arreglar la ventana de creación de cuenta para que esté centrada (actualmente está más a la izquierda)
![Image](https://github.com/user-attachments/assets/4f409f38-022d-49e5-9765-4b7bc47e87ba)

- No hay modal de confirmación de cancelación de cita (salta error de cita no encontrada directamente)

**Consideraciones adicionales:**  
- Como son varias pequeñas tareas ,os las podéis dividir entre los 3 como mejor consideréis.
- Poner como revisor a [@antoniommff](https://github.com/antoniommff) 

<br></br>

<hr>

<br></br>



## **Épica 21: Campaña de lanzamiento**

[***Video y presentación para el PPL #508***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/508)

**Descripción de tarea**

- Crear un **video de costes** de acuerdo a lo comentado con el feedback de los profesores

- Editar y completar vídeos de fisio

- Plantear y elaborar nuevo video de pacientes

- Elaborar la presentación del PPL

- Elaborar presentación técnica de trabajo realizado

- Plantear / elaborar vídeos cortos/reels para las cuentas de Fisio Find


 **Consideraciones adicionales**

1. ENSAYO WPL 10min (Antonio y Guadalupe)
	1. ¿De qué va este proyecto? Killer opener / anuncio
	2. ¿Qué hace Fisio Find? Demo en vivo enlazado con una historia (relacionado con el killer opener)
	3. Competidores / factores diferenciales
	4. ¿Quién hay detrás de todo esto? Vídeo presentación equipo (The Office)
	5. ¿Esto puede llegar a ser rentable? Modelo de negocio, rentabilidad, ingresos corto-medio plazo, oportunidades de inversión
	6. ¿Dónde puedo encontrar más información? EL CIERRE TIENE QUE SER TOCHO

2. TECNICA 5min
- Caracterizáción de usuario potenciales (PERSONA: biografía de un personaje que podría usar la aplicación)
- Anuncios SEO, posicionamiento en internet 
- Campaña de lanzamiento del producto
- Impacto mediático
- Redes sociales (community management)
- Costes de marketing desglosado
- 3 anuncios (uno de cada rol) Sugerencia: anuncio fisios y pacientes en presentacion 1, nueva version anuncio inversores en esta presentación 

<br></br>

[***Campaña mediática y de lanzamiento #507***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/507)

**Descripción de tarea**

Desarrollar la estrategia de **impacto mediático** y **marketing digital** para Fisio Find, incluyendo:
- Posicionamiento SEO de la plataforma en buscadores.
- Planificación de **campañas de anuncios** segmentadas (Google Ads, redes sociales).
- **Gestión de redes sociales** (community management).
- Análisis de **costes de marketing desglosados** por canal y herramienta.

**Consideraciones adicionales**

- Establecer keywords estratégicas y estudiar la competencia local en posicionamiento SEO.
- Seleccionar redes sociales clave (Instagram, Facebook, LinkedIn) y definir un calendario de publicaciones.
- Contratar o asignar un perfil de **community manager**.
- Dividir el presupuesto mensual de marketing en:
  - Anuncios pagados (SEM)
  - Herramientas SEO (por ejemplo, Ahrefs, Semrush)
  - Software de gestión de redes (Buffer, Hootsuite, etc.)
  - Mano de obra (CM, diseño, redacción)
- Medir impacto con KPIs: visitas, CTR, leads, followers, etc.

<br></br>

[***[Doc] Primera versión documento Stock Pitch #537***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/537)

**Descripción de la funcionalidad:**
Realizar un documento "Stock Pitch" orientado a los inversores, en los que puedan entender de un vistazo el modelo de negocio, monetización y datos sobre nuestras estimaciones de rentanilidad.

**Motivación e impacto:**
- Continuar con el plan de marketing y lanzamiento
- Hacer más atractiva nuestra propuesta a los inversores

**Consideraciones adicionales:**
- Se recomienda usar [Canva](https://www.canva.com/)
- Se recomienda consultar la siguiente página como guía: https://www.careerprinciples.com/resources/stock-pitch 


<br></br>

[***SEO on page #550***](https://github.com/Proyecto-ISPP/FISIOFIND/issues/550)

**Descripción de la funcionalidad:**
Investigación y Selección de Palabras Clave
Identificación de palabras clave estratégicas: Utilizar herramientas como Semrush y Ahrefs para identificar palabras clave relevantes relacionadas con "fisioterapia", "salud", "ejercicio físico" y "telemedicina", incluyendo términos de cola larga como "fisioterapia para personas mayores" o "rehabilitación de lesiones musculares".
Análisis de la competencia local: Estudiar las palabras clave por las que compiten otras clínicas y sitios webs de fisioterapia en España, como TuFisio, Doctoralia, TopDoctors, Fisioforce o TRAK para identificar oportunidades de mejora y nichos menos competidos.
Optimización On-Page
Contenido del sitio web (fisiofind.com):
Redactar textos claros y concisos que incluyan las palabras clave seleccionadas.
Incorporar testimonios de pacientes y fisiotearpeutas para aumentar la credibilidad.
Metaetiquetas:
Crear títulos y descripciones únicas para cada página, incluyendo palabras clave relevantes.
Utilizar etiquetas ALT en imágenes que describan el contenido visual y contengan palabras clave.
Estructura del sitio:
Asegurar una navegación intuitiva y jerarquía clara de contenidos.
Implementar URLs amigables que reflejen el contenido de cada página.


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

**Representante grupo 3:** Delfín Santana Rubio 
**Rol:** Secretario del grupo 2, analista, programador, tester

