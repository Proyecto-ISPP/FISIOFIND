---
title: "REPORTE ANÁLISIS DE SEGURIDAD S2"
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 2"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]                                                # CHANGE IF NEEDED
date: "27/03/2025"
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
header-left: "QUALITY REPORT"                                  # CHANGE IF NEEDED
header-right: "27/03/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  REPORTE ANÁLISIS DE SEGURIDAD S2
</h1>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
- [2. HERRAMIENTA UTILIZADA](#2-herramienta-utilizada)
- [3. RESULTADOS DEL ANÁLISIS](#3-resultados-del-análisis)
- [4. CONCLUSIONES](#4-conclusiones)

<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 2

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Delfín Santana Rubio](https://github.com/DelfinSR) (autor)

- **Fecha de Creación:** 27/03/2025  

- **Versión:** v1.0

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por   | Descripción de los cambios                       |
| ---------- | ------- | --------------- | ------------------------------------------------ |
| 27/03/2025 | v1.0    | Delfín Santana Rubio | Primera versión del documento |


<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN
El presente informe tiene como objetivo mostrar los resultados de utilizar una herramienta automática de análisis de seguridad. Este análisis es fundamental para evaluar la seguridad del proyecto, detectar posibles vulnerabilidades y garantizar la privacidad, autenticidad e integridad de nuestra aplicación y de los datos que manejamos.

# 2. HERRAMIENTA UTILIZADA
La herramienta utilizada es la herramienta [ZAP](https://www.zaproxy.org/). Esta herramienta es ampliamente utilizada en el sector, y permite hacer análisis automáticos de seguridad a aplicaciones web. El análisis lo hace descubriendo las rutas de la página web (mediante scrapping y otras técnicas) y buscando de forma pasiva y activa patrones o evidencias de problemas de seguridad conocidos.

Para el análisis hemos usado la configuración por defecto de la herramienta para facilitar la reproducibilidad del análisis.

# 3. RESULTADOS DEL ANÁLISIS

Los resultados del análisis se pueden ver en el archivo generado por ZAP [2025-03-27-ZAP-Report-.html](https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/docs/03_reports/security_reports/2025-03-27-ZAP-Report-.html). ZAP nos categoriza los avisos en informacional, bajo, medio y alto en función del riesgo que suponen. A continuación, hacemos un resumen de lo más importante de los resultados. 

|Nombre | 	Nivel de riesgo | 	Número de evidencias |
|----|------------|------------------------|
|Content Security Policy (CSP) Header Not Set| 	Medio |	20|
|Missing Anti-clickjacking Header |	Medio 	|6|
|Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s) |	Bajo |	20|
|Server Leaks Version Information via "Server" HTTP Response Header Field |	Bajo |	54|
|Strict-Transport-Security Header Not Set |	Bajo |	54|
|X-Content-Type-Options Header Missing |	Bajo |	40|
|Information Disclosure - Suspicious Comments |	Informativo |	13|
|Re-examine Cache-control Directives |	Informativo |	6|
|User Agent Fuzzer |	Informativo |	300|

Los dos avisos de nivel medio como algunos de los avisos de nivel bajo hacen referencia a que falta poner headers de seguridad en las respuestas del header. Este aviso no es un problema de seguridad inminente y se puede implementar en el S3.

Por ejemplo, el aviso "Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)" es que el servidor revela la tecnología que utiliza. Sabiendo esto, el atacante podría buscar ataques específicos para la tecnología que utilizamos (Next.js).

Después, el "Information Disclosure - Suspicious Comments" hace referencia a que parece haber comentarios sospechosos en las respuestas del servidor. En el proceso de desarrollo los programadores pueden poner comentarios con información sensible y no ser borrados en producción. Sin embargo, analizando los resultados parece que son comentarios normales sin información sensible (sin api keys, sin credenciales de administración, etc.). Sin embargo, para el siguiente sprint deberían de eliminarse todos los comentarios de funcionalidades que no se utilicen.

# 4. CONCLUSIONES
Fisio Find no presenta vulnerabilidades críticas que puedan ser encontradas con herramientas automáticas de análisis de seguridad. De hecho, realmente no tenemos vulnerabilidades, solo tenemos avisos, y los avisos que nos devuelve ZAP son genéricos(muchas otras webs lo tienen y no hay consecuencias inmediatas) y no necesitan de acciones inminentes. Sin embargo, se deben de tomar medidas correctivas para la siguiente entrega porque se aspira a tener el mínimo número de avisos.
