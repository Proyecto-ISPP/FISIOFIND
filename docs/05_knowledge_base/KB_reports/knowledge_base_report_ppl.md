---
title: "REPORTE BASE DE CONOCIMIENTO #PPL"            # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #PPL"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "01/05/2025"                                          # CHANGE IF NEEDED
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
header-right: "01/05/2025"                                  # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"  
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  REPORTE BASE DE CONOCIMIENTO #PPL
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
    - [3.2.6. Términos](#326-términos)
    - [3.2.7. Ideando un proyecto](#327-ideando-un-proyecto)
    - [3.2.8. SPRINT 1](#328-sprint-1)
    - [3.2.9. SPRINT 2](#329-sprint-2)
    - [3.2.10. SPRINT 3](#3210-sprint-3)
    - [3.2.11. Preparar el lanzamiento del proyecto](#3211-preparar-el-lanzamiento-del-proyecto)
  - [3.2 USO Y GESTIÓN GENERAL](#32-uso-y-gestión-general)
- [4. CONTRIBUCIONES DEL EQUIPO](#4-contribuciones-del-equipo)
  - [4.1. CONTRIBUCIONES A LA BASE DE CONOCIMIENTO GRUPAL](#41-contribuciones-a-la-base-de-conocimiento-grupal)
    - [4.1.1. Organización](#411-organización)
    - [4.1.2. Planificación](#412-planificación)
    - [4.1.3. Informes](#413-informes)
    - [4.1.4. Seguimiento](#414-seguimiento)
    - [4.1.5. Recursos ("Base de conocimiento" en el repositorio oficial de Fisio Find)](#415-recursos-base-de-conocimiento-en-el-repositorio-oficial-de-fisio-find)
    - [4.1.6. Términos](#416-términos)
    - [4.1.7. Ideando un proyecto](#417-ideando-un-proyecto)
    - [4.1.8. Sprint 1](#418-sprint-1)
    - [4.1.9 Sprint 2](#419-sprint-2)
    - [4.1.10. Sprint 3](#4110-sprint-3)
    - [4.1.11. Preparar el lanzamiento del proyecto](#4111-preparar-el-lanzamiento-del-proyecto)
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
  - [5.1. Resumen de mejoras tras el feedback del 11/04/2025](#51-resumen-de-mejoras-tras-el-feedback-del-11042025)
    - [5.1.1. Video final](#511-video-final)
    - [5.1.2. Captación de inversores](#512-captación-de-inversores)
  - [5.2. Resumen de mejoras tras el feedback del 04/04/2025](#52-resumen-de-mejoras-tras-el-feedback-del-04042025)
    - [5.2.1. Presentación general](#521-presentación-general)
    - [5.2.2. Anuncio de inversores resumido](#522-anuncio-de-inversores-resumido)
- [**6. ANEXO - RESUMEN DEL FEEDBACK POR GRUPO**](#6-anexo---resumen-del-feedback-por-grupo)
    - [6.1. Feedback del día 11/04/2025 (semana 10)](#61-feedback-del-día-11042025-semana-10)
- [**1. RESUMEN DEL FEEDBACK POR GRUPO**](#1-resumen-del-feedback-por-grupo)
  - [**Primer grupo (Holos):**](#primer-grupo-holos)
  - [**Segundo grupo (Gastrostock):**](#segundo-grupo-gastrostock)
  - [**Tercer grupo (Eventbride):**](#tercer-grupo-eventbride)
  - [**Cuarto grupo (BORROO):**](#cuarto-grupo-borroo)
  - [**Quinto grupo (CAMYO):**](#quinto-grupo-camyo)
  - [**Sexto grupo (FISIO FIND):**](#sexto-grupo-fisio-find)
- [**2. ANÁLISIS DEL FEEDBACK**](#2-análisis-del-feedback)
  - [**2.1 TENDENCIAS GENERALES**](#21-tendencias-generales)
  - [**2.2. COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**](#22-comparación-del-feedback-de-nuestro-grupo-vs-los-otros)
  - [**COMENTARIOS FINALES**](#comentarios-finales)
      - [PRÓXIMA SEMANA](#próxima-semana)
- [**3. CONCLUSIONES Y OBSERVACIONES**](#3-conclusiones-y-observaciones)
- [6.2. Feedback del día 25/04/2025 (semana 12)](#62-feedback-del-día-25042025-semana-12)
- [**1. RESUMEN DEL FEEDBACK POR GRUPO**](#1-resumen-del-feedback-por-grupo-1)
  - [**Primer grupo (Holos):**](#primer-grupo-holos-1)
  - [**Segundo grupo (Gastrostock):**](#segundo-grupo-gastrostock-1)
  - [**Tercer grupo (Eventbride):**](#tercer-grupo-eventbride-1)
  - [**Cuarto grupo (BORROO):**](#cuarto-grupo-borroo-1)
  - [**Quinto grupo (CAMYO):**](#quinto-grupo-camyo-1)
  - [**Sexto grupo (FISIO FIND):**](#sexto-grupo-fisio-find-1)
- [**ANÁLISIS DEL FEEDBACK**](#análisis-del-feedback-1)
  - [**2.1 TENDENCIAS GENERALES**](#21-tendencias-generales-1)
  - [**2.2. COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**](#22-comparación-del-feedback-de-nuestro-grupo-vs-los-otros-1)
  - [**COMENTARIOS FINALES**](#comentarios-finales-1)
      - [PRÓXIMA SEMANA](#próxima-semana-1)
- [**3. CONCLUSIONES Y OBSERVACIONES**](#3-conclusiones-y-observaciones-1)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #PPL

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Alberto Carmona Sicre](https://github.com/albcarsic) (autor), [Rafael Pulido Cifuentes](https://github.com/rafaelpulido) (revisor)

- **Fecha de Creación:** 30/04/2025

- **Versión:** v1.1

<br>


---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 30/04/2025 | v1.0    | Alberto Carmona Sicre | Creación del informe de base de conocimiento del PPL |
| 01/05/2025 | v1.1    | Alberto Carmona Sicre | Finalización de los apartados 4, 5 y Anexo |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  

La base de conocimiento ha sido desarrollada siguiendo las directrices establecidas en nuestro Acuerdo de Base de Conocimiento. Cada acción realizada ha sido regulada conforme a sus disposiciones. En este documento puede encontrar la información correspondiente a las actividades realizadas durante el proceso: Prepare Project Launch.

Importante: el repositorio de documentación en el que se suben los documentos generados durante los sprints no se actualiza directamente tras la creación de un archivo, sino que se va actualizando una vez se conoce que los archivos van a dejar de ser modificados, para así evitar trabajo extra a los responsables de poblar dicho repositorio.

# 2. ACCESO A LA BASE DE CONOCIMIENTO

El acceso a la base de conocimiento está disponible en el siguiente enlace: [Fisio Find](https://fisiofind.vercel.app/).  

Para consultar la documentación, visita [Documentación Fisio Find](https://fisiofind.vercel.app/docs/Inicio). En esta sección, encontrarás un panel lateral izquierdo que muestra todos los documentos subidos.

Por otro lado, la base de conocimiento de toda la clase se encuentra en el siguiente enlace: [https://bcc-three.vercel.app/](https://bcc-three.vercel.app/).

Por último, en caso de que la Base de Conocimiento no haya sido actualizada, puede encontrar los diferentes documentos mencionados en la carpeta docs del repositorio oficial de Fisio Find, haciendo click en este enlace: [Documentación repositorio oficial Fisio Find](https://github.com/FisioFind/FisioFind/tree/main/docs).

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

- En los apartados **Sprint 1**, **Sprint 2**, **Sprint 3**, **Sprint 4 ppl** y **Sprint 5 wpl**, se almacenan los informes relacionados con el sprint en sí (planificación, retrospectiva, etc.). Documentos como la retrospectiva se encargaron al equipo de **QA**, mientras que la **planificación** fue responsabilidad del **Scrum Master**.

### 3.2.5. Recursos

- La gestión de la carpeta **Recursos** siguió la siguiente dinámica: los **Secretarios** y el **Scrum Master** fueron los encargados de añadir los informes de **feedback**, las notas sobre las **píldoras teóricas** y otros documentos relevantes, como el Informe de Base de Conocimiento.

### 3.2.6. Términos

- En esta carpeta se pueden encontrar todos los documentos relacionados con los términos y condiciones, la privacidad, las cookies y las licencias. Los encargados de la elaboración de estos fueron el **Scrum Master**, Antonío Macías, el **Secretario** Delfín Santana y Daniel Ruiz.

### 3.2.7. Ideando un proyecto

- En la carpeta **Ideando un proyecto** se pueden encontrar juntos todos los documentos generados durante esta fase inicial del proyecto.

### 3.2.8. SPRINT 1

- En la carpeta **Sprint 1** se pueden encontrar juntos todos los documentos generados o modificados durante esta fase del proyecto.

### 3.2.9. SPRINT 2

- En la carpeta **Sprint 2** se pueden encontrar juntos todos los documentos generados o modificados durante esta fase del proyecto.

### 3.2.10. SPRINT 3

- En la carpeta **Sprint 3** se pueden encontrar juntos todos los documentos generados o modificados durante esta fase del proyecto.

### 3.2.11. Preparar el Lanzamiento del proyecto

- En la carpeta **Preparar el Lanzamiento del proyecto** se pueden encontrar juntos todos los documentos generados o modificados durante esta fase del proyecto.

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

- Modificación del Acuerdo de compromiso: Adición del punto "2.12 SOBRE EL ESTADO DEL PROYECTO TRAS LA ASIGNATURA"

### 4.1.2. Planificación

- Adición del documento Planificación del marketing.

### 4.1.3. Informes

- Adición del informe de tiempo del PPL.

- Adicción del informe de IA del PPL.

- Adición del informe de usuarios piloto del PPL.

- Adición del informe de Comunicaciones usuarios piloto PPL.

- Adición del informe de calidad del PPL.

- Adición del informe de seguridad del PPL.

<br>

De manera independiente:

- Lecciones aprendidas del sprint 1.

### 4.1.4. Seguimiento

En la carpeta sprint_4_ppl:

- Planificación del PPL.

- Retrospectiva global del PPL.

- Retrospectiva del Sprint del grupo 1.

- Retrospectiva del Sprint del grupo 2.

- Retrospectiva del Sprint del grupo 3.

- Retrospectiva de mitad del PPL.

En la carpeta sprint_5_wpl:

- Planificación del WPL.

### 4.1.5. Recursos ("Base de conocimiento" en el repositorio oficial de Fisio Find)

- Feedback de la clase del día 11 de abril de 2025.

- Feedback de la clase del día 25 de abril de 2025.

- Informe de la base de conocimiento del PPL.

En el anexo, se muestra tanto el feedback grupal como las anotaciones generales.

### 4.1.6. Términos

- Documento de "cookies" de Fisio Find en formato pdf y md.

- Documento de términos y condiciones de Fisio Find en formato pdf y md.

- Documento de privacidad de Fisio Find en formato pdf y md.

- Documento de licencias de Fisio Find en formato pdf y md.

### 4.1.7. Ideando un proyecto

- No se han añadido ni modificado documentos.

### 4.1.8. Sprint 1

- No se han añadido ni modificado documentos.

### 4.1.9 Sprint 2

- No se han añadido ni modificado documentos.

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

### 4.1.11. Preparar el lanzamiento del proyecto

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

A continuación, se muestran las contribuciones a la base de conocimiento general. Cabe destacar que, para los demás grupos, el feedback es igual al que se añade en el feedback de la base de conocimiento grupal, por lo que solo se va a añadir el feedback del grupo 6. Como aclaración, la información añadida en la base de conocimiento general tiene una estructura similar pero un poco diferente a la recogida en el feedback grupal, por ello, este feedback individual si se muestra como parte de una contribución a nivel general.

## 4.2.1. Feedback individual del grupo 6

En este apartado se encuentra la información relacionada con el feedback de las semanas 10, 11 y 12.

## Semana 10

#### Feedback relacionado con la presentación

- Preparar mejor la demo en vivo en caso de volver a hacerse: solucionar los problemas de red y asegurar el uso de zoom adecuado.

- Eliminar o rediseñar el video final si solo repite contenido anterior; enfocarlo en novedades si se mantiene.

- Reemplazar iconos genéricos por imágenes reales de fisioterapeutas dentro de la aplicación.

- Mantener los anuncios específicos para características nuevas.

- Reflexionar sobre la estrategia de captación de inversores y considerar pequeños ensayos de aproximación.

#### Feedback relacionado con el desarrollo del proyecto

- Genial lo de los anuncios específicos para características nuevas. Muy top. 

- El killer opener se ha cambiado por un pseudo anuncio de inversores, ¿por qué? No queríamos hablar de dinero, paquete de inversiones, etc. Apostamos porque los inversores nos encuentren. Ya, pero hay que intentar, con prueba y error, llegar a los inversores. 

#### Tareas a realizar para la siguiente semana

- Preparar mejor la demo en vivo: solucionar los problemas de red y asegurar el uso de zoom adecuado.

- Eliminar o rediseñar el video final si solo repite contenido anterior; enfocarlo en novedades si se mantiene.

- Reemplazar iconos genéricos por imágenes reales de fisioterapeutas dentro de la aplicación.

- Reflexionar sobre la estrategia de captación de inversores y considerar pequeños ensayos de aproximación.

## Semana 11
#### Feedback relacionado con la presentación

- Intencionalmente en blanco (no hubo clase).

#### Feedback relacionado con el desarrollo del proyecto

- Intencionalmente en blanco (no hubo clase).

#### Tareas a realizar para la siguiente semana

- Intencionalmente en blanco (no hubo clase).

## Semana 12
#### Feedback relacionado con la presentación

- El video de presentación del equipo estuvo muy bien, pero faltaría especificar los roles de manera más general para que sea fácilmente entendido por un público general.

- El Killer Opener estuvo muy bien, aunque quizás se podría encontrar algo aún más “impactante”. Un punto muy positivo es que siempre se presenta un nuevo Killer Opener.

- Para Cristina, el Killer Opener fue más apropiado y alineado con el mensaje que se quería transmitir.

- Se dedicó demasiado tiempo a explicar características que posteriormente se repiten en la demo.

- Se echó en falta la presencia de actores en el Killer Opener para alinearlo mejor con la demo y los posibles anuncios.

- Aunque la primera presentación fue muy profesional, en algunas secciones el flujo no fue tan bueno como debería. Sería recomendable explicar antes de un video qué contenido introduce (si es demo o anuncio).

- Aunque en algunas partes el flujo no fue óptimo, eso no quita todo el trabajo importante que hay detrás.

- La diapositiva 10 pudo alterar el flujo de la presentación, afectando la continuidad.

- En cuanto a posibles muletillas, se debería evitar decir "FisioFind pretende" y utilizar "FisioFind hace".

- Muy bien incluir los costes en la presentación.

- Respecto al anuncio de FisioFind, aunque gustó, sería importante inferir más contexto para personas que no conocen la aplicación.

- Puede ser buena idea que el fisioterapeuta comience trabajando de manera offline y que reciba un flyer de FisioFind invitándolo a hacer fisioterapia online, aportando así más contexto.

#### Feedback relacionado con el desarrollo del proyecto

- Para el anuncio de inversores, sería recomendable preparar una versión más corta.

- Aunque no se incluyeron los planes de inversión, se argumentó adecuadamente el motivo.

- El proyecto muestra mucho potencial para el futuro.

- Faltó incluir métricas sobre el posicionamiento SEO.

- En los planes de precios debería aclararse que el precio es por mes; actualmente pone "PERMANENTE".

- Faltó incluir el tema de los perfiles (profiles)

#### Tareas a realizar para la siguiente semana

- Añadir contexto antes de cada video en la presentación para mejorar el flujo narrativo.

- Mejorar el killer opener buscando uno más impactante o más alineado con los anuncios/demos.

- Hacer más explícitos los roles del equipo en la presentación, con un enfoque comprensible para el público general.

- Evitar muletillas como “FisioFind pretende” y reemplazarlas por frases concretas como “FisioFind hace”.

- Ajustar la presentación de los precios: cambiar “PERMANENTE” por “€/mes”.

- Incluir métricas de posicionamiento SEO si están disponibles.

- Añadir una sección clara sobre la gestión de perfiles de usuario.

- Preparar una versión resumida del anuncio para inversores.

- Proporcionar mayor contexto en los anuncios para audiencias que no conocen la app (por ejemplo, fisioterapeutas offline).

## 4.2.2. Aportaciones generales

En este apartado se encuentran las aportaciones que se han realizado a la Base de Conocimiento grupal en función de las semanas y puntos que se han pedido según la organización grupal de aportaciones. Sin embargo, y según la planificación, el grupo 6 estuvo exento de realizar aoprtaciones durante estas semanas, por lo que este apartado se encuentra vacío en esta ocasión.

### Apartado Presentaciones

Intencionalmente en blanco.

<br>

<br>

---

# 5. ACCIONES TOMADAS A PARTIR DEL FEEDBACK

En esta sección se muestra un resumen de las acciones que se han tomado a partir del feedback dado. Se muestra un resumen ya que se entiende que existe un proceso de interiorización del feedback que hace que se tomen acciones de forma inconsciente. Es decir, si por ejemplo se valora mucho una presentación en concreto, lógicamente se va a intentar mejorar dicha presentación en los puntos en los que se haya dado feedback positivo. Se puede obtener un análisis mucho más detallado del feedback y de las presentaciones en los documentos de feedback de nuestra base de conocimiento.

## 5.1. Resumen de mejoras tras el feedback del 11/04/2025

Tras el _feedback_ recibido en la sesión del 11/04/2025, se tomaron medidas para mejorar aquellos aspectos de la presentación que presentaban fallos, al mismo tiempo que se reforzaron los puntos que fueron elogiados.

### 5.1.1. Video final

- Uno de los comentarios de los profesores fue que les pareció extraño la inclusión de un video al final de la presentación donde se repetía contenido ya visto anteriormente en esta. Se decidió eliminar dicho video para futuras presentaciones para así poder dedicar más tiempo a otros apartados, a no ser que se mostrasen novedadesen dicho video.

### 5.1.2. Captación de inversores

- Siguiendo uno de los comentarios de los profesores, "Reflexionar sobre la estrategia de captación de inversores y considerar pequeños ensayos de aproximación", se decidió aportar más recursos para la estrategia de captación de inversores, así como la creación de nuevas tareas acorde a la redefinición de esta estrategia.

## 5.2. Resumen de mejoras tras el feedback del 25/04/2025

Tras el _feedback_ recibido en la sesión del 25/04/2025, se tomaron medidas para mejorar aquellos aspectos de la presentación que presentaban fallos, al mismo tiempo que se reforzaron los puntos que fueron elogiados.

### 5.2.1. Presentación general

- La gran mayoría de comentarios de los profesores se referían a diferentes aspectos que se podían incluir, eliminar o mejorar en la presentación en sí, por lo que se tuvieron en cuenta para la siguiente semana, sin llegar a realizar acciones concretas más allá de retocar la presentación.

### 5.2.2. Anuncio de inversores resumido

- Se desarrolló una versión más corta del anuncio de inversores para futuras presentaciones.

<br>

\newpage

<br>


---

# **6. ANEXO - RESUMEN DEL FEEDBACK POR GRUPO**

### 6.1. Feedback del día 11/04/2025 (semana 10)

# **1. RESUMEN DEL FEEDBACK POR GRUPO**

## **Primer grupo (Holos):**
**Feedback alumnos**

- El grupo se fija mucho en la satisfacción del equipo, video para inversores muy bueno (simple, directo).

- Es valiente que hayan cambiado de PM. 

- Ha gustado el cambio que han hecho de PM y la forma de analizar los roles del equipo.


**Feedback recibido (resumen de los comentarios de los profesores)**

- En general, se ve en la presentación que el hilo de discurso y ritmo están bien.  

- Ha habido aprtes que estan especialmente bien. El anuncio de inversores tiene el punto justo de dinamismo y cómo lo presentan. Si pueden hacer una demostración del anuncio a algún inversor estaría bien para validarlo. 

- La forma de mostrar problemas, soluciones es bastante top.  

- Hay que intentar hacer ensayos de volumen. Buscarse micrófonos, proyectar la voz, etc. Vocalizar. 

- La integración continua es muy importante. **Se deberían poder meter cosas y que las pruebas sean automáticas**, sobre todo hacer pruebas end-to-end para casos de uso más importantes.

- Se deberia de medir el tiempo relacionado con las pull requests.

- Usuarios pilotos, ¿cuántos usuarios pilotos están usando la app? Lo importante es que la usen diariamente.

**Puntos positivos destacados**

- Buen ritmo.

- Buen anuncio de inversores.

- La forma de mostrar problemas.

**Áreas de mejora sugeridas**

- Hacer ensayos de volumen.

- Integración continua.

- Medir el tiempo de las PR.

<br>

## **Segundo grupo (Gastrostock):** 
**Feedback alumnos**:

- Killer opener muy bueno, hall of fame muy bueno.

- Muy bueno anuncio de inversores y costes.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Han cogido el toro por los cuernos. Han cogido todo lo que tenía mal, han hecho lo que han podido y han tirado para alante. Se anima a que sigan así. 

- Como han empezado tarde, hay muchas cosas en las que tienen que ir a remolque. Han echado agallas al tema y han tirado para adelante, enhorabuena. 

- Killer opener muy bien menos lo del niño gordo. Gordofobia no. Le han hecho caso a feedback anteriores. 

- Muy bien el guión del anuncio, pero el principio es demasiado largo, y te quita tiempo para contar otras cosas. Que quiten que el del gorro de tanta pena. 

- Detalles del anuncio: 

    - El mostrar paquetes de inversión es buena idea. 

    - Deben aparecer números para que el negocio sea creible. 

    - Producción y guión del anuncio muy buenos.

- Han puesto costes fijos, pero después los costes del OpEx. Quizás los costes fijos sobran en la forma en la que lo explican. Podrían integrarlo en la gráfica.

- No es costes capitales, sino capitalizados o capitalizables, o costes de capital.

- El porcentaje de los bares bien puesto, comentado en feedbacks anteriores. 

- Ha faltado la evolución de cómo van yendo las soluciones a los problemas, quiere ver un poco de eso el próximo día. 

- La matriz de rendimiento está demasiada resumida, quiere ver distintos puntos y la evolución respecto a la semana anterior. 

- Duda: No queda claro el terminator para qué es (la IA): han quitado la IA del alcance. 

**Puntos positivos destacados**

- Killer opener muy bueno.

- Se felicita la resiliencia.

- Buen anuncio de inversores.

- Han hecho caso a feedback anteriores.

**Áreas de mejora sugeridas**

- No a la gordofobia.

- Deben aparecer números para que el negocio sea creible.

- Costes.

- Matriz de rendimiento.

<br>

## **Tercer grupo (Eventbride):** 
**Feedback alumnos**

- Gusta cómo tienen todo gestionado. Recuerda a PGPI. Está bien que tengan registro claro de todo lo relacionado con problemas.

- En las redes sociales se nota que cumplen los objetivos de marketing. Me ha gustado mucho cómo han solucionado los problemas los compañeros.

- Ha gustado mucho que sigan la historia, y cómo desglosan el feedback de los Usuarios Piloto y trabajan en las redes sociales.

**Feedback recibido (resumen de los comentarios de los profesores)**

- En general, se nota que le dedican bastante esfuerzo a la aplicación, pero no se le saca el brillo que debería sacarse en una demo de producto, porque se entiende mucho mejor si la demo sigue una historia, en vez de simplemente mostrar las funcionalidades y escenarios de la aplicación. Lo importante es que sea más corta y focalizada y se muestren los elementos core. Que los posibles clientes tengan claro lo que hace la aplicación concretamente, en vez de saber todo lo que hace. 

- Con respecto a los inversores, se nota que lo han intentado hacer de la mejor manera posible, y que es bastante superior a lo que se suele ver, pero el contenido en sí debería dar un mensaje más apropiado para un inversor. Tenemos que identificar hacia quién va dirigido lo que hacemos. El nivel de informalidad en ciertos aspectos puede ser raro para inversores serios. Hay que buscar el mostrar un mensaje claro y serio. Intentar mucha más información sobre el mercado, el mercado potencial. Los inversores quieren saber a qué aspiramos, y si hay potencial para conseguir dinero. Centrarnos en mostrar datos y cosas objetivas. 

- A nivel general de presentación, se repiten un par de cosas ya comentadas y que son importantes: 

    - Por favor, Ciclo: problemas, acciones, cómo medir. Faltan: medidas, objetivos de esas medidas, cuándo llegar a esas medidas. Porque si no, no pueden hacer el seguimiento. 

    - No pensar que es solo un patrón para los problemas, también tenerlo para las mejoras. Por ejemplo: queremos organizar para mejorar la eficiencia, pues debe seguirse el mismo ciclo. 

**Puntos positivos destacados**

- Se nota el trabajo y el esfuerzo dedicado.

**Áreas de mejora sugeridas**

- Perfilar la seriedad del anuncio de inversores.

- Ciclo de problemas.

<br>

## **Cuarto grupo (BORROO):** 
**Feedback alumnos**

- Muy bien la forma en la que se afrontan problemas. Categorización del feedeback. 

- Calendario niko niko muy bien, la categorización muy buena respecto al feedback pasado.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Muy bien trabajado, dan buena sensación de principio a fin. 

- Enhorabuena por decir solo 2 “seguidamente”, lo ha sustituido por “de acuerdo” y “a continuación”. 

- Aplica tanto al killer opener como al anuncio de clientes: hacen hincapié en que las cosas se usan, se guardan y se quieren dar salida. Hay que hacer diferenciación entre alquilar y vender, porque es lo que se muestra en el anuncio. Si hay objetos que puedo no usar esporádicamente, y por tanto puedo alquilar, entonces se refleja mejor la idea de la aplicación. 

- Hay cosas sacadas de la manga: mercado en auge, cada vez las personas alquilan más. Hay que meter datos: noticias, estudios, etc. Hay que convencer con estadísticas. 

- Faltan las opciones de inversión y porcentajes de cuánto vender. 

- Son los que de manera más eficiente cuentan el equipo. 

- La demo está genial, pero no han contado al principio lo que iba a aparecer en esta. 

- El incremento o decremento de datos respecto a la semana anterior es importante reflejarlo, junto con flechas y cosas así. 

- Buena priorización del feedback, con varios apartados para priorizar. 

- Lo de hacer merges de ramas incorrectas es muy grave. Deberian de añadir una leccion aprendida sobre esto.

- ¿El tema de Locust cómo lo estan haciendo? Estan midiendo como si fuesen 10 usuarios los que hacen la petición y viendo como va la pagina. Lo importante es detectar los límites, ¿eso lo han hecho? No, porque no están terminados los test de Locust. Se anima a detectarlos. 

**Puntos positivos destacados**

- Muy buen trabajo.

- Buen cambio de muletillas.

- Eficiendia al contar el equipo.

- Buena priorización del feedback.

**Áreas de mejora sugeridas**

- Killer opener y anuncios.

- Meter más datos reales.

- Opciones de inversión y porcentajes.

- Incremento o decremento de datos respecto a la semana anterior.
<br>

## **Quinto grupo (CAMYO):** 
**Feedback alumnos**:

- Enhorabuena porque sus presentaciones son siempre muy buenas. El anuncio es brillante. Muy desglosado el plan de marketing. Siguen siendo creativos en la forma en la que hilan.

- Muy bien el apartado de marketing.

- Muy bien los iconos en la PPT.

**Feedback recibido (resumen de los comentarios de los profesores)**

- Han tenido bastante en cuenta el feedback de la semana pasada, se ha reflejado. 

- El ritmo de la presentacion y el hilo están muy bien y son muy naturales. 

- El anuncio inicial está muy bien y va muy a lo concreto, da a entender el mensaje y valor de la plataforma de manera muy directa y sencilla. 

- La demo se ve bien, pero hay que transicionar a otro modelo de demo en el que la informalidad se mida un poco, porque son demos ya para clientes objetivos. ¿Qué queremos que piense? Si metemos demasiado humor e informalidad, no va a pensar que sea una aplicación seria. 

- ¿Cuántos UP reales tienen actualmente? Ahora mismo, unos 31 contando con empresas, transportitstas y personas de la clase. Suelen tener un 80% de respuesta. De los UP que tienen, ¿Cuántos son les empresas y cuáles transportistas? 10 transportitstas y 6 empresas (10 empleados). Estaría bien hacer una pequeña encuesta sobre la demo, para conocer la opinión de los clientes y que ellos promuevan ese video con compañeros. A Pablo le preocupa que el video está super bien para esta clase, pero puede que no sea el mejor vídeo de presentación para clientes serios.  

- Preocupa que no se oía muy bien en muchas partes. Hablaban muy bajo. Que hagan pruebas de volumen e incluso se planteen usar un micro. 

- En general, la parte de inversión no se ha visto muy en detalle el mensaje principal. Justificación: como debían hacer anuncios para distintos usuarios, se han centrado en clientes, y además tienen pensado cosas para los inversores, no van a trabajar desde cero.  

- En las estimaciones, los porcentajes deberían decir qué significan, para no tener que hacer cálculos. Pablo no entiende bien las estimaciones de a cuántos clientes quieren llegar y en qué momento. Los datos que pongan deben ser entendidos sin tener que coger la calculadora. El principal análisis que hace alguien cuando ve la gráfica es si es realista, y darle información para que vea que es realista. 

**Puntos positivos destacados**

- Han tenido en cuenta el feedback de la semana pasada.

- Buen ritmo de la presentación.

- Buen anuncio.

- Buena demo.

**Áreas de mejora sugeridas**

- Demo menos informal.

- Realizar pruebas de volumen.

- Usar micro.

- Indicar el significado de los porcentajes.

<br>

## **Sexto grupo (FISIO FIND):** 
**Feedback alumnos**

- No sabe ni por dónde empezar, el killer opener y los anuncios, y las videollamadas para dar paso a la otra presentadora, la página del modelo anatomico, los videos, todo está estupendo. 

- El anuncio de los inversores está genial.

- Hemos clavado la gestión del tiempo.

- ¿Tenemos pensado patentar la app?

**Feedback recibido (resumen de los comentarios de los profesores)**

- Si no llega a ser por lo que ha pasado con la demo habría aplaudido. 

- Hay muchas cosas muy buenas y destacables. 

- El killer opener se ha cambiado por un pseudo anuncio de inversores, ¿por qué? No queríamos hablar de dinero, paquete de inversiones, etc. Apostamos porque los inversores nos encuentren. Ya, pero hay que intentar, con prueba y error, llegar a los inversores. 

- Muy bien el anuncio, pero ya que es un video, hay que vocalizar un poco más, tener varias tomas. 

- El versus en la demo ha sido muy top. Lo de permitir una entrada estelar ha sido guay. 

- Cosas de mejora: no usar iconos genéricos en la aplicacion, hay que usar datos reales (imágenes de los fisios). 

- La demo en vivo tiene pros y contras, hay que prepararlo bien para que no haya contras. Problemas con la red, con la falta de zoom, etc.

- Genial lo de los anuncios específicos para características nuevas. Muy top. 

- El último video está bien pero parecía redundante. Todo lo que se vea en el video final ya se ha visto antes. Es como un resumen, pero podríamos invertir ese tiempo en otras cosas. Si se han enseñado detallitos no vistos antes, pues se dice en la presentación. 

**Puntos positivos destacados**

- Todo increible.

**Áreas de mejora sugeridas**

- Llegar a los inversores mediante prueba y error.

- Vocalizar en los videos.

- Usar datos reales.

- Preparar bien las demostraciones en vivo.

- Evitar las partes redundantes en la presentación. Usar el tiempo para otras cosas.

<br>


# **2. ANÁLISIS DEL FEEDBACK**

## **2.1. TENDENCIAS GENERALES**
**Factores comunes en los comentarios de los profesores**

- Los anuncios para inversores están presentes en todos los grupos, pero muchos aún tienen problemas con el enfoque del mensaje: o es demasiado informal, o no tiene suficientes datos reales (proyecciones, mercado, retornos…).

- La demo es una herramienta potente pero mal aprovechada en general: muchos grupos no siguen una narrativa clara o tienen problemas técnicos que restan profesionalidad.

- Varios grupos siguen sin aplicar completamente el ciclo de mejora continua (problema → acción → medida). Se menciona en varios casos la falta de objetivos y seguimiento de métricas.

- La informalidad o el exceso de humor se repite como algo a cuidar según el tipo de público al que se dirigen (clientes, inversores...).

- Se valora mucho cuando los grupos responden al feedback de semanas anteriores, aunque a veces no queda claro cómo lo priorizan.

**Puntos de fortaleza general en los equipos**

- Crecimiento en la calidad de presentación visual y audiovisual: muchos grupos han mejorado notablemente en el diseño de sus slides y vídeos, con estilos consistentes y buen uso del color, el ritmo y los efectos visuales.

- Mayor atención al discurso y la estructura: la mayoría de los equipos presentan una narrativa más clara que en semanas anteriores, cuidando la conexión entre secciones (inicio, demo, anuncio, cierre).

- Más creatividad en los formatos: hay una tendencia a experimentar con formatos distintos (entrevistas, dramatizaciones, videollamadas simuladas), lo que genera un mayor engagement.

- Buen trabajo en equipo: se percibe cohesión, roles claros y un sentimiento de pertenencia y orgullo en la mayoría de presentaciones.

- Respuesta al feedback anterior: muchos equipos han incorporado observaciones anteriores, especialmente en aspectos como ritmo, visuales o killer openers.

**Áreas de mejora recurrentes**

- Costes y métricas poco justificadas: sigue habiendo confusión entre términos financieros, falta de explicaciones en estimaciones y ausencia de métricas realistas o contrastadas con datos de mercado.

- Falta de priorización del feedback de usuarios piloto: aunque todos mencionan haberlo recibido, pocos explican cómo lo han priorizado o qué decisiones se han tomado a raíz de él.

- Anuncios mal enfocados según la audiencia: algunos anuncios son demasiado informales para inversores o demasiado vagos para clientes. Faltan enfoques estratégicos claros.

- Problemas de realismo en las demos: muchas demos presentan funcionalidades sin un contexto claro o con una narrativa débil. Algunas carecen de datos reales o imágenes creíbles que den confianza.

- Presencia de suposiciones no justificadas: se mencionan afirmaciones como “el mercado está creciendo” sin respaldo, lo que debilita el argumento.

- Uso de jergas internas o falta de contexto: hay casos donde se asume que la audiencia sabe lo que es una "pull request", un “terminator” o un "SLA", sin explicar los términos.

<br>

## **2.2. COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**

**¿Qué estamos haciendo bien en comparación con otros?**

- Narrativa audiovisual impecable: somos el grupo con mejor integración entre presentación, demo, killer opener y anuncio. Las transiciones y efectos (como las videollamadas para dar paso o el "versus" en la demo) han sido especialmente celebradas por los profesores.

- Alta creatividad en la estructura y formato de presentación: demostramos originalidad sin perder profesionalismo. Somos probablemente el grupo con mejor storytelling general.

- Gestión del tiempo muy destacada: a diferencia de otros equipos que se quedaron cortos o largos, nosotros hemos “clavado” el ritmo.

- Presentación clara y fluida: no se nos ha señalado ni problemas de ritmo, ni estructura, ni confusión del mensaje, como sí ha ocurrido en otros grupos.

- Anuncios específicos por funcionalidades: muy pocos grupos han pensado en esto, lo cual nos da un plus de personalización y orientación al cliente.

- Somos uno de los pocos grupos con demos en vivo, lo cual nos distingue, aunque con algunos riesgos técnicos que se deben trabajar.

**¿Qué aspectos debemos mejorar respecto a los demás?**

- Vocalización y calidad de audio en los vídeos: al igual que otros grupos, se nos recomienda hacer más tomas, vocalizar mejor y plantear incluso el uso de micros.

- Mostrar datos reales en la app: se nos ha mencionado el uso de iconos genéricos. A diferencia de otros, debemos integrar imágenes reales (ej. de fisioterapeutas), que aporten mayor credibilidad y profesionalidad.

- Preparación técnica de la demo en vivo: aunque fue valiente y diferente, tuvimos contratiempos como problemas de red o de visibilidad (falta de zoom). Otros grupos evitaron estos fallos porque usaron vídeos pregrabados.

- Evitar redundancias: el último vídeo fue percibido como repetitivo. Otros grupos han sido más eficaces al distribuir contenido sin reiteraciones.

- Mostrar intención hacia inversores: aunque evitamos hablar de dinero, se recomienda adoptar una mentalidad de prueba y error para conectar con inversores. Otros grupos han arriesgado más en esta línea (aunque no siempre bien).

<br>

## COMENTARIOS FINALES

- En el S1 y S2 van a dar la opción de recuperar parte de la nota, hasta un 50%. Los documentos a entregar estarán en la ev. Esos documentos deben estar para el 24 de abril, pero se entregarán como parte del Project Launcher. Esto no va a estar en el S3 y lo demás. 

- Van a dar la opción de subir nota individual hasta medio punto si formas parte de actividades entre semana santa y feria. Solo por participar tendríamos 0.25 y en función de preguntas que nos harán, podremos obtener el otro 0.25. Los viernes de 2:30 a 3:00. Si te quieres apuntar, debes registrarte en el formulario antes del 23 de abril. 

#### PRÓXIMA SEMANA

Piden 2 presentaciones pequeñas: una con la misma estructura que sea un ensayo del día de lanzamiento, de 10 minutos máximo. Otra presentación de 5 minutos con detalles más específicos de la fase del desarrollo en la que estamos: anotaciones sobre el marketing y tal. 

Una buena presentación de lanzamiento debe responder a 6 preguntas: 

- ¿De qué va el proyecto? Se puede responder con un killer opener, un anuncio muy cortito (1 min max). 

- ¿Qué hace exactamente? Una demo enlazada con una historia, relacionada a lo mejor con el anuncio del principio, por ejemplo. Tiene que ser consistente. 

- ¿A esto nadie se le ha ocurrido antes? Decir cuáles son los factores clave que nos diferencian de la competencia. 

- ¿Quién hay detrás de esto? Mostrar los participantes. 

- ¿Esto puede llegar a ser rentable? Puntos clave del modelo de negocio, planes, cómo ofrecemos el producto. Explicación de muy alto nivel del modelo de negocio: costes, ingresos, etc. Contar las oportunidades de inversión. 

- ¿Cómo contacto con este proyecto? Presentar algún enlace para que la persona pueda informarse y tal. 

Segunda presentación: 

- En este caso, la preparación del project lunch, podemos centrar la presentación en todo lo del marketing: cómo lo vamos a hacer, segmentación, qué usuarios tenemos en cuenta, etc. Persona: caracterización de un cliente ficticio, inventarse una pequeña biografía de alguien para poder tener un perfil que parezca realista, imaginarse varias personas con sus objetivos, frustraciones y tal, sirve para después saber enfocar los anuncios y demás. 

- Hay que analizar qué palabras clave queremos que sean importantes para buscar nuestro producto. 

- Analizar qué campañas vamos a realizar para anunciar el producto, las actividades. Analizar también cómo podemos expandirnos mediante colaboraciones, alianzas... 

- Cuál es el plan de community management, si tenemos un rol, los costes del marketing, el propio salario del cm. 

- Tambien centrarse en los anuncios: de inversor, de usuario y de cliente (en caso que usuario y cliente no sean lo mismo). Los anuncios no tienen por qué ser nuevos, con mejorar los que hay mediante el feedback es suficiente. 


# **3. CONCLUSIONES Y OBSERVACIONES**

- El feedback recibido posiciona a Fisio Find como un grupo referente en cuanto a puesta en escena, dominio narrativo y calidad visual del material presentado. La presentación transmite confianza, y la demo es percibida como una de las más profesionales, tanto por el diseño como por la funcionalidad mostrada.

- A nivel general, los comentarios de los profesores reflejan una necesidad compartida entre todos los equipos de mejorar en profundidad analítica. Aspectos como la justificación de métricas económicas, la trazabilidad de las acciones tomadas a partir del feedback recibido y la adecuación del discurso a diferentes públicos siguen siendo puntos débiles recurrentes.

- Nuestro grupo ha acertado al construir una narrativa sólida y cuidada, con una clara separación entre pitch, demo y anuncio. Esta estructura facilita la comprensión y permite que cada parte cumpla su propósito de forma específica. La profesionalidad en los vídeos, la atención al detalle visual y la coordinación del equipo son elementos que han sumado significativamente.

- Uno de los aspectos a reforzar es la visibilidad del trabajo con usuarios piloto: aunque se ha hecho un esfuerzo real en recoger y aplicar su feedback, no se ha comunicado de forma estructurada ni priorizada. Mostrar qué se ha hecho con esa información y cómo impacta en el desarrollo puede ser clave para reforzar la percepción de mejora continua.

- Otro eje de mejora está en el análisis de costes y beneficios. A día de hoy, no se refleja con claridad el punto de equilibrio ni se distinguen escenarios estratégicos (pesimista, esperado, optimista). Incorporar estos elementos, acompañados de una lectura accesible y realista, puede ser decisivo a la hora de convencer a perfiles más técnicos o inversores potenciales.

- Desde el punto de vista de la usabilidad en la demo, convendría reforzar la diferenciación visual entre los distintos perfiles de usuario y ajustar el ritmo narrativo para favorecer la comprensión del flujo sin sobrecargar de información.

- Finalmente, aunque el killer opener ha sido muy bien valorado, conviene revisar su evolución y coherencia narrativa con el resto del proyecto. A medida que el producto madura, también debe hacerlo el tono y el contenido del mensaje inicial, para seguir sorprendiendo sin perder solidez.

<br>

# 6.2. Feedback del día 25/04/2025 (semana 12)

# **1. RESUMEN DEL FEEDBACK POR GRUPO**

## **Primer grupo (Holos):**
**Feedback alumnos**

- Intencionalmente en blanco.

**Feedback recibido (resumen de los comentarios de los profesores)**

- El inicio podría haber sido más efectivo; había demasiado ruido y el micro se escucha algo distorsionado. Es importante hacer algo que detenga todo el ruido de la clase e intentar captar la atención.

- La presentación, respecto al flujo e imagen corporativa, estuvo muy bien.

- El presentador transmite una sensación de tranquilidad, algo muy difícil de conseguir.

- Hay que intentar evitar estar demasiado relajado, implementando cambios de ritmo para aportar dinamismo.

- Respecto a los costes, han mejorado, ya que se ha dado el número de artistas. Es importante caracterizar los datos que se expongan, así como las fuentes de donde se han obtenido.

- En el video para inversores, ya que se menciona que el mercado del arte está en auge, se debe aportar una referencia para poder dar credibilidad a dicha información.

- Intentar dar un perfil económico por parte de los artistas para conocer las probabilidades de que ellos se suscriban a la plataforma. Estos datos se pueden recabar mediante los usuarios piloto si están dispuestos a compartirlos.

- Respecto al video, el comienzo fue muy bueno con las gráficas. La diapositiva del Bitcoin hay que reevaluarla; si los inversores en Bitcoin no coinciden con el perfil de sus inversores, deberían replantear otra metáfora para el cierre.

- En el video de inversores se hizo referencia a los costes, pero fue algo confuso diferenciar exactamente a qué tipo de costes se referían.

- Kanban es un término muy técnico que no todo el mundo conoce, al igual que el pago ESCROW. Se debería intentar utilizar términos más comunes y con los que el público esté familiarizado.

**Puntos positivos destacados**

- Flujo de presentación e imagen corporativa.

- Transmitir una sensación de tranquilidad inigualable.

- Mejora en la presentación de los costes.

- Las gráficas iniciales en el video.

**Áreas de mejora sugeridas**

- Más dinamismo.

- Cuidado con la falta de captación de atención en el killer opener.

- Aportar referencias de datos.

- Reevaluar la gráfica de Bitcoin.

- Video de inversores confuso.

- Usar términos más comunes.

<br>

## **Segundo grupo (Gastrostock):** 
**Feedback alumnos**

- Intencionalmente en blanco.

**Feedback recibido (resumen de los comentarios de los profesores)**

- En algunas partes no se escuchaba bien.

- El anuncio inicial está bien, pero quizás se necesita aportar más información acerca de lo que se digitaliza.

- Cuando se presenta al equipo, se habla en pasado o presente, pero no en futuro. Hay que cuidar el tiempo verbal.

- Respecto a los costes, se dan demasiados detalles; quizás se podría acortar.

- De manera general, todos los grupos están trasladando los anuncios a la sección de marketing; esto debería incluirse en la primera presentación.

- La demo debería presentarse antes.

- Respecto al ritmo de la presentación, fue bastante bueno, y las ideas se hilvanaron correctamente.

- Intentar ajustarse más a la estructura propuesta para facilitar la narrativa de la información.

- El principal problema puede ser el desbalance en el peso de la presentación, que debería centrarse en explicar qué se ha hecho.

- Es mejor incluir brevemente un caso de uso core muy específico para que quede muy claro y, a partir de ahí, desarrollar la presentación.

- Respecto al tema del video, habría que intentar identificar mejor a los tipos de inversores a los que se quiere atraer.

**Puntos positivos destacados**

- Buen ritmo en la presentación.

- Anuncio inicial efectivo.

- Presentación clara del equipo.

- Correcta exposición de problemas.


**Áreas de mejora sugeridas**

- Mejorar la calidad del sonido

- Aportar más información sobre la digitalización

- Cuidar el uso de tiempos verbales

- Sintetizar la sección de costes

- Reorganizar la estructura de la presentación

- Adelantar la demo

- Equilibrar el contenido de la presentación

- Incluir un caso de uso específico

- Afinar el perfil de inversores

<br>

## **Tercer grupo (Eventbride):** 
**Feedback alumnos**

- Intencionalmente en blanco.

**Feedback recibido (resumen de los comentarios de los profesores)**

- El killer opener no ha sido el mejor, y lo sabéis.

- El recurso de la tarta ha estado muy bien utilizado; se recomienda seguir utilizándolo.

- Los competidores fueron presentados de manera muy clara.

- La presentación del equipo fue muy buena visualmente, aunque quizá estuvo demasiado especificada y resultó algo larga.

- La demo estuvo muy bien, pero no había personajes definidos, por lo que se notó la falta de personas.

- En las diapositivas 14 y 15, la letra era quizá un poco demasiado grande.

- El anuncio general está muy bien enfocado.

- Los perfiles estaban muy bien detallados.

- En la diapositiva 9 faltaba una "H".

**Puntos positivos destacados**

- El recurso de la tarta estuvo muy bien utilizado.

- Los competidores fueron presentados de manera clara.

- El equipo fue presentado de manera muy visual.

- La demo estuvo bien realizada.

- El anuncio general está muy bien enfocado.

- Los perfiles estaban muy bien detallados.

**Áreas de mejora sugeridas**

- Mejorar el killer opener.

- Ajustar la presentación del equipo para evitar exceso de especificaciones y reducir su duración.

- Incluir personajes en la demo para dar más contexto.

- Reducir el tamaño de la letra en las diapositivas 14 y 15.

- Corregir la falta ortográfica en la diapositiva 9.

<br>

## **Cuarto grupo (BORROO):** 
**Feedback alumnos**

- Intencionalmente en blanco.

**Feedback recibido (resumen de los comentarios de los profesores)**

- El anuncio inicial está bien, pero se puede reducir; a largo plazo puede volverse monótono.

- Cuidado con el uso de muletillas.

- Respecto a la demo, fue demasiado corta y rápida. No hay que tener miedo de mostrar más cosas, siempre y cuando puedan ser entendidas por un público general.

- Los planes de inversión resultaron algo pesados.

- En cuanto a la segunda presentación, se presentaron cuatro perfiles, pero solo se explicaron dos. Se debería marcar más claramente las diferencias entre los perfiles para evitar confusiones.

- En el anuncio dirigido a inversores, hay que intentar dar datos concretos y citar la fuente de los mismos.

- Faltó detallar cuándo y qué se va a publicar en las redes sociales.

- La calidad de la presentación, en cuanto a flujo y dinamismo, fue buena.

- Deberían mejorar el inicio efectivo, ya que incluir únicamente el anuncio puede ser poco impactante, además de que el anuncio se hacía algo largo.

- Cuando se habla de rentabilidad, hay que referirse a la posibilidad de que sea rentable, no afirmar directamente que "será rentable".

- Deben incluir, en el tema de la rentabilidad, el volumen de transacciones que efectúen los usuarios en la plataforma.

- A Pablo le pareció buena idea el concepto de paquetes de inversión, pero considera que puede haber demasiados paquetes. Podría ser mejor reducir su número y explicar que están abiertos a negociación.

- En la estructura de la presentación, lo que debe estar detallado correctamente es aquello que aporte valor a las personas que utilizarán la aplicación. Es importante mejorar el mensaje que se transmite acerca del producto.

**Puntos positivos destacados**

- El anuncio inicial fue correcto en su planteamiento.

- La calidad de la presentación en cuanto a flujo y dinamismo fue buena.

- La idea de los paquetes de inversión fue bien recibida.

**Áreas de mejora sugeridas**

- Optimizar el anuncio inicial.

- Mejorar la calidad de la presentación oral.

- Ampliar y estructurar mejor la demo.

- Clarificar el contenido de la presentación.

- Aportar datos concretos.

- Simplificar los planes de inversión.

- Mejorar el mensaje sobre el producto.

<br>

## **Quinto grupo (CAMYO):** 
**Feedback alumnos**

- Intencionalmente en blanco.

**Feedback recibido (resumen de los comentarios de los profesores)**

- El Killer Opener estuvo muy bien enfocado, pero se debería mejorar cómo el personaje escoge el plan de precios. Actualmente, simplemente menciona que el precio está bien, pero sería mejor añadir más razones o alicientes que justifiquen su elección, adaptándola a sus necesidades.

- Se debería intentar mostrar las características fundamentales dentro de la misma demo, para no tener que explicarlas primero de manera verbal y luego nuevamente en la demo.

- La primera parte de la presentación fue muy profesional y bien orientada al WPL.

- La luz estaba encendida delante del proyector, lo que dificultó la visibilidad de las diapositivas.

- La demo estuvo muy bien enfocada, aunque algunos profesores tuvieron problemas para ver correctamente, ya sea por el tamaño de la proyección o por la iluminación.

- El anuncio de inversores fue muy bueno; se basaron en temas reales, se explicaron los planes de inversión y se aportó información sobre el mercado que respalda la viabilidad del proyecto.

- Se dedicó demasiado tiempo a los planes de precios, ya que tienen una sección específica para ello y luego vuelven a aparecer en el video de inversores. Se podría ajustar para que se cuente únicamente en el video, y comentar brevemente solo las particularidades no mencionadas.

- En el video de inversores, estuvo muy bien que justificaran la fuente de los datos presentados.

- En la primera presentación se echó en falta más detalles sobre la gestión de redes sociales, como cuándo se realizará la subida de contenido.

- No se incluyeron los costes.

**Puntos positivos destacados**

- Killer Opener muy bien enfocado.

- Primera parte de la presentación muy profesional y bien orientada al WPL.

- Demo bien enfocada.

- Buen anuncio de inversores, basado en datos reales y planes de inversión claros.

- Justificación adecuada de las fuentes de datos en el video de inversores.

**Áreas de mejora sugeridas**

- Mejorar cómo el personaje escoge el plan de precios en la demo.

- Mostrar las características fundamentales dentro de la misma demo para evitar duplicidad de explicaciones.

- Mejorar las condiciones de visibilidad (controlar la iluminación y el tamaño de la proyección).

- Ajustar el tiempo dedicado a los planes de precios para evitar repeticiones.

- Incluir detalles sobre la gestión y calendario de publicaciones en redes sociales.

- Incorporar información sobre los costes.

<br>

## **Sexto grupo (FISIO FIND):** 
**Feedback alumnos**

- Intencionalmente en blanco.

**Feedback recibido (resumen de los comentarios de los profesores)**

- El video de presentación del equipo estuvo muy bien, pero faltaría especificar los roles de manera más general para que sea fácilmente entendido por un público general.

- El Killer Opener estuvo muy bien, aunque quizás se podría encontrar algo aún más “impactante”. Un punto muy positivo es que siempre se presenta un nuevo Killer Opener.

- Para Cristina, el Killer Opener fue más apropiado y alineado con el mensaje que se quería transmitir.

- Se dedicó demasiado tiempo a explicar características que posteriormente se repiten en la demo.

- Se echó en falta la presencia de actores en el Killer Opener para alinearlo mejor con la demo y los posibles anuncios.

- Aunque la primera presentación fue muy profesional, en algunas secciones el flujo no fue tan bueno como debería. Sería recomendable explicar antes de un video qué contenido introduce (si es demo o anuncio).

- Aunque en algunas partes el flujo no fue óptimo, eso no quita todo el trabajo importante que hay detrás.

- La diapositiva 10 pudo alterar el flujo de la presentación, afectando la continuidad.

- En cuanto a posibles muletillas, se debería evitar decir "FisioFind pretende" y utilizar "FisioFind hace".

- Muy bien incluir los costes en la presentación.

- Para el anuncio de inversores, sería recomendable preparar una versión más corta.

- Aunque no se incluyeron los planes de inversión, se argumentó adecuadamente el motivo.

- El proyecto muestra mucho potencial para el futuro.

- Respecto al anuncio de FisioFind, aunque gustó, sería importante inferir más contexto para personas que no conocen la aplicación.

- Puede ser buena idea que el fisioterapeuta comience trabajando de manera offline y que reciba un flyer de FisioFind invitándolo a hacer fisioterapia online, aportando así más contexto.

- Faltó incluir métricas sobre el posicionamiento SEO.

- En los planes de precios debería aclararse que el precio es por mes; actualmente pone "PERMANENTE".

- Faltó incluir el tema de los perfiles (profiles)

**Puntos positivos destacados**

- Muy buena presentación del equipo.

- Killer Opener bien enfocado y renovado.

- El anuncio de FisioFind gustó.

- Correcta inclusión de los costes en la presentación.

- Buena argumentación sobre la no inclusión de los planes de inversión.

- El proyecto tiene gran potencial de futuro.

**Áreas de mejora sugeridas**

- Especificar los roles del equipo de manera más general para un público amplio.

- Buscar un Killer Opener aún más impactante.

- Evitar repetir la explicación de características en la demo.

- Incluir actores en el Killer Opener para mejor cohesión narrativa.

- Mejorar el flujo de la presentación, especialmente en los cambios entre secciones y videos.

- Introducir los videos explicando su contenido previamente.

- Evitar muletillas como “FisioFind pretende”.

- Preparar una versión más corta del anuncio de inversores.

- Añadir más contexto en los anuncios para usuarios no familiarizados con la aplicación.

- Incluir métricas sobre SEO.

- Corregir el error en los planes de precios, indicando el coste mensual.

- Incluir información sobre los perfiles (profiles).

<br>


# **2. ANÁLISIS DEL FEEDBACK**

## **2.1. TENDENCIAS GENERALES**
**Factores comunes en los comentarios de los profesores**

- Valoración positiva de la calidad visual y estructural de las presentaciones iniciales.

- Buenas ideas en los anuncios de inversores, especialmente cuando se basan en datos reales y están bien argumentados.

- Presentadores que transmiten tranquilidad y profesionalidad, aunque a veces falta dinamismo o cambios de ritmo.

- Reconocimiento del esfuerzo y del potencial de los proyectos.

- Problemas recurrentes de sonido, visibilidad o falta de claridad en algunas demos.

**Puntos de fortaleza general en los equipos**

- Cuidado de la imagen corporativa y presentación visual.

- Buen trabajo en la identificación de oportunidades de mercado y presentación de datos de inversión.

- Presentaciones profesionales en las primeras fases.

- Capacidad de adaptación en los Killer Openers, proponiendo nuevas ideas en cada iteración.

- Inclusión progresiva de justificación de datos y costes en los discursos.

**Áreas de mejora recurrentes**

- Mejorar el control del flujo de la presentación para que sea más natural y claro.

- Ajustar y equilibrar mejor los tiempos dedicados a las diferentes secciones (especialmente evitar repeticiones entre presentaciones y demos).

- Cuidar el lenguaje técnico: evitar términos poco conocidos o explicar su significado.

- Incorporar más contexto en las demos y anuncios para públicos no familiarizados.

- Definir y justificar mejor los datos y métricas utilizadas (por ejemplo, referencias de mercado, métricas SEO).

- Clarificar mensajes sobre precios y rentabilidad, y ser más precisos en la presentación de modelos de negocio.

- Mejorar la introducción de los vídeos (avisar si es demo, anuncio, etc.).

<br>

## **2.2. COMPARACIÓN DEL FEEDBACK DE NUESTRO GRUPO VS LOS OTROS**

**¿Qué estamos haciendo bien en comparación con otros?**

- Nuestro equipo presentó de forma muy profesional y visualmente atractiva.

- Conseguimos que el Killer Opener estuviera alineado con el mensaje principal y valorado positivamente por los profesores.

- La inclusión de los costes fue correcta, un detalle que otros equipos olvidaron.

- Argumentamos adecuadamente la decisión de no incluir planes de inversión en esta fase, mostrando criterio estratégico.

- Mostramos una buena capacidad de mejora continua, presentando nuevos Killer Openers y adaptándonos al feedback recibido.

- Se reconoció que el proyecto tiene un gran potencial a futuro, algo que no todos los grupos consiguieron transmitir.

**¿Qué aspectos debemos mejorar respecto a los demás?**

- Especificar mejor los roles del equipo de manera más sencilla y accesible para públicos generales.

- Hacer que el flujo de la presentación sea más fluido, especialmente en los cambios entre secciones y vídeos.

- Añadir actores o representaciones más claras en los Killer Openers y en las demos para reforzar la narrativa.

- Incluir métricas clave de SEO para reforzar la estrategia digital.

- Mejorar el contexto en los anuncios para personas que no conocen previamente la aplicación.

- Corregir pequeños errores como en la presentación de los precios ("por mes" en lugar de "permanente") y asegurarnos de incluir todos los elementos clave (como los perfiles o profiles).

<br>

## COMENTARIOS FINALES

- Intencionalmente en blanco. 

#### PRÓXIMA SEMANA

No hay nada nuevo. Se subirá la última píldora teórica del curso.

Primera presentación:

- Estructura:

    - Killer opener más anuncio de usuarios.

    - Qué hace exactamente, añadir la demo para clarificar ciertos aspectos.

    - Competencia.

    - Quién hay detrás (equipo).

    - ¿Podría ser rentable?

    - Planes de precio.

    - Costes de estimación.

    - Anuncio de inversores.

    - Landing page.

Segunda presentación (tener en cuenta las píldoras teóricas):

- Profiles.

- SEO.

- Campaña de lanzamiento.

- Community management, todas las estrategias de marketing.

- Costes de marketing.

- Anuncios, vídeos y banners.


# **3. CONCLUSIONES Y OBSERVACIONES**

- La estructura general de las presentaciones ha sido adecuada, siguiendo un esquema lógico que permite transmitir el proyecto de forma clara: introducción impactante (Killer Opener), explicación del producto, análisis de competencia, equipo, viabilidad económica, y cierre con anuncios y landing page.

- Se ha valorado positivamente la profesionalidad en la exposición, el diseño visual de las presentaciones, la correcta inclusión de costes y la constante búsqueda de mejorar los Killer Openers.

- El proyecto muestra un gran potencial a futuro, algo destacado recurrentemente por los profesores. Esto es un indicador de que la idea de negocio es sólida, aunque su presentación debe seguir puliéndose.

- Las principales áreas de mejora giran en torno al flujo y la narrativa: es necesario lograr una transición más fluida entre las diferentes partes de la presentación, explicando previamente los contenidos de los vídeos, y evitando repeticiones innecesarias entre explicación verbal y demos.

- Se debe prestar especial atención a la estrategia digital: integrar correctamente las métricas SEO, detallar la gestión de redes sociales y optimizar los mensajes en anuncios y campañas para públicos que no conocen la aplicación.

- Es importante adaptar el lenguaje tanto técnico como comercial, asegurándose de que sea accesible para todo tipo de audiencia, y utilizando expresiones más directas y firmes ("FisioFind hace", en lugar de "FisioFind pretende").

- El tratamiento de los precios y rentabilidad debe ser más claro y preciso, indicando correctamente términos como “precio por mes” y hablando de la "posibilidad" de rentabilidad en lugar de asegurarla.

- La implementación de perfiles y personalización en las presentaciones sigue siendo una asignatura pendiente, que puede enriquecer mucho la narrativa de usuario y el enfoque de marketing.
