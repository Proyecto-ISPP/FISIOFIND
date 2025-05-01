<!-- ---
title: "PLAN DE PRUEBAS"                       # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 3"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "09/04/2025"                                        # CHANGE IF NEEDED
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
--- -->

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  PLAN DE PRUEBAS
</h1>

<br>


**ÍNDICE**
- [1. INTRODUCCIÓN](#1-introducción)
- [2. PRUEBAS CONTEMPLADAS Y ÁREAS DE APLICACIÓN](#2-pruebas-contempladas-y-áreas-de-aplicación)
- [3. METODOLOGÍA Y POLÍTICA DE PRUEBAS](#3-metodología-y-política-de-pruebas)
  - [3.1 Herramientas que se van a utilizar para las pruebas](#31-herramientas-que-se-van-a-utilizar-para-las-pruebas)
- [4. PRUEBAS IMPLEMENTADAS](#4-pruebas-implementadas)
  - [4.1 PRUEBAS UNITARIAS Y DE INTEGRACIÓN](#41-pruebas-unitarias-y-de-integración)
  - [4.2 PRUEBAS DE INTERFAZ](#42-pruebas-de-interfaz)
  - [4.3 PRUEBAS DE CARGA](#43-pruebas-de-carga)
  - [4.4 PRUEBAS DE SEGURIDAD](#44-pruebas-de-seguridad)
- [5. OBJETIVOS](#5-objetivos)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>

---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #SPRINT 3

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Contribuidores:** [Delfín Santana Rubio](https://github.com/DelfinSR)

- **Fecha de Creación:** 09/04/2025 

- **Versión:** v1.2

<br>


---

<!-- \newpage -->

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por          | Descripción de los cambios                  |
| ---------- | ------- | ---------------------- | ------------------------------------------- |
| 09/04/2025 | v1.0    | Delfín Santana Rubio   | Creación del documento y primeros cambios.  |
| 09/04/2025 | v1.1    | Miguel Encina Martínez | Revisión del documento y corrección de faltas de ortografía |
| 01/05/2025 | v1.2    | Delfín Santana Rubio   | Actualización del estado.  |



<br>

<!-- \newpage -->

<br>


# 1. INTRODUCCIÓN

Un sistema de información puede entenderse, desde una perspectiva abstracta, como una función que transforma vectores de entrada en vectores de salida dentro de un espacio ℝⁿ → ℝᵐ, donde tanto las entradas como las salidas pueden tomar valores en un rango teórico que va de −∞ a +∞. Esta función, que representa la lógica y comportamiento del sistema, es en gran medida desconocida o indefinida hasta que se somete a validación.

Es a través del proceso de pruebas donde empezamos a delinear el contorno del hiperplano que define el comportamiento observable de la aplicación. Cada prueba ejecutada actúa como un punto de muestreo sobre esa función, permitiéndonos visualizar su forma, detectar discontinuidades, anomalías o desviaciones respecto al comportamiento esperado. 

Solo mediante la implementación sistemática de pruebas es posible delimitar con precisión el espacio funcional real de la aplicación: el producto final que aspiramos a entregar.



<br>

<br>

# 2. PRUEBAS CONTEMPLADAS Y ÁREAS DE APLICACIÓN
En este apartado se pretende definir las pruebas que se contemplan en este plan:

- Pruebas unitarias: Pruebas que afectan a una única función o funcionalidad que no depende de otras.
- Pruebas de integración: Pruebas que afectan a una sola o conjunto de funciones o funcionalidades que sí dependen de otras.
- Pruebas de seguridad: Pruebas que comprueban la seguridad de la aplicación. La seguridad de una aplicación se puede entender como el conjunto de configuraciones y lógica de la aplicación. Existen herramientas automáticas que pueden hacer este tipo de tests.
- Pruebas de interfaz: Pruebas que interactúan con la interfaz de la aplicación. Se podría entender como pruebas de integración del sistema con la interfaz.
- Pruebas de carga: Pruebas que simulan interacciones con el sistema y miden su respuesta enfatizando resultados relacionados con el rendimiento del sistema. Generalmente, estas intentan probar lo que su propio nombre indica, cómo el sistema se comporta frente a diversas cargas.

Por otro lado, a continuación se especifica en que áreas se utilizará cada tipo prueba:
- Backend: se harán pruebas unitarias (o, cuando se requiera, de integración), de integración, de seguridad y de carga.
- Frontend: se harán pruebas de seguridad, de interfaz y de carga.

No vamos a hacer pruebas unitarias o de integración para el frontend porque entendemos que, a través de las pruebas de interfaz, también se está probando perfectamente la funcionalidad del frontend.

# 3. METODOLOGÍA Y POLÍTICA DE PRUEBAS
No se deben de hacer pruebas sin razón. Es decir, si se sabe que un componente nunca va a ser integrado con otro, no tiene sentido probarlo. Del mismo modo, si un componente siempre se llama a través de otro, lo que tiene sentido es comprobar directamente la integración de estos dos, como si de un solo componente fuera.

Por otro lado, se entiende que todos los tests deben de ejecutarse correctamente. Sin embargo, durante el desarrollo se podrán dejar tests fallidos bajo la justificación de dejar constancia de que hay un error no contemplado en el código de la aplicación. Por ejemplo, si un/a tester está haciendo tests y encuentra un caso no contemplado en el código, tiene la opción de resolverlo directamente o de darlo a conocer por un canal apropiado. Independientemente de la decisión que tome, el test se deja. Sin embargo, para la entrega del PPL **la mayoría de los tests deberán pasarse**, pudiendo dejar algunos tests fallando como muestra de que hay áreas de mejora. Se hablará más detenidamente sobre esto en la sección de objetivos.

El canal apropiado que se menciona en el ejemplo anterior es un chat específico para bugs que tenemos el equipo de Fisio Find.

Las pruebas a implementar plantean obtener el máximo de *coverage* posible. Además, los tests hechos deberán aportar casos positivos y negativos, para así asegurar el comportamiento esperado de la aplicación. 

Finalmente, las pruebas de seguridad se harán cuando se haga el reporte de seguridad y sus resultados se podrán ver en el documento. En el reporte de seguridad se hacen dos cosas: un análisis de seguridad de la app con ZAP y documentar las nuevas medidas o decisiones de seguridad que se han tomado o implementado en el sprint especificado. Para las pruebas de seguridad sólo es pertinente la sección del análisis de seguridad. Por otro lado, el reporte de seguridad está en la carpeta de reportes y sólo tendrá vigencia el último generado. Los resultados se podrán ver en la sección de "Resultados del análisis" y "Conclusiones". La carpeta se encuentra en la ruta [docs/03_reports/security_reports](https://github.com/Proyecto-ISPP/FISIOFIND/tree/main/docs/03_reports/security_reports) y el vigente es el del último sprint.

## 3.1 Herramientas que se van a utilizar para las pruebas
En general, se va a intentar integrar el mínimo número de herramientas externas a los que ya nos dan los *frameworks* y lenguajes que utilizamos en el desarrollo. Esto es así porque se quiere ahorrar tiempo de configuración e integración. También, tomamos como referencia las herramientas que se han dado en las píldoras teóricas y en otras asignaturas.

Las pruebas de seguridad se harán tal y como se hacen en el reporte de seguridad, con la herramienta ZAP.

# 4. PRUEBAS IMPLEMENTADAS

## 4.1 PRUEBAS UNITARIAS Y DE INTEGRACIÓN
A fecha de redacción de este documento, todos los módulos del backend de Fisio Find están probados.

El resto de módulos ya están probados. Además, como se ha dicho en la metodología, todos estos tienen tests de casos positivos y negativos. Creemos que ofrecer una descripción de cada test implementado no aporta valor a este documento.

A continuación, ofrecemos un listado detallado del coverage actual:
|Name                                            |Stmts   |Miss  |Cover|
|------------------------------------------------|-------|-------|-----|
|appointment/__init__.py                         |    0   |   0  | 100%|
|appointment/admin.py                            |    7   |   0  | 100%|
|appointment/apps.py                             |    4   |   0  | 100%|
|appointment/emailUtils.py                       |  116   |  47  |  59%|
|appointment/migrations/0001_initial.py          |    5   |   0  | 100%|
|appointment/migrations/0002_initial.py          |    6   |   0  | 100%|
|appointment/migrations/__init__.py              |    0   |   0  | 100%|
|appointment/models.py                           |   23   |   1  |  96%|
|appointment/serializers.py                      |   59   |   4  |  93%|
|appointment/tests.py                            | 1413   |  20  |  99%|
|appointment/urls.py                             |    5   |   0  | 100%|
|appointment/views.py                            |  488   |  93  |  81%|
|appointment_rating/__init__.py                  |    0   |   0  | 100%|
|appointment_rating/admin.py                     |    1   |   0  | 100%|
|appointment_rating/apps.py                      |    4   |   0  | 100%|
|appointment_rating/emailUtils.py                |   12   |   0  | 100%|
|appointment_rating/migrations/0001_initial.py   |    6   |   0  | 100%|
|appointment_rating/migrations/0002_initial.py   |    6   |   0  | 100%|
|appointment_rating/migrations/__init__.py       |    0   |   0  | 100%|
|appointment_rating/models.py                    |   16   |   0  | 100%|
|appointment_rating/serializers.py               |   19   |   1  |  95%|
|appointment_rating/tests.py                     |  206   |   0  | 100%|
|appointment_rating/urls.py                      |    3   |   0  | 100%|
|appointment_rating/views.py                     |  114   |   9  |  92%|
|files/__init__.py                               |    0   |   0  | 100%|
|files/admin.py                                  |   66   |  34  |  48%|
|files/apps.py                                   |    4   |   0  | 100%|
|files/migrations/0001_initial.py                |    5   |   0  | 100%|
|files/migrations/0002_initial.py                |    6   |   0  | 100%|
|files/migrations/__init__.py                    |    0   |   0  | 100%|
|files/models.py                                 |   42   |  16  |  62%|
|files/serializers.py                            |  113   |  15  |  87%|
|files/tests.py                                  |  534   |   4  |  99%|
|files/urls.py                                   |    3   |   0  | 100%|
|files/views.py                                  |  255   |  47  |  82%|
|fisio_find/__init__.py                          |    0   |   0  | 100%|
|fisio_find/settings.py                          |   77   |   7  |  91%|
|fisio_find/urls.py                              |   14   |   3  |  79%|
|guest_session/__init__.py                       |    0   |   0  | 100%|
|guest_session/admin.py                          |    0   |   0  | 100%|
|guest_session/apps.py                           |    4   |   0  | 100%|
|guest_session/migrations/__init__.py            |    0   |   0  | 100%|
|guest_session/models.py                         |    0   |   0  | 100%|
|guest_session/tests.py                          |   90   |   0  | 100%|
|guest_session/urls.py                           |    4   |   0  | 100%|
|guest_session/views.py                          |  204   |  39  |  81%|
|manage.py                                       |   11   |   2  |  82%|
|payment/__init__.py                             |    0   |   0  | 100%|
|payment/admin.py                                |    7   |   0  | 100%|
|payment/apps.py                                 |    4   |   0  | 100%|
|payment/migrations/0001_initial.py              |    7   |   0  | 100%|
|payment/migrations/__init__.py                  |    0   |   0  | 100%|
|payment/models.py                               |   23   |   1  |  96%|
|payment/serializers.py                          |    9   |   0  | 100%|
|payment/tests.py                                |  571   |   0  | 100%|
|payment/urls.py                                 |    3   |   0  | 100%|
|payment/utils/pdf_generator.py                  |   95   |   0  | 100%|
|payment/views.py                                |  368   | 118  |  68%|
|questionnaire/__init__.py                       |    0   |   0  | 100%|
|questionnaire/admin.py                          |    3   |   0  | 100%|
|questionnaire/apps.py                           |    4   |   0  | 100%|
|questionnaire/migrations/0001_initial.py        |    5   |   0  | 100%|
|questionnaire/migrations/0002_initial.py        |    6   |   0  | 100%|
|questionnaire/migrations/__init__.py            |    0   |   0  | 100%|
|questionnaire/models.py                         |   21   |   6  |  71%|
|questionnaire/serializers.py                    |   45   |   8  |  82%|
|questionnaire/tests.py                          |  146   |   0  | 100%|
|questionnaire/urls.py                           |    3   |   0  | 100%|
|questionnaire/views.py                          |   81   |   9  |  89%|
|ratings/__init__.py                             |    0   |   0  | 100%|
|ratings/admin.py                                |   11   |   1  |  91%|
|ratings/apps.py                                 |    4   |   0  | 100%|
|ratings/migrations/0001_initial.py              |    5   |   0  | 100%|
|ratings/migrations/0002_initial.py              |    6   |   0  | 100%|
|ratings/migrations/__init__.py                  |    0   |   0  | 100%|
|ratings/models.py                               |   13   |   1  |  92%|
|ratings/serializers.py                          |   32   |   3  |  91%|
|ratings/tests.py                                |  197   |   0  | 100%|
|ratings/urls.py                                 |    3   |   0  | 100%|
|ratings/views.py                                |   85   |   4  |  95%|
|terms/__init__.py                               |    0   |   0  | 100%|
|terms/admin.py                                  |    3   |   0  | 100%|
|terms/apps.py                                   |    4   |   0  | 100%|
|terms/migrations/0001_initial.py                |    5   |   0  | 100%|
|terms/migrations/0002_initial.py                |    6   |   0  | 100%|
|terms/migrations/__init__.py                    |    0   |   0  | 100%|
|terms/models.py                                 |   15   |   1  |  93%|
|terms/serializers.py                            |    8   |   0  | 100%|
|terms/tests.py                                  |  106   |   0  | 100%|
|terms/urls.py                                   |    3   |   0  | 100%|
|terms/views.py                                  |   72   |   4  |  94%|
|treatments/__init__.py                          |    0   |   0  | 100%|
|treatments/admin.py                             |   28   |   2  |  93%|
|treatments/migrations/0001_initial.py           |    6   |   0  | 100%|
|treatments/migrations/0002_initial.py           |    6   |   0  | 100%|
|treatments/migrations/__init__.py               |    0   |   0  | 100%|
|treatments/models.py                            |  116   |   2  |  98%|
|treatments/serializers.py                       |  104   |   7  |  93%|
|treatments/tests.py                             | 1180   |  35  |  97%|
|treatments/urls.py                              |    3   |   0  | 100%|
|treatments/views.py                             |  631   | 194  |  69%|
|users/__init__.py                               |    0   |   0  | 100%|
|users/admin.py                                  |   48   |   2  |  96%|
|users/apps.py                                   |    4   |   0  | 100%|
|users/emailUtils.py                             |   88   |  69  |  22%|
|users/forms.py                                  |  105   |  80  |  24%|
|users/migrations/0001_initial.py                |   12   |   0  | 100%|
|users/migrations/__init__.py                    |    0   |   0  | 100%|
|users/models.py                                 |  130   |  12  |  91%|
|users/permissions.py                            |   13   |   0  | 100%|
|users/serializers.py                            |  321   |  46  |  86%|
|users/subscription_views.py                     |   53   |  37  |  30%|
|users/tests.py                                  | 1325   |   1  |  99%|
|users/urls.py                                   |    7   |   0  | 100%|
|users/util.py                                   |  132   |   8  |  94%|
|users/validacionFisios.py                       |  395   | 374  |   5%|
|users/views.py                                  |  393   | 130  |  67%|
|videocall/__init__.py                           |    0   |   0  | 100%|
|videocall/admin.py                              |    3   |   0  | 100%|
|videocall/apps.py                               |    4   |   0  | 100%|
|videocall/migrations/0001_initial.py            |    6   |   0  | 100%|
|videocall/migrations/__init__.py                |    0   |   0  | 100%|
|videocall/models.py                             |   18   |   1  |  94%|
|videocall/serializers.py                        |   21   |   1  |  95%|
|videocall/tests.py                              |  210   |   0  | 100%|
|videocall/urls.py                               |    3   |   0  | 100%|
|videocall/views.py                              |   80   |   0  | 100%|

En resumen, el coverage total actual es del 87%. Como se puede ver, hay módulos que ya están probados pero podría mejorarse su coverage. El script de validación de fisios está probado pero como tarda mucho en probarse (porque utiliza selenium) no se ofrece el coverage aqui.

## 4.2 PRUEBAS DE INTERFAZ
Se han implementado pruebas de interfaz de con el add-on de selenium ide. Estas cubren casos específicos.

## 4.3 PRUEBAS DE CARGA
Se han implementado pruebas de interfaz con locust. Estas cubren casos específicos.

## 4.4 PRUEBAS DE SEGURIDAD
Finalmente, las pruebas de seguridad sí están implementadas y se hacen durante el sprint. Actualmente Fisio Find no tiene ningún aviso de categoría **high**.

# 5. OBJETIVOS
Para el PPL se deberán tener estas pruebas implementadas:
- Pruebas de integración o unitarias para todos los módulos del backend de Fisio Find.
  - Estas pruebas deberán ofrecer un coverage mínimo del 80%.
- Pruebas de interfaz para el frontend.
- Pruebas de seguridad para el frontend y backend.
- Pruebas de carga para frontend y backend.

Además, como ya se ha dicho anteriormente, la mayoría de las pruebas deberán pasarse para el PPL(se pueden dejar tests que fallen para cambiarse posteriormente). 

Por otro lado, las pruebas de seguridad no ofrecen un valor de pasado o no pasado, sino que dan una categoría de riesgo o de peligro. Nuestro objetivo es no tener ningún aviso que sea de categoría crítica o alta que no esté justificado en el reporte de seguridad (el cual se puede encontrar en la carpeta de reportes que se encuentra en la ruta [docs/03_reports/security_reports](https://github.com/Proyecto-ISPP/FISIOFIND/tree/main/docs/03_reports/security_reports) y el vigente es el del último sprint).
