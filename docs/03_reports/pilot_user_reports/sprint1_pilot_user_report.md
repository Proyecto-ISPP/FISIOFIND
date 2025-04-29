---
title: "INFORME DE USUARIOS PILOTO"                      # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 1"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "26/02/2025"                                        # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../../.backgrounds/background1V.pdf"  # CHANGE IF NEEDED
header-left: "INFORME DE USUARIOS PILOTO (SPRINT 1)"                # CHANGE IF NEEDED
header-right: "26/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  INFORME DE USUARIOS PILOTO (SPRINT 1)
</h1>

<br>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
- [2. LISTA DE USUARIOS PILOTO](#2-lista-de-usuarios-piloto)
    - [FISIOTERAPEUTAS](#fisioterapeutas)
    - [PACIENTES](#pacientes)
    - [USUARIOS PILOTO TÉCNICOS](#usuarios-piloto-técnicos)
- [3. FEEDBACK OBTENIDO](#3-feedback-obtenido)
  - [3.1. PRINCIPALES OBSERVACIONES Y SUGERENCIAS](#31-principales-observaciones-y-sugerencias)
- [3.2. PROBLEMAS DETECTADOS](#32-problemas-detectados)
- [3.3. FUNCIONALIDADES VALORADAS POSITIVAMENTE](#33-funcionalidades-valoradas-positivamente)
- [4. CONCLUSIONES, LECCIONES APRENDIDAS Y PROCESADO DEL FEEDBACK](#4-conclusiones-lecciones-aprendidas-y-procesado-del-feedback)
  - [4.1. AJUSTES REALIZADOS EN BASE AL FEEDBACK](#41-ajustes-realizados-en-base-al-feedback)
  - [4.2. ESTRATEGIAS DE MEJORA FUTURA](#42-estrategias-de-mejora-futura)
- [5. EVALUACIÓN DE LA EXPERIENCIA PILOTO](#5-evaluación-de-la-experiencia-piloto)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 1

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Guadalupe Ridruejo Pineda](https://github.com/guaridpin) (autor), [Antonio Macías Ferrera](https://github.com/antoniommff) (revisor)

- **Fecha de Creación:** 26/02/2025  

- **Versión:** v1.2

<br>


---

**Historial de modificaciones**

| Fecha        | Versión  | Realizada por             | Descripción de los cambios                   |
| ------------ | -------- | ------------------------- | -------------------------------------------- |
| 26/02/2025   | v1.0     | Guadalupe Ridruejo Pineda | Versión inicial del documento                |
| 27/02/2025   | v1.1     | Guadalupe Ridruejo Pineda | Redacción de secciones                       |
| 10/03/2025   | v1.2     | Antonio Macías Ferrera    | Adición de participantes técnicos, rúbrica de evaluación de participantes técnicos, adecuación para entrega del #SPRINT 1 |

<br>

<!-- \newpage -->

<br>


# 1. INTRODUCCIÓN

En este documento se recogerá el feedback recogido en la fase piloto de FISIO FIND. Se analizarán las opiniones y comentarios recibidos, identificando problemas detectados, funcionalidades mejor valoradas y áreas de mejora. También se evaluarán a los usuarios piloto técnicos (estudiantes de la asignatura ISPP).

# 2. LISTA DE USUARIOS PILOTO

Se presenta un listado de los usuarios piloto que participarán en las pruebas de FISIO FIND, detallando sus perfiles y *la relevancia de su participación en la evaluación de la plataforma*:


### FISIOTERAPEUTAS

| Nombre                          | Ámbito Profesional       | Especialidades                                                         | Experiencia    |
| ------------------------------- | ------------------------ | ---------------------------------------------------------------------- | -------------- |
| Cristina Gómez Ramos            | En una clínica           | Traumatológica y ortopédica                                            | 1-5 años       |
| Carlos Solo de Zaldivar Liviano | En una clínica           | Traumatológica y ortopédica, Deportiva, Neurológica                    | Menos de 1 año |
| Javier Rodriguez Hava           | Autónomo/a               | Deportiva                                                              | 1-5 años       |
| Alba                            | En un centro de salud    | Traumatológica y ortopédica, Neurológica, Geriátrica, Cardiaca         | 5-10 años      |
| Jorge García Chaparro           | En una clínica           | Traumatológica y ortopédica, Deportiva                                 | Menos de 1 año |
| Gonzalo Herrera Fernández       | Autónomo/a               | Traumatológica y ortopédica, Deportiva                                 | 5-10 años      |
| Pablo Ramírez Toro              | En una clínica           | Traumatológica y ortopédica, Deportiva                                 | Menos de 1 año |
| Irene Bernal Martínez           | Autónomo/a               | Terapia manual, Miofascial, Osteopatía, General, Ejercicio Terapéutico | 5-10 años      |
| Lidia Fernández Anselmo         | Autónomo/a               | Traumatológica y ortopédica, Deportiva, Suelo pélvico y/o Obstétrica   | 1-5 años       |
| Cristina Sánchez Gómez          | Atención a la diversidad | Deportiva, Geriátrica                                                  | Más de 10 años |
| José Antonio Martín Parada      | En un centro de salud    | Salud Comunitaria                                                      | Más de 10 años |
| María Martín Aragón             | Atención a la diversidad | Traumatológica y ortopédica, Geriátrica, Suelo pélvico y/o Obstétrica  | Más de 10 años |
| Isabel Valares Avís             | Atención a la diversidad | Neurológica                                                            | Más de 10 años |
| María Vallejo                   | Autónomo/a               | Traumatológica y ortopédica, Deportiva, Suelo pélvico y/o Obstétrica   | 5-10 años      |
| Eusebia Cano Gil                | En un hospital           | Traumatológica y ortopédica, Respiratoria, Rehabilitación Cardiaca     | Más de 10 años |
| Marina Gonzalez Sanchez         | En un hospital           | Deportiva                                                              | Más de 10 años |


### PACIENTES

| Nombre Completo        | Edad         | ¿Ha acudido al fisioterapeuta? | Frecuencia         | Motivo de consulta     | ¿Busca fisioterapeutas por internet? | Preferencias de selección |
| ---------------------- | ------------ | ------------------------------ | ------------------ | ---------------------- | -------------------- | ------------------------- |
| Pedro Pablo Gallego Mendoza     | Más de 60   | Sí                             | Ocasional      | Tendinitis, dolor muscular               | No                                   | Recomendaciones                                     |
| Marta García Maldonado          | 18-25       | Sí                             | Ocasional      | Dolor de espalda                         | No                                   | Ubicación, Precio, Recomendaciones, Disponibilidad  |
| Francisco Muñoz Sánchez         | 18-25       | Sí                             | Una vez al año      | Recuperación para oposiciones de bombero | No                                   | Ubicación, Precio, Recomendaciones                  |
| Carmen Bilbao Marcos            | 18-25       | Sí                             | Una vez al año      | Suelo pélvico                            | No                                   | Ubicación, Precio, Especialización                  |
| Andrea Ruiz                     | 18-25       | Sí                             | Ocasional      | Dolor de espalda                         | No                                   | Ubicación, Recomendaciones                          |
| Antonio Macías Barrera          | 41-60       | Sí                             | Ocasional      | Recuperación posoperatoria               | No                                   | Ubicación, Precio, Recomendaciones                  |
| M° Dolores Ferrera Ortiz        | 41-60       | Sí                             | Ocasional      | Problemas de rodilla                     | No                                   | Recomendaciones                                     |
| Rodrigo Macías Ferrera          | Menos de 18 | No                             |                     | Nunca ha acudido a fisioterapia          | No                                   | Precio, Especialización                             |
| Leonor Moreno Ortiz             | 26-40       | Sí                             | Ocasional      | Suelo pélvico                            | No                                   | Ubicación, Precio, Especialización, Recomendaciones |
| Sara Allouani Mechfaoui         | 18-25       | Sí                             | Ocasional      | Dolor de espalda                         | Sí                                   | Precio, Especialización, Recomendaciones            |
| Guadalupe Pineda Tejeda         | 41-60       | Sí                             | Ocasional      | Dolor de espalda                         | No                                   | Ubicación, Precio                                   |
| Reyes Ismael Sánchez Parra      | 18-25       | Sí                             | Varias veces al año | Dolor de espalda, Lesión deportiva       | No                                   | Ubicación, Precio, Recomendaciones                  |
| Laura Fuentes González          | 18-25       | Sí                             | Ocasional      | Dolor de espalda                         | No                                   | Precio, Especialización, Recomendaciones            |
| Francisco Manuel Gómez Manzorro | 18-25       | Sí                             | Ocasional      | Dolor de espalda                         | No                                   | Especialización                                     |
| Borja Lozano Marcos             | 18-25       | Sí                             | Ocasional      | Nudillo roto                             | No                                   | Precio                                              |
| Ester Palomar Bonet             | 18-25       | Sí                             | Ocasional      | Dolor de espalda                         | No                                   | Ubicación, Recomendaciones, Disponibilidad          |
| María Macías Barrera            | 41-60       | Sí                             | Ocasional      | Dolor de espalda                         | No                                   | Ubicación, Precio, Especialización                  |
| Luis Manuel Martín Domínguez    | 41-60       | Sí                             | Ocasional      | Lesión deportiva                         | No                                   | Ubicación, Precio                                   |


### USUARIOS PILOTO TÉCNICOS

| Nombre Completo   | Edad     | ¿Ha acudido al fisioterapeuta? | Frecuencia        | Motivo de consulta   | ¿Busca fisioterapeutas por internet? | Preferencias de selección |
| ----------------- | -------- | ------------------------------ | ----------------- | -------------------- | -------------------------------- | ----------------- |
| Antonio Daniel Porcar Aragón | 18-25 | [Sí/No]                        | [Frecuencia] | [Motivo] | [Sí/No]                              | [Preferencias] |
| Antonio Jiménez Ortega       | 18-25 | [Sí/No]                        | [Frecuencia] | [Motivo] | [Sí/No]                              | [Preferencias] |
| David Guillén Fernández      | 18-25 | [Sí/No]                        | [Frecuencia] | [Motivo] | [Sí/No]                              | [Preferencias] |
| Jaime Linares Barrera        | 18-25 | [Sí/No]                        | [Frecuencia] | [Motivo] | [Sí/No]                              | [Preferencias] |
| Javier Ulecia García         | 18-25 | [Sí/No]                        | [Frecuencia] | [Motivo] | [Sí/No]                              | [Preferencias] |
| José Manuel Miret Martín     | 18-25 | [Sí/No]                        | [Frecuencia] | [Motivo] | [Sí/No]                              | [Preferencias] |

<br>

<!-- \newpage -->

<br>


# 3. FEEDBACK OBTENIDO

*El feedback de los usuarios piloto fue clave para evaluar la plataforma y determinar las mejoras necesarias. En este apartado se presentan las principales observaciones, problemas detectados y funcionalidades mejor valoradas.*

## 3.1. PRINCIPALES OBSERVACIONES Y SUGERENCIAS

*Se recogen los comentarios y sugerencias más relevantes de los usuarios piloto, destacando aspectos positivos y áreas de mejora.*

# 3.2. PROBLEMAS DETECTADOS

*Se identifican los principales problemas encontrados por los usuarios piloto durante la prueba de la plataforma, junto con su impacto y posibles soluciones.*

# 3.3. FUNCIONALIDADES VALORADAS POSITIVAMENTE

*Se detallan las características y funcionalidades de FISIO FIND que recibieron comentarios positivos por parte de los usuarios piloto, identificando fortalezas clave del producto.*

# 4. CONCLUSIONES, LECCIONES APRENDIDAS Y PROCESADO DEL FEEDBACK

*En este apartado se presentan las conclusiones generales del informe, las lecciones aprendidas y las acciones tomadas en base al feedback de los usuarios piloto.*

## 4.1. AJUSTES REALIZADOS EN BASE AL FEEDBACK

*Se describen los cambios y mejoras implementadas en la plataforma tras analizar las opiniones y sugerencias de los usuarios piloto.*

## 4.2. ESTRATEGIAS DE MEJORA FUTURA

*Se establecen estrategias y planes de acción para continuar mejorando FISIO FIND en futuros sprints, basándose en la experiencia obtenida en esta fase piloto.*



# 5. EVALUACIÓN DE LA EXPERIENCIA PILOTO

| Usuario piloto (uvus) | Fecha acceso al sistema | Fecha envío de feedback | Enlace Clockify | Fallos encontrados | Recomendaciones de mejora | Otros comentarios |
|----------------------|------------------------|------------------------|----------------|-------------------|------------------------|------------------|
| Antonio Daniel Porcar Aragón (antporara) | 12/03/2025 18:30 | 12/03/2025 18:45 | [antporara](https://app.clockify.me/shared/67d18452becbe07bd98ec838) | - | Asegurarse de que cualquiera de las versiones desplegadas se encuentre disponible en todo momento | Me ha parecido bastante interesante el contenido realizado por redes sociales y de buena calidad. |
| Antonio Jiménez Ortega (antjimort) | 11/03/2025 15:30 | 11/03/2025 15:41 | [antjimort](https://app.clockify.me/shared/67d1d1a8ef0d12419bbe3b19) | • En la parte de inicio, cuando bajas, en la parte de enlaces sale "Acerca de" y está duplicado.<br>• Cuando le das a "Probar demo", si bajas aparecen palabras en inglés encima de los iconos de las redes sociales.<br>• En la demo, si le das a inicio, desaparecen las demás opciones del header.<br>• Puedes registrar procesos sin añadir número de series o dolor.<br>• En los ejercicios no se ven los vídeos. | De momento, si fuera posible intentaría conseguir desplegar la app en algún sitio que tuviera mejores tiempos de carga (aunque entiendo que sería difícil puesto que en la mayoría de las plataformas es necesario pagar para ello) | En general, la landing page es muy bonita, sencilla, fácil de usar y no es complicado encontrar la información en ella. Bajo mi opinión, tenéis mi 10. |
| David Guillén Fernández (davguifer) | 11/03/2025 20:25 | 11/03/2025 21:00 | [davguifer](https://app.clockify.me/shared/67d08fd1becbe07bd98cb6a8) | • En la parte de inicio, "Acerca de" está duplicado<br>• Palabras en inglés en iconos de redes sociales en demo<br>• Más iconos de redes sociales en demo que en inicio<br>• Desaparecen opciones del header al dar a inicio<br>• Se pueden registrar procesos sin series o dolor<br>• Videos de ejercicios no visibles | • Mejorar reordenamiento en búsquedas con filtros<br>• Cambiar color de fechas disponibles a verde en calendario<br>• Sombrear días no laborables<br>• Añadir fotos de fisios en reserva de citas | Lo veo bastante bien en general, he comentado cosas que seguramente en un futuro se solucionarían. Me gusta bastante. |
| Jaime Linares Barrera (jailinbar) | 11/03/2025 20:27 | 11/03/2025 21:08 | [jailinbar](https://app.clockify.me/shared/67d09057becbe07bd98cb84d) | • Sección "Acerca de" duplicada tres veces<br>• Términos en inglés en demo (footer)<br>• Videos de ejercicios no cargan<br>• Permite registros sin series ni dolor<br>• Sistema permite reservas en fechas pasadas | • Ajustar color de fondo en sección "Sobre nosotros"<br>• Optimizar rendimiento y tiempos de carga | Muy completa y buen diseño en general. |
| Javier Ulecia García (javulegar) | 12/03/2025 11:30 | 12/03/2025 12:15 | [javulegar](https://app.clockify.me/shared/67d0567e06a063047ed3554d) | En la demo, al ver el listado de pacientes siendo fisio los detalles llevan a una página que no existe | • Reducir tamaño de fotos de perfil de fisios<br>• Mostrar todas las citas con botón de gestión | - |
| José Manuel Miret Martín (josmirmar2) | 12/03/2025 14:55 | 12/03/2025 15:04 | [josmirmar2](https://app.clockify.me/shared/67d08d5e06a063047ed41c21) | Ninguno. Da las funcionalidades principales que me gustaría que tuviera | Añadir información de contacto y dirección del fisioterapeuta para atención presencial | Me gusta la idea, la usaría |
