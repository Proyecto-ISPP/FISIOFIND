---
title: "SPRINT PLANNING GENERAL"                          # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "15/02/2025"                                        # CHANGE IF NEEDED
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background1V.pdf"  # CHANGE IF NEEDED
header-left: "PLANNING SPRINT GENERAL"                    # CHANGE IF NEEDED
header-right: "15/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN *EXPORTING* TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  SPRINT PLANNING GENERAL
</h1>

<br>

**ÍNDICE**
- [**1. INTRODUCCIÓN**](#1-introducción)
- [**2. METODOLOGÍA INTERNA**](#2-metodología-interna)
  - [2.1. Gestión de Tareas](#21-gestión-de-tareas)
  - [2.2. Flujo de Trabajo](#22-flujo-de-trabajo)
  - [2.3. Flujo de Desarrollo](#23-flujo-de-desarrollo)
  - [2.4. Definición de Hecho (DoD) de una Historia de Usuario](#24-definición-de-hecho-dod-de-una-historia-de-usuario)
  - [2.5. Gestión de la Configuración](#25-gestión-de-la-configuración)
  - [2.6. Gestión del Cambio](#26-gestión-del-cambio)
  - [2.7. Gestión de los Riesgos](#27-gestión-de-los-riesgos)
  - [2.8. Uso de la Inteligencia Artificial](#28-uso-de-la-inteligencia-artificial)
- [**3. PRODUCT BACKLOG**](#3-product-backlog)
  - [SPRINT 1](#sprint-1)
  - [SPRINT 2](#sprint-2)
  - [SPRINT 3](#sprint-3)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>


---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Antonio Macías Ferrera](https://github.com/antoniommff) (autor), [Delfín Santana Rubio](https://github.com/DelfinSR) (revisor)

- **Fecha de Creación:** 15/02/2025  

- **Versión:** v1.3

<br>


---

**Historial de modificaciones**

| Fecha        | Versión | Realizada por          | Descripción de los cambios          |
| ------------ | ------- | ---------------------- | ----------------------------------- |
| 15/02/2025   | v1.0    | Antonio Macías Ferrera | Elaboración de la base del documento.                                       |
| 18/02/2025   | v1.1    | Delfín Santana Rubio   | Progreso en puntos 2.2, 2.3, 2.5, 2.6, 2.7 y 2.8                            |
| 19/02/2025   | v1.2    | Antonio Macías Ferrera | Adición de la planificación inicial de acuerdo a la reunión del 16/02/2024. |
| 20/02/2025   | v1.3    | Antonio Macías Ferrera | Corrección de algunas HU. |


<br>

<!-- \newpage -->

<br>


# **1. INTRODUCCIÓN**

El propósito de este informe es definir los objetivos a lograr a lo largo del desarrollo del proyecto. Siguiendo los estándares marcados por los *principios ágiles*, el equipo dividirá el trabajo en tres *Sprints*. En este documento se explicará la metodología de trabajo en general, y se definirán los objetivos a cumplir en cada iteración del proyecto.

<br>


# **2. METODOLOGÍA INTERNA**

## 2.1. Gestión de Tareas

El equipo utiliza *GitHub Project* como herramienta de gestión de tareas donde las actividades están organizadas en distintas columnas que reflejan su estado dentro del flujo de trabajo. Esta herramienta cuenta con un **tablero Kanban** para facilitar el seguimiento de las tareas, generación de **gráficas Burn-down** que nos serán útiles en las retrospectivas, y asignación y **estimación de tareas** además de otras funciones que procurarán una buena organización del trabajo.

Todas las tareas a ejecutar en el *Sprint* se encontrarán inicialmente en la columna "Product Backlog", habiendo sido previamente asignadas y estimadas por el equipo *Scrum*.

<br>

## 2.2. Flujo de Trabajo

La organización del trabajo, dado el gran número de participantes del proyecto, se ha llevado a cabo siguiendo una estructura doble: por un lado, una **división horizontal** en 3 subgrupos, y por otro lado, una **división transversal** en función de las tareas a realizar. Para ver en más detalle la división del trabajo, consultar el *Plan de Recursos Humanos*. 

La **organización horizontal** está compuesta por tres grupos de trabajo, en los que cada uno tiene un representante y un secretario.


| GRUPO 1                                 | GRUPO 2                               | GRUPO 3                                |
| --------------------------------------- | ------------------------------------- | -------------------------------------- |
| ALBERTO CARMONA SICRE (secretario)      | ANTONIO MACÍAS FERRERA (Scrum Master) | DANIEL TORTORICI BARTUS                |
| DANIEL ALORS ROMERO                     | BENJAMÍN I. MAUREIRA FLORES           | DANIEL VELA CAMACHO (secretario)       |
| DANIEL FERNÁNDEZ CABALLERO              | DELFÍN SANTANA RUBIO (secretario)     | FRANCISCO CAPOTE GARCÍA                |
| DANIEL RUIZ LÓPEZ                       | GUADALUPE RIDRUEJO PINEDA             | Francisco Mateos Villarejo             |
| PABLO FERNÁNDEZ PÉREZ                   | JULEN REDONDO PACHECO                 | MIGUEL ENCINA MARTÍNEZ (representante) |
| RAFAEL PULIDO CIFUENTES (representante) | RAMÓN GAVIRA SÁNCHEZ (representante)  |                                        |


Estos grupos trabajarán de forma autosuficiente durante la fase de ejecución (desarrollo del producto). 

Los **representantes** serán necesarios para favorecer una buena comunicación, y serán los encargados de elaborar los *Sprint Planning* en conjunto y dividir las tareas en cada grupo.

Los **secretarios** serán los encargados de tomar actas de las reuniones internas y tomar nota del *feedback* de los profesores.


Por otro lado, la **organización transversal** a lo largo de los equipos asignará distintos **roles** a los miembros del equipo para realizar tareas más ajenas al desarrollo de la aplicación. Estas serán tareas de planificación, documentación, publicidad...:


| RRSS Y PUBLICIDAD  | PLANIFICACIÓN      | SECRETARIOS     | QA                   |
| ------------------ | ------------------ | --------------- | -------------------- |
| ANTONIO MACÍAS     | ANTONIO MACÍAS     | ALBERTO CARMONA | BENJAMÍN I. MAUREIRA |
| FRANCISCO CAPOTE   | GUADALUPE RIDRUEJO | DANIEL VELA     | DANIEL ALORS         |
| FRANCISCO MATEO    | MIGUEL ENCINA      | DELFÍN SANTANA  | FRANCISCO MATEO      |
| GUADALUPE RIDRUEJO | PABLO FERNÁNDEZ    |                 | MIGUEL ENCINA        |
| PABLO FERNÁNDEZ    | RAFAEL PULIDO      |                 |                      |
| RAFAEL PULIDO      | RAMÓN GAVIRA       |                 |                      |
| DANIEL RUIZ        |                    |                 |                      |



| PRESENTACIONES     | TIEMPO          | IA               | FORMACIÓN     |
| ------------------ | --------------- | ---------------- | ------------- |
| ANTONIO MACÍAS     | ALBERTO CARMONA | DANIEL FERNÁNDEZ | RAFAEL PULIDO |
| GUADALUPE RIDRUEJO | RAFAEL PULIDO   | DANIEL RUIZ      | RAMÓN GAVIRA  |
|                    |                 |                  |               |



Así, las tareas se podrán asignar a equipos siguiendo alguno de los dos tipos de subdivisiones explicados. Sin embargo, dado que seguimos una organización ágil, esta organización se podrá modificar en cualquier momento. Por ejemplo, si se sabe que hay dos personas que son idóneas para hacer una tarea, se podrá asignar a esas dos personas a hacerla. También, si por ejemplo el equipo de QA o de seguimiento han terminado sus tareas, podrán ayudar en cualquier otra tarea.



<br>

## 2.3. Flujo de Desarrollo

Siguiendo la subdivisión anteriormente descrita, se puede especificar en qué tareas se especializa cada miembro de cada subgrupo.

- Grupo 1:

  - Frontend:
    - Rafael Pulido Cifuentes
    - Daniel Ruiz López

  - Backend:
    - Alberto Carmona Sicre
    - Daniel Fernández Caballero
    - Daniel Alors Romero

  - Fullstack:
    - Pablo Fernández Pérez


- Grupo 2:

  - Frontend:
    - Julen Redondo Pacheco
    - Benjamín Ignacio Maureira Flores

  - Backend:
    - Delfín Santana Rubio
    - Guadalupe Ridruejo Pineda
    - Antonio Macías Ferrera

  - Fullstack:
    - Ramón Gavira Sánchez


- Grupo 3:

  - Frontend:
    - Daniel Vela Camacho
    - Daniel Tortorici Bartús

  - Backend:
    - Francisco Mateos Villarejo
    - Francisco Capote García

  - Fullstack:
    - Miguel Encina Martínez


Cada miembro del equipo será responsable de gestionar el estado de sus tareas ateniéndose al siguiente procedimiento:


1. **Inicio de la Tarea**
    - El desarrollador selecciona una tarea de la columna "Product Backlog" y la traslada a "Todo".
    - Esta acción indica que la tarea ha sido priorizada para su ejecución.
    - Los representantes de cada grupo serán responsables de estimar y asignar las tareas a realizar por ese grupo.

2. **Trabajo en Progreso**
    - Cuando se comienza a trabajar en la tarea, se mueve a la columna "In Progress".
    - Se debe registrar el tiempo de trabajo en **Clockify** de acuerdo al protocolo y la política de nombrado especificada en el ***Plan De Gestión De La Configuración***.

3. **Revisión de Código: Revisión por pares**
    - Al finalizar la implementación, el responsable de la tarea crea una *Pull Request (PR)* y traslada la tarea a la columna "In Review".
    - El otro miembro del equipo asignado se encarga de analizar el código y verificar su calidad.
    - Si la revisión es satisfactoria, el revisor aprueba la PR y fusiona los cambios.
    - Si se identifican errores o mejoras necesarias, la tarea se devuelve a "In Progress", notificando los ajustes requeridos.
    - Por norma general, el *testing* será realizado también acorde a la revisión por pares.

<br>

## 2.4. Definición de Hecho (DoD) de una Historia de Usuario

Para que una historia de usuario (HU) se considere terminada, debe cumplir con los siguientes requisitos:

- La funcionalidad **debe** estar completamente desarrollada y *cumplir con los requisitos* especificados en la *HU*.

- Se deben **satisfacer** las **expectativas** del producto en términos de **comportamiento y usabilidad**.

- El código **debe seguir las buenas prácticas** establecidas por el equipo.

- Se debe **garantizar** la **legibilidad**, **mantenibilidad** y escalabilidad del código fuente.

- Todo el código **debe ser revisado por al menos un miembro distinto** al desarrollador original.

- El revisor debe verificar que el código funciona correctamente y cumple con los estándares definidos.

- Cada issue debe contar con al menos **un comentario positivo** de otro miembro del equipo antes de su aprobación final.

<br>

## 2.5. Gestión de la Configuración

Desde la **política de versionado** de documentos y de código, hasta la **política de nombrado de ramas**, pasando por el **criterio de mensajes de commits** y el **flujo** de trabajo **GitHub Project - GitHub - Clockify** se encuentra definido en detalle en el ***Plan De Gestión De La Configuración***.

<br>

## 2.6. Gestión del Cambio

Los cambios no pueden ser implementados de manera arbitraria, sino que deben de seguir un proceso que cubra las fases de registro, análisis, aceptación, implantación, evaluación y seguimiento. La gestión del cambio se hará tal y como se describe en el documento *Plan de Gestión del Cambio*. 

<br>

## 2.7. Gestión de los Riesgos

La gestión del riesgo se hará tal y como se describe en el documento *Plan de Gestión de los Riesgos*. En este documento, entre otras cosas, se explica que se deberá de hacer seguimiento a los riesgos y actualizar el registro de riesgos periódicamente.

<br>

## 2.8. Uso de la Inteligencia Artificial

El uso de la inteligencia artificial estará regulado por el *Acuerdo de IA* y se deberán de hacer informes periódicos de su uso. Uno de los puntos a destacar de este acuerdo es la importancia de la intervención humana en la aplicación de soluciones IA en el proyecto.

<br>

<!-- \newpage -->

<br>


# **3. PRODUCT BACKLOG**

A continuación, se desglosarán los objetivos del proyecto, divididos en *Sprints*. Cada *Sprint* contará con un **Sprint Goal** además de unos **objetivos de alto nivel** acorde con los requisitos marcados por los distintos entregables de la asignatura. 

Para cada iteración, se dividirá el trabajo en *Historias Épicas* trazables con los objetivos de alto nivel, y para cada épica se asignarán unas **historias de usuario** trazables en el *Registro de Historias de Usuario*. 


## SPRINT 1 

**🔴 Sprint Goal:** CORE USE CASES (Casos de uso principales)

Los objetivos marcados para este *Sprint* son los siguientes:

- ✅ **Objetivo 1:** Formar al equipo
- ✅ **Objetivo 2:** Implementar una gestión de usuarios básica
- ✅ **Objetivo 3:** Implementar las funcionalidades correspondientes a los casos de uso *'core'*.
- ✅ **Objetivo 4:** Desplegar una '*landing page*' estética y accesible para posicionar y mostrar al público nuestra aplicación.


| Historia Épica   | Historias de Usuario                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| Formación        | HA-002                                                                 |
| Gestión usuarios | HF-001, HF-002, HI-001, HI-002, HP-001, HP-002, HP-003, HP-006, HA-001 |
| Videollamada     | HF-010, HF-019                                                         |
| Landing page     | HA-003                                                                 |
| Cita/Calendario  | HP-005, HF-003, HF-004                                                 |



## SPRINT 2

**🔴 Sprint Goal:** TOOLS & PAYMENT (Herramientas para fisioterapeutas y gestión de pagos y monetización)

Los objetivos marcados para este *Sprint* son los siguientes:

- ✅ **Objetivo 1:** Elaborar el sistema de pagos y monetización
- ✅ **Objetivo 2:** Implementar las herramientas para fisioterapeutas


| Historia Épica              | Historias de Usuario              |
| --------------------------- | --------------------------------- |
| Payment Pricing             | HP-04, HP-07, HF-08, HF-09        |
| Subida vídeos/archivos      | HF-12                             |
| Herramientas de seguimiento | HF-06, HF-07, HF-11, HF-13, HF-14 |



## SPRINT 3

**🔴 Sprint Goal:** EXTRAS & TESTING (Funcionalidades extra y *testing* de integración)

Los objetivos marcados para este *Sprint* son los siguientes:

- ✅ **Objetivo 1:** Desarrollar funcionalidades extra de la aplicación
- ✅ **Objetivo 2:** Desarrollar herramientas de soporte para los usuarios
- ✅ **Objetivo 3:** Realizar pruebas de la apliación de forma más dedicada.

| Historia Épica                                                                                          | Historias de Usuario                     |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Testing, búsqueda avanzada, subida docs, historial paciente, API SMS, mapa de búsqueda, chatbot support | HI-03, HF-05, HF-16, HF-17, HF-18 |

Cabe aclarar que la división en épicas y la asignación de tareas e HU es menos detalla ya que este último *Sprint* queda supeditado al trabajo realizado en los dos anteriores y se presta a modificaciones a lo largo del desarrollo del proyecto.

<br>

Por otro lado, de manera separada a la organización por *Sprints* propia de la fase de ejecución del proyecto, se definirán otros objetivos que tendrán relación con la organización, seguimiento y planificación del proyecto más que con el desarrollo del producto. Estas tareas serán realizadas por los equipos transversales y se ejecutarán de forma paralela a las tareas del *Product Backlog*. Estos objetivos se han trazado en las siguientes *épicas* para llevar un control adecuado del trabajo y del tiempo: 

- **Planificación**
- **Usuarios Piloto**
- **Redes sociales / publicidad**
- **Presentaciones**
- **Documentación / reports**