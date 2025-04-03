---
title: "REPORTE DE IA DE LA SEMANA 1 y 2 (31/01/25) - (14/02/25)" # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]                                                # CHANGE IF NEEDED
date: "17/02/2025"
subject: "ISPP"
lang: "es"
# toc: true
titlepage: true
titlepage-text-color: "1C1C1C"
titlepage-rule-color: "1C1C1C"
titlepage-rule-height: 0
colorlinks: true
linkcolor: blue
titlepage-background: "../../.backgrounds/background4V.pdf"  # CHANGE IF NEEDED
header-left: "IA REPORT"                                  # CHANGE IF NEEDED
header-right: "17/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND - REPORTE DE IA DE LA SEMANA 1 y 2 (31/01/25) - (14/02/25)
</h1>
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Daniel Fernández Caballero](https://github.com/DaniFdezCab) (autor), [Daniel Ruiz López](https://github.com/Danielruizlopezcc) (revisor)

- **Fecha de Creación:** 17/02/2025  

- **Versión:** v1.1

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por   | Descripción de los cambios                       |
| ---------- | ------- | --------------- | ------------------------------------------------ |
| 15/02/2025 | v1.0    | Daniel Fernández Caballero, Daniel Ruiz López | Elaboración de la primera versión del documento. |
| 20/02/2025 | v1.1    | Daniel Fernández Caballero | Añadidos enlaces a las conversaciones. |

<br>

<!-- \newpage -->

<br>

---

# PROMPTS UTILIZADOS  

A continuación, se listan los diferentes prompts utilizados en esta fase del proyecto, organizados por categoría para una mejor comprensión.

## **Legal y Contratos**
- [Corregir contrato para los usuarios pilotos y profesionalizar.](https://chatgpt.com/share/67aa3383-7044-800f-b127-73b143c7336e)
- [Evaluar la viabilidad legal, competencia y diferenciación de un MVP en desarrollo.](https://chatgpt.com/share/67ab381d-7abc-8004-91b9-3a00dab4e67b)  

## **Desarrollo de Aplicaciones y Funcionalidades**
- [Definir funciones para una app todo-en-uno para conductores.](https://chatgpt.com/share/67aa33b8-2374-8004-a2c0-bf5320d9e7c7)  
- [Cómo subir una versión corta de un juego a una página web.](https://chatgpt.com/share/67a9c6e8-cfc0-800b-8040-1a10eb65efd1)
- [Cómo almacenar las versiones de los videojuegos en la aplicación.](https://chatgpt.com/share/67a9c6e8-cfc0-800b-8040-1a10eb65efd1)  
- [Los usuarios de móvil pueden jugar a los videojuegos a partir de un iframe que referencie a una URL de un `index.html` del juego.](https://chatgpt.com/share/67a9c6e8-cfc0-800b-8040-1a10eb65efd1)  

##  **Análisis de Mercado y Competencia**
-  [Buscar áreas no informatizadas con potencial para una solución software empresarial.](https://chatgpt.com/share/67aa4767-2ba8-8001-b8f9-7a3cf1196c59)
-  [Ayuda para encontrar competidores sobre un planificador de viajes con IA.](https://chatgpt.com/share/67aa49e5-7454-8009-b2ce-cf0c301eda16)  
-  [Herramientas para realizar análisis de competidores.](https://chatgpt.com/share/67aa49e5-7454-8009-b2ce-cf0c301eda16)  
-  [Competidores para un letterbox de videojuegos en los ámbitos publicitarios, de letterbox y foros.](https://chatgpt.com/share/67aa49e5-7454-8009-b2ce-cf0c301eda16)  

##  **APIs y Conectividad**
-  [¿La DGT tiene API?](https://chatgpt.com/share/67aa49fd-eb14-8009-8204-a709623f3162)  
-  [Herramientas para hacer videollamadas.](https://chatgpt.com/share/67acf098-0f18-800e-8feb-6f56ed31f5bc)  

##  **Optimización y Recursos**
- [Precio en términos de API del input promedio que una persona puede hacer en ChatGPT.](https://chatgpt.com/share/67ab37fd-fa6c-8004-8867-554597d624b7)  
- [Cuántos tokens de API puede o podría gastar un estudiante promedio en un mes.](https://chatgpt.com/share/67ab37fd-fa6c-8004-8867-554597d624b7)  
- [Estimación de tokens de API sobre un output.](https://chatgpt.com/share/67ab37fd-fa6c-8004-8867-554597d624b7)

## **Arquitectura y Desarrollo del Sistema**
- [Convertir texto de requisitos a tabla en formato `.md`.](https://chatgpt.com/share/67ac7a11-1e2c-800f-9e63-9158a26179a5)
- [Ayuda en la generación de requisitos.](https://chatgpt.com/share/67ac7ac5-10bc-8001-91b5-86041d36a56d)
- [Ayuda en la arquitectura software del core del sistema.](https://chatgpt.com/share/67acd0a0-3d38-8013-b640-df69524c0e53) 
- [Resumir documento sobre el core del sistema.](https://chatgpt.com/share/67acd0a0-3d38-8013-b640-df69524c0e53)

---

**Aprobado por:**  
**Scrum Master:** Antonio Macías Ferrera
