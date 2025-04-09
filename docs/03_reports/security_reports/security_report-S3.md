---
title: "REPORTE ANÁLISIS DE SEGURIDAD S3"
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 3"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]                                                # CHANGE IF NEEDED
date: "09/04/2025"
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
header-right: "09/04/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  REPORTE ANÁLISIS DE SEGURIDAD S3
</h1>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
- [2. HERRAMIENTA UTILIZADA](#2-herramienta-utilizada)
- [3. RESULTADOS DEL ANÁLISIS](#3-resultados-del-análisis)
- [4. MEDIDAS DE SEGURIDAD IMPLEMENTADAS EN ESTE SPRINT](#4-medidas-de-seguridad-implementadas-en-este-sprint)
  - [4.1 CONTROL DE LA INFRAESTRUCTURA](#41-control-de-la-infraestructura)
  - [4.2 CIFRADO](#42-cifrado)
    - [4.2.1 MIGRACIÓN A CRIPTOGRAFÍA POSTCUÁNTICA](#421-migración-a-criptografía-postcuántica)
  - [4.3 ANÁLISIS DE CÓDIGO Y DEPENDENCIAS](#43-análisis-de-código-y-dependencias)
- [5. CONCLUSIONES](#4-conclusiones)

<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 2

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Delfín Santana Rubio](https://github.com/DelfinSR) (autor)

- **Fecha de Creación:** 09/04/2025  

- **Versión:** v1.0

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por   | Descripción de los cambios                       |
| ---------- | ------- | --------------- | ------------------------------------------------ |
| 09/04/2025 | v1.0    | Delfín Santana Rubio | Primera versión del documento |


<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN
El presente informe tiene como objetivo mostrar los resultados de utilizar una herramienta automática de análisis de seguridad. Este análisis es fundamental para evaluar la seguridad del proyecto, detectar posibles vulnerabilidades y garantizar la privacidad, autenticidad e integridad de nuestra aplicación y de los datos que manejamos.

# 2. HERRAMIENTA UTILIZADA
La herramienta utilizada es la herramienta [ZAP](https://www.zaproxy.org/). Esta herramienta es ampliamente utilizada en el sector, y permite hacer análisis automáticos de seguridad a aplicaciones web. El análisis lo hace descubriendo las rutas de la página web (mediante scrapping y otras técnicas) y buscando de forma pasiva y activa patrones o evidencias de problemas de seguridad conocidos.

Para el análisis hemos usado la configuración por defecto de la herramienta para facilitar la reproducibilidad del análisis.

# 3. RESULTADOS DEL ANÁLISIS

Los resultados del análisis se pueden ver en el archivo generado por ZAP. En este sprint hemos decidido hacer 2 analálisis: un análisis al backend y al frontend antes de implementar medidas para solucionar algunos de los avisos que se reportó en el S2, y otro después de implementarla. Puede ver esos análisis en:
- Antes de aplicar soluciones:
  - [2025-04-07-ZAP-Report-backend.html](https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/docs/03_reports/security_reports/2025-04-07-ZAP-Report-backend.html)
  - [2025-04-07-ZAP-Report-Frontend.html](https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/docs/03_reports/security_reports/2025-04-07-ZAP-Report-Frontend.html)
- Después de aplicar soluciones:
  - [2025-04-09-ZAP-Report-backend.html](https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/docs/03_reports/security_reports/2025-04-09-ZAP-Report-backend.html)
  - [2025-04-09-ZAP-Report-Frontend.html](https://github.com/Proyecto-ISPP/FISIOFIND/blob/main/docs/03_reports/security_reports/2025-04-09-ZAP-Report-Frontend.html)

ZAP categoriza los avisos en informativo, bajo, medio y alto en función del riesgo que suponen. A continuación, hacemos un resumen de lo más importante de los resultados. 

En el análisis del 07/04/25 del frontend se ha podido ver una evolución de los avisos que nos devuelve ZAP. Se ha pasado de 0 high, 2 medium, 4 low, 3 informational, a 0 high, 2 medium, 4 low y 10 informational. Si se analizan los avisos medium y low que nos da ZAP se ve que no ha habido variación en estos avisos. Como no la habido y la tabla es igual a del S2, no la repito. Sin embargo, respecto a los avisos informational sí que se han econtrado nuevos. En este caso todos avisan de que ZAP puede detectar las tecnologías que utilizamos y que no tenemos un header que controla la cache. 

Un nuevo análisis que hemos implementado en este sprint es el análisis al backend. Estos son los resultados:
|Nombre | 	Nivel de riesgo | 	Número de evidencias |
|----|------------|------------------------|
|Content Security Policy (CSP) Header Not Set| 	Medio |	3|
|Server Leaks Version Information via "Server" HTTP Response Header Field |	Bajo |	3|
|Strict-Transport-Security Header Not Set |	Bajo |	3|
| Re-examine Cache-control Directives | 	Informational 	1 |
| Tech Detected - Nginx |	Informational |	1 |
| Tech Detected - Ubuntu |	Informational |	1 |

Como se puede ver, son avisos parecidos a los del frontend.

En el segundo análisis que hemos hecho hemos podido paliar uno de los avisos. Hemos pasado de 4 avisos low a 3 avisos low. Hemos solucionado el aviso "Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)". También, intentamos paliar uno de los avisos medium, el de "Missing Anti-clickjacking Header", pero no lo hemos conseguido y decidimos no dedicarle más recursos a solucionarlo porque no es una amenaza crítica. Por otro lado, el aviso medium "Content Security Policy (CSP) Header Not Set" y el aviso low "Strict-Transport-Security Header Not Set" no hemos querido solucionarlo porque la solución podría romper parte del sistema y desarrollo, y no son avisos críticos.

Respecto al backend, no han avido cambios en el segundo análisis.

Hemos conseguido reducir el número de avisos low que tenemos y hemos fallado al intentar solucionar un aviso medium. Sin embargo, el nuevo código que se ha implementado en este sprint no parece que haya tenido impacto en la seguridad de la aplicación. Actualmente, ningún aviso necesita atención inmediata.

# 4. MEDIDAS DE SEGURIDAD IMPLEMENTADAS EN ESTE SPRINT

# 4.1 CONTROL DE LA INFRAESTRUCTURA
Se ha mejorado el control de la infraestructura de Fisio Find. Ahora, los servidores intermedios necesarios para las funcionalidades de videollamadas y correo están en un subdominio de Fisio Find.

# 4.2 CIFRADO
Se han implementado medidas de cifrado en las funcionalidades de Fisio Find. Por ejemplo, la funcionalidad de correo implementa cifrado.

También, hemos conseguido implementar cifrado en uno de los datos más sensibles que tratamos: el DNI. Según hemos analizado, si un atacante consigue acceso a la base de datos, este no podría recuperar los DNIs.

# 4.2.1 MIGRACIÓN A CRIPTOGRAFÍA POSTCUÁNTICA
Es sabido que los ordenadores cuánticos pueden romper la criptografía que llevamos utilizando años. Esto quiere decir que, en un futuro todas las medidas de seguridad basadas en criptografía que utiliza Fisio Find(y muchas otras empresas) podrán romperse. En este contexto, lo que tiene sentido es encontrar algoritmos criptográficos que no puedan romper los ordenadores cuánticos(y tampoco los actuales) e implementarlos.

El pasado agosto de 2024, el [NIST publicó los primeros estándares postcuánticos](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards). Actualmente, existe la necesidad de migrar de los algoritmos criptográficos clásicos a algoritmos postcuánticos para evitar ataques como ["harvest now, decrypt later"](https://en.wikipedia.org/wiki/Harvest_now,_decrypt_later). Sin embargo, debido a que muchas de las implementaciones de estos nuevos algoritmos son nuevas(por ejemplo, OpenSSL acaba de implementar importantes cambios respecto a la criptografía postcuántica y los esquemas híbridos en su nueva versión[3.5.0](https://github.com/openssl/openssl/releases/tag/openssl-3.5.0)) y podrían tener vulnerabilidades, y actualmente no existen ordenadores cuánticos, desde Fisio Find preferimos aplazar esta migración y no dedicar recursos a ello, sobre todo porque es probable que nuestros proveedores de hosting acaben implementando criptografía postcuántica en el HTTPS pronto.


# 4.3 ANÁLISIS DE CÓDIGO Y DEPENDENCIAS
Fisio Find desde antes del S3 implementa worklows que comprueban la seguridad del código y de las dependencias que utilizamos. En este sprint, nos han ido avisando de actualizaciones de dependencias y de malas prácticas de seguridad y vulnerabilidades en el código. Estos avisos han ido siendo resueltos y actualizados durante el sprint tras ser analizados. Github ya nos los clasifican por urgencia/riesgo, pero los avisos que han sido resueltos han sido porque lo ha decidido un miembro del equipo tras analizar riesgos y consecuencias del aviso. 

Por otro lado, hemos decidido que no vamos a utilizar los avisos de seguridad que nos ofrece sonarqube, ya que tiene demasiados falsos positivos. Se seguirá monitorizando, pero no será una prioridad atender a esos avisos.

# 5. CONCLUSIONES
Después de este sprint, Fisio Find sigue sin presentar vulnerabilidades críticas que puedan ser encontradas con herramientas automáticas de análisis de seguridad. De hecho, realmente no tenemos vulnerabilidades, solo tenemos avisos, y los avisos que nos devuelve ZAP son genéricos(muchas otras webs lo tienen y no hay consecuencias inmediatas) y no necesitan de acciones inminentes. Sin embargo, se deben de seguir tomando medidas correctivas para la siguiente entrega porque se aspira a tener el mínimo número de avisos. En esta entrega se ha intentado reducir este número y se ha conseguido parcialmente, pero se quiere seguir mejorando en este aspecto.

Por otro lado, el equipo de Fisio Find está implementando medidas de seguridad(además de las correctivas de los análisis de ZAP) que hacen de Fisio Find una aplicación más segura.
