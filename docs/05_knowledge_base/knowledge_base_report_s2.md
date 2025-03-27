---
title: "REPORTE BASE DE CONOCIMIENTO #SPRINT 2"            # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 2"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "26/03/2025"                                          # CHANGE IF NEEDED
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
header-left: "REPORTE BASE DE CONOCIMIENTO #SPRINT 2"       # CHANGE IF NEEDED
header-right: "26/03/2025"                                  # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"  
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  REPORTE BASE DE CONOCIMIENTO #SPRINT 2
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
    - [3.2.8. Sprint 1](#328-sprint-1)
  - [3.2 USO Y GESTIÓN GENERAL](#32-uso-y-gestión-general)
- [4. CONTRIBUCIONES DEL EQUIPO](#4-contribuciones-del-equipo)
  - [4.1. CONTRIBUCIONES A LA BASE DE CONOCIMIENTO GRUPAL](#41-contribuciones-a-la-base-de-conocimiento-grupal)
    - [4.1.1. Organización](#411-organización)
    - [4.1.2. Planificación](#412-planificación)
    - [4.1.3. Informes](#413-informes)
    - [4.1.4. Seguimiento](#414-seguimiento)
    - [4.1.5. Recursos (Conocimiento base en el repositorio oficial de Fisio Find)](#415-recursos-conocimiento-base-en-el-repositorio-oficial-de-fisio-find)
    - [4.1.6. Ideando un proyecto](#416-ideando-un-proyecto)
    - [4.1.7. Términos](#417-términos)
    - [4.1.8. Sprint 1](#418-sprint-1)
  - [4.2 CONTRIBUCIONES A LA BASE DE CONOCIMIENTO GENERAL](#42-contribuciones-a-la-base-de-conocimiento-general)
  - [4.2.1. Feedback individual del grupo 6](#421-feedback-individual-del-grupo-6)
    - [Semana 6](#semana-6)
      - [Feedback relacionado con la presentación](#feedback-relacionado-con-la-presentación)
      - [Feedback relacionado con el desarrollo del proyecto](#feedback-relacionado-con-el-desarrollo-del-proyecto)
      - [Tareas a realizar para la siguiente semana](#tareas-a-realizar-para-la-siguiente-semana)
    - [Semana 7](#semana-7)
      - [Feedback relacionado con la presentación](#feedback-relacionado-con-la-presentación-1)
      - [Feedback relacionado con el desarrollo del proyecto](#feedback-relacionado-con-el-desarrollo-del-proyecto-1)
      - [Tareas a realizar para la siguiente semana](#tareas-a-realizar-para-la-siguiente-semana-1)
  - [4.2.2. Aportaciones generales](#422-aportaciones-generales)
    - [Apartado Presentaciones](#apartado-presentaciones)
      - [Semana 10/03](#semana-1003)
    - [Apartado Idea de Negocio](#apartado-idea-de-negocio)
      - [Semana 03/02](#semana-0302)
      - [Semana 10/03](#semana-1003-1)
- [5. ACCIONES TOMADAS A PARTIR DEL FEEDBACK](#5-acciones-tomadas-a-partir-del-feedback)
  - [5.1. Resumen de mejoras tras el feedback del 14/03/2025](#51-resumen-de-mejoras-tras-el-feedback-del-14032025)
    - [5.1.1. Redefinición de las estimaciones](#511-redefinición-de-las-estimaciones)
    - [5.1.2. Mecanismo de puntos, asvisos y penalizaciones](#512-mecanismo-de-puntos-asvisos-y-penalizaciones)
    - [5.1.3. Historias de usuario provenientes de feedback](#513-historias-de-usuario-provenientes-de-feedback)
  - [5.2. Resumen de mejoras tras el feedback del 07/03/2025](#52-resumen-de-mejoras-tras-el-feedback-del-07032025)
    - [5.2.1. Request for Change](#521-request-for-change)
    - [5.2.2. Rendimiento del equipo](#522-rendimiento-del-equipo)
    - [5.2.3. Gráficas](#523-gráficas)
- [**6. ANEXO - RESUMEN DEL FEEDBACK POR GRUPO**](#6-anexo---resumen-del-feedback-por-grupo)
    - [6.1. Feedback del día 14/03/2025 (semana 6)](#61-feedback-del-día-14032025-semana-6)
- [**1. RESUMEN DEL FEEDBACK POR GRUPO**](#1-resumen-del-feedback-por-grupo)
  - [**Primer grupo (Holos):**](#primer-grupo-holos)
  - [**Segundo grupo (Gastrostock):**](#segundo-grupo-gastrostock)
  - [**Tercer grupo (Eventbride):**](#tercer-grupo-eventbride)
  - [**Cuarto grupo (BORROO):**](#cuarto-grupo-borroo)
  - [**Quinto grupo (CAMYO):**](#quinto-grupo-camyo)
  - [**Sexto grupo (FISIO FIND):**](#sexto-grupo-fisio-find)
- [**ANÁLISIS DEL FEEDBACK**](#análisis-del-feedback)
  - [**TENDENCIAS GENERALES**](#tendencias-generales)
  - [**COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**](#comparación-del-feedback-de-nuestro-grupo-vs-los-otros)
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
  - [**COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**](#comparación-del-feedback-de-nuestro-grupo-vs-los-otros-1)
  - [Discusión para la siguiente clase.](#discusión-para-la-siguiente-clase-1)
      - [PRÓXIMA SEMANA](#próxima-semana-1)
- [**CONCLUSIONES Y OBSERVACIONES**](#conclusiones-y-observaciones-1)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 2

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Alberto Carmona Sicre](https://github.com/albcarsic) (autor), [Antonio Macías Ferrera](https://github.com/antoniommff) (autor), [Delfín Santana Rubio](https://github.com/DelfinSR) (revisor)

- **Fecha de Creación:** 26/03/2025

- **Versión:** v1.1

<br>


---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 26/03/2025 | v1.0    | Alberto Carmona Sicre | Creación del informe de base de conocimiento del sprint 2. |
| 27/03/2025 | v1.1    | Alberto Carmona Sicre | Modificación de distintos apartados. |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  

La base de conocimiento ha sido desarrollada siguiendo las directrices establecidas en nuestro Acuerdo de Base de Conocimiento. Cada acción realizada ha sido regulada conforme a sus disposiciones. En este documento puede encontrar la información correspondiente al sprint 2.

Importante: el repositorio de documentación en el que se suben los documentos generados durante los sprints no se actualiza directamente tras la creación de un archivo, sino que se va actualizando una vez se conoce que los archivos van a dejar de ser modificados, para así evitar trabajo extra innecesario a los responsables de poblar dicho repositorio.

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

- En los apartados **Sprint 1** y **Sprint 2**, se almacenan los informes relacionados con el sprint en sí (planificación, retrospectiva, etc.). Documentos como la retrospectiva se encargaron al equipo de **QA**, mientras que la **planificación** fue responsabilidad del **Scrum Master**.

### 3.2.5. Recursos

- La gestión de la carpeta **Recursos** siguió la siguiente dinámica: los **Secretarios** y el **Scrum Master** fueron los encargados de añadir los informes de **feedback**, las notas sobre las **píldoras teóricas** y otros documentos relevantes, como el Informe de Base de Conocimiento.

### 3.2.6. Ideando un proyecto

- En la carpeta **Ideando un proyecto** simplemente se pueden encontrar juntos todos los documentos generados durante esta fase inicial del proyecto.

### 3.2.7. Términos

- En esta carpeta se pueden encontrar todos los documentos relacionados con los términos y condiciones, la privacidad, las cookies y las licencias. Los encargados de la elaboración de estos fueron el **Scrum Master**, Antonío Macías, el **Secretario** Delfín Santana y Daniel Ruiz.

### 3.2.8. Sprint 1

- En la carpeta **Sprint 1** simplemente se pueden encontrar juntos todos los documentos generados o modificados durante esta fase: Reporte de la base de conocimiento, Acuerdo de compromiso, Uso de la IA, etc.

<br>

Los documentos e informes no se incluyen directamente en la base de conocimiento, sino que se van subiendo al apartado docs del repositorio oficial de código de [Fisio Find](https://github.com/Proyecto-ISPP/FISIOFIND/tree/main/docs), que cuenta con una estructura ampliamente parecida a la base de conocimiento, para así mantener un orden de los documentos que se van finalizando a lo largo del desarrollo. Una vez los documentos son finalizados, dos responsables, Rafael Pulido y Daniel Ruiz, se encargan de lo siguiente:

- Se aseguran de que los documentos añadidos en el repositorio oficial de código de **Fisio Find** estén correctamente reflejados en la base de conocimiento.  

- También supervisan la correcta visualización de la página web asociada.

<br>

De nuevo, este esquema ha permitido **optimizar la documentación**, asignar responsabilidades de manera eficiente y garantizar un acceso ordenado a la información a lo largo del desarrollo del proyecto.

## 3.2 USO Y GESTIÓN GENERAL

En la base de conocimiento general de la asignatura, dentro de la sección correspondiente a nuestro grupo (Grupo 6), se ha ido incorporando semanalmente el feedback recibido tanto de nuestros docentes como de nuestros compañeros. Este feedback abarca tanto la evaluación de nuestro propio grupo como la de los otros once grupos.

Se ha elegido al secretario Alberto Carmona como responsable de actualizar la base de conocimiento general de la asignatura.


<br>

# 4. CONTRIBUCIONES DEL EQUIPO

## 4.1. CONTRIBUCIONES A LA BASE DE CONOCIMIENTO GRUPAL

A continuación, se muestran las contribuciones del equipo a la base de conocimiento grupal durante la elaboración del Sprint 2, dividido en las secciones: Organización, Planificación, Informes, Seguimiento y Recursos.

### 4.1.1. Organización

- Modificación del Acuerdo de compromiso.

- Añadido el documento Acuerdo de Nivel de Servicio.

### 4.1.2. Planificación

- Modificación del Plan de Gestión de la Configuración.

### 4.1.3. Informes

- Informe de tiempo del Sprint 1 (21/02/2025 - 13/03/2025).

- Informe de tiempo del Sprint 2 (14/03/2025 - 27/03/2025).

<br>

- Informe de IA del sprint 1 (21/02/2025 - 13/03/2025).

- Informe de IA del sprint 2 (14/03/2025 - 27/03/2025).

<br>

- Informe de usuarios piloto del sprint 1 (21/02/2025 - 13/03/2025).

- Informe de usuarios piloto del sprint 2 (14/03/2025 - 27/03/2025).

<br>

- Informe de la calidad del Sprint 1 (21/02/2025 - 13/03/2025).

- Informe de la calidad del Sprint 2 (14/03/2025 - 27/03/2025).

<br>

- Informe de seguridad 2025-03-27 ZAP.

- Informe de seguridad.

### 4.1.4. Seguimiento

- Acta de reunión del día 19 de marzo de 2025.

- Planificación del Sprint 2.

- Retrospectiva global del Sprint 2.

- Retrospectiva del Sprint del grupo 1.

- Retrospectiva del Sprint del grupo 2.

- Retrospectiva del Sprint del grupo 3.

- Retrospectiva de mitad del Sprint 2.

### 4.1.5. Recursos (Conocimiento base en el repositorio oficial de Fisio Find)

- Feedback de la clase del día 14 de marzo de 2025.

- Feedback de la clase del día 21 de marzo de 2025.

- Informe de la base de conocimiento del Sprint 2.

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

<br>

Para consultar la documentación, visita [Documentación Fisio Find](https://fisiofind.vercel.app/docs/Inicio). En esta sección, encontrarás un panel lateral izquierdo que muestra todos los documentos subidos. Si desea una versión actualizada en todo momento, acceda al siguiente enlace con el apartado de documentos del [repositorio oficial de Fisio Find](https://github.com/Proyecto-ISPP/FISIOFIND/tree/main/docs).


## 4.2 CONTRIBUCIONES A LA BASE DE CONOCIMIENTO GENERAL

A continuación, se muestran las contribuciones a la base de conocimiento general. Cabe destacar que, para los demás grupos, el feedback es igual al que se añade en el feedback de la base de conocimiento grupal, por lo que solo se va a añadir el feedback del grupo 6. Además, aunque resulte parecida, la información añadida en la base de conocimiento general tiene una estructura parecida pero diferente a la recogida en el feedback grupal, por ello, este feedback individual si se muestra como parte de una contribución a nivel general.

## 4.2.1. Feedback individual del grupo 6

En este apartado se encuentra la información relacionada con el feedback de las semanas 6 y 7.

### Semana 6
#### Feedback relacionado con la presentación

- Han empezado muy rápido. Al final también fue rápido.

- Muy profesional el killer opener.

- "Perder un día entero para ir al fisio", poder ver al usuario en el fisio esperando, en vez de simplemente sentado en el suelo del gym (hablando del video).

- El elevator pitch debería de ser un poquito más lento, hay que hacer un buen énfasis en este.

- Muy bien las gráficas de costes, pero la de pesimista debe de ser menos pesimista.

- Más énfasis en porcentaje de suscripción.

- Muy bien que la demo esté hilada con el killer opener. Se ve razonablemente bien, aunque no se ve el epígrafe de cada párrafo.

#### Feedback relacionado con el desarrollo del proyecto

- Muy bien el análisis de rendimiento de los compañeros. Extraño mecanismos de quitar puntos. Deben de funcionar en términos de motivación y no de penalización. Funcionar con strikes, 3 strikes.

- Bien planteado el tema de los riesgos. Hay que decir si son nuevos o son ya identificados. También definir si los problemas son ajenos a los riesgos o no.

- Medir el FAQ, si bajan las dudas o si todas se resuelven está funcionando, si se quedan así y no se responden no funciona.

- ¿El feedback de usuarios piloto se ha implementado? Al principio no, porque esta semana no se ha planteado, pero la siguiente ya sí. Recomendable indicar las HU que provengan de usuarios piloto con algún icono,por ejemplo.

#### Tareas a realizar para la siguiente semana

- Mejorar el énfasis en el elevator pitch.

- Mejorar el mecanismo de puntos.

- Definir si los problemas son ajenos o no a los riesgos.

- Medir el FAQ.

- Considerar el feedback de usuarios piloto e implementarlo a ser posible.

### Semana 7
#### Feedback relacionado con la presentación

- Dani debería hablar con más fuerza.

- Buen inicio efectivo destacando que NO existe en el mercado y por qué nos diferenciamos. Complementando al anuncio de la semana anterior.

- Han respondido al feedback del killer opener.

- Los competidores deben pasar más rápido.

- Buen guiño a las píldoras teóricas.

- Quizás se deberían usar otras gráficas que se dieron en otras asignaturas.

- La gráfica sobre tareas realizadas debería ser de barras, en lugar de área.

- La demo se veía muy pequeña, debería tener audio incluido (diferenciando por rol), los títulos de cada funcionalidad deberían ser estáticos y pequeños que se deberían mostrar más tiempo.

- Muy bien el canal de denuncias.

- ¿Como miden el rendimiento del equipo? Deberian poner cómo se hace. Además de mostrar una gráfica.

- Detallar un poco más la gráfica de evaluación de la calidad.

- Añadir apartado de evolución de los problemas (problema -> métrica -> objetivo -> estado).

- Algunas métricas son objetivos. 

- Se ha mejorado estéticamente la presentación.

- En costes, falta indicar qué porcentaje de fisios tienen qué plan.

#### Feedback relacionado con el desarrollo del proyecto

- Revisar qué es una RfC (debe ser una petición que realiza un usuario para cambiar o añadir funcionalidad).

- Sistema de recompensas: hay que intentar buscar un sistema que no cueste dinero. Por ejemplo, que elija la tarea.

#### Tareas a realizar para la siguiente semana

- Mejorar la presentación y la demo con las varias sugerencias del profesor.

- Realizar una redefinición de lo que es una RfC para usarla en contextos correctos.

- Mejorar el sistema de recompensas.

## 4.2.2. Aportaciones generales

En este apartado se encuentras las aportaciones que se han realizado a la Base de Conocimiento grupal en función de las semanas y puntos que se han pedido según la organización grupal de aportaciones. En concreto, el grupo 6 se hizo responsable de añadir información en los apartados Presentaciones e Idea de negocio durante la semana 10/03, y de las primeras dos semanas en caso de que no hubiese información ya recogida.

### Apartado Presentaciones
#### Semana 10/03

- Mejorar el opener e introducción, fortalecer el inicio de la presentación con un “killer opener” y un "elevator pitch" impactantes que cuenten una historia atractiva, logrando un mayor dinamismo y captación de la atención desde el principio.

- Mejorar el diseño empleando fondos y gráficos que aseguren legibilidad y resalten la información clave (por ejemplo, usando colores llamativos).

- Acortar la duración de la introducción, debe ser más ligera, sin perder el importante énfasis que hay que hacer en esta.

- Incluir en la diapositiva final un enlace a la "landing page" o a la web del proyecto, las posibles redes sociales y un enlace al vídeo demo del proyecto.

- El feedback de los usuarios piloto debe quedar reflejado. Esto es, si hay alguna HU que provenga de algún comentario de los usuarios piloto, debe indicarse en la presentación, por ejemplo, con un icono.

- Es recomendable poner el aumento de características que se dan en los sprints, reflejándose con colores distintos a las características inicialmente pensadas, para que así destaquen más.

- Debe de haber elasticidad en la forma de presentar, tener pensado qué cosas de las que se cuentan sobran, para no perjudicar el ritmo. Se puede volver a transparencias anteriores si sobra tiempo.

- Hay veces que no hay que traducir ciertas expresiones, como code smells -> código que apesta.

### Apartado Idea de Negocio
#### Semana 03/02

- Tener cuidado con las ideas demasiado ambiciosas.

- Hay que tener muy claro nuestros casos de uso y en quénos diferenciamos de los competidores.

- Invertir una gran cantidad de recursos y tiempo en el análisis de competidores para asegurar una solución competitiva es esencial.

#### Semana 10/03

- Al explicar las estimaciones, es necesario indicar con qué usuarios se ha validado, así como hacer un mayor énfasis en los porcentajes de suscripción, si procede.

- En los riesgos, hay que decir si son nuevos o son ya identificados. También definir si los problemas son ajenos a los riesgos o no.

- Hay que tener cuidado con los cambios repentinos de planteamiento del producto a mitad del proyecto, sobre todo si generas dudas al explicarlo en las presentaciones.

<br>

<br>

---

# 5. ACCIONES TOMADAS A PARTIR DEL FEEDBACK

En esta sección se muestra un resumen de las acciones que se han tomado a partir del feedback dado. Se muestra un resumen ya que se entiende que existe un proceso de interiorización del feedback que hace que se tomen acciones de forma inconsciente. Es decir, si por ejemplo se valora mucho una presentación en concreto, lógicamente se va a intentar mejorar dicha presentación en los puntos en los que se haya dado feedback positivo. Se puede obtener un análisis mucho más detallado del feedback y de las presentaciones en los documentos de feedback de nuestra base de conocimiento.

## 5.1. Resumen de mejoras tras el feedback del 14/03/2025

Tras el _feedback_ recibido en la sesión del 14/03/2025, se tomaron medidas para mejorar aquellos aspectos de la presentación que presentaban fallos, al mismo tiempo que se reforzaron los puntos que fueron elogiados.

### 5.1.1. Redefinición de las estimaciones

- Se nos comentó que, en las estimaciones de costes, la estimación pesimista era demasiado pesimista, por lo que se hizo un reajuste para la siguiente presentación teniendo en cuenta este comentario, corrigiéndose este pequeño fallo.

### 5.1.2. Mecanismo de puntos, asvisos y penalizaciones

- Aunque en el feedback del 14/03 se destacó el análisis de rendimiento de los compañeros, se generaron dudas acerca del mecanismo de quitar puntos, por lo que se hizo un reajuste para que se motivase con extras en vez de penalizar con menos puntos. Además, se implementaron los avisos, para no activar las penalizaciones tras el primer fallo.

### 5.1.3. Historias de usuario provenientes de feedback

- Como comentario común, se destacó la importancia de resaltar aquellas historias de usuario provenientes del feedback de los usuarios piloto, por lo que se tuvo en cuenta para la siguiente presentación.

## 5.2. Resumen de mejoras tras el feedback del 07/03/2025

Tras el _feedback_ recibido en la sesión del 07/03/2025, se tomaron medidas para mejorar aquellos aspectos de la presentación que presentaban fallos, al mismo tiempo que se reforzaron los puntos que fueron elogiados.

### 5.2.1. Request for Change

- Se comentó que los Request for Change no se habían realizado en los contextos adecuados, por lo que se realizó una reestructura para que se puedan realizar en los contextos adecuados, y se tuvo en cuenta para futuros sprints.

### 5.2.2. Rendimiento del equipo

- Se hizo hizo hincapié en que debía haber más información acerca del rendimiento del equipo, por lo que se añadieron más diapositivas e información que se adecuase a lo solicitado.

### 5.2.3. Gráficas

- Durante la presentación, también se mencionó la necesidad de una mayor diversidad en el tipo de gráfica usada, por lo que se tuvo en cuenta para la siguiente presentación.

<br>

\newpage

<br>


---

# **6. ANEXO - RESUMEN DEL FEEDBACK POR GRUPO**

### 6.1. Feedback del día 14/03/2025 (semana 6)

# **1. RESUMEN DEL FEEDBACK POR GRUPO**

## **Primer grupo (Holos):**
**Feedback alumnos**

- Han sabido atraer la atención del público desde el principio. Consigue que empaticemos con la solución.

- Bien identificados los problemas.

- Muy buena la estética en general y costes.

- Se mide la satisfacción dentro del grupo, cosa que los profesores recomendaban.
 
**Feedback recibido (resumen de los comentarios de los profesores)**

- Si cuando se pide que se levante la mano nadie la levanta puede quedar mal.

- Muy bueno lo de "tablero scrum para artistas".

- ¿Cómo se rastrean las IAS?  

	- Lo hace con los reportes y los administradores.

- Las estimaciones de costes no están muy claras, el CapEx y el OpEx están un poco liados.

- Muy bien el plan B del video. Iba muy lento y lo han adelantado a mano.

- No se ve del todo bien la demo desde el final.

- Métrica del número de commits muy pervertible, por ejemplo, haciendo muchos commits muy pequeños. Número de commits - entrega de issues.

- ¿Cómo solucionan los problemas? Hay que convertir la solución en una métrica. 

- No han podido desplegar bien. 

- FEEDBACK GENERAL PARA LA CLASE: cuidado con el despliegue por si se acaban los créditos.  


**Puntos positivos destacados**

- Buena estética en general.

- Muy bueno lo de "tablero scrum para artistas".

- Muy bien el plan B del video.

**Áreas de mejora sugeridas**

- Aclarar las estimaciones de costes.

- Demo mejorable visualmente.

- Sustituir la métrica de número de commits.

<br>

## **Segundo grupo (Gastrostock):** 
**Feedback alumnos**:

-	El killer opener muy bien conectado con la gente.

-	Muy bien explicado lo que hacen y los objetivos.

-	Mucha calma a pesar de los errores.

-	Está bien que hayan dicho que tienen muchos problemas sin que les de vergüenza, además de detallar cuales han sido y las soluciones.

- Gráficas muy buenas, color rojo y animaciones bien en conjunto.

**Feedback recibido (resumen de los comentarios de los profesores)**

-	El killer opener está razonablemente bien, se pueden usar memes. Falta sacar alguna sonrisa.

-	Deberían haber dedicado más tiempo a la retrospectiva, que es lo más importante. Que no esté desplegado el producto es muy malo. Hay que comentar más cuáles han sido los problemas y cómo solucionarlos. 

-	Ha habido falta de comunicación clara. Y la solución de hacer un grupo grande no es la mejor. Otros compañeros ya han recibido ese feedback anteriormente.

-	El cambio a TPV genera dudas, el coste del hardware es dudoso, así como los proveedores si no es página web. 

- Explicación PM:

	- Usuarios piloto no quisieron pasar datos reales para la ia. ¿Estaba contemplado en riesgos? Sí, escrepear ¿Se ha empezado a usar?

	- Que sea solo web no funciona en bares porque se debe de usar dos veces. Por eso el TPV.

- Se puede simular la funcionalidad de la IA o pueden crearlos ellos mismos. 

- Cuidado con el lenguaje sexista. Solo se han referido a camareros hombres.

- Las animaciones no pueden fallar. En general deben de tener muchos planes B para que si falla algo se pueda solucionar rápidamente, como venir a reuniones de prueba.

-	Alabar la sinceridad y honestidad al contar los problemas.

- ¿De qué forma se puede castigar?

	- Si alguien tiene una falta grave, haces toda la funcionalidad. Es algo peligroso.

  -	Avisar con tiempo de los strikes.

-	El sprint parece que lleva un progreso de más del 50%.


**Puntos positivos destacados**

- Sinceridad y honestidad.

-	El killer opener está razonablemente bien.

**Áreas de mejora sugeridas**

- Dedicar más tiempo a la retrospectiva.

- Aumentar la comunicación sin formar un grupo grande.

- Funcionalidad de la IA simulable.

- Plan B para las presentaciones.

- Redefinir los castigos y avisos.

<br>

## **Tercer grupo (Eventbride):** 
**Feedback alumnos**

- Inicio efectivo original y bueno. Muy buen diseño. Analisis de competidores lo han trabajado. Problemas encontrados muy bien también. 

- El documento de IA muy bien. Muy buenos zooms y mejora.

-	Al análisis de competidores tiene pinta de haberse echado muchas horas.

- Han tenido plan B para el video, además de traer altavoz propio para que se escuche bien.

- Rendimiento mediante fórmula clara. 

- Retrospectiva clara.

- Muy bien la centralización de información por el problema del aislamiento.

- Me gusta la transparencia con la que se muestra el esfuerzo del equipo.

- Muy bien la diapositiva de la IA, miden si se tiene que editar y miden el tiempo ahorrado. Incluso quitan una IA.


**Feedback recibido (resumen de los comentarios de los profesores)**

- Muy buen killer opener. Se sugiere seguir con la historia.

- Cuando no te acuerdas de algo, puedes beber agua de la botella que **está en la mesa**. Si está en la mano siempre la atención se va allí.

-	Las estimaciones deberían haberse explicado un poco mejor, ha faltado comentar detalles como de dónde sale la gráfica, con qué usuarios de cada tipo, etc.

- Las demos deben de tener datos realistas, para así evitar la falta de profesionalidad.

-	Intentar audios más homogéneos: misma velocidad, mismo tono, etc. Sobre todo si hablan distintas personas.

- Se debe comentar lo que va a aparecer en la demo, para así seguir mejor el hilo de esta.

-	La fórmula de rendimiento está bien trabajada, pero falta poner los números de cada uno de los miembros, al menos anonimizados. Se recomienda incluso añadir una evolución entre sprints usando gráficas de barras.

-	El procedimiento de cómo resolver problemas es muy genérico (en las diapositivas). Está bien poner ejemplos, como el problema de las estimaciones.

- Debe de haber elasticidad en la forma de presentar, tener pensado qué cosas de las que se cuentan sobran, para no perjudicar el ritmo. Se puede volver a transparencias si sobra tiempo.

**Puntos positivos destacados**

- Killer opener espectacular.

- Fórmula de rendimiento bien trabajada.

**Áreas de mejora sugeridas**

- Mejor explicación de las estimaciones.

- Audios más homogéneos.

- Comentarlo que va a aparecer en la demo.

- Evitar diapositivas muy genéricas. Incluir ejemplos es recomendable.

- Ensayar más las presentaciones para conseguir una mayor elasticidad.

<br>

## **Cuarto grupo (BORROO):** 
**Feedback alumnos**

- Buen desglose de los costes.

- El estudio que han hecho, amortización en base a encuestas, hace que la suposición tenga menos riesgo (estimación de costes).

- Muy buen ritmo.

- Problemas, se han solucionado casi todos. Son transparentes en que hay riesgos que no estaban previstos y en el ritmo de completar las tareas.

- Simple pero claro las alucinaciones de la IA.

- Tabla comparativa, diferencias con los competidores, costes han puesto K para los miles, gráfica de coste muy visual, responsabilidades muy claras.

- Buena estética, cómo se han mostrado los problemas y se han solucionado la mayoría.

**Feedback recibido (resumen de los comentarios de los profesores)**

- El killer opener no está tan enlazado porque Doraemon tenía muchas cosas que prestar, el nuevo personaje no tiene eso. Habría que mejorarlo.

-	El análisis de los costes es muy bueno, pero hay que tener en cuenta cómo evolucionará el avance real de costes.

- Muy buen formato, pero puede ser un problema. No han puesto las medidas para resolver y el cómo miden (métricas).

- Hay que resaltar la característica que están mostrando en la demo.

- La demo parecía en tiempo real, que es algo muy bueno.

- Muy bien haber puesto el incremento de características para el segundo sprint. Lo podrían poner en otro color para que resaltase más.

- ¿Por qué la IA alucina tanto? ¿Por qué sucede eso? No lo saben, pero es raro.

**Puntos positivos destacados**

- Análisis de costes muy bueno.

- La naturalidad de la demo.

- Inclusión del incremento de características en futuros sprints.

**Áreas de mejora sugeridas**

- Falta algo de enlace entre el killer opener y la presentación.

- Tener en cuenta la evolución del avance real de los costes.

- No han puesto las medidas para resolver y el cómo miden.

- Resaltar la funcionalidad que se muestra en la demo.

- Realizar análisis de las alucinaciones de la IA.

<br>

## **Quinto grupo (CAMYO):** 
**Feedback alumnos**:

-	Está bien como han mostrado los problemas, sus soluciones y los resultados.

- Muy bien bots y métricas utilizas para la IA. Muy bien la estética.

**Feedback recibido (resumen de los comentarios de los profesores)**

-	Las métricas muy bien.

-	Los íconos en la demo, que indican qué usuario está usando la app en cada momento, son una muy buena idea. Estaría bien que en el killer opener se conectasen los presentadores con dichos iconos, para así enlazar el killer opener con la demo y todo lo demás.

-	Debería ser el empleado el que piense en que ojalá haya una app que haga tal y cual, no el empleador, al menos en este caso.

-	Revisar CapEx y OpEx, hay que desglosar bien las cosas.

-	Hay veces que no hay que traducir ciertas cosas, como code smells -> código que apesta.

-	El tema de plantear el problema, la solución, cómo se mide y el avance es superior a todos los grupos. Usar hasta CodiumIA para automatizar métricas de problemas es muy útil. Ayuda a que la obtención de métricas sea lo más barato y automatizado posible.

-	Resaltar la gráfica que se cruza de costes y presupuestos.

-	La gestión de usuarios pilotos, la gestión del feedback, se asume que todo tiene errores, lo cual no tiene por qué ser así. Hay que generalizar adecuadamente.

**Puntos positivos destacados**

- Buenas métricas.

- Iconos de usuarios en la demo.

- La gestión de problemas es superior a todos los grupos.

- Gráfica de costes y presupuestos.

**Áreas de mejora sugeridas**

- Estaría bien que en el killer opener se conectasen los presentadores con los iconos.

- Revisar CapEx y OpEx.

- Cuidado al traducir literalmente.

- Generalizar adecuadamente.

<br>

## **Sexto grupo (FISIO FIND):** 
**Feedback alumnos**

- Inicio muy bien explicado.

- Ha gustado mucho el video y cómo manejamos el tema de la seguridad de la verificación por DNI de las personas.

- Gama de colores muy bien usada.

-	Hemos desarrollado muy bien el sprint. Parece que se ha planificado muy bien.

-	Las redes sociales tienen buena pinta.

-	El vídeo está muy bien.

-	La gama de colores esta mu bien.

-	Hemos metido mas animaciones y le da un buen toque.

-	Se han notado las prisas, pero está muy bien preparado. Hay una buena conexión entre diapositivas, buen flujo.


**Feedback recibido (resumen de los comentarios de los profesores)**

- Han empezado muy rápido. Al final también fue rápido.

- Muy profesional el killer opener.

- "Perder un día entero para ir al fisio", poder ver al usuario en el fisio esperando, en vez de simplemente sentado en el suelo del gym (hablando del video).

- El elevator pitch debería de ser un poquito más lento, hay que hacer un buen énfasis en este.

- Muy bien las gráficas de costes, pero la de pesimista debe de ser menos pesimista.

- Más énfasis en porcentaje de suscripción.

- Muy bien que la demo esté hilada con el killer opener. Se ve razonablemente bien, aunque no se ve el epígrafe de cada párrafo.

- Muy bien el análisis de rendimiento de los compañeros. Extraño mecanismos de quitar puntos. Deben de funcionar en términos de motivación y no de penalización. Funcionar con strikes, 3 strikes.

- Bien planteado el tema de los riesgos. Hay que decir si son nuevos o son ya identificados. También definir si los problemas son ajenos a los riesgos o no.

- Medir el FAQ, si bajan las dudas o si todas se resuelven está funcionando, si se quedan así y no se responden no funciona.

- ¿El feedback de usuarios piloto se ha implementado? Al principio no, porque esta semana no se ha planteado, pero la siguiente ya sí. Recomendable indicar las HU que provengan de usuarios piloto con algún icono,por ejemplo.

**Puntos positivos destacados**

- Killer opener muy profesional.

- Muy bien las gráficas de costes.

- Muy bien el enlace entre killer opener y demo.

- Muy bien el análisis de rendimiento de los compañeros.

- Bien planteado el tema de los riesgos.

**Áreas de mejora sugeridas**

- Mayor énfasis en el elevator pitch

- La estimación pesimista debe ser menos pesimista.

- Replantear el mecanismo de puntos, avisos y penalizaciones.

- Información del equipo más resumida.

- Medir el FAQ.

- Destacar las HU provenientes de feedback.

<br>


# **ANÁLISIS DEL FEEDBACK**

## **TENDENCIAS GENERALES**
**Factores comunes en los comentarios de los profesores**

- Importancia del killer opener: En la mayoría de los grupos se ha valorado positivamente la introducción, aunque se han dado sugerencias para mejorar su conexión con el resto de la presentación.

- Demos y presentaciones bien estructuradas: Se ha insistido en que la demo debe estar bien enlazada con la presentación y que debe haber un plan B en caso de fallos técnicos.

- Uso de métricas: Se ha valorado mucho la inclusión de métricas para evaluar el progreso y la efectividad de las soluciones propuestas.

- Claridad en la comunicación: Se ha recomendado que las explicaciones sean claras y bien organizadas, evitando información excesivamente genérica.

- Estimaciones de costes: La mayoría de los grupos han recibido observaciones sobre la necesidad de mejorar la presentación y desglose de los costes.

- Uso de IA y su justificación: Se han señalado dudas sobre cómo funciona la IA en algunos casos y cómo se podría mejorar su implementación.

- Lenguaje y comunicación inclusiva: En algunos casos, se ha sugerido mejorar la inclusión en la comunicación, evitando sesgos de género en las explicaciones.


**Puntos de fortaleza general en los equipos**

- Buena preparación de las presentaciones: En general, los equipos han demostrado haber trabajado en la presentación, con materiales bien organizados y estructurados.

- Uso de gráficos y métricas: Varios equipos han incorporado gráficos bien diseñados para respaldar su análisis, lo cual ha sido valorado positivamente.

- Capacidad de adaptación: Algunos equipos han demostrado una buena capacidad de reacción ante problemas imprevistos, como dificultades técnicas en los videos o demos.

- Sinceridad y transparencia: Se ha valorado que los equipos admitan sus errores y expliquen cómo han trabajado para solucionarlos.

**Áreas de mejora recurrentes**

- Tiempo dedicado a la retrospectiva: Se ha mencionado en varios grupos que no se ha dedicado suficiente tiempo a la retrospectiva del proyecto, algo clave para evaluar el aprendizaje.

- Claridad en las estimaciones de costes: Muchos equipos han recibido comentarios sobre la falta de precisión en los cálculos de costes y su desglose.

- Mejora en la presentación de datos y métricas: Aunque hay un buen uso de métricas, se ha sugerido mejorar la forma de presentarlas para que sean más claras y útiles.

- Ritmo y fluidez de la presentación: Algunos equipos han recibido recomendaciones sobre la velocidad de su discurso y la necesidad de estructurar mejor su presentación.

- Mayor planificación para mitigar errores: Se ha enfatizado la importancia de tener planes B para evitar problemas en demos, animaciones y presentaciones en general.


<br>

## **COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**

**¿Qué estamos haciendo bien en comparación con otros?**

- Killer opener muy profesional: Nuestro grupo ha recibido elogios por la introducción, destacando su calidad profesional y su capacidad para captar la atención.

- Buen uso de gráficos de costes: Aunque se sugiere mejorar la estimación pesimista, en general, los gráficos han sido bien valorados, a diferencia de otros grupos que han recibido críticas más severas sobre la claridad de los costes.

- Buena conexión entre el killer opener y la demo: Algo que ha sido una recomendación para otros grupos (como CAMYO y BORROO) se ha valorado positivamente en nuestro caso.

- Buen análisis de rendimiento del equipo: Se ha destacado que el análisis del rendimiento ha sido sólido y detallado, algo que no ha sido tan mencionado en otros grupos.

- Enfoque claro en la planificación de riesgos: Nuestro equipo ha sido reconocido por plantear bien los riesgos y diferenciarlos de los problemas, lo cual ha sido un punto débil en otros grupos.

**¿Qué aspectos debemos mejorar respecto a los demás?**

- Mayor énfasis en el elevator pitch: Aunque nuestro killer opener ha sido profesional, se sugiere hacer un poco más lento el elevator pitch para enfatizar mejor los puntos clave.

- Ajustar la estimación pesimista de los costes: Aunque hemos recibido elogios por los gráficos de costes, se ha señalado que la estimación pesimista es demasiado pesimista y debe ser ajustada.

- Replantear el sistema de puntos y penalizaciones: Se ha sugerido que los mecanismos de penalización no sean punitivos, sino motivacionales. Otros equipos han tenido enfoques diferentes en este aspecto.

- Mejorar la medición del impacto del FAQ: Se ha sugerido medir mejor la efectividad del FAQ para comprobar si realmente está resolviendo dudas o si es necesario hacer ajustes.

- Destacar mejor las HU provenientes del feedback de usuarios piloto: Se nos ha recomendado indicar con algún icono qué HU vienen de los usuarios piloto.

<br>

## Discusión para la siguiente clase.

-	De cara a la KB y a los documentos md: se pueden poner enlaces, así que usémoslos. Por ejemplo, esfuerzo de los compañeros y se mencionan las horas de cada uno, pues un enlace a otro documento donde estén esas horas. En el docusaurus, el repo da info sobre las personas que han contribuido, pues tener un README con aquellos que lo hayan hecho.

-	Información de licencias, de SLA con usuarios piloto, se pueden ir poniendo.

-	Respecto a la KB, debería haber un protocolo de aportaciones y un buscador.

-	Queremos evidencias de lo que ha hecho cada uno.

-	Recomendable el uso de changelogs de conventional commits para automatizar cosas.

-	Todo lo que se pueda automatizar y de métricas gratis, bienvenido es.

-	Es interesante ver la evolución en esfuerzo de tiempo a lo largo de la asignatura.

-	Destacar el empleado de la semana, o algo así. Que en base al rendimiento se pongan rankings.

-	El feedback positivo (métricas bien medidas, las soluciones detalladas de los problemas y la evolución de estos) debe ser tenido en cuenta por los grupos.

#### PRÓXIMA SEMANA

- 15 min de duración.

- Introducción inicial.

- Refinamiento del negocio

  -	Killer opener de 1 minuto como máximo.

  -	Elevator pitch directo.

  -	Que el killer opener enlace con el elevator pitch. Este último puede incluso sobrar.

  -	Análisis de competidores.
  
  -	Pensar en el guión, un story board, de un anuncio. Anuncio de usuarios, anuncio de clientes y anuncio de inversores (totalmente distinto a los otros 2, dar un resumen y DATOS).

  -	Ir pensando en implicaciones legales: GDPR, licencias, etc. Pensar en cómo se implementarían.

- TCO

  -	CapEx es todo aquello que capitalizas, cosa que compra tu empresa y que puedes incluso vender a posteriori. Servidores (no en la nube, que eso se “alquila”), 

  -	Situación actual frente a la prevista

  -	Estimaciones pesimistas, esperadas y optimistas

-	Demo de la mitad del sprint 2: el incremento de las características de demos anteriores es interesante. Usar datos realistas.

  -	La demo debe tener pago real.

- Retrospectiva de mitad del sprint 2.

- Gestión de usuarios piloto.

- Planificación reestimando el sprint 2 si a mitad vamos mal. Justificar recortes si son necesarios y centrarse en funcionalidades core.

- Usuario de IAs.

- Diapositiva final.

# **CONCLUSIONES Y OBSERVACIONES**

- Nuestra presentación ha sido bien valorada en cuanto a estructura y claridad, pero debemos mejorar el ritmo, especialmente en el elevator pitch, haciéndolo más pausado para enfatizar los puntos clave.

- El killer opener ha sido considerado profesional y bien ejecutado, pero podemos mejorar la conexión entre la introducción y el problema que queremos resolver para que el mensaje sea aún más impactante.

- Nuestro uso de gráficos y métricas ha sido destacado, pero se nos ha sugerido hacer la estimación pesimista menos extrema, ajustando los valores para reflejar mejor la realidad del proyecto.

- El sistema de puntos y penalizaciones necesita ser replanteado. En lugar de enfocarnos en sanciones, podríamos orientarlo hacia un mecanismo de motivación para mejorar el compromiso del equipo sin generar un impacto negativo en la moral.

- La gestión del feedback de los usuarios piloto ha sido reconocida como un aspecto importante, pero se nos recomienda hacer más visible qué cambios han surgido a partir de ese feedback. Podemos incorporar iconos o indicadores en las HU para resaltar su origen.

- Se nos ha valorado por una buena conexión entre el killer opener y la demo, lo cual ha sido una debilidad en otros grupos. Debemos seguir reforzando este punto y asegurarnos de que cada parte de la presentación fluya de manera coherente.

- La demo ha sido bien recibida, pero se ha señalado la importancia de medir la efectividad del FAQ. Implementar métricas que evalúen si realmente está resolviendo dudas nos permitirá validar su impacto en la experiencia del usuario.

- Aunque hemos manejado bien los riesgos y problemas, debemos dejar más claro si los problemas son ajenos a los riesgos previstos o si han surgido de manera inesperada. Esto nos permitirá demostrar un mejor control del proyecto y una capacidad de respuesta más efectiva.

<br>

# 6.2. Feedback del día 21/03/2025 (semana 7)

# **1. RESUMEN DEL FEEDBACK POR GRUPO**

## **Primer grupo (Holos):**
**Feedback alumnos**

- Buen inicio efectivo.

- El GDPR está muy bien descrito.
 
**Feedback recibido (resumen de los comentarios de los profesores)**

- En el inicio efectivo no quedaba claro quién era el cliente. No se ha enfocado bien al publico de la presentación, ya que nosotros seríamos un público “usuario” y no un público “artista”. Además, debería ser más específico, para que no se pierda tiempo.

- En Costes, las licencias.

- La gráfica para los costes incurridos no es intuitiva.

- La demo se veía y se oía bien. Sobre todo se entendía bien, mostraba un CU fácil de seguir.

- Las soluciones son propuestas, no son compromisos.

- Pequeño fallo: hasta ahora no tenían Github Project.

- En cumplimiento de plazos poner claramente si alguien ha sido marcado por no cumplir con plazos.

- En el apartado de IA, no parece que esté bien planteado porque actualmente no hay formas de detectar si se usa o no.

- Los costes tienen defectos que deberían corregirse.

**Puntos positivos destacados**

- Buena demo.

**Áreas de mejora sugeridas**

- Mejorar costes y licencias.

- Inicio efectivo más específico.

- Replantear cómo se detecta el uso de IAs.

<br>

## **Segundo grupo (Gastrostock):** 
**Feedback alumnos**:

- Buen inicio efectivo.

- Responden al feedback explicando correctamente la funcionalidad y los distintos dispositivos donde quieren desplegar/hacer una app.

- Siguen poniendo las cifras de precios sin Ks.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Tiene que apoyar las cosas que dice en información cuantitativa que evidencie lo dicho y que sea fácil de entender (que permita saber si es creíble, etc). No es recomendable que el público tenga que dejar de atender para calcular/entender los datos.

- Buen inicio efectivo, pero un poco largo.

- Ha empezado con mucha energía, pero un poco monótono.

- En el gráfico de costes, poner colores que tengan un significado estándar. Por ejemplo, no poner una línea de valoración pesimista en verde, cuando este se suele usar para indicar beneficios.

- La demo es bastante mejorable.

- Los anuncios no se ven bien.

- Rendimiento del equipo, problemas encontrados, storyboard no han puesto.

**Puntos positivos destacados**

- Buen inicio efectivo.

**Áreas de mejora sugeridas**

- Apoyarse en datos.

- Colores en las gráficas con sentido, aunque pueda parecer una tontería.

- Demo mejorable.

- Faltan métricas cuantitativas de calidad.

<br>

## **Tercer grupo (Eventbride):** 
**Feedback alumnos**

- Inicio efectivo chulo. 

- Dos tardes haciendo el storyboard.

- Muy informal la demo.

- No se ve muy bien la demo, pero parece que va al target.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Deberían usar un aparato para cambiar de diapositiva.

- Muy buena conexion entre killer openers.

- No hacer referencia a las semanas pasadas.

- Buen desarrollo de los storyboards (a mano, directos, claros, no demasiadas escenas).

- Parece que no es multievento en la presentación.

- Mostrar más claramente las líneas de corte de los costes.

- Equipo: no está puesto el responsable de GDPR.

- Muy buena demo. Se escuchaba alto y claro, se definían bien los roles y era relativamente cómico. Quizás mejorar la experiencia de usuario.

- Destacar el workflow.

- Hay que ser capaz de medir las soluciones.

- Es necesario una gráfica de barras para mostrar la evolución cuantitativa del rendimiento del equipo.

**Puntos positivos destacados**

- Buena conexión entre killers openers.

- Muy buena demo.

- Workflow destacable.

- Muy buenos storyboards.

**Áreas de mejora sugeridas**

- Mostrar mejor las líneas de corte de los costes.

- Mejorar la experiencia de usuario en la demo (que se vea bien).

- Soluciones medibles.

- Gráfica de barras de evolución cuantitativa del rendimiento del equipo.

<br>

## **Cuarto grupo (BORROO):** 
**Feedback alumnos**

- Muy buena esa comparación entre las gráficas "burn down".

- Han mejorado mucho la forma de presentación, ahora tiene un ritmo más calmado.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Personajes poco acertados en la demo y el killer opener.

- Pequeño fallo: ponen mil en vez de k para representar cifras grandes.

- En las gráficas de costes, es importante poner de dónde salen los números, porque el público se va a preguntar si es realista. Se tiene que poner el número de usuarios/transacciones en cada punto.

- Los usuarios piloto deberían probar la aplicación. Tienen que poner su valor diferencial y lo que valoran los usuarios piloto.

- Muchas cosas que han dicho no están apoyadas en datos cuantitativos.

- Han puesto dos storyboards, pero parecen poco ocurrentes (expresión literal).

- La demo se puede poner más grande.

- Diapositiva de IA poco genérica. Solo había tres textos. Se podría haber puesto de herramientas usadas, métricas… Faltan más transparencias en este apartado.

- No se deben hacer afirmaciones absolutas que se apliquen a todos los proyectos sin excepción.

- Han mejorado la presentación poniendo títulos en todas las diapositivas.

- Es importante detallar más el proceso de evaluación del rendimiento individual del equipo.

**Puntos positivos destacados**

- Han mejorado la presentación poniendo títulos en todas las diapositivas.

**Áreas de mejora sugeridas**

- Buscar personajes adecuados para el killer opener y la demo.

- Usar la k en los costes.

- Poner de dónde salen los números en las gráficas de costes.

- Que los usuarios piloto prueben la app.

- Apoyarse en datos cuantitativos.

- Los storyboards son poco ocurrentes.

- Más diapositivas de IA.

- Detallar el proceso de evaluación del rendimiento individual del equipo.

<br>

## **Quinto grupo (CAMYO):** 
**Feedback alumnos**:

- Buen inicio efectivo como si fuera un simulacro de incendios.

- Se ha equivocado un poco al explicar los derechos sobre los datos.

- Muy bien el top 3 de rendimiento semanal.

**Feedback recibido (resumen de los comentarios de los profesores)**

- El principio muy rápido. Parece casi que no ha dicho el elevator pitch. Quizás ha sido por los problemas técnicos iniciales.

- ¿A quién va dirigido el storyboard? Parece que va a varios targets y eso puede hacer que no funcione. Debería ser dirigido a solo un target.

- Muy buen killer opener por lo de la alarma, ha captado la atención completamente. Sin embargo, ha faltado que conecte con la demo.

- El impacto legal está muy bien, tanto las conclusiones como lo que afecta al usuario.

- CapEx y OpEx están bien.

- Falta una gráfica de corte para mostrar cuándo se empieza a ganar más de lo que se gasta.

- ¿Han priorizado el feedback? 

	- Está en proceso de priorización porque es reciente.

- En la gestión de usuarios piloto han dicho muchas cosas sin apoyo visual. Hace falta apoyo (seguramente será porque es reciente).

- Además del QR, poner un email de contacto.

- La demo se escucha poco y se ve poco. 

- Una propuesta de mejora es que los audios en las demos sean grabados por varias personas, para identificar aun mejor cuando se cambie entre distintos usuarios.

- No han dicho ningún problema. Parece que es porque no hay ninguno.

	- Esta semana están probando una solución, por lo que no saben si está funcionando o no.

- La trasparencia de historias de usuario tiene demasiada incertidumbre, porque depende de los últimos dias del sprint.

**Puntos positivos destacados**

- Buena captación de atención en el killer opener.

- Muy bien definido el impacto legal.

- Bien el CapEx y el OpEx.

**Áreas de mejora sugeridas**

- Principio demasiado rápido.

- Dirigir el storyboard a un solo target.

- Falta una gráfica de corte para mostrar cuándo se empieza a ganar más de lo que se gasta.

- Usar apoyo visual.

- Demo mejorable audiovisualmente. Además de añadir distintas voces.

- No se ha hablado expresamente de problemas/soluciones/estado.

<br>

## **Sexto grupo (FISIO FIND):** 
**Feedback alumnos**

- Muy chulo el inicio efectivo.

- Dani habla un poco bajo.

- La demo no se ve nada.

- Los números en la dedicación individual no se ven bien.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Dani debería hablar con más fuerza.

- Buen inicio efectivo destacando que NO existe en el mercado y por qué nos diferenciamos. Complementando al anuncio de la semana anterior.

- Han respondido al feedback del killer opener.

- Los competidores deben pasar más rápido.

- Revisar qué es una RfC (debe ser una petición que realiza un usuario para cambiar o añadir funcionalidad).

- Buen guiño a las píldoras teóricas.

- Quizás se deberían usar otras gráficas que se dieron en otras asignaturas.

- La gráfica sobre tareas realizadas debería ser de barras, en lugar de área.

- La demo se veía muy pequeña, debería tener audio incluido (diferenciando por rol), los títulos de cada funcionalidad deberían ser estáticos y pequeños que se deberían mostrar más tiempo.

- Muy bien el canal de denuncias.

- ¿Como miden el rendimiento del equipo? Deberian poner cómo se hace. Además de mostrar una gráfica.

- Detallar un poco más la gráfica de evaluación de la calidad.

- Sistema de recompensas: hay que intentar buscar un sistema que no cueste dinero. Por ejemplo, que elija la tarea.

- Añadir apartado de evolución de los problemas (problema -> métrica -> objetivo -> estado).

- Algunas métricas son objetivos. 

- Se ha mejorado estéticamente la presentación.

- En costes, falta indicar qué porcentaje de fisios tienen qué plan.

**Puntos positivos destacados**

- Buen inicio efectivo.

- Bien el canal de denuncias.

- Mejora estética de la presentación.

**Áreas de mejora sugeridas**

- Los competidores deben pasar más rápido.

- Revisión de las RfC.

- Hacer uso de otras gráficas.

- Demo mejorable. Que sea más grande y se usen distintas voces para distintos roles.

- Añadir más información sobre el rendimiento del equipo.

- Buscar un sistema de recompensas que no cueste dinero.

- Añadir apartado de evolución de los problemas.

- En costes, indicar cuánto porcentaje de fisios tienen qué plan.

<br>


# **ANÁLISIS DEL FEEDBACK**

## **TENDENCIAS GENERALES**
**Factores comunes en los comentarios de los profesores**

- Inicio efectivo: La mayoría de los grupos han logrado captar la atención del público al inicio, aunque en algunos casos fue demasiado largo o no se conectó con la demo.

- Necesidad de apoyo cuantitativo: Muchos equipos hicieron afirmaciones sin sustentarlas con datos claros o gráficas comprensibles.

- Gráficas mejorables: Hay errores frecuentes en el diseño o uso de gráficas, como colores mal elegidos, falta de contexto, o formatos poco intuitivos.

- Demos poco visibles o poco audibles: Es una queja generalizada. En varios casos, no se ve bien la demo o no se escucha, o es mejorable la diferenciación de los roles.

- Evaluación del rendimiento del equipo poco detallada: Varios grupos no explican claramente cómo miden el rendimiento, o bien no lo representan visualmente.

**Puntos de fortaleza general en los equipos**

- Buenos killer openers en general, creativos y capaces de captar la atención.

- Algunas presentaciones han mejorado estética y estructuralmente con respecto a semanas anteriores.

- En varios grupos, el impacto legal o la gestión de privacidad (como el GDPR) se ha tratado con seriedad y claridad.

**Áreas de mejora recurrentes**

- Demo técnica: Mejorar su visibilidad, calidad de audio y claridad del caso de uso.

- Justificación de costes: Muchos grupos deben explicar mejor el origen de los datos económicos y cómo se proyectan.

- Más métricas y datos: Se necesita un mayor uso de datos cuantitativos, tanto en resultados como en la presentación de problemas y soluciones.

- Evaluación del rendimiento del equipo: Hacer más visible y clara esta parte, con gráficos u otros sistemas que muestren progreso.

- Uso de IA y métricas: Apartado generalmente débil, con poca profundidad y escasa presentación visual o analítica.

<br>

## **COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**

**¿Qué estamos haciendo bien en comparación con otros?**

- Inicio efectivo claro y diferenciador: Se destacó positivamente la introducción, por presentar de forma contundente que no hay una solución similar en el mercado, y complementar con el anuncio de la semana anterior.

- Canal de denuncias: Es un elemento muy valorado que no se ha mencionado en otros equipos.

- Impacto legal bien trabajado: Al igual que algún otro grupo, se ha abordado con claridad la parte legal y cómo afecta al usuario, lo cual no es un estándar en todos los equipos.

- Mejora estética de la presentación: Se ha notado una evolución positiva en la parte visual, lo que ha sido reconocido.

- Respuesta al feedback anterior: Se ha trabajado conscientemente en incorporar sugerencias previas.

**¿Qué aspectos debemos mejorar respecto a los demás?**

- Demo: Aunque algunos grupos también han tenido problemas aquí, en nuestro caso la demo se ve muy pequeña y no incluye voces diferenciadas por rol. Otros grupos han logrado una demo más clara y comprensible.

- Datos de rendimiento del equipo: Falta detallar mejor cómo se mide y presentar alguna gráfica que lo represente.

- Presentación de problemas y evolución: Hay que incluir un apartado claro con problemas, métricas asociadas, objetivos y estado actual.

- Gráficas: Aún podemos mejorar el tipo de gráficas usadas (como reemplazar áreas por barras cuando corresponde) y hacerlas más intuitivas, algo que también se ha señalado en muchos grupos.

- Porcentaje de planes en los costes: Es un detalle importante no incluido aún y que aportaría claridad a la sostenibilidad del modelo.

<br>

## Discusión para la siguiente clase.

- La próxima semana la presentación deberá tener más o menos lo mismo.

- Se aconseja tener un calendario compartido para las reuniones.

- Se recomienda tener changelog.

- Hay que hacer acuerdo de usuario piloto con los usuarios de la asignatura.

#### PRÓXIMA SEMANA

- Introducción:

	- Killer oppener de 1 minuto.

	- Elevator pitch de 30 segundos.

	- Presentar los competidores más al grano.

	- Storyboard de otro target (inversor mejor no).

	- Customer agreement, licencias, términos y condiciones del servicio, evitar clausulas abusivas, acuerdos de nivel de servicio, implicaciones otras apis, pricing, gdpr.

	- TCO, CapEx OpEx, github, optimista, realista y pesimista. Mejorar con el feedback dado.

	- Equipo igual: resumen, roles, commitment agreement status (ver si se esta cumpliendo).

- Demo

	- Mejorar la calidad visual y auditiva, así como una buena diferenciación de roles: usar distintas voces si hay distintos usuarios.

- Retrospectiva 40%-50%

	- Casi lo mismo.

	- Añadir gráficas rendimiento/esfuerzo: Mucho esfuerzo poco rendimiento, poco esfuerzo mucho rendimiento, etc.

	- Gráficas rendimiento personal, análisis software.

	- En el apartado de Problemas igual pero decir, además del problema, el estado de este (si es de antes, solucionado, no solucionado, etc), las acciones concretas y ver alguna forma de evaluar esa solución. Analizar las soluciones. Añadir unas lecciones aprendidas del análisis.

- Gestión de usuarios piloto: Nada nuevo parece.

	- Gestión del feedback, comunicación.

- Replanificación:

	- Sprint 3, aspectos de seguridad (validación de los formularios, correos). Ver si la validación de correos tiene repercusión en el OpEx.

- Uso IA:

	- Decir que si se ha mejorado el uso de la IA desde el principio, lecciones aprendidas, alucionaciones. 

	- Evitar cosas genéricas.


# **CONCLUSIONES Y OBSERVACIONES**

- Nuestra presentación ha sido valorada positivamente por su estética y por haber respondido al feedback previo, pero debemos seguir trabajando en la proyección de voz y en asegurar que todos los miembros del equipo se escuchen con claridad durante la exposición.

- El killer opener ha sido bien recibido por su originalidad y capacidad de diferenciación, destacando la ausencia de soluciones similares en el mercado. Aun así, se sugiere trabajar una mejor conexión entre esa introducción y la demo, para que el hilo narrativo sea más fluido.

- Se ha valorado positivamente nuestro enfoque en el canal de denuncias y el impacto legal del proyecto, dos apartados que no han sido tan desarrollados por otros equipos. Debemos mantener esta línea e incluso reforzarla como un valor diferencial.

- La demo ha sido uno de los puntos más débiles. Es necesario aumentar su tamaño visual, mejorar el audio y añadir voces diferenciadas según los roles. Además, los títulos deben mostrarse de forma clara y constante para facilitar la comprensión del caso de uso.

- Aunque se reconocen nuestros esfuerzos por incluir métricas, se nos ha recomendado mejorar el tipo de gráficas utilizadas, optando por formatos más adecuados como barras en vez de áreas para representar tareas o rendimiento.

- El sistema de recompensas necesita ser replanteado. En lugar de implicar costes, podemos explorar alternativas motivadoras como permitir que el miembro destacado elija tareas o influya en decisiones del equipo.

- Nos falta mostrar con más claridad cómo se mide el rendimiento del equipo. Incluir una gráfica específica y explicar el proceso de evaluación ayudaría a demostrar mejor nuestra organización interna.

- Es importante que incorporemos un apartado visual sobre la evolución de los problemas del proyecto, mostrando cómo estos se identifican, cómo se miden, qué objetivos se fijan y cuál es su estado actual. Esto no solo mejora la transparencia, sino también nuestra capacidad de reacción ante imprevistos.

- En el apartado de costes, debemos especificar el porcentaje de fisioterapeutas que se espera que adopten cada tipo de plan, para dar mayor realismo y credibilidad al modelo de negocio.
