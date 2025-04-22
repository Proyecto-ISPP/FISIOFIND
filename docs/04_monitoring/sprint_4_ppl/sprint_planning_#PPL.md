<!-- ---
title: "SPRINT PLANNING SPRINT 4"                         # UPDATED FOR SPRINT 3
subtitle: "FISIO FIND - Grupo 6 - #PPL"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "20/04/2025"                                        # UPDATED FOR SPRINT 3
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

- **Versión:** v1.0

<br>


---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por          | Descripción de los cambios                       |
| ---------- | ------- | ---------------------- | ------------------------------------------------ |
| 20/04/2025 | v1.0    | Antonio Macías Ferrera | Elaboración de la primera versión del documento. |


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

El propósito de este informe es definir los objetivos a lograr durante el Sprint 4 y describir la metodología para alcanzarlos.Este Sprint pertenece a la pase de preparación de lanzamiento del proyecto (Prepare Project Launch - #PPL) y durará desde el viernes 18/04/2025 hasta el jueves 01/05/2025.

**🔴 Sprint Goal:** PREPARE PROJECT LAUNCH (Pruebas finales, refactorización, funcionalidades extra)

Los objetivos marcados para este Sprint son los siguientes:

- ✅ **Objetivo 1:** Correcciones y tareas del Sprint 3
- ✅ **Objetivo 2:** Plan de pruebas
- ✅ **Objetivo 3:** Campaña de lanzamiento
- ✅ **Objetivo 4:** Corrección de bugs


| Épica | Tarea | Objetivo | Asignados | Prioridad |
|------|------|-----------|-----------|----------|
| E-017: Correcciones #S3 | [RFC-011: Refactorización frontend II](https://github.com/Proyecto-ISPP/FISIOFIND/issues/383) | 1: Correcciones y tareas del Sprint 3 | [Daniel Ruiz](https://github.com/Danielruizlopezcc), [Rafael Pulido](https://github.com/rafpulcif) | HIGH 🔴 |
| E-017: Correcciones #S3 | [HF-018: Accesibilidad](https://github.com/Proyecto-ISPP/FISIOFIND/issues/394) | 1: Correcciones y tareas del Sprint 3 | [Ramón Gavira](https://github.com/rgavira123), [Benjamín Maureira](https://github.com/benjimrfl) | MEDIUM 🟡 |
| E-017: Correcciones #S3 | [Sistema de Soporte y Comunicación](https://github.com/Proyecto-ISPP/FISIOFIND/issues/396) | 1: Correcciones y tareas del Sprint 3 | [Daniel Alors](https://github.com/DanielAlors), [Pablo Fernández](https://github.com/Letee2) | HIGH 🔴 |
| E-017: Correcciones #S3 | [Changelog automático](https://github.com/Proyecto-ISPP/FISIOFIND/issues/398) | 1: Correcciones y tareas del Sprint 3 | [Daniel Alors](https://github.com/DanielAlors), [Julen Redondo](https://github.com/Julenrp) | LOW 🟢 |
| E-017: Correcciones #S3 | [HF-017: Compartir archivos clínicos](https://github.com/Proyecto-ISPP/FISIOFIND/issues/393) | 1: Correcciones y tareas del Sprint 3 | [Julen Redondo](https://github.com/Julenrp), [Paco Mateos](https://github.com/pacomateos10), [Antonio Macías](https://github.com/antoniommff) | HIGH 🔴 |

<br>

<!-- \newpage -->

<br>


# **2. SPRINT BACKLOG**




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

