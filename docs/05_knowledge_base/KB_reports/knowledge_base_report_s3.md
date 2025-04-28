<!-- ---
title: "REPORTE BASE DE CONOCIMIENTO #SPRINT 3"            # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 3"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "10/04/2025"                                          # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
toc-own-page: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background2V.pdf"    # CHANGE IF NEEDED
header-left: "REPORTE BASE DE CONOCIMIENTO #SPRINT 3"       # CHANGE IF NEEDED
header-right: "10/04/2025"                                  # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"  
--- -->

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  REPORTE BASE DE CONOCIMIENTO #SPRINT 3
</h1>

<br>


# **ÍNDICE**
- [**ÍNDICE**](#índice)
- [1. INTRODUCCIÓN](#1-introducción)
- [2. ACCESO A LA BASE DE CONOCIMIENTO](#2-acceso-a-la-base-de-conocimiento)
- [3. USO Y GESTIÓN DE LA BASE DE CONOCIMIENTO](#3-uso-y-gestión-de-la-base-de-conocimiento)
  - [3.2. USO Y GESTIÓN GRUPAL](#32-uso-y-gestión-grupal)
    - [3.2.1. Organización](#321-organización)
    - [3.2.2. Planificación](#322-planificación)
    - [3.2.3. Informes](#323-informes)
    - [3.2.4. Seguimiento](#324-seguimiento)
    - [3.2.5. Recursos](#325-recursos)
    - [3.2.6. Ideando un proyecto](#326-ideando-un-proyecto)
    - [3.2.7. Términos](#327-términos)
    - [3.2.8. SPRINT 1](#328-sprint-1)
    - [3.2.9. SPRINT 2](#329-sprint-2)
    - [3.2.10. SPRINT 3](#3210-sprint-3)
  - [3.2 USO Y GESTIÓN GENERAL](#32-uso-y-gestión-general)
- [4. CONTRIBUCIONES DEL EQUIPO](#4-contribuciones-del-equipo)
  - [4.1. CONTRIBUCIONES A LA BASE DE CONOCIMIENTO GRUPAL](#41-contribuciones-a-la-base-de-conocimiento-grupal)
    - [4.1.1. Organización](#411-organización)
    - [4.1.2. Planificación](#412-planificación)
    - [4.1.3. Informes](#413-informes)
    - [4.1.4. Seguimiento](#414-seguimiento)
    - [4.1.5. Recursos ("Base de conocimiento" en el repositorio oficial de Fisio Find)](#415-recursos-base-de-conocimiento-en-el-repositorio-oficial-de-fisio-find)
    - [4.1.6. Ideando un proyecto](#416-ideando-un-proyecto)
    - [4.1.7. Términos](#417-términos)
    - [4.1.8. Sprint 1](#418-sprint-1)
    - [4.1.9 Sprint 2](#419-sprint-2)
    - [4.1.10. Sprint 3](#4110-sprint-3)
  - [4.2 CONTRIBUCIONES A LA BASE DE CONOCIMIENTO GENERAL](#42-contribuciones-a-la-base-de-conocimiento-general)
  - [4.2.1. Feedback individual del grupo 6](#421-feedback-individual-del-grupo-6)
    - [Semana 8](#semana-8)
      - [Feedback relacionado con la presentación](#feedback-relacionado-con-la-presentación)
      - [Feedback relacionado con el desarrollo del proyecto](#feedback-relacionado-con-el-desarrollo-del-proyecto)
      - [Tareas a realizar para la siguiente semana](#tareas-a-realizar-para-la-siguiente-semana)
    - [Semana 9](#semana-9)
      - [Feedback relacionado con la presentación](#feedback-relacionado-con-la-presentación-1)
      - [Feedback relacionado con el desarrollo del proyecto](#feedback-relacionado-con-el-desarrollo-del-proyecto-1)
      - [Tareas a realizar para la siguiente semana](#tareas-a-realizar-para-la-siguiente-semana-1)
  - [4.2.2. Aportaciones generales](#422-aportaciones-generales)
    - [Apartado Presentaciones](#apartado-presentaciones)
      - [Feedback del día 04/04](#feedback-del-día-0404)
    - [Apartado Killer opener](#apartado-killer-opener)
      - [Feedback del día 04/04](#feedback-del-día-0404-1)
    - [Apartado Idea de negocio](#apartado-idea-de-negocio)
      - [Feedback del día 04/04](#feedback-del-día-0404-2)
    - [Apartado Usuarios piloto](#apartado-usuarios-piloto)
      - [Feedback del día 04/04](#feedback-del-día-0404-3)
    - [Apartado Storyboards](#apartado-storyboards)
      - [Feedback del día 04/04](#feedback-del-día-0404-4)
- [5. ACCIONES TOMADAS A PARTIR DEL FEEDBACK](#5-acciones-tomadas-a-partir-del-feedback)
  - [5.1. Resumen de mejoras tras el feedback del 28/03/2025](#51-resumen-de-mejoras-tras-el-feedback-del-28032025)
    - [5.1.1. Ratio de respuesta de usuarios piloto](#511-ratio-de-respuesta-de-usuarios-piloto)
    - [5.1.2. Análisis de costes](#512-análisis-de-costes)
  - [5.2. Resumen de mejoras tras el feedback del 04/04/2025](#52-resumen-de-mejoras-tras-el-feedback-del-04042025)
    - [5.2.1. Iconos en la demo](#521-iconos-en-la-demo)
    - [5.2.2. Priorización del feedback](#522-priorización-del-feedback)
    - [5.2.3. Redifinición tareas PPL](#523-redifinición-tareas-ppl)
- [**6. ANEXO - RESUMEN DEL FEEDBACK POR GRUPO**](#6-anexo---resumen-del-feedback-por-grupo)
    - [6.1. Feedback del día 28/03/2025 (semana 8)](#61-feedback-del-día-28032025-semana-8)
- [**1. RESUMEN DEL FEEDBACK POR GRUPO**](#1-resumen-del-feedback-por-grupo)
  - [**Primer grupo (Holos):**](#primer-grupo-holos)
  - [**Segundo grupo (Gastrostock):**](#segundo-grupo-gastrostock)
  - [**Tercer grupo (Eventbride):**](#tercer-grupo-eventbride)
  - [**Cuarto grupo (BORROO):**](#cuarto-grupo-borroo)
  - [**Quinto grupo (CAMYO):**](#quinto-grupo-camyo)
  - [**Sexto grupo (FISIO FIND):**](#sexto-grupo-fisio-find)
- [**ANÁLISIS DEL FEEDBACK**](#análisis-del-feedback)
  - [**TENDENCIAS GENERALES**](#tendencias-generales)
  - [Discusión para la siguiente clase.](#discusión-para-la-siguiente-clase)
      - [PRÓXIMA SEMANA](#próxima-semana)
- [**CONCLUSIONES Y OBSERVACIONES**](#conclusiones-y-observaciones)
- [6.2. Feedback del día 21/03/2025 (semana 7)](#62-feedback-del-día-21032025-semana-7)
- [**1. RESUMEN DEL FEEDBACK POR GRUPO**](#1-resumen-del-feedback-por-grupo-1)
  - [**Primer grupo (Holos):**](#primer-grupo-holos-1)
  - [**Segundo grupo (Gastrostock):**](#segundo-grupo-gastrostock-1)
  - [**Tercer grupo (Eventbride):**](#tercer-grupo-eventbride-1)
  - [**Cuarto grupo (BORROO):**](#cuarto-grupo-borroo-1)
  - [**Quinto grupo (CAMYO):**](#quinto-grupo-camyo-1)
  - [**Sexto grupo (FISIO FIND):**](#sexto-grupo-fisio-find-1)
- [**ANÁLISIS DEL FEEDBACK**](#análisis-del-feedback-1)
  - [**TENDENCIAS GENERALES**](#tendencias-generales-1)
  - [**COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**](#comparación-del-feedback-de-nuestro-grupo-vs-los-otros)
  - [Discusión para la siguiente clase.](#discusión-para-la-siguiente-clase-1)
      - [PRÓXIMA SEMANA](#próxima-semana-1)
- [**CONCLUSIONES Y OBSERVACIONES**](#conclusiones-y-observaciones-1)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 3

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Alberto Carmona Sicre](https://github.com/albcarsic) (autor), [Rafael Pulido Cifuentes](https://github.com/rafaelpulido) (revisor)

- **Fecha de Creación:** 10/04/2025

- **Versión:** v1.0

<br>


---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 10/04/2025 | v1.0    | Alberto Carmona Sicre | Creación del informe de base de conocimiento del sprint 3 |
| 10/04/2025 | v1.1    | Alberto Carmona Sicre | Finalización puntos 4 y 5 |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  

La base de conocimiento ha sido desarrollada siguiendo las directrices establecidas en nuestro Acuerdo de Base de Conocimiento. Cada acción realizada ha sido regulada conforme a sus disposiciones. En este documento puede encontrar la información correspondiente al sprint 3.

Importante: el repositorio de documentación en el que se suben los documentos generados durante los sprints no se actualiza directamente tras la creación de un archivo, sino que se va actualizando una vez se conoce que los archivos van a dejar de ser modificados, para así evitar trabajo extra a los responsables de poblar dicho repositorio.

# 2. ACCESO A LA BASE DE CONOCIMIENTO

El acceso a la base de conocimiento está disponible en el siguiente enlace: [Fisio Find](https://fisiofind.vercel.app/).  

Para consultar la documentación, visita [Documentación Fisio Find](https://fisiofind.vercel.app/docs/Inicio). En esta sección, encontrarás un panel lateral izquierdo que muestra todos los documentos subidos.

Por otro lado, la base de conocimiento de toda la clase se encuentra en el siguiente enlace: [https://bcc-three.vercel.app/](https://bcc-three.vercel.app/).

Por último, en caso de que la Base de Conocimiento no haya sido actualizada, usted puede encontrar los diferentes documentos mencionados en la carpeta docs del repositorio oficial de Fisio Find, haciendo click en este enlace: [Documentación repositorio oficial Fisio Find](https://github.com/FisioFind/FisioFind/tree/main/docs).

# 3. USO Y GESTIÓN DE LA BASE DE CONOCIMIENTO

## 3.2. USO Y GESTIÓN GRUPAL

Para gestionar de manera eficiente la base de conocimiento, se ha implementado el siguiente esquema de trabajo, con una **separación de responsabilidades** que optimiza la eficacia del equipo al momento de elaborar y actualizar documentos de forma recurrente.

A continuación, se muestra la información correspondiente a cada punto del esquema:

### 3.2.1. Organización

- En la carpeta **Organización** se almacenan todos los documentos redactados relacionados con acuerdos o compromisos. Los encargados de la elaboración de estos se asignaban durante reuniones y se desarrollaban de manera conjunta, sin haber unos responsables específicos encargados de realizar todos los documentos de este tipo.

### 3.2.2. Planificación

- En la carpeta **Planificación** se guardan todos los documentos relacionados con la planificación del proyecto (planes, registros y costes). En este caso, la distribución sigue el mismo procedimiento: el equipo se reunía, se distribuían los documentos y se realizaban de manera colaborativa.

### 3.2.3. Informes

Para mejorar la eficiencia en la documentación de informes, se estableció un grupo específico encargado de cada tipo de reporte:

- **Carpeta Informes de Tiempo**: en esta sección se acumulan todos los informes de horas que el equipo dedica al trabajo de manera semanal. Para la elaboración de dichos documentos se asignaron a los compañeros Rafael Pulido y Alberto Carmona.  

- **Carpeta Informes de IA**: en esta sección se almacenan todos los informes dedicados a evaluar el uso de la inteligencia artificial por parte de los miembros del equipo durante cada semana de trabajo. Para la elaboración de dichos documentos se asignaron a los compañeros Daniel Ruiz y Daniel Fernández.

- **Carpeta Informes de usuarios piloto**: en esta sección se almacenan todos los informes dedicados a la obtención y evaluación del feedback por parte de los usuarios piloto. Los compañeros Antonio Macías y Guadalupe Ridruejo fueron los encargados de la elaboración de dichos documentos.

- **Carpeta Informes de calidad**: en esta sección se almacenan todos los informes dedicados a la evaluación del trabajo realizado por cada integrante del equipo en un periodo concreto. El equipo de QA es el encargado de realizar dichos documentos. Los integrantes son: Francisco Mateos, Daniel Alors, Miguel Encina, Benjamín Ignacio Maureira.

- **Carpeta Informes de seguridad**: en esta sección se almacenan todos los informes que tienen como objetivo mostrar los resultados de utilizar una herramienta automática de análisis de seguridad. Los encargados de realizar dichos documentos son: Guadalupe Ridruejo y Delfín Santana.

### 3.2.4. Seguimiento

En esta sección encontramos tres subapartados: Reuniones, Sprint 1 y Sprint 2.

- En la sección de **Reuniones** se guardan cada una de las actas de las reuniones realizadas. La redacción de las actas de reuniones es responsabilidad del **Scrum Master**, Antonio Macías, o de los **Secretarios**, Alberto Carmona, Delfín Santana y Daniel Vela.

- En los apartados **Sprint 1**, **Sprint 2** y **Sprint 3**, se almacenan los informes relacionados con el sprint en sí (planificación, retrospectiva, etc.). Documentos como la retrospectiva se encargaron al equipo de **QA**, mientras que la **planificación** fue responsabilidad del **Scrum Master**.

### 3.2.5. Recursos

- La gestión de la carpeta **Recursos** siguió la siguiente dinámica: los **Secretarios** y el **Scrum Master** fueron los encargados de añadir los informes de **feedback**, las notas sobre las **píldoras teóricas** y otros documentos relevantes, como el Informe de Base de Conocimiento.

### 3.2.6. Ideando un proyecto

- En la carpeta **Ideando un proyecto** simplemente se pueden encontrar juntos todos los documentos generados durante esta fase inicial del proyecto.

### 3.2.7. Términos

- En esta carpeta se pueden encontrar todos los documentos relacionados con los términos y condiciones, la privacidad, las cookies y las licencias. Los encargados de la elaboración de estos fueron el **Scrum Master**, Antonío Macías, el **Secretario** Delfín Santana y Daniel Ruiz.

### 3.2.8. SPRINT 1

- En la carpeta **Sprint 1** se pueden encontrar juntos todos los documentos generados o modificados durante esta fase del proyecto.

### 3.2.9. SPRINT 2

- En la carpeta **Sprint 2** se pueden encontrar juntos todos los documentos generados o modificados durante esta fase del proyecto.

### 3.2.10. SPRINT 3

- En la carpeta **Sprint 3** se pueden encontrar juntos todos los documentos generados o modificados durante esta fase del proyecto.

<br>

Los documentos e informes no se incluyen directamente en la base de conocimiento, sino que se van subiendo al apartado docs del repositorio oficial de código de [Fisio Find](https://github.com/Proyecto-ISPP/FISIOFIND/tree/main/docs), que cuenta con una estructura ampliamente parecida a la base de conocimiento, para así mantener un orden de los documentos que se van finalizando a lo largo del desarrollo. Una vez los documentos son finalizados, dos responsables, Rafael Pulido y Daniel Ruiz, se encargan de lo siguiente:

- Se aseguran de que los documentos añadidos en el repositorio oficial de código de **Fisio Find** estén correctamente reflejados en la base de conocimiento.  

- También supervisan la correcta visualización de la página web asociada.

<br>

De nuevo, este esquema ha permitido **optimizar la documentación**, asignar responsabilidades de manera eficiente y garantizar un acceso ordenado a la información a lo largo del desarrollo del proyecto.

## 3.2 USO Y GESTIÓN GENERAL

En la base de conocimiento general de la asignatura, dentro de la sección correspondiente a nuestro grupo (Grupo 6), se ha ido incorporando semanalmente el feedback recibido de nuestros docentes y compañeros. Este feedback abarca tanto la evaluación de nuestro propio grupo como la de los otros once grupos.

Se ha elegido al secretario Alberto Carmona como responsable de actualizar la base de conocimiento general de la asignatura.

<br>

# 4. CONTRIBUCIONES DEL EQUIPO

## 4.1. CONTRIBUCIONES A LA BASE DE CONOCIMIENTO GRUPAL

A continuación, se muestran las contribuciones del equipo a la base de conocimiento grupal durante la elaboración del Sprint 3, dividido en las secciones: Organización, Planificación, Informes, Seguimiento y Recursos.

### 4.1.1. Organización

- Modificación del Acuerdo de usuarios piloto: adecuación para la entrega del #SPRINT 3. Adición de nuevos UP (fisioterapeutas).

### 4.1.2. Planificación

- Modificación del Documento de seguimiento de costes: Actualización del documento acorde a los gastos a mitad de Sprint 3.

- Modificación del Plan de gestión de usuarios piloto: Adecuación para la entrega del #SPRINT 3. Adición de nuevos UP (fisioterapeutas).

- Adición del documento Plan de pruebas.

### 4.1.3. Informes

- Informe de tiempo del Sprint 3.

- Informe de tiempo de la semana 8.

<br>

- Informe de IA de la semana 9.

- Informe de IA del sprint 3.

<br>

- Informe de usuarios piloto del sprint 3.

- Comunicaciones usuarios piloto sprint 3.

<br>

- Informe de calidad del Sprint 3.

<br>

- Informe de seguridad del Backend 2025-04-27 ZAP.

- Informe de seguridad del Frontend 2025-04-27 ZAP.

- Informe de seguridad del Backend 2025-04-29 ZAP.

- Informe de seguridad del Frontend 2025-04-29 ZAP.

- Informe de seguridad del sprint 3

### 4.1.4. Seguimiento

En la carpeta sprint_3:

- Planificación del Sprint 3.

- Retrospectiva global del Sprint 3.

- Retrospectiva del Sprint del grupo 1.

- Retrospectiva del Sprint del grupo 2.

- Retrospectiva del Sprint del grupo 3.

- Retrospectiva de mitad del Sprint 3.

### 4.1.5. Recursos ("Base de conocimiento" en el repositorio oficial de Fisio Find)

- Feedback de la clase del día 28 de marzo de 2025.

- Feedback de la clase del día 4 de abril de 2025.

- Informe de la base de conocimiento del Sprint 3.

En el anexo, se muestra tanto el feedback grupal como las anotaciones generales.

### 4.1.6. Ideando un proyecto

- No se han añadido ni modificado documentos.

### 4.1.7. Términos

- Documento de "cookies" de Fisio Find en formato pdf y md.

- Documento de términos y condiciones de Fisio Find en formato pdf y md.

- Documento de privacidad de Fisio Find en formato pdf y md.

- Documento de licencias de Fisio Find en formato pdf y md.

### 4.1.8. Sprint 1

- Informe de uso de la Inteligencia Artificial.

- Informe de la base de conocimiento.

- Acuerdo de compromiso con las modificaciones del sprint.

- Documento de evaluación del rendimiento.

- Documento de usuarios piloto.

- Documento de acuerdo de compromiso de usuarios piloto.

- Documento de evaluación del rendimiento de usuarios piloto.

- Presentación del sprint en formato pdf.

- Guía de uso y revisión.

- Informe del esfuerzo de tiempo.

### 4.1.9 Sprint 2

- Informe de uso de la Inteligencia Artificial.

- Informe de la base de conocimiento.

- Acuerdo de compromiso con las modificaciones del sprint.

- Documento de evaluación del rendimiento.

- Documento de usuarios piloto.

- Documento de acuerdo de compromiso de usuarios piloto.

- Documento de evaluación del rendimiento de usuarios piloto.

- Presentación del sprint en formato pdf.

- Guía de uso y revisión.

- Informe del esfuerzo de tiempo.

### 4.1.10. Sprint 3

- Informe de uso de la Inteligencia Artificial.

- Informe de la base de conocimiento.

- Acuerdo de compromiso con las modificaciones del sprint.

- Documento de evaluación del rendimiento.

- Documento de usuarios piloto.

- Documento de acuerdo de compromiso de usuarios piloto.

- Documento de evaluación del rendimiento de usuarios piloto.

- Presentación del sprint en formato pdf.

- Guía de uso y revisión.

- Informe del esfuerzo de tiempo.

<br>

Para consultar la documentación, visita [Documentación Fisio Find](https://fisiofind.vercel.app/docs/Inicio). En esta sección, encontrarás un panel lateral izquierdo que muestra todos los documentos subidos. Si desea una versión actualizada en todo momento, acceda al siguiente enlace con el apartado de documentos del [repositorio oficial de Fisio Find](https://github.com/Proyecto-ISPP/FISIOFIND/tree/main/docs).


## 4.2 CONTRIBUCIONES A LA BASE DE CONOCIMIENTO GENERAL

A continuación, se muestran las contribuciones a la base de conocimiento general. Cabe destacar que, para los demás grupos, el feedback es igual al que se añade en el feedback de la base de conocimiento grupal, por lo que solo se va a añadir el feedback del grupo 6. Además, aunque resulte parecida, la información añadida en la base de conocimiento general tiene una estructura similar pero un poco diferente a la recogida en el feedback grupal, por ello, este feedback individual si se muestra como parte de una contribución a nivel general.

## 4.2.1. Feedback individual del grupo 6

En este apartado se encuentra la información relacionada con el feedback de las semanas 6 y 7.

### Semana 8
#### Feedback relacionado con la presentación

- Hay que diferenciar entre anuncio y demo. No hace falta conectarlas.

- Buen inicio efectivo y elevator pitch. No hace falta cambiarlos semana a semana, si funciona, funciona.

- La demo está muy bien hecha. Además, proporcionar contexto también en el anuncio, para Cristina, está correcto.

#### Feedback relacionado con el desarrollo del proyecto

- El anuncio final está realmente bien. Además nos vemos muy profesionales.

- Con respecto al análisis de costes, el análisis en la gráfica es raro, porque las HU deben ser muy variables según lo que quieren los usuarios. Si quieren hacer una estimación de puntos de HU puede estar bien, pero es bastante complejo. Depende mucho del feedback. Pablo estaría dispuesto a dos finales: un final de características avanzadas (mucho esfuerzo), y otro final de mayor captación de usuarios piloto (Bajo esfuerzo).

- Tenemos una funcionalidad más compleja que los demás, pero muy bien desarrollada y llevada.

- En cuanto al bajo ratio de respuestas de los usuarios piloto, hemos dado muy poco margen para responder. Es más problema nuestro.

#### Tareas a realizar para la siguiente semana

- Mejorar la presentación y la demo con las varias sugerencias del profesor.

- Reorganizar el análisis de costes.

- Redefinir las tareas para entregar un producto funcional mucho antes a los usuarios piloto.

### Semana 9
#### Feedback relacionado con la presentación

- Guadalupe y Antonio presentan de manera inmejorable. Mezclan comunicación y chascarrillos perfectamente.

- Inicio efectivo no estridente pero muy buena forma de captar al público porque la gente puede empatizar. Empieza con tono muy bueno y muy claro. 

- La forma de presentar el equipo es perfecta.

- En la demo, muy bien las mejoras de UX, pero te puedes perder un poco por el cambio entre tipos de usuario, la mejor forma es poniendo un icono. Quizás un poco más lenta la mejoraría.

- Demo muy profesional, en funcionalidad y apariencia (demasiadas horas en el grupo), pero resultado muy profesional.

- De los costes, estimación de beneficios, la curva de costes solo hay punto de corte con la optimista, no hay con esperada y pesimista. Ayuda sobre todo en el esperado.

- Si el feedback se ha priorizado hay que decirlo, aunque sea muy general.

#### Feedback relacionado con el desarrollo del proyecto

- En el PPL hay muchas tareas de implementación, cuando en este caso hay que hacer tareas de marketing.

- No es realista que todos los usuarios tengan la misma foto de perfil.

- Customer agreement, en el SLA no hemos hablado demasiado, falta de priorización del feedback de usuarios piloto.

#### Tareas a realizar para la siguiente semana

- Mostrar la priorización del feedback.

- Cambiar el PPL añadiendo más tareas de marketing.

## 4.2.2. Aportaciones generales

En este apartado se encuentras las aportaciones que se han realizado a la Base de Conocimiento grupal en función de las semanas y puntos que se han pedido según la organización grupal de aportaciones. En concreto, el grupo 6 se hizo responsable de añadir información en los apartados Presentaciones, Killer opener, Idea de negocio, Usuarios piloto y Storyboards durante la semana de la sesión del día 4 de abril de 2025..

### Apartado Presentaciones
#### Feedback del día 04/04

 - La presentación debe ser diseñada de forma que sea entendida por alguien de fuera de la asignatura.

 - Aglutinar la información de manera clara y concisa. Un ejemplo claro fue que había varias diapositivas con varías gráficas de costes distintas, que podían incluirse en una sola.

 - Tener cuidado con el momento del desarrollo el que nos encontramos. Ejemplo: hubo un grupo que puso Sprint 2 en algunas diapositivas, cuando estamos ya en el 3.

 - Cuidado con las imágenes con Copyright.

 - No usar muletillas.

 - No incluir suposiciones al presentar datos, en todo caso aproximaciones.

 - Tener cuidado con el uso de ciertos gráficos que no son claros indicadores de lo que se quiere expresar.

 - Reducir al máximo el texto en las diapositivas y hacer uso de metáforas gráficas.

 ### Apartado Killer opener
 #### Feedback del día 04/04

 - Realizar un inicio efectivo que siga la estructura de un anuncio puede captar la atención fácilmente.

 - Por otro lado, el análisis de esta semana muestra que los comentarios recibidos por los grupos siguen líneas similares a feedbacks anteriores, sin aportar observaciones fundamentalmente nuevas. Entre las áreas de mejora mencionadas y ya identificadas en sesiones previas encontramos: mejorar la conexión con el elevator pitch.

### Apartado Idea de negocio
#### Feedback del día 04/04

 - El volumen de mercado debe aparecer en los hitos.

 - Es esencial transmitir claramente la funcionalidad principal.

### Apartado Usuarios piloto
#### Feedback del día 04/04

 - Es importante mostrar el feedback específico que hancasuado acciones concretas de los usuarios piloto para mejorar el producto.

 - Algunos clientes pilotos han dejado de contestar, lo que puede afectar la validación continua del producto. Es esencial tener contar con una planificación óptima de manera que los usuarios piloto puedan seguir participando en el proyecto con un producto funcional. 

 - Si en la demo se ven mejoras en la experiencia de usuario gracias a los comentarios de usuarios piloto, es importante recalcarlo.

 - Hay que tener cuidado al mezclar clasificaciones del feedback de usuarios piloto. Por ejemplo: no mezclar el tipo con la prioridad.

 - Hay que poner en la presentación cuánto feedback reciben de cada tipo.

### Apartado Storyboards
#### Feedback del día 04/04

 - Cuidar el tono y la coherencia del anuncio. Puede haber humor, pero debe estar bien medido y no distraer del propósito.

 - Por mucho que la ejecución técnica de un anuncio se vea agradable, si este no representa una situación creíble o relevante, no vale la pena. Alinear mejor el caso mostrado con un escenario realista y relevante para el usuario objetivo.

 - Tener cuidado con los sonidos: música muy alta, voces muy bajas, etc.

 - Hacer un anuncio muy largo con una mezcla de temas diferentes puede hacer que este sea pesado, poco llamativo y difícil de entender. Hay que mantener un hilo conductor claro y objetivo.

<br>

<br>

---

# 5. ACCIONES TOMADAS A PARTIR DEL FEEDBACK

En esta sección se muestra un resumen de las acciones que se han tomado a partir del feedback dado. Se muestra un resumen ya que se entiende que existe un proceso de interiorización del feedback que hace que se tomen acciones de forma inconsciente. Es decir, si por ejemplo se valora mucho una presentación en concreto, lógicamente se va a intentar mejorar dicha presentación en los puntos en los que se haya dado feedback positivo. Se puede obtener un análisis mucho más detallado del feedback y de las presentaciones en los documentos de feedback de nuestra base de conocimiento.

## 5.1. Resumen de mejoras tras el feedback del 28/03/2025

Tras el _feedback_ recibido en la sesión del 28/03/2025, se tomaron medidas para mejorar aquellos aspectos de la presentación que presentaban fallos, al mismo tiempo que se reforzaron los puntos que fueron elogiados.

### 5.1.1. Ratio de respuesta de usuarios piloto

- Ante el comentario de tener cuidado con el ratio de respuesta de usuarios piloto, se decidió dejar una fecha límite para tener las funcionalidades funcionando correctamente en main, y así poder desplegar más rápidamente y que los usuarios piloto diesen un feedback positivo.

### 5.1.2. Análisis de costes

- La gráfica de costes con las HU se redireccionó para seguir el feedback sugerido por Pablo: un final de características avanzadas (mucho esfuerzo), y otro final de mayor captación de usuarios piloto (Bajo esfuerzo).

## 5.2. Resumen de mejoras tras el feedback del 04/04/2025

Tras el _feedback_ recibido en la sesión del 04/04/2025, se tomaron medidas para mejorar aquellos aspectos de la presentación que presentaban fallos, al mismo tiempo que se reforzaron los puntos que fueron elogiados.

### 5.2.1. Iconos en la demo

- Nos comentaron que el público se puede perder un poco al cambiar entre usuarios, por lo que se tuvo en cuenta el poner iconos haciendo referencias a los distintos usuarios para que no se pierda el contexto.

### 5.2.2. Priorización del feedback

- El feedback priorizado apenas se comentó en la presentación, por lo que se tuvo en cuenta para la siguiente semana. Se añadió más información acerca de este apartado del feedback.

### 5.2.3. Redifinición tareas PPL

- Se incluyeron más tareas de marketing y menos de implementación.

<br>

\newpage

<br>


---

# **6. ANEXO - RESUMEN DEL FEEDBACK POR GRUPO**

### 6.1. Feedback del día 28/03/2025 (semana 8)

# **1. RESUMEN DEL FEEDBACK POR GRUPO**

## **Primer grupo (Holos):**
**Feedback alumnos**

- El enfoque que le han dado a la demo ha sido muy divertido. Además, han usado zoom para mostrar bien las partes de la aplicación menos visibles a gran distancia. 

- Muy buen inicio efectivo.

- Los aspectos legales del GDPR han gustado.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Han empezado muy lento y después ha acelerado descontroladamente, por lo que ha habido partes de la presentación que no se han podido ver ni entender bien. Sugerencia: meter menos diapositivas y practicar más la presentación.

- El killer opener ha resultado demasiado dramático. Hay que tratar de rebajar el tono para no deprimir al público.

- Lo de pagos anónimos y personalizados no ha quedado claro.

- El storyboard de usuarios muy bien. Al de inversores le faltan datos. Hay que poner números, datos, cuánto invierto y cuánto gano. Hay que coordinarse con los dibujos del storyboard, comentar las viñetas. Se anima a que sea la dibujante la que comente los storyboards.

- Lo del trabajador de la semana está muy bien. Así como hay un hall of fame, puede haber uno de shame. 

- La demo espectacular. El comentar lo que se va a ver en la demo antes de mostrarla es importante, aunque sea por encima. Por otro lado, falta que el admin diga que él es el admin, y no cualquier usuario aleatorio.

- Las diapositivas 9 y 10 se pueden juntar.

- Apartado de problemas:

    - Si hace falta recortar el alcance se recorta, porque la carga de trabajo no debe ser mayor de 10 horas semanales.

    - Hay que mostrar una gráfica que muestre cómo ha evolucionado la trazabilidad de la diapositiva 36.

- Muy bien la gráfica de rendimiento y esfuerzo, así como la de rendimiento individual. 

- Que el testing sea del 0% no es bueno.

**Puntos positivos destacados**

- Buen storyboard de usuarios.

- El destacar al trabajador de la semana.

- Demo espectacular.

- Buenas gráficas.

**Áreas de mejora sugeridas**

- Gestionar mejor los tiempos.

- Killer opener más positivo.

- Hace falta comentar lo que se va a ver en la demo.

- Las diapositivas 9 y 10 se pueden juntar.

- Falta una gráfica de evolución de la trazabilidad.

- Aumentar el porcentaje de testing.

<br>

## **Segundo grupo (Gastrostock):** 
**Feedback alumnos**:

- El desglose de los costes y los problemas están muy bien detallados.

- Se ha destacado el uso de Claudette para evitar las cláusulas abusivas en el SLA, recomendado en las píldoras teóricas.

- Se ha notado la mejoría respecto de la semana anterior.

- Ha gustado cómo han gestionado el feedback de los usuarios piloto.

**Feedback recibido (resumen de los comentarios de los profesores)**

- El inicio efectivo no está bien hilado, ya que la parte de la hostelería es muy amplia, no pueden solo nombrar eso, hay que centrarse también en el problema, y no solo mencionar que la hostelería está muy sacrificada.

- Hay partes de la presentación que son muy originales, por lo que deberían aplicarlo también en el killer opener.

- En las diapositivas iniciales de tantas gráficas (4 y 5), podrían aglutinarlas en menos, ya que ayuda a la comprensión.

- En la demo hay cositas que no se ven, letras muy pequeñas. Hay que usar el zoom.

- Duda: ¿Cómo evaluáis el rendimiento, solo commits?

    - No, la métrica es también qué ha hecho cada uno, cuántas horas le ha echado. Profesor: Esta forma es un poco floja. En el siguiente sprint deberían evaluar las gráficas que aporta Zenhub.

- El número de commits no sirve para evaluar correctamente, ya que es muy pervertible.

- Alabar que tengan una actitud positiva, aunque haya dificultades. Los problemas pasan, y pasan siempre, lo importante es afrontarlos y buscar soluciones, y ellos lo han llevado muy bien.

- Otra mención a usar Claudette.

- Al storyboard de inversores le faltan datos. Hay que poner números, datos, cuánto invierto y cuánto gano.

- La caja de problemas y soluciones está bien.

- Hay que plantear soluciones que puedan medirse y tienen que mostrar cuánto avanza.

**Puntos positivos destacados**

- Presentación con mucha originalidad.

- Actitud positiva alabable.

- Uso acertado de Claudette.

- Caja de problemas y soluciones bien planteadas.

**Áreas de mejora sugeridas**

- Hilar mejor el inicio efectivo con la solución que aporta la app.

- Aglutinar más la información.

- Demo mejorable.

- Usar gráficas de Zenhub y no usar el número de commits como métrica.

- Faltan datos en el storyboard de inversores.

- Soluciones mejor planteadas.

<br>

## **Tercer grupo (Eventbride):** 
**Feedback alumnos**

- Matriz de rendimiento muy buena y bien hilada con los empleados de la semana.

- La música usada en la demo le da un toque.

- Story boards muy trabajadas.

- Se ha destacado el team building.

- Han dejado muy claro de qué va la presentación desde el primer momento.

- las presentaciones minimalistas, centrándose en el contenido, han gustado.

- Muy buen el tono y ritmo y las formas de presentar.

**Feedback recibido (resumen de los comentarios de los profesores)**

- La demo se veía poco, hay que aumentar el zoom. Error frecuente en las demos: mostrar todo a tiempo real, o acelerado para que se vea todo. Se pueden meter cortes sin problema. La música la quitaría, no aporta mucho. Ayudaría que hubiese distintos narradores cuando hay distintos roles. Además, hay que meter cosas positivas, no hablar de cancelaciones en medio de la demo y cosas así.

- Justificar las previsiones económicas con el impacto en el mercado. ¿Las líneas están hechas al tuntún? ¿O hay un estudio firme detrás? Recomendación: dar un par de puntos con distintos casos y distintos usuarios y evaluar el porcentaje del mercado que se uniría a nuestra aplicación.

- Han pasado muy de perfil el pivotar con los clientes. Hay que sacar muchísima más información de los usuarios piloto, sobre todo de los clientes reales, para ordeñar la vaca al máximo, y tener una app mucho más adecuada a lo que piden realmente.

- El inicio efectivo está muy bien, se nota que los motiva. Hay una historia muy buena detrás.

- Hablando del rendimiento, es normal que el rendimiento baje en ocasiones. No hay que tener vergüenza a la hora de indicar las desviaciones del rendimiento.

- En el segundo storyboard, el de inversores, faltan cifras.

- ¿Hay política de cancelación? Porque ha habido una cancelación en la demo. Han dicho que en semanas siguientes se explayarán.

- Han mejorado en el seguimiento de los problemas.

- Las horas mínimas de trabajo en realidad son horas exigidas. Hay que ceñirse a las 10 horas. Es un objetivo.

- En la diapositiva 36, se han equivocado un poco con las métricas enseñadas, pero Daniel ha contestado bien a la pregunta.


**Puntos positivos destacados**

- El inicio efectivo es muy bueno.

- Seguimiento de problemas muy mejorado.

**Áreas de mejora sugeridas**

- Demo muy mejorable: usar distintas voces, quitar la música, etc.

- Justificar las previsiones económicas.

- Hay que sacar más información de los usuarios piloto.

- Faltan cifras en el storyboard de inversores.

- Ceñirse a las horas mínimas de trabajo.

<br>

## **Cuarto grupo (BORROO):** 
**Feedback alumnos**

- Muy buen killer opener y demo. 

- Muy bien cómo enseñan las funcionalidades. 

- Han mantenido a don Ramón.

- Muy buena la métrica del software. 

- Muy bien presentado el uso de la IA.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Si el killer opener es generalista, que pueda llegar a cualquier persona, ahí hay problemas de falta de profesionalidad. Es decir, si la demo y el killer opener están en un contexto distinto al de tener como público a alumnos en una clase, puede tener consecuencias muy malas.

- La demo tiene que estar adecuada a las necesidades y situaciones de los usuarios piloto. Si tienes usuarios piloto mayoritariamente de entre 19 y 25 años, no pongas un taladro como ejemplo.

- Si realmente se enfocan en algo tan grande, debería haber más objetos en la plataforma de BORROO. ¿Se han hecho transacciones reales? Si, hasta 10. Pablo lo ve poco para el potencial que tienen.

- El inicio efectivo es bueno, pero falta algo en el elevator pitch. Necesitan una frase que solucione el problema de don Ramón.

- En la diapositiva 15, está bien aglutinar la información, pero hay que tener en cuenta cómo se muestran las cosas. Si metes animaciones, úsalas para ir mostrando cosas poco a poco.

- La demo se puede agilizar en muchos apartados, como los formularios de pago, donde puede haber hasta cortes.

- Son de los pocos que usan Niko Niko. No es un método que sirve mucho para el rendimiento, pero si aporta información acerca del estado emocional.

- En el feedback de los usuarios piloto, estaría bien mostrar la cantidad, no solo el porcentaje, de los distintos tipos de feedback.

- La fianza debería haber sido prioritario, y parece que se ha dejado como secundario, cuando es algo trascendental en apps como esta.

**Puntos positivos destacados**

- Buen inicio efectivo.

- Usan el Niko Niko.

**Áreas de mejora sugeridas**

- Tener cuidado con las informalidades en el inicio efectivo y la demo.

- La demo debe estar adecuada al contexto de los usuarios piloto.

- Les falta algo en el elevator pitch.

- Usar animaciones para mostrar poco a poco mucha información aglutinada en una diapositiva.

- La demo debe agilizarse.

- Mostrar más información del feedback de los usuarios piloto.

<br>

## **Quinto grupo (CAMYO):** 
**Feedback alumnos**:

- Muy buena presentación, buen storyboard, muy buena demo, comentarios graciosos.

- Demo acelerada, muy buen contexto de los inversores.

- Muy buena demo, enlazado con el killer opener, en el final han continuado con la broma. 

- Se ha destacado que en el uso de la IA haya propuestas de cómo reaccionar.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Muy muy bien, Carlos se ha levantado y ha aplaudido.

- Han hilado muy bien todas las partes de la presentación, increíble.

- Hacen el feedback suyo, recogen todo lo positivo y lo aplican.

- La demo debe tener un poco más de zoom.

- ¿El bot de las pull request es el de copilot añadido hace poco? Es un poco parecido, revisa el código de la pr, ve si hay errores y genera un texto descriptivo con los cambios, ayudando al revisor. Comentario de Carlos: Copilot ha metido un bot para revisar las pull request automáticamente, estaría bien tenerlo en cuenta.

- ¿Hay algún beneficio para los empleados de la semana? El reconocimiento público ya es suficiente (broma). Carlos sugiere incentivos como elegir issues en próximos sprints y cosas del estilo.

- Muy buenos killer opener y elevator pitch, los dos presentan muy bien.

- El storyboard transmite muy bien lo que se desea transmitir.

- La trazabilidad de los problemas está muy bien explicada.

- Diapositiva 18: se han autoevaluado, cuando debería haber ya métricas de rendimiento. Se evalúan el autoesfuerzo. Es un tanto raro.

- El rendimiento podría evaluarse con métricas ya mostradas.


**Puntos positivos destacados**

- La presentación en general.

- Muy bien hilada toda la presentación.

- Se nota que tienen en cuenta todo el feedback generado en las clases.

- Muy buenos killer opener y elevator pitch.

- Los presentadores presentan muy bien.

- El storyboard está muy bien trabajado.

- Trazabilidad de problemas bien explicada.

**Áreas de mejora sugeridas**

- Más zoom en la demo.

- Hacer uso de incentivos para motivar.

- Rendimiento evaluable con métricas ya mostradas.

<br>

## **Sexto grupo (FISIO FIND):** 
**Feedback alumnos**

- Genial, todo muy profesional. 

- Perfectamente desplegable. 

- Han destacado que haya una persona grabando la presentación.

- Destacar la demo, muy bueno todo.

**Feedback recibido (resumen de los comentarios de los profesores)**

- El anuncio final está realmente bien. Además nos vemos muy profesionales.

- Hay que diferenciar entre anuncio y demo. No hace falta conectarlas.

- Con respecto al análisis de costes, el análisis en la gráfica es raro, porque las HU deben ser muy variables según lo que quieren los usuarios. Si quieren hacer una estimación de puntos de HU puede estar bien, pero es bastante complejo. Depende mucho del feedback. Pablo estaría dispuesto a dos finales: un final de características avanzadas (mucho esfuerzo), y otro final de mayor captación de usuarios piloto (Bajo esfuerzo).

- Buen inicio efectivo y elevator pitch. No hace falta cambiarlos semana a semana, si funciona, funciona.

- La demo está muy bien hecha. Además, proporcionar contexto también en el anuncio, para Cristina, está correcto.

- Tenemos una funcionalidad más compleja que los demás, pero muy bien desarrollada y llevada.

- En cuanto al bajo ratio de respuestas de los usuarios piloto, hemos dado muy poco margen para responder. Es más problema nuestro.

**Puntos positivos destacados**

- Presentación, demo y anuncio muy profesionales.

- Buenos killer opener y elevator pitch.

- Proporcionar contexto en el anuncio.

- Hemos sabido gestionar bien la compleja funcionalidad.

**Áreas de mejora sugeridas**

- Reorganizar el análisis de coste respecto a los puntos de HUs.

- Dar más margen de respuesta a los usuarios piloto.

<br>


# **ANÁLISIS DEL FEEDBACK**

## **TENDENCIAS GENERALES**
**Factores comunes en los comentarios de los profesores**

- Presentaciones iniciales potentes: La mayoría de los grupos ha hecho un esfuerzo por crear un killer opener llamativo. Sin embargo, se destaca la necesidad de que esté bien alineado con el contexto y el público. En algunos casos, se señala que el tono es demasiado dramático, informal o genérico.

- Storyboards de inversores incompletos: Casi todos los grupos han recibido comentarios sobre la falta de datos cuantitativos en los storyboards dirigidos a inversores (cuánto se invierte, cuánto se gana).

- Problemas de visualización en las demos: Es un problema recurrente que las demos no se vean bien (letras pequeñas, poco zoom, demasiado rápidas o sin cortes). También se menciona la importancia de contextualizar lo que se va a ver antes de mostrarlo.

- Uso y evaluación de métricas: Hay cierta crítica generalizada al uso de métricas poco robustas como el número de commits. Se sugiere en su lugar usar herramientas como Zenhub para tener métricas más sólidas. También se valora cuando se mide la trazabilidad de los problemas y el rendimiento.

- Gestión del feedback de usuarios piloto: Se valora mucho cuando los equipos recogen bien el feedback de usuarios piloto y lo utilizan de forma activa para pivotar o mejorar. Al mismo tiempo, se señala como área de mejora la necesidad de sacar mayor provecho de esa información (más cantidad, más profundidad).

**Puntos de fortaleza general en los equipos**

- Buen uso del storytelling en los storyboards los dirigidos a usuarios.

- Esfuerzo por hacer presentaciones dinámicas, con demos entretenidas.

- Uso de herramientas de trazabilidad y planificación, como Zenhub, gráficos de rendimiento, o métricas visuales.

**Áreas de mejora recurrentes**

- Mejorar la visibilidad de las demos: añadir zoom, eliminar partes irrelevantes o acelerar con cortes.

- Incluir más datos cuantitativos en el storyboard de inversores.

- Evitar métricas engañosas o poco relevantes como commits para evaluar el rendimiento.

- Aprovechar mejor el feedback de usuarios piloto: obtener más respuestas, analizarlas mejor, y aplicarlas al producto.

- Agilizar la demo y adecuarla al público objetivo.

- Revisar el análisis de costes.


<br>

**¿Qué estamos haciendo bien en comparación con otros?**

- Alta profesionalidad: Se ha destacado que tanto la presentación, como la demo y el anuncio final están a un nivel muy profesional, algo que no todos los grupos han logrado.

- Demo muy sólida: A diferencia de otros grupos, donde se critica la falta de zoom o el ritmo demasiado rápido, nuestra demo ha sido muy bien valorada.

- Elevator pitch y killer opener sólidos: Se ha confirmado que funcionan bien, por lo que no es necesario reinventarlos cada semana.

- Gestión adecuada de la complejidad técnica: A pesar de tener una funcionalidad más compleja que otros grupos, la hemos sabido llevar muy bien, lo cual se ha valorado especialmente.

**¿Qué aspectos debemos mejorar respecto a los demás?**

- Análisis de coste más riguroso: Se nos ha señalado que la gráfica de análisis de coste según HU es algo confusa. Otros grupos también tienen este problema, pero deberíamos ser de los que lo resuelven con más claridad.

- Feedback de usuarios piloto: Debemos trabajar en tener la aplicación funcionando mucho antes para ampliar las respuestas de ese feedback.

- Explorar vías de mejora en el storytelling hacia inversores: Al igual que todos, podemos reforzar nuestro storyboard de inversores incluyendo cifras claras de inversión y retorno.

<br>

## Discusión para la siguiente clase.

- Simplemente se ha destacado lo bien que se han hecho las demos.

#### PRÓXIMA SEMANA

- Introducción:

    - Killer opener de 1 minuto.

    - Elevator pitch de 30 segundos.

    - Presentar los competidores más al grano.

    - Storyboards.

    - Customer agreement, licencias, términos y condiciones del servicio, evitar cláusulas abusivas, acuerdos de nivel de servicio, implicaciones otras apis, pricing, gdpr.

    - TCO, CapEx OpEx, github, optimista, realista y pesimista. Mejorar con el feedback dado.

    - Equipo igual: resumen, roles, commitment agreement status (ver si se está cumpliendo).

- Demo

    - Mejorar la calidad visual y auditiva, así como una buena diferenciación de roles: usar distintas voces si hay distintos usuarios.

- Prototipo: decir si ha mejorado la usabilidad o interfaz (experiencia de usuario) y decir lo que estamos haciendo para tratar las regulaciones.

- Retrospectiva 40%-50%

    - Casi lo mismo.

    - Añadir gráficas rendimiento/esfuerzo: Mucho esfuerzo poco rendimiento, poco esfuerzo mucho rendimiento, etc.

    - Gráficas rendimiento personal, análisis software.

    - En el apartado de Problemas igual pero decir, además del problema, el estado de este (si es de antes, solucionado, no solucionado, etc), las acciones concretas y ver alguna forma de evaluar esa solución. Analizar las soluciones. Añadir unas lecciones aprendidas del análisis.

- Gestión de usuarios piloto: Nada nuevo parece.

    - Gestión del feedback, comunicación.

- Retrospectiva sprint 3:

	- Análisis de código, rendimiento, problemas encontrados. Hay que decir cómo van las soluciones, hay que explicar para cada problema las acciones CONCRETAS (no mejorar las cosas, no reunirnos más, si puede ser reunirnos una vez más para reducir x) y después el cómo sabéis que está funcionando (poniendo medidas como el número diario de pull requests) hay que poner un objetivo (medir si la media de pull requests es tanto, ese sería el objetivo, dentro de x días, así sí se puede decir si están funcionando o no).

		- Los problemas se repiten, hay que tomarse en serio el cómo se mide.

	- Hacer plan de pruebas previo al WPL.

- Reloj.

- Acciones en un ranking que se va a hacer, categorizar el feedback y priorizarlo.

- Replanificación con los apartados de seguridad.

- Entrega PPL: publicidad, de cara al lanzamiento y refinamiento del MVP.

- Uso de la IA:

    - Decir que si se ha mejorado el uso de la IA desde el principio, lecciones aprendidas, alucinaciones. 

    - Evitar generalizaciones.

- Diapositiva final.

NUEVO: anuncio en video, demo hincapié en regulaciones y usabilidad, plan de pruebas para el WPL, seguimiento cuantitativo de la evaluación de las soluciones a problemas, categorización del feedback, y lo dicho en la entrega para el PPL.

# **CONCLUSIONES Y OBSERVACIONES**

- El feedback global es muy positivo hacia nuestro grupo (Fisio Find), destacando la profesionalidad, la calidad de la demo, la organización y el cuidado en los detalles. Esto nos sitúa como uno de los equipos con mayor madurez en la presentación del proyecto.

- A nivel general, se observan tendencias comunes en los comentarios de los profesores, como la necesidad de mejorar los storyboards para inversores, el uso adecuado de métricas de rendimiento, y la optimización de las demos (más zoom, cortes, menos aceleración).

- Nuestro grupo ha acertado en muchas decisiones clave, como mantener un killer opener sólido, diferenciar claramente entre demo y anuncio, y gestionar con éxito una funcionalidad técnicamente compleja. Todo esto genera una imagen de equipo profesional y bien cohesionado.

- Aunque la respuesta de los usuarios piloto ha sido baja, se reconoce que se debe a factores logísticos (poco margen de tiempo). Aun así, mejorar la recolección y explotación del feedback de usuarios será clave para próximos sprints.

- El análisis de costes y las métricas de esfuerzo pueden reorganizarse y clarificarse, diferenciando claramente la autoevaluación del esfuerzo de las métricas objetivas de rendimiento. Esto evitará confusiones y dará mayor solidez al apartado de análisis del equipo.

- Incluir datos cuantitativos en el storyboard de inversores (costes, beneficios, proyección de mercado) es un paso necesario para estar al nivel de exigencia que se ha planteado de forma transversal en todos los equipos.

- Si bien el feedback sugiere que no hace falta cambiar elementos que funcionan bien (como el killer opener), debemos estar atentos a que el mensaje siga conectado con el progreso del proyecto y no pierda actualidad o coherencia con el avance técnico.

<br>

# 6.2. Feedback del día 21/03/2025 (semana 7)

# **1. RESUMEN DEL FEEDBACK POR GRUPO**

## **Primer grupo (Holos):**
**Feedback alumnos**

- Muy bien el cambio de horas.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Los costes se pueden explicar mejor. No se ha puesto el % de clientes.

- La demo al principio no se oye bien, y deberían hacer más zoom. También era complicada de seguir. Necesita fluir de una manera más natural.

- Las métricas están puestas sin valor en el SLA.

- No han empezado con el testing (el testing salva entregas).

- El anuncio no ha convencido, la temática era complicada, no bien hilada. Hay que medir bien el humor.

- La presentación va en buena dirección (visualmente).

- En cuanto los problemas, han seguido el guión propuesto por los profesores, pero no han logrado indagar en aquellos puntos que deberían ser tratados con más detalle. 

- Mejora continua, hay una mejora en cuanto a decir las soluciones y cosas así. Sin embargo, algunas medidas no son concretas.

- No dar por asumido algunos conceptos impartidos en otras asignaturas.

- Las presentaciones tienen que ser entendibles por alguien de fuera de la asignatura (por ejemplo, los costes).

- Usuarios piloto, parece no aparecer el feedback específico que han causado acciones específicas, que es algo necesario de la mejora continua.

**Puntos positivos destacados**

- Buena presentación (visualmente).

- Han mejorado en la manera de contar soluciones.

**Áreas de mejora sugeridas**

- Costes.

- Empezar el testing.

- Darle vuelta a los anuncios.

- Presentaciones entendibles de fuera de la asignatura.

- Más importancia a la mejora continua.

<br>

## **Segundo grupo (Gastrostock):** 
**Feedback alumnos**:

- El anuncio está chulo.

**Feedback recibido (resumen de los comentarios de los profesores)**

- ¿La app lleva control de cuánto tiempo llevan los productos? Sí.

- Las gráficas de costes deberían estar en solo una diapositiva.

- Anuncio muy bueno. Pero el caso que se ha dado quizás no es el más indicado al no ser el más realista.

- Han puesto sprint 2 en algun sito que debería de estar sprint 3.

- No se han cumplido las horas mínimas en el sprint.

- Algunos clientes pilotos ya no están contestando.

- La gráfica de rendimiento/esfuerzo es preocupante (para las personas que no se esfuercen).

- Cuidado con las imágenes con copyright.

- El volumen de mercado en los hitos parece faltar.

- No se llega a transmitir la funcionalidad principal parece. Deberían priorizar esto (si la funcionalidad es hacer inventario, para eso puedes hacerte un excel, la funcionalidad podría ser que sea súper fácil en la app).

**Puntos positivos destacados**

- Muy buen anuncio.

**Áreas de mejora sugeridas**

- Agrupar los costes.

- Buscar realismo en los anuncios.

- Cumplir con las horas mínimas.

- Cuidado con el copyright.

- Transmitir correctamente la funcionalidad principal.

<br>

## **Tercer grupo (Eventbride):** 
**Feedback alumnos**

- El killer opener muy entretenido.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Muy buen inicio efectivo.

- Anuncio: música alta, voz baja, popurrí de cosas que se puede hacer largo. Empieza hablando sobre la app como si fuera para un usuario, después gastos demasiado internos (a un inversor quizás no le interesa), y vuelven hablar de la app. Hay que centrarse más en análisis de mercado, el nicho y cómo va a crecer en los próximos meses: invierte tanto, gana tanto en X meses.

- Visualmente muy bueno el anuncio, pero hay que hacer más hincapié en el beneficio, quizás dando ejemplo. Se suele hacer respecto a % de acciones. El inversor en principio solo quiere saber cuánto tiene que meter y cuánto va a sacar (y el por qué va a ser bueno).

- Muy buen SLA, pero ha tardado mucho en decirlo (a partir de la semana que viene puede omitirse).

- Hay que poner datos realistas (a partir de un análisis) en el plan de costes y en el anuncio de inversores.

- Demo, no se ve muy bien. Debería ser más rápido el formulario. El narrador tiene que explicar lo que hay en pantalla si no se ve bien.

- Diapositiva de problemas ha ido demasiado rápido, no ha visto la evolución.

- Alegra que estén orgullosos con el equipo.

**Puntos positivos destacados**

- Muy buen inicio efectivo.

- Anuncio muy bueno visualmente.

- Alegra que estén orgullosos con el equipo.

- Muy buen SLA.

**Áreas de mejora sugeridas**

- El contenido del anuncio.

- Datos realistas en costes e inversores.

- Demo mejorable.

<br>

## **Cuarto grupo (BORROO):** 
**Feedback alumnos**

- Intencionalmente en blanco.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Cuidado con el uso de muletillas.

- Buen Killer Opener, pero mejorar la conexión con el elevator pitch.

- Elevator Pitch algo más largo, deberían encontrar un mantra de Borroo.

- El anuncio genial, muy profesional.

- En los costes deberían poner el número de usuarios según el tipo de caso en el que estamos: pesimista, optimista y realista.

- Falta recalcar en la demo la mejora en la experencia de usuario, ya que dicha mejora viene por el feedback dado de los usuarios piloto.

- Bien hecho al usar Selenium.

- En el feedback de los usuarios piloto han mezclado clasificaciones, como el tipo de feedback con la prioridad.

**Puntos positivos destacados**

- Buen inicio efectivo.

- Anuncio genial.

- Buen uso de Selenium.

**Áreas de mejora sugeridas**

- No usar muletillas.

- Conectar killer opener con elevator pitch.

- Elevator pitch algo más largo.

- Recalcar en la demo la mejora en la experiencia de usuario.

- No mezclar clasificaciones en el feedback de los usuarios piloto.

- Poner número de usuarios en los costes.

<br>

## **Quinto grupo (CAMYO):** 
**Feedback alumnos**:

- Intencionalmente en blanco.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Inicio muy bueno con como un anuncio.

- Maria y Claudia presentan muy bien.

- El número de empresas de transportistas no es una suposición y se debería poner como tal.

- La demo parece que no es demo pero si lo es. Algo corta de funcionalidad.

- En cuanto a la persona que no se esfuerza, esa persona debe mejorar.

- En problemas, habría que hacer un poco más de hincapié.

- Feedback usuarios piloto, no está puesto cuanto feedback reciben de cada tipo.

- Cambio positivo a lo largo del tiempo.

- Cambiar el uso de ciertos gráficos que no son claros indicadores de lo que se quiere expresar.

- Respecto a la mejora continua, antes de la trazabilidad está el objetivo y el periodo (cuando quieren alcanzar el objetivo). No solo debería aplicarse a problemas sino también a mejoras.

- En algunas diapositivas reducir al máximo el texto y más metáforas gráficas.

- Métricas de calidad tienen que estar en perspectiva (venimos de aquí y vamos aquí y queremos ir hacia allá).


**Puntos positivos destacados**

- Inicio muy bueno.

- Los presentadores presentan muy bien.

**Áreas de mejora sugeridas**

- No indicar datos aproximados como suposiciones.

- La demo necesita mostrar más funcionalidad.

- Más hincapié en los problemas.

- Mejorar la trazabilidad.

- Cambiar las gráficas que no expresen claramente lo que se dea transmitir.

- Reducción de texto y más metáforas gráficas.

- Métricas de calidad en perspectiva.

<br>

## **Sexto grupo (FISIO FIND):** 
**Feedback alumnos**

- Enhorabuena por el anuncio.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Guadalupe y Antonio presentan de manera inmejorable. Mezclan comunicación y chascarrillos perfectamente.

- Inicio efectivo no estridente pero muy buena forma de captar al público porque la gente puede empatizar. Empieza con tono muy bueno y muy claro. 

- La forma de presentar el equipo es perfecta.

- En el PPL hay muchas tareas de implementación, cuando en este caso hay que hacer tareas de marketing.

- En la demo, muy bien las mejoras de UX, pero te puedes perder un poco por el cambio entre tipos de usuario, la mejor forma es poniendo un icono. Quizás un poco más lenta la mejoraría.

- Demo muy profesional, en funcionalidad y apariencia (demasiadas horas en el grupo), pero resultado muy profesional.

- No es realista que todos los usuarios tengan la misma foto de perfil.

- De los costes, estimación de beneficios, la curva de costes solo hay punto de corte con la optimista, no hay con esperada y pesimista. Ayuda sobre todo en el esperado.

- Customer agreement, en el SLA no hemos hablado demasiado, falta de priorización del feedback de usuarios piloto.

- Si el feedback se ha priorizado hay que decirlo, aunque sea muy general.

**Puntos positivos destacados**

- Muy buenos presentadores.

- Inicio efectivo muy bueno y claro.

- Presentación del equipo perfecta.

- Demo muy profesional.

**Áreas de mejora sugeridas**

- En el PPL debe haber tareas de marketing.

- Usar iconos para distintos usuarios en la demo.

- Todos los usuarios con la misma foto de perfil no queda realista.

- Mejorar la curva de costes.

- Priorizar el feedback de usuarios piloto.

<br>


# **ANÁLISIS DEL FEEDBACK**

## **TENDENCIAS GENERALES**
**Factores comunes en los comentarios de los profesores**

- Muchas presentaciones tienen buenos inicios o killer openers, lo que indica que los grupos están mejorando en captar la atención desde el principio.

- En varios casos, los anuncios están bien producidos visualmente, pero el contenido necesita mejor enfoque (realismo, claridad de mensaje).

- La demo es un punto crítico en todos los grupos: suele haber problemas de ritmo, claridad o visibilidad.

- Falta claridad en las métricas (costes, calidad, beneficios, etc.) y en cómo estas se comunican.

- La mejora continua se menciona como un área donde se ha mejorado, pero aún falta trazabilidad clara y priorización del feedback.

- Se detectan errores comunes como uso de suposiciones sin justificar, gráficos poco claros o confusión en los tipos de feedback de usuarios piloto.

**Puntos de fortaleza general en los equipos**

- Presentaciones visuales bien cuidadas.

- Mejora progresiva en la estructura de los discursos.

- Se nota esfuerzo en la parte de producción audiovisual (anuncios, intros).

- Capacidad de trabajar en equipo y demostrar orgullo por el trabajo realizado.

**Áreas de mejora recurrentes**

- Justificación realista de costes y beneficios.

- Priorización y trazabilidad del feedback de usuarios piloto.

- Claridad y enfoque en los anuncios.

- Mayor realismo en demos (escenarios, tiempos, datos, imágenes...).

- Menor dependencia de suposiciones no sustentadas.

- Evitar jergas internas o conceptos no explicados para audiencias externas.

<br>

## **COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**

**¿Qué estamos haciendo bien en comparación con otros?**

- Presentadores muy sólidos: Guadalupe y Antonio destacan por una comunicación excelente, equilibrando profesionalidad con un toque cercano y entretenido.

- Inicio efectivo muy bueno, que logra captar la atención del público sin ser estridente.

- Presentación del equipo especialmente bien realizada, con claridad y simpatía.

- Nuestra demo destaca como una de las más profesionales en términos de funcionalidad, fluidez y diseño visual.

- El anuncio ha gustado tanto al público como al profesorado, lo cual no ha sido tan común en otros grupos.

- A diferencia de otros grupos, no se nos han señalado problemas con el killer opener ni con la claridad general de la presentación.

**¿Qué aspectos debemos mejorar respecto a los demás?**

- PPL poco equilibrado: demasiadas tareas técnicas, falta incluir más acciones de marketing (otros grupos también tienen este error, pero debemos corregirlo).

- La demo, aunque profesional, puede mejorar en usabilidad (por ejemplo, uso de iconos para diferenciar roles) y ritmo narrativo.

- Realismo visual: todos los usuarios tenían la misma foto, lo cual rompe la ilusión de diversidad.

- Curva de costes y beneficios: falta mostrar el punto de equilibrio para todos los escenarios (pesimista, esperado y optimista).

- No se está priorizando explícitamente el feedback de usuarios piloto en el SLA ni en la mejora continua, o al menos no se comunica claramente.

- Aunque estamos muy bien posicionados, debemos cuidar los detalles de fondo y el storytelling estratégico para diferenciarnos todavía más.

<br>

## Discusión para la siguiente clase.

- Simplemente se ha destacado lo bien que se han hecho las demos.

#### PRÓXIMA SEMANA

- Introducción:

    - Killer opener de 1 minuto.

    - Elevator pitch de 30 segundos.

    - Presentar los competidores más al grano.

    - Anuncio de otro target. Puede haber dos anuncios.

    - TCO, CapEx OpEx, github, optimista, realista y pesimista. Mejorar con el feedback dado.

    - Equipo igual: resumen, roles, commitment agreement status (ver si se está cumpliendo). Hay que meter roles de gestion del marketing: community manager y generales

- Demo

    - Mejorar la calidad visual y auditiva, así como una buena diferenciación de roles: usar distintas voces si hay distintos usuarios.

- Prototipo: decir si ha mejorado la usabilidad o interfaz (experiencia de usuario) y decir lo que estamos haciendo para tratar las regulaciones.

- Retrospectiva 40%-50%

    - Casi lo mismo.

    - Añadir gráficas rendimiento/esfuerzo: Mucho esfuerzo poco rendimiento, poco esfuerzo mucho rendimiento, etc.

    - Gráficas rendimiento personal, análisis software.

    - En el apartado de Problemas igual pero decir, además del problema, el estado de este (si es de antes, solucionado, no solucionado, etc), las acciones concretas y ver alguna forma de evaluar esa solución. Analizar las soluciones. Añadir unas lecciones aprendidas del análisis.

- Gestión de usuarios piloto: Nada nuevo parece.

    - Gestión del feedback, comunicación.

- Retrospectiva sprint 3:

    - Análisis de código, rendimiento, problemas encontrados. Hay que decir cómo van las soluciones, hay que explicar para cada problema las acciones CONCRETAS (no mejorar las cosas, no reunirnos más, si puede ser reunirnos una vez más para reducir x) y después el cómo sabéis que está funcionando (poniendo medidas como el número diario de pull requests) hay que poner un objetivo (medir si la media de pull requests es tanto, ese sería el objetivo, dentro de x días, así sí se puede decir si están funcionando o no).

        - Los problemas se repiten, hay que tomarse en serio el cómo se mide.

    - Hacer plan de pruebas previo al WPL.

- Reloj.

- Acciones en un ranking que se va a hacer, categorizar el feedback y priorizarlo.

- Replanificación con los apartados de seguridad.

- Entrega PPL: publicidad, de cara al lanzamiento y refinamiento del MVP.

- Tareas de marketing preliminares, gestión de la atracción inicial en el mercado.

- Uso de la IA:

    - Decir que si se ha mejorado el uso de la IA desde el principio, lecciones aprendidas, alucinaciones. 

    - Evitar generalizaciones.

- Diapositiva final.

NUEVO: anuncio diferente, tareas de marketing, customer agreement puede no ponerse.

preguntas alumos/respuesta:

- Si se necesita contratar a alguien de asesoramiento también se pone en costes de marketing.

- En anuncio de inversores, poner cuanto necesitaríamos. Hay que valorar cuanto cuesta nuestro sistema, ver aplicaciones parecidas, interés al tiempo, etc. Se puede preguntar a Jose María que parece que lo entiende.

- Lo que hay que hacer es un plan de negocio, para ser rentable de tal manera se necesita tanto dinero. Lo que hay que hacer es plantear el escenario de los inversores, estudiando cual nos rentaría.

- Lo que vale la app no es solo el capex, necesita una valoración: nosotros valoramos nuestra aplicación con lo que hemos invertido y nada más (sería poco), también hay que valorar el conocimiento adquirido mientras se desarrolla. Hay que decir las acciones que se van a tomar en ese plan de negocio, cómo llegar a esos objetivos, lo que hay que decir es cómo se va a conseguir el dinero: inversiones, préstamos, crédito a fondo perdido, etc. También hay que decir lo que conseguiría el inversor.


# **CONCLUSIONES Y OBSERVACIONES**

- El feedback recibido sitúa a Fisio Find como uno de los grupos con mayor grado de madurez en la presentación del proyecto. Se valora especialmente la calidad profesional de la demo, la claridad en la exposición, y el dominio escénico de los presentadores, elementos que transmiten solidez y confianza en el producto.

- A nivel general, los comentarios reflejan la necesidad común de reforzar aspectos como la claridad en las métricas (especialmente de costes y beneficios), la trazabilidad del feedback, y la coherencia en los anuncios (en cuanto a mensaje, realismo y foco en la funcionalidad principal). Esto refuerza la idea de que no solo importa la forma, sino también la profundidad del contenido.

- Nuestro equipo ha acertado en decisiones estratégicas como mantener un inicio empático y eficaz, cuidar el detalle visual de todos los elementos, y realizar una demo técnicamente elaborada. Además, hemos sabido separar correctamente la estructura narrativa entre pitch, demo y anuncio, lo que ha facilitado la comprensión.

- Un punto a reforzar es la gestión del feedback de usuarios piloto: aunque se ha recogido y aplicado, no se ha priorizado ni mostrado con suficiente claridad. Esto es clave para evidenciar mejora continua de forma tangible y demostrar que el desarrollo responde a necesidades reales.

- También debemos replantear el análisis de costes y beneficios, asegurándonos de incluir todos los escenarios (pesimista, esperado, optimista) con sus correspondientes puntos de equilibrio. Además, es importante que los datos transmitan realismo y coherencia con la estrategia de crecimiento.

- La diferenciación visual de tipos de usuario en la demo, junto con un ritmo narrativo más pausado y explicativo, puede ayudar a que el mensaje se entienda mejor sin necesidad de detenerse a interpretar lo que se ve.

- Finalmente, aunque algunos elementos como el killer opener están muy bien ejecutados, es importante revisar su coherencia con el avance del proyecto para que no pierdan fuerza ni se desvinculen del mensaje global. La narrativa debe evolucionar al mismo ritmo que el producto.
