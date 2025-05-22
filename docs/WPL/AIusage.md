<!-- ---
title: "REPORTE DE IA DEL WPL (08/05/25) - (22/05/25)"
subtitle: "FISIO FIND - Grupo 6 - #WPL"
author: [Daniel Fernández Caballero]
date: "22/05/2025"
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
header-right: "22/05/2025"
footer-left: "FISIO FIND"
documentclass: scrartcl
classoption: "table"
--- -->

<!-- Imagen del logo (comentar al exportar a PDF) -->
<p align="center">
  <img src="../.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>

<!-- Título centrado -->
<h1 align="center" style="font-size: 30px; font-weight: bold;">
  FISIO FIND - REPORTE DE IA DEL WPL (08/05/25) - (22/05/25)
</h1>

<br>

**ÍNDICE**

- [INTRODUCCIÓN](#introducción)
- [PROMPTS UTILIZADOS](#prompts-utilizados)
- [ANÁLISIS ESTADÍSTICO](#análisis-estadístico)
  - [Datos iniciales](#datos-iniciales)
  - [Análisis de las puntuaciones](#análisis-de-las-puntuaciones)
    - [1. Promedio (Media)](#1-promedio-media)
    - [2. Desviación estándar](#2-desviación-estándar)
    - [3. Distribución de las puntuaciones](#3-distribución-de-las-puntuaciones)
  - [Análisis del número de prompts](#análisis-del-número-de-prompts)
    - [1. Promedio (Media)](#1-promedio-media-1)
    - [2. Desviación estándar](#2-desviación-estándar-1)
    - [3. Rango](#3-rango)
  - [Análisis de las alucinaciones](#análisis-de-las-alucinaciones)
    - [1. Promedio (Media)](#1-promedio-media-2)
    - [2. Desviación estándar](#2-desviación-estándar-2)
    - [3. Distribución de las alucinaciones](#3-distribución-de-las-alucinaciones)
  - [Relación entre variables](#relación-entre-variables)
    - [1. Puntuaciones y número de prompts](#1-puntuaciones-y-número-de-prompts)
    - [2. Puntuaciones y alucinaciones](#2-puntuaciones-y-alucinaciones)
    - [3. Número de prompts y alucinaciones](#3-número-de-prompts-y-alucinaciones)
  - [Tendencias y observaciones](#tendencias-y-observaciones)
  - [Conclusión del análisis estadístico](#conclusión-del-análisis-estadístico)

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND

- **Número de Grupo:** Grupo 6

- **Entregable:** #WPL

- **Miembros del grupo:**
  Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García,  
  Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús,  
  Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco,  
  Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez,  
  Rafael Pulido Cifuentes.

- **Contribuidores:** [Daniel Fernández Caballero](https://github.com/DaniFdezCab) (autor), [Antonio Macías Ferrera](https://github.com/antoniommff) (revisor)

- **Fecha de Creación:** 22/05/2025

- **Versión:** v1.1

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                                         | Descripción de los cambios                  |
|------------|---------|-------------------------------------------------------|---------------------------------------------|
| 22/05/2025 | v1.0    | Daniel Fernández Caballero                            | Elaboración de la primera versión del documento. |
| 22/05/2025 | v1.1    | Antonio Macías Ferrera                            | Pequeñas correcciones ortográficas. Repaso para la entrega del #WPL. |


---

## INTRODUCCIÓN

Para este último sprint de este gran proyecto, el equipo se ha centrado más en presentaciones y en dar los retoques finales al producto. Esto, sumado a que algunos integrantes ya alcanzaron sus 150 horas reglamentarias y por tanto pudieron dejar de trabajar, hace que este último reporte de IA sea el más escueto de todos.

Antes de pasar a los prompts, hace falta mencionar la gran importancia que han tenido las distintas inteligencias artificiales durante todo el período de la asignatura. Gracias a ellas hemos aprendido, hemos mejorado y hemos conseguido superar nuestros límites para lograr unos resultados profesionales y satisfactorios. Cabe recalcar que todo esto ha sido posible gracias al talento del maravilloso equipo de trabajo del proyecto, que ha sabido mejorar su manera de manejar y consultar a la IA en cada iteración.


## PROMPTS UTILIZADOS

A continuación se presentan los distintos prompts evaluados junto con sus respectivas puntuaciones, cantidad de prompts y porcentaje de alucinaciones.

1. **[Prompt 1](https://chatgpt.com/share/682ed1ef-30f0-8000-8548-6f49c9c53994)**  
   - Puntuación: 5  
   - Prompts: 3  
   - Alucinaciones: 0% 

2. **[Prompt 2](https://chatgpt.com/share/682ed204-2c74-8000-b58f-3989e07b66d7)**  
   - Puntuación: 5  
   - Prompts: 1 
   - Alucinaciones: 0%

3. **[Prompt 3](https://chatgpt.com/share/682ed219-5b5c-8000-86bb-7e49f186331d)**  
   - Puntuación: 4  
   - Prompts: 28  
   - Alucinaciones: 15%


## ANÁLISIS ESTADÍSTICO

En esta sección, realizaremos un análisis estadístico completo basado en las puntuaciones, el número de prompts y el porcentaje de alucinaciones de los 3 casos documentados en este reporte. Calcularemos medidas como el promedio, la desviación estándar, la distribución y las correlaciones entre las variables, para luego extraer conclusiones sobre el desempeño de la IA en las consultas realizadas.

### Datos iniciales

Los datos a analizar son los siguientes:

- **Puntuaciones:** 5, 5, 4  
- **Número de prompts:** 3, 1, 28  
- **Alucinaciones (%):** 0, 0, 15  

Estos valores corresponden a los 3 prompts evaluados, cada uno con su respectiva puntuación (escala de 1 a 5), cantidad de prompts utilizados y porcentaje de alucinaciones.

---

### Análisis de las puntuaciones

#### 1. Promedio (Media)

Para calcular el promedio de las puntuaciones, sumamos todos los valores y los dividimos entre el número total de casos, que es 3.

Suma de las puntuaciones:  
5 + 5 + 4 = 14  

Promedio:  
14 ÷ 3 ≈ 4.667  

El promedio de las puntuaciones es **4.667**. Esto indica un desempeño generalmente excelente en las consultas, con una leve variación en la calidad percibida.

#### 2. Desviación estándar

La desviación estándar mide cuánto se alejan las puntuaciones del promedio. Primero calculamos la varianza.

***- Paso 1: Calcular la varianza***

Restamos el promedio (4.667) a cada puntuación, elevamos al cuadrado, sumamos y dividimos entre 3:  
(5 - 4.667)² = 0.111111  
(5 - 4.667)² = 0.111111  
(4 - 4.667)² = 0.444444  

Suma de las diferencias al cuadrado:  
0.111111 + 0.111111 + 0.444444 = 0.666667  

Varianza:  
0.666667 ÷ 3 ≈ 0.222222  

***- Paso 2: Calcular la desviación estándar***

Desviación estándar:  
√0.222222 ≈ 0.471  

La desviación estándar es aproximadamente **0.471**, indicando una dispersión baja. Las puntuaciones son bastante consistentes alrededor del promedio.

#### 3. Distribución de las puntuaciones

Contamos cuántas veces aparece cada valor:  
- 4: 1 vez (33.33%)  
- 5: 2 veces (66.67%)  

**Observación:** La puntuación dominante es 5 (66.67%), reflejando un desempeño mayoritariamente excelente, con un solo caso ligeramente inferior.

---

### Análisis del número de prompts

#### 1. Promedio (Media)

Sumamos todos los valores del número de prompts y dividimos entre 3.

Suma de los prompts:  
3 + 1 + 28 = 32  

Promedio:  
32 ÷ 3 ≈ 10.667  

El promedio del número de prompts es **10.667**, sugiriendo interacciones de longitud variable, influido por un caso con muchos prompts.

#### 2. Desviación estándar

***- Paso 1: Calcular la varianza***

Restamos el promedio (10.667) a cada valor, elevamos al cuadrado, sumamos y dividimos entre 3:  
(3 - 10.667)² = 58.778689  
(1 - 10.667)² = 93.444689  
(28 - 10.667)² = 300.444689  

Suma:  
58.778689 + 93.444689 + 300.444689 = 452.668067  

Varianza:  
452.668067 ÷ 3 ≈ 150.889356  

***- Paso 2: Calcular la desviación estándar***

Desviación estándar:  
√150.889356 ≈ 12.283  

La desviación estándar es **12.283**, mostrando una dispersión alta debido al valor extremo de 28 prompts.

#### 3. Rango

- Mínimo: 1 prompt  
- Máximo: 28 prompts  
- Rango = 28 - 1 = 27  

**Observación:** El rango amplio y la alta desviación estándar reflejan una gran variabilidad en la longitud de las interacciones.

---

### Análisis de las alucinaciones

#### 1. Promedio (Media)

Sumamos los porcentajes de alucinaciones y dividimos entre 3:  
0 + 0 + 15 = 15  

Promedio:  
15 ÷ 3 = 5  

El promedio de alucinaciones es **5%**, indicando un nivel bajo de error en promedio, influido por un solo caso con alucinaciones.

#### 2. Desviación estándar

***- Paso 1: Calcular la varianza***

Restamos el promedio (5) a cada valor, elevamos al cuadrado, sumamos y dividimos entre 3:  
(0 - 5)² = 25  
(0 - 5)² = 25  
(15 - 5)² = 100  

Suma:  
25 + 25 + 100 = 150  

Varianza:  
150 ÷ 3 = 50  

***- Paso 2: Calcular la desviación estándar***

Desviación estándar:  
√50 ≈ 7.071  

La desviación estándar es **7.071**, indicando una dispersión moderada, influida por el valor de 15%.

#### 3. Distribución de las alucinaciones

- 0%: 2 veces (66.67%)  
- 15%: 1 vez (33.33%)  

**Observación:** La mayoría de los casos (66.67%) no presentan alucinaciones, pero el caso con 15% afecta el promedio general.

---

### Relación entre variables

#### 1. Puntuaciones y número de prompts

- ∑x = 14, ∑y = 32, ∑xy = 5×3 + 5×1 + 4×28 = 132, ∑x² = 66, ∑y² = 794  
- r = [3 × 132 - 14 × 32] ÷ √{[3 × 66 - 14²] × [3 × 794 - 32²]}  
- r = [396 - 448] ÷ √{[198 - 196] × [2382 - 1024]} ≈ -52 ÷ √{2 × 1358} ≈ -0.998  

**Resultado:** Correlación **-0.998** (negativa muy fuerte). Un mayor número de prompts está fuertemente asociado con una puntuación más baja.

#### 2. Puntuaciones y alucinaciones

- ∑x = 14, ∑y = 15, ∑xy = 5×0 + 5×0 + 4×15 = 60, ∑x² = 66, ∑y² = 225  
- r = [3 × 60 - 14 × 15] ÷ √{[3 × 66 - 14²] × [3 × 225 - 15²]} ≈ [180 - 210] ÷ √{[198 - 196] × [675 - 225]} ≈ -30 ÷ √{2 × 450} ≈ -0.999  

**Resultado:** Correlación **-0.999** (negativa muy fuerte). Las alucinaciones están fuertemente asociadas con una reducción en las puntuaciones.

#### 3. Número de prompts y alucinaciones

- ∑x = 32, ∑y = 15, ∑xy = 3×0 + 1×0 + 28×15 = 420, ∑x² = 794, ∑y² = 225  
- r = [3 × 420 - 32 × 15] ÷ √{[3 × 794 - 32²] × [3 × 225 - 15²]} ≈ [1260 - 480] ÷ √{[2382 - 1024] × [675 - 225]} ≈ 780 ÷ √{1358 × 450} ≈ 0.998  

**Resultado:** Correlación **0.998** (positiva muy fuerte). Un mayor número de prompts está fuertemente asociado con un mayor porcentaje de alucinaciones.

---

### Tendencias y observaciones

1. **Puntuaciones:** Promedio de 4.667 y desviación de 0.471 reflejan un desempeño excelente y consistente, con una mayoría de puntuaciones altas (5).  
2. **Número de prompts:** Promedio de 10.667 y desviación de 12.283 muestran alta variabilidad, con un outlier (28), reflejando diferencias en la complejidad de las consultas.  
3. **Alucinaciones:** Promedio de 5% y desviación de 7.071 indican alta precisión en general, con un solo caso de alucinaciones (15%).  
4. **Relaciones:** Las alucinaciones y el número de prompts tienen un impacto muy fuerte en la reducción de puntuaciones (-0.999 y -0.998, respectivamente). Además, un mayor número de prompts está fuertemente correlacionado con más alucinaciones (0.998).

---

### Conclusión del análisis estadístico

El análisis revela varios aspectos importantes sobre el desempeño de la IA:

1. **Calidad general:** Con un promedio de puntuaciones de 4.667 y una desviación estándar de 0.471, el sistema demuestra un rendimiento consistentemente alto, con una sola excepción que reduce ligeramente la percepción de calidad.  
2. **Extensión de las interacciones:** La variabilidad en el número de prompts (promedio 10.667, desviación 12.283) refleja la capacidad del sistema para manejar consultas de diferente complejidad, aunque interacciones más largas tienden a tener peores resultados.  
3. **Control de alucinaciones:** El promedio de 5% en alucinaciones, con una desviación de 7.071, indica alta precisión, pero el caso con 15% sugiere que consultas extensas pueden ser propensas a errores.  

<p>
<br>
<hr>
<br>
</p>

***Aprobado por***

**Scrum Master:** Antonio Macías Ferrera