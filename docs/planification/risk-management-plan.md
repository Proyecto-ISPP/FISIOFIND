---
title: "PLAN DE GESTIÓN DE RIESGOS"
subtitle: "FISIO FIND"                       
author: [Delfín Santana Rubio] 
date: "17/02/2025"                                                 
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../.backgrounds/background1V.pdf"                            
header-left: "PLAN DE GESTIÓN DE RIESGOS"                 
header-right: "17/02/2025"                                         
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  PLAN DE GESTIÓN DE RIESGOS
</h1>

<br>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
- [2. REGISTRO DE RIESGOS](#2-registro-de-riesgos)
- [3. CLASIFICACIÓN DE RIESGOS](#3-clasificación-de-riesgos)
- [4. EVALUACIÓN DE RIESGOS](#4-evaluación-de-riesgos)
- [5. PLANES DE CONTIGENCIA Y CONTRAMEDIDAS](#5-planes-de-contigencia-y-contramedidas)
- [6. SEGUIMIENTO DE RIESGOS](#6-seguimiento-de-riesgos)
- [7. MATRIZ DE RIESGOS](#7-matriz-de-riesgos)

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Autores:** Delfín Santana Rubio, Julen Redondo Pacheco

- **Fecha de Creación:** 17/02/2025  

- **Versión:** v1.3

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 17/02/2025 | v1.0    | Delfín Santana Rubio          | Creación del documento y primeras modificaciones |
| 18/02/2025 | v1.1    | Julen Redondo Pacheco        | Correcciones y modificaciones |
| 18/02/2025 | v1.2    | Delfín Santana Rubio        | Modificado punto 5 para añadir tipos de contramedidas a riesgos |
| 19/02/2025 | v1.3    | Delfín Santana Rubio        | Modificado punto 5 y matriz de riesgos |


<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  
En este documento se detalla el plan de gestión de riesgos del proyecto FISIO FIND. Se detalla la clasificación de los riesgos y la metodología para analizarlos y categorizarlos.

# 2. REGISTRO DE RIESGOS
Se deberán registrar los riesgos en el documento **Risk Registry**. Para esto, se identifican dos formas posibles de conocer riesgos:
- Forma pasiva: riesgos detectados indirectamente, por ejemplo, a través del feedback de clase.
- Forma activa: analizando los requisitos, hablando con los usuarios piloto, dedicando recursos a registrarlos, etc.

El registro de un riesgo deberá estar acompañado de una clasificación, una evaluación, contramedidas y un plan de contingencia.

# 3. CLASIFICACIÓN DE RIESGOS
Se ha seguido la clasificación mostrada en la píldora teórica "ISPP - Sesión 02a":
- Estimación: riesgos asociados con estimaciones.
- Técnico: riesgos asociados con la parte técnica.
- Requisitos: riesgos asociados con los requisitos. Por ejemplo, que surja un nuevo requisito.
- Organizacional: Problemas en la organización interna.
- Internos: Problemas internos del equipo del proyecto.
- Internos-externos: Problemas relacionados con interacciones entre la parte interna y externa.

# 4. EVALUACIÓN DE RIESGOS
Para evaluar un riesgo, se debe analizar su probabilidad y su impacto. Una vez establecidos estos parámetros, se deberán establecer el factor, que es el resultado de multiplicar la probabilidad por el impacto, y la prioridad.

| Parámetro  | Descripción | Escala |
|------------|------------|--------|
| **Probabilidad (P)** | Posibilidad de que ocurra el riesgo | 1-10 |
| **Impacto (I)** | Consecuencias si el riesgo ocurre | 1-10 |
| **Factor (F = P × I)** | Grado de criticidad del riesgo | 1-100 |


# 5. PLANES DE CONTIGENCIA Y CONTRAMEDIDAS
Se deberán indicar las medidas que se deben tomar de suceder el riesgo. Además, se deberán indicar las contramedidas que se están tomando para evitar que suceda o minimizar el impacto del riesgo en cuestión.

Las distintas estrategias para las contramedidas que se pueden aplicar a un riesgo pueden diferenciarse entre:
- Aceptar: Aceptar el riesgo y no tomar medidas.
- Evitar: Descartar o modificar aquello que causa el riesgo.
- Mitigar: Tomar acciones para evitar que suceda o minimizar el impacto del riesgo en cuestión.
- Transferir: Transferir el riesgo a un sujeto externo al equipo.

Estas estrategias deben de entenderse como un punto de partida, no como una respuesta que no deba de desarrollarse. Además, dependiendo de la probabilidad y el impacto de un riesgo habrá estrategias que no podrán ser elegidas. Por ejemplo, si un riesgo tiene mucho impacto y mucha probabilidad, ese riesgo no podrá ser aceptado. Esto se decide por los responsables de diseñar las contramedidas.


# 6. SEGUIMIENTO DE RIESGOS
Para los riesgos registrados, se debe hacer un seguimiento mediante la revisión de las contramedidas implementadas.

Además, se entiende que el proceso de registro de riesgos es un proceso constante. Es decir, el documento de riesgos debe revisarse periódicamente y actualizarse con los nuevos riesgos identificados.

# 7. MATRIZ DE RIESGOS

| IMPACTO ↓   PROBABILIDAD →  | 1-2 (Baja)      | 3-4 (Moderada)   | 5-6 (Alta)      | 7-8 (Crítica)   | 9-10 (Extrema)  |
|-------------------------------|----------------|----------------|----------------|----------------|----------------|
| **1-2 (Bajo impacto)**      |         |   |   |     |  |
| **3-4 (Moderado impacto)**  |       |   |       |   |  |
| **5-6 (Alto impacto)**      | RIG-007, RIG-008  | RIG-005, RIG-004       |    | |   |
| **7-8 (Crítico impacto)**   | RIG-009      |     | RIG-002, RIG-003, RIG-010   |  |  |
| **9-10 (Extremo impacto)**  | RIG-006   | RIG-001    |   |   |  |
