---
title: "DESGLOSE DE LOS COSTES"                         # CHANGE IF NEEDED
subtitle: "FISIO FIND - Grupo 6 - #DP"
author: [Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes]
date: "19/02/2025"                                        # CHANGE IF NEEDED
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
header-left: "DESGLOSE DE LOS COSTES"                     # CHANGE IF NEEDED
header-right: "19/02/2025"                                # CHANGE IF NEEDED
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
---

<!-- COMMENT THIS WHEN EXPORTING TO PDF -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>

<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND  -  DESGLOSE DE LOS COSTES
</h1>

<br>

**ÍNDICE**
- [**1. INTRODUCCIÓN**](#1-introducción)
- [**2. COSTES DE DESARROLLO (CapEx)**](#2-costes-de-desarrollo-capex)
  - [**2.1. COSTES DE PERSONAL Y HORAS DE TRABAJO**](#21-costes-de-personal-y-horas-de-trabajo)
  - [**2.2. COSTES DE REEMPLAZO DE HARDWARE Y LICENCIAS**](#22-costes-de-reemplazo-de-hardware-y-licencias)
- [**3. COSTES DE PRODUCCIÓN Y DESPLIEGUE (OpEx)**](#3-costes-de-producción-y-despliegue-opex)
- [**4. COSTES DE MANTENIMIENTO Y SOPORTE**](#4-costes-de-mantenimiento-y-soporte)
- [**5. COSTES DE MARKETING**](#5-costes-de-marketing)
- [**6. ESTIMACIÓN DE RETORNO DE INVERSIÓN (ROI)**](#6-estimación-de-retorno-de-inversión-roi)
- [**7. ANEXO Y EJEMPLO DE CÁLCULO**](#7-anexo-y-ejemplo-de-cálculo)
- [**8. CONCLUSIONES**](#8-conclusiones)
<!-- COMMENT WHEN EXPORTING TO PDF -->

<br>


---

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #DP

- **Miembros del grupo:** Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García, Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús, Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco, Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez, Rafael Pulido Cifuentes.

- **Autores:** Antonio Macías Ferrera, Ramón Gavira Sánchez, Pablo Fernández Pérez

- **Fecha de Creación:** 19/02/2025  

- **Versión:** v1.2

<br>

---

**Historial de modificaciones**

| Fecha         | Versión | Realizada por                               | Descripción de los cambios                       |
| ------------- | ------- | ------------------------------------------- | ------------------------------------------------ |
| 19/02/2025    | v1.0    | Ramón Gavira Sánchez, Pablo Fernández Pérez | Elaboración de la primera versión del documento. |
| 19/02/2025    | v1.1    | Antonio Macías Ferrera                      | Adición del resto de puntos del documento de acuerdo con el *Sprint Planning* general. |
| 24/02/2025    | v1.2    | Antonio Macías Ferrera                      | Modificación del documento para añadir desglose detallado de costes de acuerdo con el *feedback* de la clase del pasado 21/02. |


<br>

<!-- \newpage -->

<br>

# **1. INTRODUCCIÓN**

Este documento detalla el desglose de los costes asociados al desarrollo, producción y despliegue del proyecto **FisioFind**. Se incluyen cálculos basados en horas de trabajo, tarifas por perfil, costes de hardware, licencias, producción, mantenimiento, marketing y soporte. Además, se incorpora una estimación del retorno de inversión (ROI) y se detallan ejemplos de cálculo para ciertos conceptos (por ejemplo, alojamiento de videos).

A modo de resumen, se han obtenido los siguientes valores (todos en euros):

- **Coste de Desarrollo - CapEx** (personal + hardware + licencias + margen 10%) para el primer año ≈ 96.095 ≈ **96 k**

- **Coste de Producción - OpEx** (soporte + despliegue + transferencia de datos + APIs y otros) para el primer año ≈ 7.665 ≈ **8 k**

---

- **Coste del Primer Año (TCO Primer Año)** (CapEx + OpEx) para el primer año ≈ 103.760 ≈ **104 k**

- **Coste del Segundo Año - TCO Segundo Año** ≈ 24.595 ≈ **25 k**

> [!NOTE] 
> Algunos conceptos (por ejemplo, alojamiento de videos) se analizan de forma separada y pueden no incluirse en el TCO global, pero se consideran en el análisis del ROI.

<br>


# **2. COSTES DE DESARROLLO (CapEx)**

Esta sección recoge el coste del desarrollo inicial de la aplicación, incluyendo el coste del personal y las inversiones en hardware y licencias necesarias.


## **2.1. COSTES DE PERSONAL Y HORAS DE TRABAJO**

El equipo de desarrollo de FisioFind está compuesto por **17 personas**, distribuidas de la siguiente manera:

- **5 Analistas**
- **1 Project Manager (PM)**
- **11 Desarrolladores Fullstack**

La distribución de horas de trabajo varía según el mes del proyecto:

- **Febrero:** 36 horas (30 horas base + 20% adicional por alta carga inicial)
- **Marzo:** 48 horas (40 horas base + 20% adicional)
- **Abril:** 36 horas (30 horas base + 20% adicional)
- **Mayo:** 36 horas (30 horas base + 20% adicional)

El incremento del 20% se considera basado en la tendencia observada durante las primeras etapas del proyecto, donde el equipo ha mostrado capacidad y disposición para dedicar horas adicionales cuando es necesario.
Cada integrante debe trabajar un mínimo de **161 horas** mensuales (horas mínimas +15%). Estos roles asumirán los costes de desarrollo que deberán rentabilizarse a largo plazo para lograr el retorno de inversión.

<br>

**COSTE POR HORA SEGÚN PERFIL**

Antes de rentabilizar la aplicación, se estima el siguiente número de horas de trabajo por mes:

- **Febrero, Abril y Mayo:** 30 horas + **20% de incremento** → **36 horas**

- **Marzo:** 40 horas + **20% de incremento** → **48 horas**

Se utilizan las siguientes tarifas por hora:

- **Analista:** 30,82 €/hora  

- **Project Manager:** 37,25 €/hora  

- **Desarrollador:** 27 €/hora  

<br>

**CÁLCULOS**

El cálculo del coste mensual se realiza multiplicando las horas por el coste horario de cada perfil.

1. **Analistas:**  
   - Total de horas: 5 x 161 = 805 horas  
   - Coste: 805 x 30,82 = **24.810,10 €**

2. **Project Manager:**  
   - Total de horas: 1 x 161 = 161 horas  
   - Coste: 161 x 37,25 = **5.997,25 €**

3. **Desarrolladores Fullstack:**  
   - Total de horas: 11 x 161 = 1.771 horas  
   - Coste: 1.771 x 27 = **47.817,00 €**

4. **Coste Total de Personal (CapEx Base):**  
   - Suma: 24.810,10 € + 5.997,25 € + 47.817,00 € = **78.624,35 €**

5. **Aplicando un margen del 10%:**  
   - 78.624,35 € x 1,10 ≈ **86.487 €**

El coste de desarrollo mensual variará según el mes, ya que depende de las horas de trabajo asignadas. Una vez sumados todos los costes mensuales, se aplicará un **10% de margen de contingencia**.



## **2.2. COSTES DE REEMPLAZO DE HARDWARE Y LICENCIAS**

**COSTES DE HARDWARE**

Se estima que la **vida útil media de un equipo es de 3 años**, lo que implica que cada año se debe renovar **1/3 de los equipos**. El coste medio de un equipo es **800€**, por lo que:

- Se renuevan aproximadamente 5,5 equipos al año:
  - Renovación anual: 5,5 x 800 € = **4.400 €**

- **Aplicando un margen de contingencia del 20%:**  
  - 4.400 € x 1,20 = **5.280 €/año**  
  - **Coste mensual de hardware:** 5.280 € / 12 ≈ **440 €/mes**

> [!NOTE]
> Este coste se considera únicamente en el primer año (desarrollo inicial). 
> En años posteriores se prevé un coste menor de hardware debido a que el reemplazo de hardware no es decesario que se realice cada año.

<br>

**COSTES DE LICENCIAS Y HERRAMIENTAS**

1. **GitHub Enterprise:**
   Se utilizará **GitHub Enterprise** para la gestión del código del equipo.
   - Tarifa: 20,04 € por miembro  
   - Total para 17 miembros: 17 x 20,04 € = **340,68 €/mes**

2. **Entorno de Desarrollo/Preproducción:**
   - Coste fijo: **20 €/mes**

- **Total Licencias y Herramientas:** 340,68 + 20 = **360,68 €/mes**  
  - Anual: 360,68 × 12 ≈ **4.328,16 €/año**

> **Resumen CapEx (Primer Año):**  
> - Desarrollo (personal, único): **86.487 €**  
> - Hardware: **5.280 €/año**  
> - Licencias y Herramientas: **4.328 € aprox.**  
> - **Total CapEx Primer Año:** 86.487 + 5.280 + 4.328 ≈ **96.095 €**

<br>

<br>


# **3. COSTES DE PRODUCCIÓN Y DESPLIEGUE (OpEx)**

A partir de junio, se activan los costes operativos (OpEx) relacionados con la producción, soporte y despliegue. Estos costes incluirán los siguientes elementos:

1. **Soporte de Chatbot:**

  Para soporte técnico de primer nivel, se estima el plan más caro, con un coste de 425,51 €/mes.

   - Plan premium *Fisio Gold* (para atención de primer nivel): **425,51 €/mes**  

   - Anual: 425,51 × 12 ≈ **5.106 €**


2. **Despliegue, Alojamiento y Transferencia de Datos:**

   - **Despliegue:** 60 €/mes → 60 × 12 = **720 €/año**  

   - **Transferencia de Datos (Google Cloud):** Se estima un coste medio anual de **1.800 €** (valor variable según uso).
     - Dependiente del uso (videos y documentos).  
     - Estimación para APIs (verificación de DNI, mapa, SMS, videollamada): entre **1.000 € y 2.000 € anuales.**
   
   - **Dominio:** 24 €/año  
   
   - **APIs y otros servicios:** 15 €/año  
      
   - Anual: 720 + 24 + 15 + 1.800 = **2.559 €**

> **Resumen OpEx (Primer Año):**  
> - Soporte Chatbot: **5.106 €**  
> - Despliegue: **720 €**  
> - Trasnferencia: **1.800 € aprox.**  
> - Dominio, APIs, otros: **39 €** 
> - **Total OpEx Primer Año:** 2.559 + 5.106 ≈ **7.665 €/año**
> - **Mensual promedio:** 7.665 €/12 ≈ **639 €/mes**

<br>

<br>


# **4. COSTES DE MANTENIMIENTO Y SOPORTE**


Tras el lanzamiento, se prevé la necesidad de mantenimiento y soporte, divididos en dos categorías:

1. **Mantenimiento Adaptativo:**  
   - Revisión trimestral asignando a un desarrollador 2 jornadas (≈16 horas/trimestre).  
   - Costo (con tarifa de 27 €/hora): 16/3 ≈ 5,33 horas/mes × 27 ≈ **144 €/mes**  
   
   - Anual: 144 × 12 = **1.728 €/año**

2. **Mantenimiento Correctivo:**  
   - Se estiman 10 incidencias mensuales (1 hora cada una).  
   
   - Costo: 10 × 27 = **270 €/mes**  
   
   - Anual: 270 × 12 = **3.240 €/año**

3. **Soporte Premium (Fisio Gold):**  
   - Cobertura en horario laboral con 3 agentes en turnos rotativos: **600 €/mes**  
   
   - Anual: 600 × 12 = **7.200 €/año**

> **Resumen Mantenimiento y Soporte (Primer Año):**  
> - **Total Mantenimiento y Soporte Primer Año:** (144 + 270 + 600) x 12 = **12.168 €/año**
> - **Mensual promedio:** 12.168 €/12 ≈ **1.014 €/mes**



<br>

<br>


# **5. COSTES DE MARKETING**

Los costes de marketing se calculan en función de las campañas publicitarias, promociones y otros esfuerzos de marketing necesarios para atraer usuarios a la plataforma. Se estima un presupuesto mensual de **500€** para marketing digital, incluyendo anuncios en redes sociales, **Google Ads** y otros canales relevantes.

- **Marketing Digital:**  
  - Presupuesto mensual: **500 €/mes**  
  - Anual: 500 x 12 = **6.000 €/año**

<br>

<br>


# **6. ESTIMACIÓN DE RETORNO DE INVERSIÓN (ROI)**

La estimación del ROI se basa en:

- **Registro Inicial:** 100 fisioterapeutas el primer mes.

- **Planes de Suscripción:**

  - **Plan Estándar:** 18,99 €/mes  

  - **Plan PRO:** 23,99 €/mes (estimando que no superará el 20% de los registros)


El análisis del ROI es **dinámico** y, con está web de cálculo de viabilidad que hemos elaborado, podremos modificar los parámetros de análisis de costes y ROI.
Esta herramienta nos permitirá observar de manera dinámica el valor de retorno de la inversión, y el valance de ganancias y pérdidas por meses tomando en cuenta valores como el soporte técnico, el número de usuarios activos en la plataforma cada mes, la subida de vídeos o el tipo de suscripición de los fisioterapeutas inscritos en la plataforma.

[Análisis de Costes y ROI - FisioFind](https://viabilitycalculator-ea5fgpjtyn5jkuq492xz2t.streamlit.app)

Este tipo de análisis dinámico servirá como base para que el equipo pueda modificar los parámetros y actualizar los costes de manera flexible si el proyecto, por su escalabilidad, plazos o tecnologías empleadas se vea obligado a recalcular los costes.


# **7. ANEXO Y EJEMPLO DE CÁLCULO**


A continuación se presenta un resumen detallado de los costes, diferenciando los gastos de desarrollo (CapEx) y operativos (OpEx).

**A. Primer Año (TCO ≈ 123.910 €)**

| Concepto                                | Tipo        | Cálculo / Unidad                      | Mensual (€)         | Anual (€)            |
|-----------------------------------------|-------------|---------------------------------------|---------------------|----------------------|
| **I. Desarrollo y CapEx**               | **Único/Rec.**  |                                       |                     |                      |
| - Desarrollo (Personal con margen)      | Único       | 86.487 € (gasto único)                | —                   | 86.487 €             |
| - Hardware (Renovación + Contingencia)    | Recurrente  | 5.280 €/año                           | 440 €/mes           | 5.280 €              |
| - Licencias y Herramientas              | Recurrente  | 360,68 €/mes                          | 360,68 €/mes        | 4.328,16 €           |
| **Subtotal CapEx**                      |             | 86.487 + 5.280 + 4.328 ≈ **96.095 €**   | —                   | 96.095 €             |
| **II. Operativo (OpEx)**                |             |                                       |                     |                      |
| - Producción y Despliegue               | Recurrente  | 9.645 €/año                           | ≈804 €/mes          | 9.645 €              |
| - Mantenimiento y Soporte               | Recurrente  | 1.014 €/mes                           | 1.014 €/mes         | 12.168 €             |
| - Marketing                             | Recurrente  | 500 €/mes                             | 500 €/mes           | 6.000 €              |
| **Subtotal OpEx**                       |             | 9.645 + 12.168 + 6.000 ≈ **27.813 €**   | ≈2.318 €/mes        | 27.813 €             |
| **Total Primer Año (CapEx + OpEx)**       |             | 96.095 + 27.813 ≈ **123.908 €**         | Promedio ≈10.326 €/mes | ≈123.908 €        |

**B. Segundo Año (TCO ≈ 24.600 €)**

En el segundo año no se repite el coste de desarrollo; sin embargo, se ajustan ciertos gastos operativos:

| Concepto                                | Tipo       | Cálculo / Unidad                        | Mensual (€)          | Anual (€)            |
|-----------------------------------------|------------|-----------------------------------------|----------------------|----------------------|
| - Hardware (coste reducido)             | Recurrente | ~800 €/año                              | ≈67 €/mes            | 800 €                |
| - Licencias y Herramientas              | Recurrente | Igual: 360,68 €/mes                       | 360,68 €/mes         | 4.328,16 €           |
| - Producción y Despliegue (reducción)     | Recurrente | Estimado en 2.319 €/año                    | ≈193 €/mes           | 2.319 €              |
| - Mantenimiento y Soporte (optimizado)   | Recurrente | Reducción (p.ej., menos intervenciones)    | ≈807 €/mes           | ≈9.684 €             |
| - Marketing                             | Recurrente | Igual: 500 €/mes                           | 500 €/mes            | 6.000 €              |
| **Total Segundo Año**                   |            | Suma ≈ 800 + 4.328 + 2.319 + 9.684 + 6.000 ≈ **23.131 €** | ≈1.927 €/mes         | ≈23.131 €           |

> *Observación:* Las reducciones en el segundo año reflejan menores necesidades en hardware, producción y mantenimiento tras la estabilización de la plataforma. Se ha redondeado ligeramente para facilitar la interpretación (el valor original referenciado era de ~24.595 €, por lo que las diferencias son atribuibles a ajustes en supuestos operativos).

**C. Estimación del ROI**

- **Supuesto 1 (Primer Año):**  
  - Si se mantiene una media de 200 suscriptores activos, con una tarifa de 18,99 €/mes:  
    - **Ingreso mensual:** 200 × 18,99 = 3.798 €  
    - **Ingreso anual:** 3.798 × 12 ≈ 45.576 €  
  - **ROI Primer Año:** (45.576 – 123.908) / 123.908 ≈ **–63%**

- **Supuesto 2 (Punto de Equilibrio):**  
  - Para cubrir un coste mensual promedio de ≈10.326 €, se requieren:  
    10.326 / 18,99 ≈ **543 suscriptores activos**  
  - Este es el umbral para alcanzar el break-even.

- **Supuesto 3 (Segundo Año):**  
  - Con un crecimiento a 1.000 suscriptores:  
    - **Ingreso mensual:** 1.000 × 18,99 = 18.990 €  
    - **Ingreso anual:** 18.990 × 12 ≈ 227.880 €  
  - **ROI Segundo Año:** (227.880 – 23.131) / 23.131 ≈ **884%** (indicando un salto considerable en la rentabilidad una vez superado el punto de equilibrio).

> **Conclusión ROI:** La inversión inicial muestra un retorno negativo en el primer año, pero la escalabilidad del modelo y el crecimiento en la base de usuarios permiten alcanzar el break-even (alrededor de 543 suscriptores activos) y lograr un **ROI positivo a partir del segundo año**.


![Análisis de Costes y ROI - FisioFind](../.img/cost_viability_01.png)

![Análisis de Costes y ROI - FisioFind](../.img/cost_viability_02.png)

<br>

<br>


# **8. CONCLUSIONES**


- **Coste de Desarrollo (CapEx):** El desarrollo inicial tiene un coste base de 78.624 €, que al aplicar un margen del 10% asciende a 86.487 €. Sumado a hardware y licencias, el CapEx del primer año es de aproximadamente 96.095 €.

- **TCO del Primer Año:** Integrando CapEx y OpEx (producción, mantenimiento, marketing y soporte), el TCO se sitúa en torno a 103.760 €.

- **TCO del Segundo Año:** Con menores costes recurrentes, el TCO se reduce a aproximadamente 23.000–24.600 €.

- **ROI y Punto de Equilibrio:**  
  - Con un escenario conservador (200 suscriptores), el primer año presenta un ROI negativo (~–63%).  
  - Se estima que el punto de equilibrio se alcanza con unos 543 suscriptores activos.  
  - Se puede lograr un **ROI positivo a partir del segundo año**.

- **Flexibilidad y Revisión:** La herramienta de análisis [FisioFind ROI Calculator](https://viabilitycalculator-ea5fgpjtyn5jkuq492xz2t.streamlit.app) permite modificar estos parámetros dinámicamente para ajustar el análisis conforme a la evolución del proyecto.

---

*Este documento es un análisis inicial y podrá ser actualizado a medida que se disponga de datos reales y se ajusten los parámetros operativos y de mercado.*
