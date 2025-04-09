---
title: "INFORME DE USUARIOS PILOTO"                      # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 3"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "26/03/2025"                                        # CHANGE IF NEEDED
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
header-left: "INFORME DE USUARIOS PILOTO (SPRINT 3)"                # CHANGE IF NEEDED
header-right: "06/04/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  INFORME DE USUARIOS PILOTO (SPRINT 3)
</h1>

<br>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
- [2. LISTA DE USUARIOS PILOTO](#2-lista-de-usuarios-piloto)
    - [FISIOTERAPEUTAS](#fisioterapeutas)
    - [PACIENTES](#pacientes)
    - [USUARIOS PILOTO TÉCNICOS](#usuarios-piloto-técnicos)
- [3. FEEDBACK OBTENIDO](#3-feedback-obtenido)
  - [3.1. PROBLEMAS DETECTADOS](#31-problemas-detectados)
  - [3.2. FUNCIONALIDADES VALORADAS POSITIVAMENTE](#32-funcionalidades-valoradas-positivamente)
  - [3.3. PRINCIPALES OBSERVACIONES Y SUGERENCIAS](#33-principales-observaciones-y-sugerencias)
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

- **Entregable:** #SPRINT 3

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Guadalupe Ridruejo Pineda](https://github.com/guaridpin) (revisor), [Antonio Macías Ferrera](https://github.com/antoniommff) (autor)

- **Fecha de Creación:** 06/04/2025  

- **Versión:** v1.0

<br>


---

**Historial de modificaciones**

| Fecha        | Versión  | Realizada por             | Descripción de los cambios                   |
| ------------ | -------- | ------------------------- | -------------------------------------------- |
| 06/04/2025   | v1.0     | Antonio Macías Ferrera    | Versión inicial del documento con el feedback para el Sprint 3. |
| 09/04/2025   | v1.1     | Guadalupe Ridruejo Pineda    | Modificación del formato de la prueba. |

<br>

<!-- \newpage -->

<br>


# 1. INTRODUCCIÓN

En este documento se recogerá el feedback recogido en la fase piloto de Fisio Find. Se analizarán las opiniones y comentarios recibidos, identificando problemas detectados, funcionalidades mejor valoradas y áreas de mejora. También se evaluarán a los usuarios piloto técnicos (estudiantes de la asignatura ISPP).

Debido a la complejidad y al volumen de datos necesarios para preparar una prueba completa dirigida a los usuarios piloto externos (fisioterapeutas y pacientes), se ha decidido posponer dicha prueba hasta el próximo 12 de abril. Para entonces, se contará con una versión completamente estable y definitiva correspondiente al Sprint 3. Los usuarios piloto externos podrán aprovechar el periodo de Semana Santa para realizar la prueba.

Por otro lado, los usuarios piloto técnicos sí llevarán a cabo su prueba. Para ello, se les ha proporcionado un conjunto de credenciales que les permitirá acceder tanto como fisioterapeuta como paciente, con el objetivo de evaluar el funcionamiento de las videoconsultas.

# 2. LISTA DE USUARIOS PILOTO

Se presenta un listado de los usuarios piloto que participarán en las pruebas de FISIO FIND, detallando sus perfiles:


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
| Alejandro Pedrido Galván        |            | /TODO                 |    |


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

En este apartado se presentan las principales observaciones, problemas detectados y funcionalidades mejor valoradas en la fase de pruebas de este Sprint 3.

Para priorizar la corrección de los problemas detectados y sugerencias de mejora, se seguirá el siguiente orden de prioridad:

1. **Gestión de usuarios:** habrá que priorizar y prestar más atención a todos los errores reportados sobre la gestión de usuarios. Esto incluye problemas para registrarse e iniciar sesión, especialmente en el caso de los fisioterapeutas, quienes dependen de una correcta comprobación de su número de colegiado para acceder al sistema. También se abordarán las acciones limitadas por una mala implementación de la gestión de tokens y cookies de sesión.

2. **Rigor clínico:** se deberá prestar especial atención a los errores reportados que reflejen incoherencias entre la plataforma y el ejercicio profesional de la fisioterapia. Es fundamental garantizar que las funcionalidades y la información proporcionada sean consistentes con las prácticas clínicas y éticas de la profesión.

3. **Funcionalidades principales:** en tercer lugar, se dará prioridad a los errores y observaciones reportados que impacten en las funcionalidades principales definidas dentro del alcance del proyecto (MVP). Esto incluye cualquier problema que afecte el núcleo de la plataforma, como la reserva de citas, la gestión de pacientes o el acceso a ejercicios terapéuticos.

4. **Experiencia de usuario (UX):** se priorizarán los comentarios y observaciones relacionados con la facilidad de uso, la navegación intuitiva y la estética de la plataforma. Se buscará mejorar la interacción del usuario con el sistema, asegurando que las funcionalidades sean accesibles, claras y agradables de utilizar. Además, se atenderán los problemas reportados que dificulten la experiencia general, como tiempos de carga, errores visuales o inconsistencias en el diseño.

Este enfoque permitirá abordar de manera estructurada las áreas críticas de mejora, asegurando que la plataforma evolucione para satisfacer las necesidades tanto de los fisioterapeutas como de los pacientes y usuarios técnicos.

## 3.1. PROBLEMAS DETECTADOS

Se detallan los principales problemas encontrados por los usuarios piloto durante la prueba de la plataforma, junto con su impacto y posibles soluciones.

| Error                                      | Motivo                                                                                                                                                                                                                                            | Solución                                                                                                                                                                                                                                                                                                   | Prioridad | Impacto |
|-------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|---------|
| **Errores en el registro de fisioterapeutas** | Diferencia entre el número de colegiado en la tarjeta física (ej. 02300) y el registrado en la base de datos oficial (ej. 2300), lo que causa fallos en el script de validación. | Incluir un enlace a la BBDD del colegio profesional correspondiente en el formulario para verificar el número antes de ingresarlo. Además, se hará una batería de pruebas con combinaciones comunes en diferentes comunidades autónomas. | 1 | ALTO |
| /TODO   |      |           |         |      |

## 3.2. FUNCIONALIDADES VALORADAS POSITIVAMENTE

Los usuarios destacaron varias funcionalidades que mejoraron significativamente su experiencia:

 /TODO   



## 3.3. PRINCIPALES OBSERVACIONES Y SUGERENCIAS

Los usuarios piloto realizaron valiosas aportaciones sobre la experiencia general con la plataforma. A continuación, se recogen las sugerencias de mejora más reiteradas por nuestros usuarios piloto:




# 4. CONCLUSIONES, LECCIONES APRENDIDAS Y PROCESADO DEL FEEDBACK

La fase piloto ha permitido identificar fortalezas clave de la plataforma, así como diversas áreas de mejora que resultan cruciales para alcanzar un producto sólido y adaptado a las necesidades reales de fisioterapeutas y pacientes. La recopilación de feedback ha sido variada, representativa y útil para marcar prioridades de desarrollo en los siguientes sprints.

 /TODO   



## 4.1. AJUSTES REALIZADOS EN BASE AL FEEDBACK

Tras la evaluación del feedback, se han realizado los siguientes cambios en la plataforma:


/TODO




## 4.2. ESTRATEGIAS DE MEJORA FUTURA

 /TODO   


# 5. EVALUACIÓN DE LA EXPERIENCIA PILOTO

| Usuario (uvus) | Fecha acceso | Feedback | Clockify | Fallos encontrados | Recomendaciones / Comentarios |
|----------------|--------------|----------|----------|---------------------|-------------------------------|
| Antonio Daniel Porcar Aragón (**antporara**) | /04/2025 | /04/2025 | [antporara]() |  /TODO    |  |
| Antonio Jiménez Ortega (**antjimort**) | /04/2025 | /04/2025 | [antjimort]() |  |  |
| David Guillén Fernández (**davguifer**) | /04/2025 | /04/2025 | [davguifer]() |  |  |
| Jaime Linares Barrera (**jailinbar**) | /04/2025 | /04/2025 | [jailinbar]() |  |  |
| Javier Ulecia García (**javulegar**) | /04/2025 | /04/2025 |[javulegar]() |  |  |
| José Manuel Miret Martín (**josmirmar2**) | /04/2025 | /04/2025 | [josmirmar2]() |  |  |
