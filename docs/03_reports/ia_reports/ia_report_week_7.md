---
title: "REPORTE DE IA DEL #SPRINT 1"
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 1"
author: [Daniel Fernández Caballero, Daniel Ruiz López]
date: "20/03/2025"
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
header-left: "IA REPORT S1"
header-right: "20/03/2025"
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
  FISIO FIND - REPORTE DE IA DE LA SEMANA 7 (14/03/25) - (20/03/25)
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

- **Contribuidores:** [Daniel Fernández Caballero](https://github.com/DaniFdezCab) [Daniel Ruiz López](https://github.com/Danielruizlopezcc) (autores)

- **Fecha de Creación:** 12/03/2025  

- **Versión:** v1.0  

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                                         | Descripción de los cambios                  |
|-----------|---------|-------------------------------------------------------|---------------------------------------------|
| 12/03/2025 | v1.0   | Daniel Fernández Caballero, Daniel Ruiz López                            | Elaboración de la primera versión del documento. |


---

## INTRODUCCIÓN

Para el primer Sprint, tras la revisión intermedia del trabajo, se decidió implementar métricas cuantitativas para evaluar la efectividad de la IA en función de los prompts utilizados. Las métricas establecidas son las siguientes:

- **Calificación de conversaciones** (escala de 1 a 5).
- **Cantidad de prompts** empleados en cada conversación.
- **Análisis estadístico** de estos datos, incluyendo promedio, desviación estándar y tendencias.

Además, debido a la rectificación del equipo respecto a las métricas, se realizará una diferenciación entre los prompts utilizados en la primera y la segunda semana.

En general, todos los integrantes se han ceñido al **_ia commitment_**, utilizando a la ia siempre con finalidades éticas y revisando sus resultados para siempre tener una última revisión humana.

## PROMPTS UTILIZADOS

A continuación se presentan los distintos prompts evaluados junto con sus respectivas puntuaciones:

1. **[Prompt 1](https://chatgpt.com/share/67d58c1d-c0b0-8000-b3e7-d7810290cdb3)**
   - Puntuación: 5
   - Prompts: 2

2. **[Prompt 2](https://chatgpt.com/share/67d5ff5b-bc78-8012-b7e8-6203fc6b0285)**
   - Puntuación: 4
   - Prompts: 3

3. **[Prompt 3](https://chatgpt.com/share/67d5ffa3-e1ac-8012-b67d-2ba69c136b9b)**
   - Puntuación: 4
   - Prompts: 1

4. **[Prompt 4](https://chatgpt.com/share/67d87425-bb50-800b-80c0-098226d6b527)**
   - Puntuación: 5
   - Prompts: 1

5. **[Prompt 5](https://chatgpt.com/share/67d8565c-fbd4-8012-b2a4-2f05a8fd47c5)**
   - Puntuación: 3
   - Prompts: 1

6. **[Prompt 6](https://chatgpt.com/share/67d966ae-aa78-800b-8059-ffbbdcc55ac5)**
   - Puntuación: 4
   - Prompts: 4


8. **[Prompt 7](https://grok.com/share/bGVnYWN5_bbba8336-784d-4d8e-a21e-8f4507c992fa)**
   - Puntuación: 3
   - Prompts: 9


## Análisis estadístico

En esta sección, realizaremos un análisis estadístico completo basado en las puntuaciones y el número de prompts de los 7 casos documentados en este reporte. Calcularemos medidas como el promedio, la desviación estándar, la distribución y la correlación entre las variables, para luego extraer conclusiones sobre el desempeño de la IA.

### Datos iniciales

Los datos a analizar son los siguientes:

- **Puntuaciones:** 5, 4, 4, 5, 3, 4, 3  
- **Número de prompts:** 2, 3, 1, 1, 1, 4, 9  

Estos valores corresponden a los 7 prompts evaluados en este sprint, cada uno con su respectiva puntuación (en una escala de 1 a 5) y la cantidad de prompts utilizados.

---

### Análisis de las puntuaciones

#### 1. Promedio (Media)

Para calcular el promedio de las puntuaciones, sumamos todos los valores y los dividimos entre el número total de casos, que en este caso es 7.

Suma de las puntuaciones:  
5 + 4 + 4 + 5 + 3 + 4 + 3 = 28  

Promedio:  
28 ÷ 7 = 4  

El promedio de las puntuaciones es **4**. Esto indica que, en general, las interacciones con la IA tienen un desempeño bastante positivo, ya que 4 está por encima del punto medio de la escala (2.5 en un rango de 0 a 5).

#### 2. Desviación estándar

La desviación estándar mide cuánto se alejan las puntuaciones del promedio, lo que nos da una idea de la dispersión de los datos. Para calcularla, primero determinamos la varianza.

##### Paso 1: Calcular la varianza

Restamos el promedio (4) a cada puntuación, elevamos esa diferencia al cuadrado, sumamos todos esos valores y dividimos entre el número de casos (7).

Diferencias al cuadrado:  
(5 - 4)² = 1  
(4 - 4)² = 0  
(4 - 4)² = 0  
(5 - 4)² = 1  
(3 - 4)² = 1  
(4 - 4)² = 0  
(3 - 4)² = 1  

Suma de las diferencias al cuadrado:  
1 + 0 + 0 + 1 + 1 + 0 + 1 = 4  

Varianza:  
4 ÷ 7 ≈ 0.5714  

##### Paso 2: Calcular la desviación estándar

La desviación estándar es la raíz cuadrada de la varianza:  
√0.5714 ≈ 0.7559  

La desviación estándar es aproximadamente **0.76**. Esto significa que las puntuaciones tienden a variar en promedio 0.76 puntos alrededor de la media de 4, lo que indica una dispersión relativamente baja y una consistencia razonable en los resultados.

#### 3. Distribución de las puntuaciones

Contamos cuántas veces aparece cada valor para entender cómo se distribuyen las puntuaciones:  
- 3: 2 veces (28.57%)  
- 4: 3 veces (42.86%)  
- 5: 2 veces (28.57%)  

**Observación:** La puntuación más frecuente es 4 (42.86%), seguida por 3 y 5, ambas con un 28.57%. No hay puntuaciones por debajo de 3, lo que sugiere un desempeño consistentemente aceptable o bueno, con una tendencia hacia valores altos (4 y 5 representan el 71.43% del total).

---

### Análisis del número de prompts

#### 1. Promedio (Media)

Sumamos todos los valores del número de prompts y dividimos entre 7 para obtener el promedio.

Suma de los prompts:  
2 + 3 + 1 + 1 + 1 + 4 + 9 = 21  

Promedio:  
21 ÷ 7 = 3  

El promedio del número de prompts es **3**. Esto indica que, en promedio, cada interacción utiliza 3 prompts, aunque veremos que hay variabilidad en los datos.

#### 2. Desviación estándar

Calculamos la desviación estándar para medir la dispersión del número de prompts respecto al promedio.

##### Paso 1: Calcular la varianza

Restamos el promedio (3) a cada valor, elevamos al cuadrado, sumamos y dividimos entre 7.

Diferencias al cuadrado:  
(2 - 3)² = 1  
(3 - 3)² = 0  
(1 - 3)² = 4  
(1 - 3)² = 4  
(1 - 3)² = 4  
(4 - 3)² = 1  
(9 - 3)² = 36  

Suma de las diferencias al cuadrado:  
1 + 0 + 4 + 4 + 4 + 1 + 36 = 50  

Varianza:  
50 ÷ 7 ≈ 7.1429  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√7.1429 ≈ 2.6719  

La desviación estándar es aproximadamente **2.67**. Esto muestra una dispersión significativa, ya que los valores pueden variar en promedio 2.67 puntos alrededor de la media de 3, influida especialmente por el valor extremo de 9 prompts.

#### 3. Rango

El rango indica la amplitud de los datos:  
- Mínimo: 1 prompt  
- Máximo: 9 prompts  
- Rango = 9 - 1 = 8  

**Observación:** El número de prompts varía desde interacciones muy breves (1 prompt) hasta una más extensa (9 prompts). La desviación estándar de 2.67 confirma esta variabilidad.

---

### Relación entre puntuaciones y número de prompts

Para explorar si existe una relación entre el número de prompts y las puntuaciones, calculamos el **coeficiente de correlación de Pearson**.

#### Paso 1: Calcular los productos cruzados y sumas necesarias

- Suma de puntuaciones (∑x) = 28  
- Suma de prompts (∑y) = 21  
- Suma del producto de puntuaciones y prompts (∑xy):  
  5 × 2 + 4 × 3 + 4 × 1 + 5 × 1 + 3 × 1 + 4 × 4 + 3 × 9  
  = 10 + 12 + 4 + 5 + 3 + 16 + 27 = 77  
- Suma de puntuaciones al cuadrado (∑x²):  
  5² + 4² + 4² + 5² + 3² + 4² + 3²  
  = 25 + 16 + 16 + 25 + 9 + 16 + 9 = 116  
- Suma de prompts al cuadrado (∑y²):  
  2² + 3² + 1² + 1² + 1² + 4² + 9²  
  = 4 + 9 + 1 + 1 + 1 + 16 + 81 = 113  

#### Paso 2: Aplicar la fórmula de Pearson

Fórmula:  
r = [n × ∑xy - ∑x × ∑y] ÷ √{[n × ∑x² - (∑x)²] × [n × ∑y² - (∑y)²]}  

Sustituyendo:  
r = [7 × 77 - 28 × 21] ÷ √{[7 × 116 - 28²] × [7 × 113 - 21²]}  
= [539 - 588] ÷ √{[812 - 784] × [791 - 441]}  
= -49 ÷ √{28 × 350}  
= -49 ÷ √9800  
≈ -49 ÷ 98.99 ≈ -0.4949  

**Resultado:** El coeficiente de correlación es aproximadamente **-0.49**.

**Interpretación:** Un valor de -0.49 indica una correlación negativa moderada. Esto sugiere que, a medida que aumenta el número de prompts, las puntuaciones tienden a disminuir ligeramente, aunque la relación no es muy fuerte. Por ejemplo, el caso con 9 prompts tiene una puntuación de 3, mientras que casos con 1 prompt tienen puntuaciones de 4 o 5.

---

### Tendencias y observaciones

1. **Puntuaciones:**  
   - El promedio de 4 refleja un desempeño generalmente bueno.  
   - La desviación estándar baja (0.76) indica consistencia, con puntuaciones concentradas entre 3 y 5.  
   - No hay puntuaciones por debajo de 3, lo que sugiere que la IA cumple al menos con un nivel aceptable en todos los casos.

2. **Número de prompts:**  
   - El promedio de 3 está influenciado por varios casos con pocos prompts (1) y un caso outlier con 9.  
   - La desviación estándar alta (2.67) muestra una gran variabilidad en la duración de las interacciones.

3. **Relación:**  
   - La correlación negativa moderada (-0.49) implica que interacciones más largas tienden a recibir puntuaciones más bajas, mientras que las más cortas suelen ser mejor valoradas. Esto podría indicar que prompts más concisos son más efectivos en este contexto.

---

### Conclusión del análisis estadístico

- **Puntuaciones:** El promedio de 4 y la ausencia de puntuaciones bajas reflejan un desempeño sólido de la IA, con una dispersión baja (desviación estándar 0.76) que indica consistencia.  
- **Número de prompts:** El promedio de 3 y la alta desviación estándar (2.67) muestran que las interacciones varían mucho en longitud, desde muy breves hasta más extensas.  
- **Relación:** La correlación negativa moderada (-0.49) sugiere que menos prompts podrían estar asociados con mejores resultados, destacando la importancia de la eficiencia en las interacciones.

Este análisis proporciona una base cuantitativa para evaluar la efectividad de la IA en este sprint y orientar mejoras en la formulación de prompts para futuros entregables.

## Aprobado por  
**Scrum Master:** Antonio Macías Ferrera