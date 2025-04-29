<!-- ---
title: "REPORTE DE IA DEL #SPRINT 2"
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 2"
author: [Daniel Fernández Caballero, Daniel Ruiz López]
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
titlepage-background: "../../.backgrounds/background4V.pdf"
header-left: "IA REPORT S2"
header-right: "27/03/2025"
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
  FISIO FIND - REPORTE DE IA DEL #SPRINT 2
</h1>

<br>

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND  

- **Número de Grupo:** Grupo 6  

- **Entregable:** #SPRINT 2

- **Miembros del grupo:**  
  Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García,  
  Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús,  
  Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco,  
  Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez,  
  Rafael Pulido Cifuentes.  

- **Contribuidores:** [Daniel Fernández Caballero](https://github.com/DaniFdezCab) [Daniel Ruiz López](https://github.com/Danielruizlopezcc) (autores)

- **Fecha de Creación:** 27/03/2025  

- **Versión:** v1.0  

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                                         | Descripción de los cambios                  |
|-----------|---------|-------------------------------------------------------|---------------------------------------------|
| 27/03/2025 | v1.0   | Daniel Fernández Caballero, Daniel Ruiz López                            | Elaboración de la primera versión del documento. |


---

## Introducción

En el marco del segundo Sprint, y **tras la revisión intermedia del trabajo**, se decidió incorporar una nueva métrica para optimizar la evaluación de la efectividad de la IA en función de los prompts utilizados. Esta nueva métrica corresponde al **porcentaje de alucinaciones** generadas por la IA, lo que permitirá obtener una visión más precisa sobre la calidad y fiabilidad de las conversaciones. Con esta actualización, las métricas establecidas para este sprint son las siguientes:

- **Calificación de conversaciones**: evaluada en una escala de 1 a 5, refleja la calidad percibida de las respuestas de la IA.  
- **Cantidad de prompts**: número de interacciones empleadas en cada conversación, como indicador de su extensión.  
- **Alucinaciones**: porcentaje de respuestas erróneas o inventadas generadas por la IA, para medir su precisión.  
- **Análisis estadístico**: incluye el cálculo de promedios, desviaciones estándar y tendencias, con el fin de identificar patrones y áreas de mejora en el desempeño de la IA.  

Esta evolución en las métricas busca proporcionar una evaluación más completa y detallada, enfocándose no solo en la satisfacción general y la duración de las interacciones, sino también en la exactitud de las respuestas generadas.

## Prompts Utilizados

A continuación se presentan los distintos prompts evaluados junto con sus respectivas puntuaciones, cantidad de prompts y porcentaje de alucinaciones. Los datos se dividen entre la primera y segunda semana del Sprint para reflejar las diferencias en la implementación de las métricas. Cabe destacar que la métrica de alucinaciones no se registró durante la primera semana.

### Primera semana

1. **[Prompt 1](https://chatgpt.com/share/67d58c1d-c0b0-8000-b3e7-d7810290cdb3)**  
   - Puntuación: 5  
   - Prompts: 2  
   - Alucinaciones: No disponible  

2. **[Prompt 2](https://chatgpt.com/share/67d5ff5b-bc78-8012-b7e8-6203fc6b0285)**  
   - Puntuación: 4  
   - Prompts: 3  
   - Alucinaciones: No disponible  

3. **[Prompt 3](https://chatgpt.com/share/67d5ffa3-e1ac-8012-b67d-2ba69c136b9b)**  
   - Puntuación: 4  
   - Prompts: 1  
   - Alucinaciones: No disponible  

4. **[Prompt 4](https://chatgpt.com/share/67d87425-bb50-800b-80c0-098226d6b527)**  
   - Puntuación: 5  
   - Prompts: 1  
   - Alucinaciones: No disponible  

5. **[Prompt 5](https://chatgpt.com/share/67d8565c-fbd4-8012-b2a4-2f05a8fd47c5)**  
   - Puntuación: 3  
   - Prompts: 1  
   - Alucinaciones: No disponible  

6. **[Prompt 6](https://chatgpt.com/share/67d966ae-aa78-800b-8059-ffbbdcc55ac5)**  
   - Puntuación: 4  
   - Prompts: 4  
   - Alucinaciones: No disponible  

7. **[Prompt 7](https://grok.com/share/bGVnYWN5_bbba8336-784d-4d8e-a21e-8f4507c992fa)**  
   - Puntuación: 3  
   - Prompts: 9  
   - Alucinaciones: No disponible  

### Segunda semana

8. **[Prompt 8](https://chatgpt.com/share/67ddb298-3c78-800f-8474-0b02ff767229)**  
   - Puntuación: 5  
   - Prompts: 10  
   - Alucinaciones: 0%  

9. **[Prompt 9](https://chatgpt.com/share/67df0183-0a7c-800f-8e7f-878653b165ba)**  
   - Puntuación: 4  
   - Prompts: 3  
   - Alucinaciones: 33%  

10. **[Prompt 10](https://chatgpt.com/share/67e14b34-3fd4-800f-b1e7-1ff1f0c72781)**  
    - Puntuación: 5  
    - Prompts: 5  
    - Alucinaciones: 0%  

11. **[Prompt 11](https://chatgpt.com/share/67e2bb95-c5d8-800f-a479-36e1fe8e7ac2)**  
    - Puntuación: 5  
    - Prompts: 4  
    - Alucinaciones: 25%  

12. **[Prompt 12](https://grok.com/share/bGVnYWN5_d6335c0d-3ee1-476a-96de-769339dae066)**  
    - Puntuación: 0  
    - Prompts: 4  
    - Alucinaciones: 100%  

13. **[Prompt 13](https://chatgpt.com/share/67e3252a-a2d4-8004-b012-eb0642d25a56)**  
    - Puntuación: 4  
    - Prompts: 18  
    - Alucinaciones: 0%  

14. **[Prompt 14](https://claude.ai/share/546dabdb-4d1a-43ed-9621-eac3c9ed7e0f)**  
    - Puntuación: 5  
    - Prompts: 7  
    - Alucinaciones: 0%  

15. **[Prompt 15](https://chatgpt.com/share/67e430d4-ae74-800f-8fd5-78c3d4374835)**  
    - Puntuación: 5  
    - Prompts: 7  
    - Alucinaciones: 0%  

16. **[Prompt 16](https://chatgpt.com/share/67e3f298-ed64-800f-8d71-e6e3a29f0238)**  
    - Puntuación: 5  
    - Prompts: 13  
    - Alucinaciones: 0%  

17. **[Prompt 17](https://chatgpt.com/share/67e32592-29d4-8004-a24d-ecae574cb892)**  
    - Puntuación: 4  
    - Prompts: 21  
    - Alucinaciones: 0%  

18. **[Prompt 18](https://claude.ai/share/909e4f7b-201c-4e80-af4e-1fce793f6ad8)**  
    - Puntuación: 0  
    - Prompts: 11  
    - Alucinaciones: 100%  

19. **[Prompt 19](https://grok.com/share/bGVnYWN5_c970d106-abce-4063-81c2-4df36af2ef3d)**  
    - Puntuación: 0  
    - Prompts: 3  
    - Alucinaciones: 100%  

20. **[Prompt 20](https://chatgpt.com/share/67e1b4d1-3088-800b-a1dc-8bc4aba300bb)**  
    - Puntuación: 5  
    - Prompts: 3  
    - Alucinaciones: 0%  

21. **[Prompt 21](https://chatgpt.com/share/67df255c-d410-800f-a382-d18359fd576c)**  
    - Puntuación: 5  
    - Prompts: 1  
    - Alucinaciones: 0%  

22. **[Prompt 22](https://chatgpt.com/share/67ded042-2848-800f-87ba-d86271f0f2dd)**  
    - Puntuación: 5  
    - Prompts: 31  
    - Alucinaciones: 0%  

## Análisis estadístico

En esta sección, realizaremos un análisis estadístico completo basado en las puntuaciones, el número de prompts y el porcentaje de alucinaciones de los 22 casos documentados en este reporte. Calcularemos medidas como el promedio, la desviación estándar, la distribución y las correlaciones entre las variables, para luego extraer conclusiones sobre el desempeño de la IA. Dado que la métrica de alucinaciones solo está disponible para la segunda semana (Prompts 8 al 22), su análisis se realizará por separado para esos 15 casos.

### Datos iniciales

Los datos a analizar son los siguientes:

- **Puntuaciones (total, 22 casos):** 5, 4, 4, 5, 3, 4, 3, 5, 4, 5, 5, 0, 4, 5, 5, 5, 4, 0, 0, 5, 5, 5  
- **Número de prompts (total, 22 casos):** 2, 3, 1, 1, 1, 4, 9, 10, 3, 5, 4, 4, 18, 7, 7, 13, 21, 11, 3, 3, 1, 31  
- **Alucinaciones (segunda semana, 15 casos):** 0%, 33%, 0%, 25%, 100%, 0%, 0%, 0%, 0%, 0%, 100%, 100%, 0%, 0%, 0%  

Estos valores corresponden a los 22 prompts evaluados en este sprint, cada uno con su respectiva puntuación (escala de 1 a 5), cantidad de prompts utilizados y, para la segunda semana, el porcentaje de alucinaciones.

---

### Análisis de las puntuaciones

#### 1. Promedio (Media)

Para calcular el promedio de las puntuaciones, sumamos todos los valores y los dividimos entre el número total de casos, que es 22.

Suma de las puntuaciones:  
5 + 4 + 4 + 5 + 3 + 4 + 3 + 5 + 4 + 5 + 5 + 0 + 4 + 5 + 5 + 5 + 4 + 0 + 0 + 5 + 5 + 5 = 85  

Promedio:  
85 ÷ 22 ≈ 3.86  

El promedio de las puntuaciones es **3.86**. Esto indica que, en general, las interacciones con la IA tienen un desempeño positivo, situándose por encima del punto medio de la escala (2.5 en un rango de 0 a 5).

#### 2. Desviación estándar

La desviación estándar mide cuánto se alejan las puntuaciones del promedio, dando una idea de la dispersión. Primero calculamos la varianza.

##### Paso 1: Calcular la varianza

Restamos el promedio (3.86) a cada puntuación, elevamos al cuadrado, sumamos y dividimos entre 22:  
(5 - 3.86)² = 1.2996  
(4 - 3.86)² = 0.0196  
(4 - 3.86)² = 0.0196  
(5 - 3.86)² = 1.2996  
(3 - 3.86)² = 0.7396  
(4 - 3.86)² = 0.0196  
(3 - 3.86)² = 0.7396  
(5 - 3.86)² = 1.2996  
(4 - 3.86)² = 0.0196  
(5 - 3.86)² = 1.2996  
(5 - 3.86)² = 1.2996  
(0 - 3.86)² = 14.8996  
(4 - 3.86)² = 0.0196  
(5 - 3.86)² = 1.2996  
(5 - 3.86)² = 1.2996  
(5 - 3.86)² = 1.2996  
(4 - 3.86)² = 0.0196  
(0 - 3.86)² = 14.8996  
(0 - 3.86)² = 14.8996  
(5 - 3.86)² = 1.2996  
(5 - 3.86)² = 1.2996  
(5 - 3.86)² = 1.2996  

Suma de las diferencias al cuadrado:  
1.2996 + 0.0196 + 0.0196 + 1.2996 + 0.7396 + 0.0196 + 0.7396 + 1.2996 + 0.0196 + 1.2996 + 1.2996 + 14.8996 + 0.0196 + 1.2996 + 1.2996 + 1.2996 + 0.0196 + 14.8996 + 14.8996 + 1.2996 + 1.2996 + 1.2996 = 60.2288  

Varianza:  
60.2288 ÷ 22 ≈ 2.7377  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√2.7377 ≈ 1.65  

La desviación estándar es aproximadamente **1.65**, lo que indica una dispersión moderada. Las puntuaciones varían en promedio 1.65 puntos alrededor de la media de 3.86, reflejando cierta variabilidad debido a los valores extremos (0 y 5).

#### 3. Distribución de las puntuaciones

Contamos cuántas veces aparece cada valor:  
- 0: 3 veces (13.64%)  
- 3: 2 veces (9.09%)  
- 4: 6 veces (27.27%)  
- 5: 11 veces (50.00%)  

**Observación:** La puntuación más frecuente es 5 (50%), seguida de 4 (27.27%). Las puntuaciones altas (4 y 5) representan el 77.27% del total, pero los valores de 0 (13.64%) sugieren una polarización en el desempeño.

---

### Análisis del número de prompts

#### 1. Promedio (Media)

Sumamos todos los valores del número de prompts y dividimos entre 22.

Suma de los prompts:  
2 + 3 + 1 + 1 + 1 + 4 + 9 + 10 + 3 + 5 + 4 + 4 + 18 + 7 + 7 + 13 + 21 + 11 + 3 + 3 + 1 + 31 = 142  

Promedio:  
142 ÷ 22 ≈ 6.45  

El promedio del número de prompts es **6.45**, indicando que las interacciones tienden a ser moderadamente largas, aunque hay una gran variabilidad.

#### 2. Desviación estándar

##### Paso 1: Calcular la varianza

Restamos el promedio (6.45) a cada valor, elevamos al cuadrado, sumamos y dividimos entre 22:  
(2 - 6.45)² = 19.8025  
(3 - 6.45)² = 11.9025  
(1 - 6.45)² = 29.7025  
(1 - 6.45)² = 29.7025  
(1 - 6.45)² = 29.7025  
(4 - 6.45)² = 6.0025  
(9 - 6.45)² = 6.5025  
(10 - 6.45)² = 12.6025  
(3 - 6.45)² = 11.9025  
(5 - 6.45)² = 2.1025  
(4 - 6.45)² = 6.0025  
(4 - 6.45)² = 6.0025  
(18 - 6.45)² = 133.4025  
(7 - 6.45)² = 0.3025  
(7 - 6.45)² = 0.3025  
(13 - 6.45)² = 42.9025  
(21 - 6.45)² = 211.7025  
(11 - 6.45)² = 20.7025  
(3 - 6.45)² = 11.9025  
(3 - 6.45)² = 11.9025  
(1 - 6.45)² = 29.7025  
(31 - 6.45)² = 602.7025  

Suma:  
19.8025 + 11.9025 + 29.7025 + 29.7025 + 29.7025 + 6.0025 + 6.5025 + 12.6025 + 11.9025 + 2.1025 + 6.0025 + 6.0025 + 133.4025 + 0.3025 + 0.3025 + 42.9025 + 211.7025 + 20.7025 + 11.9025 + 11.9025 + 29.7025 + 602.7025 = 1397.45  

Varianza:  
1397.45 ÷ 22 ≈ 63.52  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√63.52 ≈ 7.97  

La desviación estándar es **7.97**, mostrando una alta dispersión debido a la amplia gama de valores (de 1 a 31).

#### 3. Rango

- Mínimo: 1 prompt  
- Máximo: 31 prompts  
- Rango = 31 - 1 = 30  

**Observación:** El rango amplio y la desviación estándar alta confirman una gran variabilidad en la longitud de las interacciones.

---

### Análisis de las alucinaciones (segunda semana)

#### 1. Promedio (Media)

Sumamos los porcentajes de alucinaciones de la segunda semana (15 casos) y dividimos entre 15:  
0 + 33 + 0 + 25 + 100 + 0 + 0 + 0 + 0 + 0 + 100 + 100 + 0 + 0 + 0 = 358  

Promedio:  
358 ÷ 15 ≈ 23.87  

El promedio de alucinaciones es **23.87%**, indicando que, en promedio, casi una cuarta parte de las respuestas en la segunda semana podrían ser erróneas.

#### 2. Desviación estándar

##### Paso 1: Calcular la varianza

Restamos el promedio (23.87) a cada valor, elevamos al cuadrado, sumamos y dividimos entre 15:  
(0 - 23.87)² = 569.7769  
(33 - 23.87)² = 83.3569  
(0 - 23.87)² = 569.7769  
(25 - 23.87)² = 1.2769  
(100 - 23.87)² = 5806.2769  
(0 - 23.87)² = 569.7769  
(0 - 23.87)² = 569.7769  
(0 - 23.87)² = 569.7769  
(0 - 23.87)² = 569.7769  
(0 - 23.87)² = 569.7769  
(100 - 23.87)² = 5806.2769  
(100 - 23.87)² = 5806.2769  
(0 - 23.87)² = 569.7769  
(0 - 23.87)² = 569.7769  
(0 - 23.87)² = 569.7769  

Suma:  
569.7769 + 83.3569 + 569.7769 + 1.2769 + 5806.2769 + 569.7769 + 569.7769 + 569.7769 + 569.7769 + 569.7769 + 5806.2769 + 5806.2769 + 569.7769 + 569.7769 + 569.7769 = 24791.16  

Varianza:  
24791.16 ÷ 15 ≈ 1652.74  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√1652.74 ≈ 40.66  

La desviación estándar es **40.66**, reflejando una dispersión muy alta debido a la polarización entre 0% y 100%.

#### 3. Distribución de las alucinaciones

- 0%: 10 veces (66.67%)  
- 25%: 1 vez (6.67%)  
- 33%: 1 vez (6.67%)  
- 100%: 3 veces (20.00%)  

**Observación:** La mayoría (66.67%) no tiene alucinaciones, pero un 20% tiene alucinaciones totales (100%), mostrando una clara polarización.

---

### Relación entre variables

#### 1. Puntuaciones y número de prompts (22 casos)

- ∑x = 85, ∑y = 142, ∑xy = 5×2 + 4×3 + ... + 5×31 = 672, ∑x² = 385, ∑y² = 1490  
- r = [22 × 672 - 85 × 142] ÷ √{[22 × 385 - 85²] × [22 × 1490 - 142²]}  
- r = [14784 - 12070] ÷ √{[8470 - 7225] × [32780 - 20164]} ≈ 2714 ÷ √{1245 × 12616} ≈ 0.22  

**Resultado:** Correlación **0.22** (positiva débil). Más prompts tienden ligeramente a puntuaciones más altas, pero la relación es débil.

#### 2. Puntuaciones y alucinaciones (segunda semana, 15 casos)

- ∑x = 61, ∑y = 358, ∑xy = 5×0 + 4×33 + ... + 5×0 = 258, ∑x² = 301, ∑y² = 25858  
- r = [15 × 258 - 61 × 358] ÷ √{[15 × 301 - 61²] × [15 × 25858 - 358²]}  
- r = [3870 - 21838] ÷ √{[4515 - 3721] × [387870 - 128164]} ≈ -17968 ÷ √{794 × 259706} ≈ -0.88  

**Resultado:** Correlación **-0.88** (negativa fuerte). Más alucinaciones se asocian fuertemente con puntuaciones más bajas.

#### 3. Número de prompts y alucinaciones (segunda semana, 15 casos)

- ∑x = 133, ∑y = 358, ∑xy = 10×0 + 3×33 + ... + 31×0 = 1358, ∑x² = 1889, ∑y² = 25858  
- r = [15 × 1358 - 133 × 358] ÷ √{[15 × 1889 - 133²] × [15 × 25858 - 358²]} ≈ -0.11  

**Resultado:** Correlación **-0.11** (negativa muy débil). No hay relación clara entre prompts y alucinaciones.

---

### Tendencias y observaciones

1. **Puntuaciones:** Promedio de 3.86, con predominio de 5 (50%), pero valores de 0 indican inconsistencias.  
2. **Número de prompts:** Promedio de 6.45, con alta variabilidad (desviación 7.97), desde 1 hasta 31.  
3. **Alucinaciones:** Promedio de 23.87% en la segunda semana, con 66.67% sin alucinaciones y 20% con 100%.  
4. **Relaciones:** Puntuaciones y prompts tienen correlación débil (0.22); puntuaciones y alucinaciones, fuerte negativa (-0.88); prompts y alucinaciones, casi nula (-0.11).

---

### Conclusión del análisis estadístico

- **Puntuaciones:** Promedio de 3.86 y desviación de 1.65 reflejan un desempeño bueno pero variable.  
- **Número de prompts:** Promedio de 6.45 y alta desviación (7.97) muestran interacciones diversas en longitud.  
- **Alucinaciones:** Promedio de 23.87% y desviación de 40.66 indican polarización en la precisión.  
- **Relación:** Las alucinaciones impactan negativamente las puntuaciones (-0.88), mientras que la cantidad de prompts tiene un efecto leve (0.22).



## Aprobado por  
**Scrum Master:** Antonio Macías Ferrera