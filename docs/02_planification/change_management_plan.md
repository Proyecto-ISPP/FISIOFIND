---
title: "PLAN DE GESTIÓN DEL CAMBIO"                       # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "16/02/2025"                                        # CHANGE IF NEEDED
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
header-left: "PLAN DE GESTIÓN DEL CAMBIO"                 # CHANGE IF NEEDED
header-right: "16/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  PLAN DE GESTIÓN DEL CAMBIO
</h1>

<br>


**ÍNDICE**
- [**1. NORMAS Y PROCEDIMIENTOS APLICABLES**](#1-normas-y-procedimientos-aplicables)
- [**2. PASOS A SEGUIR PARA HACER UN CAMBIO**](#2-pasos-a-seguir-para-hacer-un-cambio)
  - [Paso 1 - Registro del cambio](#paso-1---registro-del-cambio)
  - [Paso 2 - Análisis del cambio](#paso-2---análisis-del-cambio)
  - [Paso 3 - Modificación de registros e implementación del cambio](#paso-3---modificación-de-registros-e-implementación-del-cambio)
  - [Paso 4 - Pruebas y validación del cambio](#paso-4---pruebas-y-validación-del-cambio)
  - [Paso 5 - Despliegue del cambio](#paso-5---despliegue-del-cambio)
  - [Paso 6 - Seguimiento y mejora continua](#paso-6---seguimiento-y-mejora-continua)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Delfín Santana Rubio, Julen Redondo Pacheco

- **Fecha de Creación:** 16/02/2025  

- **Versión:** v1.2

<br>


---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 16/02/2025 | v1.0    | Delfín Santana Rubio             | Creación del documento y primeros cambios. |
| 18/02/2025 | v1.1    | Julen Redondo Pacheco            | Ampliación y finalización del documento |
| 18/02/2025 | v1.2    | Delfín Santana Rubio             | Cambios sugeridos en pull request |


<br>

<!-- \newpage -->

<br>


# **1. NORMAS Y PROCEDIMIENTOS APLICABLES**

Este documento es una continuación del apartado 4.5 del **PLAN DE GESTIÓN DE LA CONFIGURACIÓN**. En este plan se especifican los pasos a seguir para hacer un cambio. La finalidad de este documento es estandarizar un suceso tan importante como es el de la modificación no planificada. De no existir, este tipo de sucesos supondrían un riesgo y un punto crítico. Este plan es una forma de evitar ese riesgo.


<br>

<br>

# **2. PASOS A SEGUIR PARA HACER UN CAMBIO**

## Paso 1 - Registro del cambio
- Se deberá recibir y registrar el cambio.
- La solicitud de cambio puede venir de distintas formas:
  - Mediante el feedback que se da en las presentaciones.
  - Mediante las encuestas o feedback de los usuarios pilotos.
  - Mediante cambios sugeridos por el equipo de FISIO FIND.
- La responsabilidad del registro del cambio será compartida y transmitida. Es decir, si un integrante del grupo es consciente de que ha recibido una solicitud de cambio, deberá transmitirla y registrarla.
- La forma de comunicarla será a través de los medios utilizados por el equipo.
- Si se considera, se hará una issue para registrar el cambio.

## Paso 2 - Análisis del cambio
- Se deberá asignar a un número de personas para que analicen el cambio y decidan si debe incluirse o no y cómo.
- Si se creó una issue, esto deberá verse reflejado en la misma indicando su estado, por ejemplo, si el cambio ha sido aceptado.
- Si no había issue, deberá crearse.
- En caso de no aceptarse el cambio, el proceso de cambio acaba aquí.

## Paso 3 - Modificación de registros e implementación del cambio
- Se deberán modificar los registros necesarios e implementar el cambio siguiendo las formas generales.
- Se notificará a los miembros del equipo sobre los cambios realizados.
- Se deberá actualizar el estado de la issue para reflejar el progreso de la implementación.

## Paso 4 - Pruebas y validación del cambio
- Se deberán realizar pruebas exhaustivas para asegurar que el cambio no introduce nuevos errores o afecta negativamente a otras funcionalidades.
- Se recogerá feedback sobre el impacto del cambio.
- En la issue correspondiente, se deberá añadir evidencia de las pruebas realizadas, siendo estas capturas de pantalla, logs o cualquier otro elemento de importancia.

## Paso 5 - Despliegue del cambio
- Una vez validado el cambio, se procederá con su despliegue en el entorno de producción.
- Se coordinará el momento del despliegue para minimizar impactos en los usuarios.
- Se actualizará la documentación correspondiente y se notificará a los interesados sobre el cambio.

## Paso 6 - Seguimiento y mejora continua
- Se realizará un seguimiento del cambio en producción, para verificar que funciona según lo esperado.
- Se recogerá feedback posterior al cambio para detectar posibles mejoras o ajustes adicionales.
- Si se detectan problemas o se requieren ajustes, se abrirán nuevas issues derivadas para su análisis y resolución.
