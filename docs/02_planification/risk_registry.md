---
title: "REGISTRO DE RIESGOS"
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
linkcolor: blue
titlepage-background: "../.backgrounds/background1V.pdf"                            
header-left: "REGISTRO DE RIESGOS"                 
header-right: "16/02/2025"                                         
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---


<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND - REGISTRO DE RIESGOS
</h1>

<br>

**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
- [2. LISTADO DE RIESGOS](#2-listado-de-riesgos)
<!-- COMMENT THIS WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** Fisio Find

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Delfín Santana Rubio, Julen Redondo Pacheco

- **Fecha de Creación:** 16/02/2025  

- **Versión:** v1.6

<br>

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                    | Descripción de los cambios |
|------------|---------|----------------------------------|----------------------------|
| 16/02/2025 | v1.0    | Delfín Santana Rubio          | Creación del documento y primeras modificaciones |
| 17/02/2025 | v1.1    | Delfín Santana Rubio          | Añadido impacto, probabilidad y factor a los riesgos, creación del punto 2.1 y añadidos más riesgos |
| 17/02/2025 | v1.2    | Delfín Santana Rubio          | Añadidos más riesgos y movido punto 2.1 al plan de gestión de requisitos  |
| 18/02/2025 | v1.3    | Julen Redondo Pacheco          | Añadidos más riesgos |
| 18/02/2025 | v1.4    | Delfín Santana Rubio          | Modificación del título de RIG-001 por feedback de pull request |
| 19/02/2025 | v1.5    | Delfín Santana Rubio          | Cambiado estilo de las tablas para que se genere correctamente el pdf y añadido nuevo riesgo |
| 20/02/2025 | v1.6    | Delfín Santana Rubio          | Explicadas mejor consecuencias de riesgos |
| 26/02/2025 | v1.7    | Delfín Santana Rubio          | Añadido el RIG-012 |

<br>

<!-- \newpage -->

<br>

# 1. INTRODUCCIÓN  
En este documento se detallan cada uno de los riesgos contemplados en el proyecto FISIO FIND.  

# 2. LISTADO DE RIESGOS

| **RIG-001** | **Filtrado de datos clínicos**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Dado que esta aplicación maneja datos médicos, existe el riesgo de que estos se filtren (ya sea por brecha de seguridad, mal manejo de permisos, etc.). Esto es un problema ya que la regulación actual de protección de datos penaliza gravemente este tipo de sucesos. |
| **Clasificación** | Internos-Externos |
| **Probabilidad** | 3 |
| **Impacto** | 10 |
| **Factor** | 30 |
| **Prioridad** | 10|
| **Contramedidas actuales** | Implementar las medidas de seguridad necesarias: cifrado, herramientas de escaneo de código en búsqueda de vulnerabilidades, etc. |
| **Plan de contingencia** | Este riesgo debe ser completamente evitado. De suceder, siguiendo el GDPR y la LOPD tendríamos que notificar la brecha de seguridad a Incibe y aceptar las consecuencias legales. No tenemos capacidad para hacer una investigación de seguridad sobre incidentes de este tipo. |

| **RIG-002** | **Surgen nuevas necesidades para los fisioterapeutas**  |  
| --- | --- |
| **Versión** | V1.2 |
| **Descripción** | Podría surgir la necesidad de incorporar nuevas herramientas para mejorar las consultas telemáticas. Esto podría causar la necesidad de gastar recursos en desarrollar la nueva funcionalidad. |
| **Clasificación** | Requisitos |
| **Probabilidad** | 5 |
| **Impacto** | 7 |
| **Factor** | 35 |
| **Prioridad** | 7|
| **Contramedidas actuales** | Implementar un buen plan de Gestión de Cambios. |
| **Plan de contingencia** | Seguir el plan de gestión de cambios. |

| **RIG-003** | **Competidores**  |  
| --- | --- |
| **Versión** | V1.2 |
| **Descripción** | Los competidores pueden desarrollar funcionalidades similares a las de FISIO FIND, reduciendo nuestra ventaja competitiva y probablemente nuestro número de clientes. |
| **Clasificación** | Externos |
| **Probabilidad** | 5 |
| **Impacto** | 8 |
| **Factor** | 40 |
| **Prioridad** | 6 |
| **Contramedidas actuales** | Seguir haciendo análisis de competidores periódicamente. |
| **Plan de contingencia** | A partir del análisis de competidores periódico, buscar nuevas debilidades en el mercado para volver a ser innovadores. |

| **RIG-004** | **Problemas al implementar un requisito novedoso**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Existe la posibilidad de que alguna de las herramientas o funcionalidades que quiere implementar el equipo de FISIO FIND sea suficientemente difícil de implementar como para que ocurra un retraso en una entrega o no pueda implementarse. De no poderse implementar las funcionalidades, podríamos perder aquello que nos diferencia de nuestros competidores. |
| **Clasificación** | Técnicos |
| **Probabilidad** | 3 |
| **Impacto** | 6 |
| **Factor** | 18 |
| **Prioridad** | 7 |
| **Contramedidas actuales** | Investigar sobre las tecnologías necesarias para cumplir con un requisito antes de asegurarlo. |
| **Plan de contingencia** | De descubrirse una funcionalidad o herramienta difícil de implementar, se destinarán más recursos para desarrollarla. |

| **RIG-005** | **El usuario no entiende la interfaz**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Existe la posibilidad de que el usuario no sepa utilizar la aplicación. Esto podría causar que el cliente no quiera contratarnos, o que contrate los servicios de nuestra competencia. |
| **Clasificación** | Externos |
| **Probabilidad** | 3 |
| **Impacto**| 5 |
| **Factor** | 15 |
| **Prioridad** | 7 |
| **Contramedidas actuales** | Se deberá hacer la aplicación lo más intuitiva posible y evaluar el grado de usabilidad y satisfacción en las encuestas pasadas a los usuarios piloto. |
| **Plan de contingencia** | De descubrirse de alguna forma que esto está sucediendo, se deberá pedir al usuario final de forma más clara que ofrezca su feedback. Por ejemplo, añadiendo un mensaje en la pantalla de inicio que anime a dar feedback de la aplicación. |

| **RIG-006** | **Los medios para comprobar que un fisioterapeuta está colegiado dejan de estar disponibles**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Existe la posibilidad de que los medios que FISIO FIND utiliza para comprobar si un fisioterapeuta esté o no colegiado dejen de estar disponibles. Actualmente, esto se comprueba a través de las webs públicas de los colegiados. Si una nueva ley de protección impidiera que estas páginas fueran públicas, nuestros mecanismos para verificar la colegiación de un fisioterapeuta quedarían inoperativos(haciendo que no podamos verificar que un fisioterapeuta esté colegiado o no).  |
| **Clasificación** | Técnicos |
| **Probabilidad** | 1 |
| **Impacto** | 9 |
| **Factor** | 9 |
| **Prioridad** | 6 |
| **Contramedidas actuales** | Se deberá estar a la orden del día en cuanto a legislación de protección de datos y a las noticias que estén relacionadas de alguna forma con este riesgo. Debido a la poca probabilidad de que suceda algo así, esto se hará de forma informal por el equipo, sin necesidad de que quede registrado. |
| **Plan de contingencia** | De suceder este riesgo, se buscarán formas alternativas para verificar la colegiación de los fisioterapeutas. Dado que siempre necesitarán comprobar su colegiación, se deberá estudiar la forma de digitalizar y automatizar este proceso al máximo. |

| **RIG-007** | **Las tecnologías utilizadas dejan de estar mantenidas**  |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Existe la posibilidad de que alguna de las tecnologías que se utilizan para el desarrollo de la aplicación dejen de ser mantenidas. Esto es un problema desde el punto de vista de la seguridad y del arreglo de bugs.  |
| **Clasificación** | Técnicos |
| **Probabilidad** | 1 |
| **Impacto** | 6 |
| **Factor** | 6 |
| **Prioridad** | 5 |
| **Contramedidas actuales** | Se deberán utilizar tecnologías que lleven el suficiente tiempo siendo mantenidas y que tengan una amplia comunidad. |
| **Plan de contingencia** | Se deberá estudiar los pros y contras de seguir utilizando el software no mantenido, cambiar a otro software y de que el equipo de FISIO FIND dedique recursos para ellos mismos mantener el software, para así tomar la decisión más adecuada. |

| **RIG-008** | **Problemas con la interoperabilidad entre plataformas**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Existe el riesgo de que la aplicación no funcione correctamente en todos los dispositivos o plataformas para los que se ha diseñado, afectando a la experiencia del usuario y reduciendo la adopción de la aplicación.  |
| **Clasificación** | Técnicos |
| **Probabilidad** | 2 |
| **Impacto** | 6 |
| **Factor** | 12 |
| **Prioridad** | 5 |
| **Contramedidas actuales** | Realizar pruebas de compatibilidad exhaustivas en todos los dispositivos y navegadores principales. |
| **Plan de contingencia** | Si se detectan problemas de interoperabilidad, se ajustarán las configuraciones de la aplicación para garantizar su correcto funcionamiento en las plataformas afectadas. |

| **RIG-009** | **Cambios en estándares web o de sistemas operativos**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Existe el riesgo de que surjan cambios en los estándares web o en sistemas operativos, lo que puede afectar la compatibilidad de la aplicación. Esto afectaría a la experiencia del usuario y reduciendo la adopción de la aplicación. |
| **Clasificación** | Técnicos |
| **Probabilidad** | 1 |
| **Impacto** | 7|
| **Factor** | 7 |
| **Prioridad** | 5 |
| **Contramedidas actuales** | El equipo de desarrollo debe mantener una relación cercana con las comunidades de tecnología web y estar al tanto de las nuevas especificaciones. |
| **Plan de contingencia** | Mantenerse actualizado sobre cambios en los estándares web y adaptar la aplicación conforme sea necesario. |

| **RIG-010** | **Problemas de escalabilidad**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Si la cantidad de usuarios de la aplicación crece rápidamente, la infraestructura podría no soportar la demanda, provocando tiempos de carga lentos o caídas del sistema. Esto afectaría a la experiencia del usuario y reduciendo la adopción de la aplicación. |
| **Clasificación** | Técnicos |
| **Probabilidad** | 5 |
| **Impacto** | 8 |
| **Factor** | 40 |
| **Prioridad** | 6 |
| **Contramedidas actuales** | Realizar pruebas de carga y estrés periódicas para evaluar la capacidad del sistema, además de optimizar el código y las bases de datos para mejorar la eficiencia en el uso de recursos. |
| **Plan de contingencia** | Evaluar la posibilidad de migrar a una infraestructura más robusta en caso de ser necesario. |

| **RIG-011** | **Dependencia de APIs externas**  |  
| --- | --- |
| **Versión** | V1.1 |
| **Descripción** | Si las APIs que se plantean utilizar dejasen de estar operativas o subiese su precio, las funcionalidades que las utilicen se verían afectadas. Esto podría tener un impacto en los costes o en las funcionalidades.  |
| **Clasificación** | Externos |
| **Probabilidad** | 2 |
| **Impacto** | 8 |
| **Factor** | 16 |
| **Prioridad** | 6 |
| **Contramedidas actuales** | Utilizar APIs de servicios que estén bien establecidos en el mercado, como puede ser la API de Google Maps. |
| **Plan de contingencia** | Evaluar la posibilidad de utilizar otra API o seguir usando la misma API pero asumiendo el nuevo precio. |

| **RIG-012** | **Usuarios piloto**  |  
| --- | --- |
| **Versión** | V1.0 |
| **Descripción** | Puede suceder que algunos de nuestros usuarios piloto que se han comprometido a probar la aplicación, no terminen cumpliendo con esto. Si el número de usuarios piloto que nos fallan es muy alto, podría desencadenar que se cumpla el riesgo **RIG-005**, haciendo que perdamos o no tengamos clientes.  |
| **Clasificación** | Externos |
| **Probabilidad** | 3 |
| **Impacto** | 8 |
| **Factor** | 24 |
| **Prioridad** | 7 |
| **Contramedidas actuales** | Conseguir muchos usuarilos piloto para que sea improbable que nos fallen todos. |
| **Plan de contingencia** | Buscar nuevos usuarios piloto y cambiar la forma en la que se gestionan los usuarios piloto. |

