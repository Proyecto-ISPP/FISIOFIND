---
title: "PLAN DE GESTIÓN DE LA CALIDAD"
subtitle: "FISIO FIND - Grupo 6 - #DP"                       
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "16/02/2025"                                                 
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: FISIO FIND
titlepage-background: "../.backgrounds/background1V.pdf"                            
header-left: "PLAN DE GESTIÓN DE LA CALIDAD"                 
header-right: "16/02/2025"                                         
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  PLAN DE GESTIÓN DE LA CALIDAD
</h1>

<br>

**ÍNDICE**
- [1. Equipo de QA](#1-equipo-de-qa)
- [2. Normas y procedimientos a aplicar](#2-normas-y-procedimientos-a-aplicar)
- [3. Objetivos de calidad](#3-objetivos-de-calidad)
- [4. Listas de control](#4-listas-de-control)
- [5. Plan de Mejora de los Procesos de Gestión](#5-plan-de-mejora-de-los-procesos-de-gestión)
- [6. Reuniones a realizar](#6-reuniones-a-realizar)
- [7. Informes a realizar](#7-informes-a-realizar)
- [8. Herramientas para la gestión de la calidad](#8-herramientas-para-la-gestión-de-la-calidad)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Miguel Encina Martínez](https://github.com/MiguelEncina) (autor), [Francisco Mateos Villarejo](https://github.com/pacomateos10) (autor)

- **Fecha de Creación:** 16/02/2025  

- **Versión:** v2.0

<br>

---

<!-- \newpage -->

**Historial de modificaciones**

| Fecha      | Versión | Realizada por | Descripción de los cambios |
|------------|---------|--------------|----------------------------|
| 16/02/2025 | v1.0    |  Miguel Encina Martínez, Francisco Mateos Villarejo | Versión inicial del documento. |
| 16/02/2025 | v1.1    |  Daniel Vela Camacho | Corrección y adecuación del formato. |
| 19/02/2025 | v2.0    |  Miguel Encina Martínez  |  Adecuación de la portada y corrección de algunas cláusulas  |

<br>

<!-- <!-- \newpage -->  -->

<br>

# 1. Equipo de QA

Para asegurar la calidad del proyecto, se ha creado un equipo de QA (Quality Assurance) que se encargará de evaluar el trabajo realizado por todos los integrantes del equipo semanalmente, así como de las horas invertidas para hacerlo.

| Nombre                          |  Perfil de GitHub |
|---------------------------------|------------------|
| Daniel Alors Romero             | [GitHub](https://github.com/DanielAlors) |
| Miguel Encina Martínez          | [GitHub](https://github.com/MiguelEncina) |
| Francisco Mateos Villarejo      | [GitHub](https://github.com/pacomateos10) |
| Benjamín Ignacio Maureira Flores| [GitHub](https://github.com/benjimrfl) |

# 2. Normas y procedimientos a aplicar

La organización aplica las siguientes normas para asegurar la calidad de los proyectos:

- **ISO 9001:** Se aplicarán procedimientos basados en esta norma, fijando principios fundamentales de gestión de calidad que ayudan a controlar y mejorar el rendimiento de las actividades de las que se compone el proyecto.
- **RPGD:** Se seguirán las reglas y medidas de seguridad para el correcto cumplimiento de las normativas relacionadas con la protección de los datos personales según la ley, incluyendo cómo se recopilan, usan, protegen o cómo se interacciona con ellos en general. Nuestra prioridad es garantizar la integridad y confidencialidad de la información.
- **Pruebas Unitarias y de Integración:** Procedimiento para asegurar que las diferentes unidades o componentes del software funcionen correctamente de forma aislada y en conjunto.
- **Pruebas de Usabilidad:** Se realizarán pruebas de usabilidad con conjunto de usuarios piloto que probarán la aplicación una vez por cada iteración y aportarán *feedback* constructivo para mejorar aspectos relacionados con la experiencia de usuario y con posibles funcionalidades adicionales.

# 3. Objetivos de calidad

| Entregable | Métrica | Valor objetivo |
| --- | --- | --- |
| Backend | Cobertura de pruebas | 100% de pruebas pasadas. |
| Frontend | Seguimiento de un diseño uniforme y que satisfaga las necesidades de los clientes | >66% de respuestas positivas por parte de los usuarios pilotos. |
| Código fuente | Workflows | 100% de workflows relacionados con la calidad de código pasados.  |
| Documentación | Completitud del contenido | Los documentos cumplen con todas las pautas requeridas por el profesorado |

# 4. Listas de control

1. **Código fuente:** En cada entregable, se realizará un procedimiento para verificar la implementación de las funcionalidades requeridas.
2. **Pruebas:** Se verificará la correcta realización de los módulos de pruebas para cada funcionalidad implementada. Se debe comprobar su ejecución, cobertura y su correspondiente documentación.
3. **Documentación:** Se deberá comprobar la calidad, claridad, riqueza y concisión de todos los documentos y/o entregables.
4. ***Feedback* (Usuarios piloto):** Evaluación por parte de los usuarios piloto a través de encuestas de la usabilidad de la plataforma. 
5. ***Feedback* (Profesorado):** Evaluación por parte del profesorado a través del feedback recogido durante las sesiones de seguimiento.

# 5. Plan de Mejora de los Procesos de Gestión

| Nombre de la Actividad | Metodología o procedimiento | Responsable |
| --- | --- | --- |
| Retroalimentación de usuarios piloto | Se recogerán los comentarios proporcionados por los clientes y el equipo lo analizará con el objetivo de mejorar futuras entregas y prevenir futuros fallos e inconsistencias. | Responsable de Usuarios Piloto |
| Retroalimentación de profesorado | Se recogerá y analizará el feedback de parte de los profesores para mejorar futuras entregas y adecuar el proyecto a los objetivos de la asignatura | Equipo de seguimiento |
| Errores encontrados | Se registrarán todos los errores detectados durante el proceso y su causa raíz. Tras esto, dichos fallos no deberán de cometerse en futuros entregables. | Equipo de QA |
| Tiempo de desarrollo | Se compararán los tiempos estimado y real de las tareas a completar con el fin de identificar posibles cuellos de botella y corregir la organización del proyecto. | Equipo de QA |
| Análisis de procesos actuales | Realizar un estudio de los procesos actuales para encontrar ineficiencias y áreas de mejora. | Equipo de QA |
| Documentación de Resultados y Lecciones | Informes de Proyecto, Actas de Reuniones.  | Equipo de secretarios |

# 6. Reuniones a realizar

| Equipo | Duración | Descripción |
| --- | --- | --- |
| Sprint Planning | 1 hora | Para asignar las tareas, los representantes de cada equipo se deberán reunir con el Project Manager al inicio de cada Sprint para dividir correctamente la carga de trabajo. A cada equipo se le asignará un conjunto de actividades a realizar. También se analizará el *feedback* por parte de los usuarios piloto. |
| Sprint Review y Sprint Retrospective | 1 hora | Al finalizar cada Sprint, los representantes de cada equipo junto con el Project Manager se reunirán para llevar a cabo una retrospección del Sprint y evaluar puntos positivos y negativos de cara a mejora para Sprints posteriores |
| Evaluación del QA | 1 hora | El equipo de QA se debe reunir semanalmente para realizar el informe de desempeño de cada miembro del equipo, basándose en las métricas definidas en el CA y en los informes de trabajo individual presentado por cada miembro del equipo |
| Asignación interna en los equipos | 30 minutos | Cada semana, cada equipo se debe reunir con su representante para la asignación de tareas interna de cada grupo. El representante es el encargado de asignarlas de forma equitativa y aprovechando al máximo las habilidades de cada miembro del equipo. Cada equipo deberá elaborar una matriz RACI con los roles de cada miembro del equipo para cada tarea y entregársela al equipo de QA |
| Gestión del cambio | 1 hora | Siguiendo el **PLAN DE GESTIÓN DEL CAMBIO**, en caso de que se produzca una solicitud de cambio, el equipo responsable de realizar el análisis, se reunirá para evaluar el impacto del mismo y decidir si se lleva a cabo o si se descarta |

# 7. Informes a realizar

| Tipo | Descripción |
| --- | --- |
| Resultados de pruebas | Por cada iteración, se deberá desarrollar un informe en el que se detalla los resultados de las pruebas realizadas, posibles errores encontrados y el estado de los mismos. |
| Informe de seguimiento | Se deberá realizar un informe semanal de seguimiento que recoja el *feedback* aportado por el profesorado, así como el contenido a implementar de cara a la siguiente semana. |
| Informe desempeño individual | Cada semana de trabajo, cada miembro del equipo deberá realizar un informe de desempeño siguiendo la plantilla proporcionada, donde deberá explicar las tareas realizadas durante la semana, acompañada de una descripción y un porcentaje de completitud. |
| Informes de rendimiento | Cada semana, el equipo de QA será el encargado de evaluar el rendimiento de cada miembro del equipo. Se tomará en cuenta el número de horas invertidas, el porcentaje de tareas finalizadas y la calidad de las mismas. Estos valores están recogidos como métricas en el CA. |

# 8. Herramientas para la gestión de la calidad

Para asegurar la calidad del proyecto se usarán las siguientes herramientas:

- **Codacy:** Se hará uso de Codacy para asegurar una calidad mínima para el proyecto. Se encarga de la búsqueda automática de errores en el código, el cumplimiento de estándares, así como de analizar la deuda técnica que se va generando a medida que crece y avanza el proyecto.
- **Codeql:** Se trata de una herramienta de análisis estático de código utilizada para encontrar vulnerabilidades de seguridad y errores en el código fuente. Forma parte de GitHub, y se usa en proyectos tanto de código abierto como cerrado. Ayuda a cumplir las normativas de seguridad como, por ejemplo, NIST.
- **Dependabot:** Es una herramienta de GitHub que ayuda a mantener actualizadas las dependencias de un proyecto de forma automática. Su función principal es detectar dependencias que estén desactualizadas que se puedan encontrar con vulnerabilidades y crear pull requests con las actualizaciones necesarias.
- **IA:** Utilizaremos herrramientas basadas en la inteligencia artificial para corregir errores en la elaboración de documentos como faltas ortográficas o expresiones mejorables. También se usará para utilizar un lenguaje más técnico y preciso.