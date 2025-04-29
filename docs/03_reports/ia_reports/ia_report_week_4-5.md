---
title: "REPORTE DE IA DE LA SEMANA 4 y 5 (21/02/25 - 06/03/25)"
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 1"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "06/03/2025"
subject: "ISPP"
lang: "es"
toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../../.backgrounds/background4V.pdf"
header-left: "IA REPORT"
header-right: "06/03/2025"
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- Imagen del logo (comentar al exportar a PDF) -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<!-- Título centrado -->
<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND - REPORTE DE IA DE LA SEMANA 4 y 5 (21/02/25 - 06/03/25)
</h1>

<br>

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND  

- **Número de Grupo:** Grupo 6  

- **Entregable:** #SPRINT 1

- **Miembros del grupo:**  
  Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García,  
  Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús,  
  Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco,  
  Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez,  
  Rafael Pulido Cifuentes.  

- **Contribuidores:** [Daniel Fernández Caballero](https://github.com/DaniFdezCab) (autor), [Daniel Ruiz López](https://github.com/Danielruizlopezcc) (autor)

- **Fecha de Creación:** 03/03/2025  

- **Versión:** v1.1  

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                                         | Descripción de los cambios                  |
|-----------|---------|-------------------------------------------------------|---------------------------------------------|
| 03/03/2025 | v1.0   | Daniel Fernández Caballero                            | Elaboración de la primera versión del documento. |
| 06/03/2025 | v1.1   | Daniel Fernández Caballero, Daniel Ruiz López        | Versión final del documento. |

---

## PROMPTS UTILIZADOS  

A continuación, se listan los diferentes prompts utilizados en esta fase del proyecto, organizados por categoría para una mejor comprensión.  

### General  
- [Saber si los prompts del chat de GitHub Copilot en Visual Studio se pueden compartir de la misma manera que estos prompts](https://chatgpt.com/share/67b9bf4e-03a8-800b-9569-ad5fd7858d71)  
- [Obtener una traducción al español de los puntos clave sobre la matriz RACI en gestión de proyectos](https://chatgpt.com/share/67ba070e-b540-8011-9feb-e8fa4fbd9e36)  
- [Obtener la descripción de los roles de cada categoría en la matriz RACI: Responsable, Aprobador, Consultado e Informado](https://chatgpt.com/share/67ba070e-b540-8011-9feb-e8fa4fbd9e36)  

### Desarrollo en Django  
- [Dudas sobre modelos de datos y Serializer en Django](https://chatgpt.com/share/67b9dac9-1538-800b-b896-d1eb1c62425b)  
- [Recomendaciones CRUD de AppUser](https://chatgpt.com/share/67b9dac9-1538-800b-b896-d1eb1c62425b)  
- [Migraciones en Django](https://chatgpt.com/share/67bafd0b-5b50-8011-8fd7-3f53fc2d4366)  
- [Pregunta sobre validaciones automáticas en Django REST Framework (DRF)](https://chatgpt.com/share/67c5f644-2410-8011-882a-d12c9dc9d593)  
- [Dudas sobre parámetros de modelos en Django REST Framework](https://chatgpt.com/share/67c1ef78-54b0-800b-b90d-ccca58d41de2)  
- [Saber dónde y cómo configurar las rutas en el frontend de un proyecto con Django REST Framework](https://chatgpt.com/share/67c95092-3b20-800f-9211-b54b90289720)  

### Desarrollo Web y Frontend  
- [Interfaz en TypeScript](https://chatgpt.com/share/67c451fe-d098-8011-9c58-e030bbbc134d)  
- [Funcionalidades y estilos de FullCalendar](https://chatgpt.com/share/67c451fe-d098-8011-9c58-e030bbbc134d)  
- [Aplicación de estilos en frontend](https://chatgpt.com/share/67c6c55d-698c-8009-aa43-43d812ab5e80)  

### Infraestructura y Herramientas  
- [Saber cómo hacer que una plantilla de pull request aparezca automáticamente al crear una en GitHub](https://chatgpt.com/share/67bda80f-1a9c-8012-97e6-c8ce7676c086)  
- [Corrección de error de actualización de Node.js](https://chatgpt.com/share/67c83eb2-d6f4-8012-b520-99b41154b950)  

### Documentación y Revisión  
- [Obtener faltas de ortografía de un documento](https://chatgpt.com/share/67bc28d7-011c-8012-bcba-c9df94e09eea)  
- [Reformular mensajes manteniendo la idea](https://chatgpt.com/share/67c2195d-4320-8000-a228-50367005027a)  
- [Sugerencias en el UML](https://chatgpt.com/share/67bdbc53-13e0-8012-8e11-764db244f985)  
- [Obtener sugerencias sobre qué epígrafes añadir a una plantilla de reuniones](https://chatgpt.com/share/67bf4ce6-cbb4-8011-94ce-6c2635225c86)  

### Datos y Base de Datos  
- [Borrar todas las tablas de la base de datos](https://chatgpt.com/share/67bc28d7-011c-8012-bcba-c9df94e09eea)  
- [Obtener una guía sobre cómo crear un archivo con datos de prueba para poblar una base de datos PostgreSQL](https://chatgpt.com/share/67c6c7f6-df24-800b-bfeb-03d7440bce64)  
- [Generar un archivo JSON con datos de prueba para poblar la base de datos](https://chatgpt.com/share/67c6c7f6-df24-800b-bfeb-03d7440bce64)  

---

## Aprobado por  
**Scrum Master:** Antonio Macías Ferrera