---
title: "INFORME DE USUARIOS PILOTO"                      # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 2"
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
header-left: "INFORME DE USUARIOS PILOTO (SPRINT 2)"                # CHANGE IF NEEDED
header-right: "26/03/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  INFORME DE USUARIOS PILOTO (SPRINT 2)
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

- **Entregable:** #SPRINT 2

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Guadalupe Ridruejo Pineda](https://github.com/guaridpin) (autor), [Antonio Macías Ferrera](https://github.com/antoniommff) (revisor)

- **Fecha de Creación:** 26/03/2025  

- **Versión:** v1.0

<br>


---

**Historial de modificaciones**

| Fecha        | Versión  | Realizada por             | Descripción de los cambios                   |
| ------------ | -------- | ------------------------- | -------------------------------------------- |
| 26/03/2025   | v1.0     | Guadalupe Ridruejo Pineda | Versión inicial del documento con el feedback reportado               |

<br>

<!-- \newpage -->

<br>


# 1. INTRODUCCIÓN

En este documento se recogerá el feedback recogido en la fase piloto de Fisio Find. Se analizarán las opiniones y comentarios recibidos, identificando problemas detectados, funcionalidades mejor valoradas y áreas de mejora. También se evaluarán a los usuarios piloto técnicos (estudiantes de la asignatura ISPP).

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

El feedback de los usuarios piloto es clave para evaluar la plataforma y determinar las mejoras necesarias. Sin embargo, en este sprint **hemos obtenido una baja tasa de respuestas**; tan solo 4/16 fisioterapeutas, 8/19 pacientes y 6/6 técnicos han enviado sus respuestas.

En este apartado se presentan las principales observaciones, problemas detectados y funcionalidades mejor valoradas en la fase de pruebas de este Sprint 2.

Para priorizar la corrección de los problemas detectados y sugerencias de mejora en el siguiente sprint, se seguirá el siguiente orden de prioridad:

1. **Gestión de usuarios:** habrá que priorizar y prestar más atención a todos los errores reportados sobre la gestión de usuarios. Esto incluye problemas para registrarse e iniciar sesión, especialmente en el caso de los fisioterapeutas, quienes dependen de una correcta comprobación de su número de colegiado para acceder al sistema. También se abordarán las acciones limitadas por una mala implementación de la gestión de tokens y cookies de sesión.

2. **Rigor clínico:** se deberá prestar especial atención a los errores reportados que reflejen incoherencias entre la plataforma y el ejercicio profesional de la fisioterapia. Es fundamental garantizar que las funcionalidades y la información proporcionada sean consistentes con las prácticas clínicas y éticas de la profesión.

3. **Funcionalidades principales:** en tercer lugar, se dará prioridad a los errores y observaciones reportados que impacten en las funcionalidades principales definidas dentro del alcance del proyecto (MVP). Esto incluye cualquier problema que afecte el núcleo de la plataforma, como la reserva de citas, la gestión de pacientes o el acceso a ejercicios terapéuticos.

4. **Experiencia de usuario (UX):** se priorizarán los comentarios y observaciones relacionados con la facilidad de uso, la navegación intuitiva y la estética de la plataforma. Se buscará mejorar la interacción del usuario con el sistema, asegurando que las funcionalidades sean accesibles, claras y agradables de utilizar. Además, se atenderán los problemas reportados que dificulten la experiencia general, como tiempos de carga, errores visuales o inconsistencias en el diseño.

Este enfoque permitirá abordar de manera estructurada las áreas críticas de mejora, asegurando que la plataforma evolucione para satisfacer las necesidades tanto de los fisioterapeutas como de los pacientes y usuarios técnicos.

## 3.1. PROBLEMAS DETECTADOS

Se detallan los principales problemas encontrados por los usuarios piloto durante la prueba de la plataforma, junto con su impacto y posibles soluciones.

| Error                                      | Motivo                                                                                                                                                                                                                                            | Solución                                                                                                                                                                                                                                                                                                   | Prioridad | Impacto |
|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|---------|
| **Errores en el registro de fisioterapeutas** | Diferencia entre el número de colegiado en la tarjeta física (ej. 02300) y el registrado en la base de datos oficial (ej. 2300), lo que causa fallos en el script de validación.                                                                  | Incluir un enlace a la BBDD del colegio profesional correspondiente en el formulario para verificar el número antes de ingresarlo. Además, se hará una batería de pruebas con combinaciones comunes en diferentes comunidades autónomas.                                                                   | 1         | ALTO    |
| **Problemas de conexión** | A pesar de estar registrados, los usuarios reportaron errores recurrentes de conexión que les impedían realizar las acciones que se les habían solicitado en la plataforma.                                                                  | Este error ya fue solucionado y tiene que ver con el tiempo de expiración y renovación del token de inicio de sesión. No obstante, se prestará especial atención a que esto no vuelva a suceder.                                                                   | 1         | ALTO    |
| **Dependencia de datos** | Estar registrado con un nombre de usuario no permite cambiar el correo asociado en la edición del perfil. | Se revisará esta dependencia para mejorar la usabilidada en el proceso de edición de datos del perfil de usuario. | 1 | ALTO |
| **Formularios que aceptan registros vacíos o datos inválidos** | Formularios como el de respuesta al cuestionario preintervención o el de creación de un servicio de fisioterapia admiten datos vacíos, cadenas de texto infinitamente largas o entradas que no corresponden al formato del campo que se está rellenando (p.e. registrar "123" para un número de teléfono). | Se revisarán cuidadosemante y se añadirán validaciones en TODOS los formularios de la plataforma. | 1 | ALTO |
| **Carga de datos lenta**                      | No especificado en el informe. Posiblemente relacionado con optimización deficiente o problemas de red/conexión.                                                                                                                                  |Se requiere diagnóstico más profundo para determinar causa raíz y aplicar medidas correctivas como cacheo, optimización de consultas o manejo de errores de red.                                                                                                   | 4 | ALTO |
| **Interfaz no responsiva en móviles**        | Formularios y botones no se adaptan correctamente a pantallas pequeñas, causando desalineaciones u ocultamiento de elementos. Esto se debe a que todo el desarrollo de la UI se ha hecho teniendo en cuenta la responsividad en un navegador de ordenador con tamaño estándar / medio                                                                                                          | Ajustar estilos CSS y layout para asegurar diseño responsivo (media queries, flexbox/grid adaptable). Realizar pruebas específicas en móviles y tablets.                                                                                                                                                    | 4 | MEDIO |


## 3.2. FUNCIONALIDADES VALORADAS POSITIVAMENTE

Los usuarios destacaron varias funcionalidades que mejoraron significativamente su experiencia:

- **Panel claro y organizado**: los usuarios pilotos técnicos resaltaron la organización general del panel y la facilidad para encontrar funciones básicas, especialmente desde el punto de vista del desarrollo y evaluación de software.

- **Diseño visual agradable**: Pacientes indicaron que la estética de la plataforma genera confianza, siendo clara y profesional.

También, se valoró positivamente el formato y estética del formulario de participación para la prueba. 

## 3.3. PRINCIPALES OBSERVACIONES Y SUGERENCIAS

Los usuarios piloto realizaron valiosas aportaciones sobre la experiencia general con la plataforma. A continuación, se recogen las sugerencias de mejora más repetidas, tanto para las funcinalidades ya implementadas para la fecha como para aquellas que aún están en desarrollo:

- **Información del paciente**: Se valoró positivamente la posibilidad de visualizar el progreso de los pacientes, pero se solicitó que se integren gráficos o resúmenes visuales que faciliten la evaluación del tratamiento. *Esta funcionalidad ya está en desarrollo para la fecha de este documento. *

- **Notificaciones y recordatorios**: Los pacientes proponen incorporar notificaciones que recuerden la realización de ejercicios o citas pendientes.

- **Mayor personalización del perfil**: Tanto pacientes como fisioterapeutas sugirieron incluir más campos en los perfiles, como formación académica, promoción, lugar de trabajo y experiencia laboral.

- **Contraseña**: Los usuarios echaron en falta una recuperación de la contraseña si la han olvidado o la posibilidad de visualizarla mientras la están escribiendo para evitar malentendidos en el registro. 

- **Accesibilidad desde dispositivos móviles**: Aunque la mayoría pudo acceder a la plataforma desde móviles, algunos reportaron problemas de visualización. Se recomienda optimizar la experiencia móvil.

- **Leyendas de colores e indicaciones**: para la gestión de citas y del calendario, se recomendó incluir una leyenda para indicar el significado de cada color empleado en la vista, así como instrucciones o una breve descripción de cómo interactuar con el mismo.

# 4. CONCLUSIONES, LECCIONES APRENDIDAS Y PROCESADO DEL FEEDBACK

La fase piloto ha permitido identificar fortalezas clave de la plataforma, así como diversas áreas de mejora que resultan cruciales para alcanzar un producto sólido y adaptado a las necesidades reales de fisioterapeutas y pacientes. La recopilación de feedback ha sido variada, representativa y útil para marcar prioridades de desarrollo en los siguientes sprints.

Se ha aprendido que la validación de roles, la usabilidad y la claridad en los procesos son aspectos centrales para garantizar una experiencia satisfactoria. Además, se ha valorado la utilidad de ciertas funciones específicas del ámbito clínico, lo que indica que el enfoque profesional está bien orientado.

## 4.1. AJUSTES REALIZADOS EN BASE AL FEEDBACK

Tras la evaluación del feedback, se han realizarán los siguientes cambios en la plataforma:

- Revisión del sistema de verificación de colegiados para reducir errores en el registro de fisioterapeutas.

- Rediseño parcial de formularios y navegación para evitar inconsistencias con los resultados que esperamos almacenar.

- Mejora del rendimiento en las pantallas principales (inicio de sesión y panel de pacientes).

- Ajustes en la visualización móvil para mejorar la compatibilidad en distintos dispositivos.


## 4.2. ESTRATEGIAS DE MEJORA FUTURA

De cara a próximos sprints, se establecen las siguientes líneas de trabajo:

- Implementación de notificaciones automáticas para pacientes (recordatorios de sesiones, tests pendientes).

- Inclusión de analíticas gráficas del progreso del paciente en el dashboard del fisioterapeuta.

- Añadir una sección de ayuda con guías interactivas o tutoriales para nuevos usuarios.

- Ampliar las opciones de personalización de perfiles tanto para pacientes como para fisioterapeutas.

- Realizar nuevas pruebas específicas en dispositivos móviles para garantizar la accesibilidad total.

- Revisión continua del flujo de registro, acceso y validación para evitar cuellos de botella y errores recurrentes.


# 5. EVALUACIÓN DE LA EXPERIENCIA PILOTO

| Usuario (uvus) | Fecha acceso | Feedback | Clockify | Fallos encontrados | Recomendaciones / Comentarios |
|----------------|--------------|----------|----------|---------------------|-------------------------------|
| Antonio Daniel Porcar Aragón (**antporara**) | 23/03/2025 | 23/03/2025 | [antporara](https://app.clockify.me/shared/67e42125f62c693dbbcbb42e) | Videollamadas no funcionaban correctamente | Interfaz sencilla y cómoda. La barra lateral podría integrarse mejor con el calendario. |
| Antonio Jiménez Ortega (**antjimort**) | 11/03/2025 | 11/03/2025 | [antjimort](https://app.clockify.me/shared/67e47e6cf62c693dbbccd7ca) | Ningún bug | Diseño y UX agradables. Sugerencia: uso coherente de mayúsculas en títulos. |
| David Guillén Fernández (**davguifer**) | 23/03/2025 | 23/03/2025 | [davguifer]() | Varios bugs en validación de formularios, errores al actualizar perfil, visualización del calendario incompleta | Visualmente atractiva. Mejorar espaciado entre botones y validaciones de campos. |
| Jaime Linares Barrera (**jailinbar**) | 23/03/2025 | 23/03/2025 | [jailinbar](https://app.clockify.me/shared/67e3e19bf562c161b726c9f1) | Errores al registrarse, cargar perfil, reservar cita, mostrar métodos de pago | Interfaz intuitiva. Sugerencia: unificar campos de registro en una sola pantalla. |
| Javier Ulecia García (**javulegar**) | 12/03/2025 | 12/03/2025 |[javulegar](https://app.clockify.me/shared/67e431c1f62c693dbbcbfaf7) | No pudo registrarse | Interfaz bonita, buena usabilidad. |
| José Manuel Miret Martín (**josmirmar2**) | 26/03/2025 | 26/03/2025 | [josmirmar2](https://app.clockify.me/shared/67e42154f562c161b727e4ca) | Fallos en visualización y edición del perfil, registro incompleto, reservas no funcionales | Buen diseño general. Mejorar perfil de usuario y revisar funcionalidad completa de registro/reserva. |
