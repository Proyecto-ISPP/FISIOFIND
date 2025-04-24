---
title: "REPORTE DE IA PPL (11/04/25) - (24/04/25)"
subtitle: "FISIO FIND - Grupo 6 - #SPRINT 3"
author: [Daniel Fernández Caballero, Daniel Ruiz López]
date: "24/04/2025"
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
header-right: "24/04/2025"
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
  FISIO FIND - REPORTE DE IA PPL (11/04/25) - (24/04/25)
</h1>

<br>

**Ficha del documento**

- **Nombre del Proyecto:** FISIO FIND  

- **Número de Grupo:** Grupo 6  

- **Entregable:** #SPRINT 3

- **Miembros del grupo:**  
  Alberto Carmona Sicre, Antonio Macías Ferrera, Benjamín Ignacio Maureira Flores, Francisco Capote García,  
  Daniel Alors Romero, Daniel Fernández Caballero, Daniel Ruiz López, Daniel Tortorici Bartús,  
  Daniel Vela Camacho, Delfín Santana Rubio, Guadalupe Ridruejo Pineda, Julen Redondo Pacheco,  
  Miguel Encina Martínez, Francisco Mateos Villarejo, Pablo Fernández Pérez, Ramón Gavira Sánchez,  
  Rafael Pulido Cifuentes.  

- **Contribuidores:** [Daniel Fernández Caballero](https://github.com/DaniFdezCab) [Daniel Ruiz López](https://github.com/Danielruizlopezcc) (autores)

- **Fecha de Creación:** 24/04/2025  

- **Versión:** v1.0

---

**Histórico de Modificaciones**

| Fecha      | Versión | Realizada por                                         | Descripción de los cambios                  |
|-----------|---------|-------------------------------------------------------|---------------------------------------------|
| 24/04/2025 | v1.0   | Daniel Fernández Caballero, Daniel Ruiz López                            | Elaboración de la primera versión del documento. |


---

## PROMPTS UTILIZADOS

A continuación se presentan los distintos prompts evaluados junto con sus respectivas puntuaciones, cantidad de prompts y porcentaje de alucinaciones.

1. **[Prompt 1](https://chatgpt.com/share/68061b21-4de8-8012-8853-e5e9830b96e0)**  
   - Puntuación: 2  
   - Prompts: 2  
   - Alucinaciones: 0% 

2. **[Prompt 2](https://chatgpt.com/share/68061b4b-aa60-8012-886a-1e8689fbc329)**  
   - Puntuación: 2  
   - Prompts: 1 
   - Alucinaciones: 0%

3. **[Prompt 3](https://chatgpt.com/share/68065efc-4cc4-8000-983f-e39d7c63fd06)**  
   - Puntuación: 4  
   - Prompts: 19  
   - Alucinaciones: 5%

4. **[Prompt 4](https://chatgpt.com/share/6807e612-c068-800f-ab18-76e13d1754fe)**  
   - Puntuación: 5  
   - Prompts: 41  
   - Alucinaciones: 12.2% 

5. **[Prompt 5](https://chatgpt.com/share/6808af8a-90c8-800f-af1f-ee54300054c7)**  
   - Puntuación: 3  
   - Prompts: 6
   - Alucinaciones: 50%

6. **[Prompt 6](https://chatgpt.com/share/6808c68b-7a14-800f-87fb-b063202ba1bb)**  
   - Puntuación: 5
   - Prompts: 14 
   - Alucinaciones: 0% 

7. **[Prompt 7](https://chatgpt.com/share/68090737-1724-800f-9c2d-9fb90da465f4)**  
   - Puntuación: 5  
   - Prompts: 11
   - Alucinaciones: 0% 

8. **[Prompt 8](https://chatgpt.com/share/6809219c-f980-800f-b9d8-7e6fdb99c0ec)**  
   - Puntuación: 5  
   - Prompts: 28
   - Alucinaciones: 35.7% 


## ANÁLISIS ESTADÍSTICO

En esta sección, realizaremos un análisis estadístico completo basado en las puntuaciones, el número de prompts y el porcentaje de alucinaciones de los 8 casos documentados en este reporte. Calcularemos medidas como el promedio, la desviación estándar, la distribución y las correlaciones entre las variables, para luego extraer conclusiones sobre el desempeño de la IA en las consultas realizadas.

### Datos iniciales

Los datos a analizar son los siguientes:

- **Puntuaciones:** 2, 2, 4, 5, 3, 5, 5, 5  
- **Número de prompts:** 2, 1, 19, 41, 6, 14, 11, 28  
- **Alucinaciones (%):** 0, 0, 5, 12.2, 50, 0, 0, 35.7  

Estos valores corresponden a los 8 prompts evaluados, cada uno con su respectiva puntuación (escala de 1 a 5), cantidad de prompts utilizados y porcentaje de alucinaciones.

---

### Análisis de las puntuaciones

#### 1. Promedio (Media)

Para calcular el promedio de las puntuaciones, sumamos todos los valores y los dividimos entre el número total de casos, que es 8.

Suma de las puntuaciones:  
2 + 2 + 4 + 5 + 3 + 5 + 5 + 5 = 31  

Promedio:  
31 ÷ 8 = 3.875  

El promedio de las puntuaciones es **3.875**. Esto indica un desempeño generalmente bueno en las consultas, pero con variaciones que sugieren inconsistencias en la calidad percibida.

#### 2. Desviación estándar

La desviación estándar mide cuánto se alejan las puntuaciones del promedio. Primero calculamos la varianza.

##### Paso 1: Calcular la varianza

Restamos el promedio (3.875) a cada puntuación, elevamos al cuadrado, sumamos y dividimos entre 8:  
(2 - 3.875)² = 3.515625  
(2 - 3.875)² = 3.515625  
(4 - 3.875)² = 0.015625  
(5 - 3.875)² = 1.265625  
(3 - 3.875)² = 0.765625  
(5 - 3.875)² = 1.265625  
(5 - 3.875)² = 1.265625  
(5 - 3.875)² = 1.265625  

Suma de las diferencias al cuadrado:  
3.515625 + 3.515625 + 0.015625 + 1.265625 + 0.765625 + 1.265625 + 1.265625 + 1.265625 = 12.875  

Varianza:  
12.875 ÷ 8 = 1.609375  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√1.609375 ≈ 1.27  

La desviación estándar es aproximadamente **1.27**, indicando una dispersión moderada. Las puntuaciones muestran cierta variabilidad alrededor del promedio.

#### 3. Distribución de las puntuaciones

Contamos cuántas veces aparece cada valor:  
- 2: 2 veces (25%)  
- 3: 1 vez (12.5%)  
- 4: 1 vez (12.5%)  
- 5: 4 veces (50%)  

**Observación:** La puntuación dominante es 5 (50%), pero la presencia de puntuaciones bajas (2 y 3) refleja inconsistencias en el desempeño de las consultas.

---

### Análisis del número de prompts

#### 1. Promedio (Media)

Sumamos todos los valores del número de prompts y dividimos entre 8.

Suma de los prompts:  
2 + 1 + 19 + 41 + 6 + 14 + 11 + 28 = 122  

Promedio:  
122 ÷ 8 = 15.25  

El promedio del número de prompts es **15.25**, sugiriendo interacciones de longitud moderada a alta, aunque con variaciones significativas.

#### 2. Desviación estándar

##### Paso 1: Calcular la varianza

Restamos el promedio (15.25) a cada valor, elevamos al cuadrado, sumamos y dividimos entre 8:  
(2 - 15.25)² = 175.5625  
(1 - 15.25)² = 203.0625  
(19 - 15.25)² = 14.0625  
(41 - 15.25)² = 663.0625  
(6 - 15.25)² = 85.5625  
(14 - 15.25)² = 1.5625  
(11 - 15.25)² = 18.0625  
(28 - 15.25)² = 162.5625  

Suma:  
175.5625 + 203.0625 + 14.0625 + 663.0625 + 85.5625 + 1.5625 + 18.0625 + 162.5625 = 1323.9375  

Varianza:  
1323.9375 ÷ 8 = 165.4921875  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√165.4921875 ≈ 12.86  

La desviación estándar es **12.86**, mostrando una dispersión alta debido al valor extremo de 41 prompts.

#### 3. Rango

- Mínimo: 1 prompt  
- Máximo: 41 prompts  
- Rango = 41 - 1 = 40  

**Observación:** El rango amplio y la alta desviación estándar reflejan una gran variabilidad en la longitud de las interacciones.

---

### Análisis de las alucinaciones

#### 1. Promedio (Media)

Sumamos los porcentajes de alucinaciones y dividimos entre 8:  
0 + 0 + 5 + 12.2 + 50 + 0 + 0 + 35.7 = 102.9  

Promedio:  
102.9 ÷ 8 ≈ 12.8625  

El promedio de alucinaciones es **12.86%**, indicando un nivel moderado de error en promedio, con casos extremos que elevan esta media.

#### 2. Desviación estándar

##### Paso 1: Calcular la varianza

Restamos el promedio (12.8625) a cada valor, elevamos al cuadrado, sumamos y dividimos entre 8:  
(0 - 12.8625)² = 165.44450625  
(0 - 12.8625)² = 165.44450625  
(5 - 12.8625)² = 61.67100625  
(12.2 - 12.8625)² = 0.43950625  
(50 - 12.8625)² = 1382.37890625  
(0 - 12.8625)² = 165.44450625  
(0 - 12.8625)² = 165.44450625  
(35.7 - 12.8625)² = 522.20880625  

Suma:  
165.44450625 + 165.44450625 + 61.67100625 + 0.43950625 + 1382.37890625 + 165.44450625 + 165.44450625 + 522.20880625 = 2788.47625  

Varianza:  
2788.47625 ÷ 8 ≈ 348.55953125  

##### Paso 2: Calcular la desviación estándar

Desviación estándar:  
√348.55953125 ≈ 18.67  

La desviación estándar es **18.67**, indicando una dispersión alta, influida por valores altos como 50%.

#### 3. Distribución de las alucinaciones

- 0%: 4 veces (50%)  
- 5%: 1 vez (12.5%)  
- 12.2%: 1 vez (12.5%)  
- 35.7%: 1 vez (12.5%)  
- 50%: 1 vez (12.5%)  

**Observación:** La mitad de los casos no presentan alucinaciones, pero valores altos (hasta 50%) afectan la percepción general de precisión.

---

### Relación entre variables

#### 1. Puntuaciones y número de prompts

- ∑x = 31, ∑y = 122, ∑xy = 2×2 + 2×1 + ... + 5×28 = 502, ∑x² = 141, ∑y² = 2758  
- r = [8 × 502 - 31 × 122] ÷ √{[8 × 141 - 31²] × [8 × 2758 - 122²]}  
- r = [4016 - 3782] ÷ √{[1128 - 961] × [22064 - 14884]} ≈ 234 ÷ √{167 × 7180} ≈ 0.213  

**Resultado:** Correlación **0.213** (positiva débil). El número de prompts tiene una influencia mínima en las puntuaciones.

#### 2. Puntuaciones y alucinaciones

- ∑x = 31, ∑y = 102.9, ∑xy = 2×0 + 2×0 + ... + 5×35.7 = 258.5, ∑x² = 141, ∑y² = 3229.62  
- r = [8 × 258.5 - 31 × 102.9] ÷ √{[8 × 141 - 31²] × [8 × 3229.62 - 102.9²]}  
- r = [2068 - 3189.9] ÷ √{[1128 - 961] × [25836.96 - 10588.41]} ≈ -1121.9 ÷ √{167 × 15248.55} ≈ -0.703  

**Resultado:** Correlación **-0.703** (negativa moderada-fuerte). Las alucinaciones tienen un impacto significativo en la reducción de las puntuaciones.

#### 3. Número de prompts y alucinaciones

- ∑x = 122, ∑y = 102.9, ∑xy = 2×0 + 1×0 + ... + 28×35.7 = 1476.6, ∑x² = 2758, ∑y² = 3229.62  
- r = [8 × 1476.6 - 122 × 102.9] ÷ √{[8 × 2758 - 122²] × [8 × 3229.62 - 102.9²]}  
- r = [11812.8 - 12553.8] ÷ √{[22064 - 14884] × [25836.96 - 10588.41]} ≈ -741 ÷ √{7180 × 15248.55} ≈ -0.224  

**Resultado:** Correlación **-0.224** (negativa débil). El número de prompts tiene una relación mínima con las alucinaciones.

---

### Tendencias y observaciones

1. **Puntuaciones:** Promedio de 3.875 y desviación de 1.27 reflejan un desempeño bueno pero con variaciones notables, especialmente por puntuaciones bajas (2 y 3).  
2. **Número de prompts:** Promedio de 15.25 y desviación de 12.86 muestran alta variabilidad, con un outlier (41).  
3. **Alucinaciones:** Promedio de 12.86% y desviación de 18.67 indican precisión variable, con casos extremos (50%).  
4. **Relaciones:** Las alucinaciones afectan negativamente las puntuaciones (-0.703), mientras que el número de prompts tiene un impacto limitado (0.213 y -0.224).

---

### Conclusión del análisis estadístico

- **Puntuaciones:** Promedio de 3.875 y desviación de 1.27 reflejan un desempeño aceptable en las consultas, pero con inconsistencias significativas en algunos casos, evidenciadas por puntuaciones bajas (2 y 3). Esto sugiere que la IA es capaz de ofrecer respuestas de alta calidad en la mitad de los casos, pero enfrenta desafíos en ciertos contextos.  
- **Número de prompts:** Promedio de 15.25 y alta desviación (12.86) indican que las consultas varían ampliamente en complejidad o extensión. La correlación débil con las puntuaciones (0.213) sugiere que la cantidad de prompts no es un factor determinante en la calidad de las respuestas.  
- **Alucinaciones:** Promedio de 12.86% y desviación de 18.67 muestran una precisión moderada, pero con casos de error significativo (hasta 50%) que afectan la confianza en las respuestas.  
- **Relación:** Las alucinaciones son el principal factor que reduce las puntuaciones (-0.703), indicando que los errores en las respuestas impactan directamente la percepción de calidad. Para mejorar la experiencia de consulta, es esencial optimizar la precisión de la IA, posiblemente mediante prompts más claros o específicos que minimicen las alucinaciones. La longitud de las interacciones no parece influir significativamente, lo que permite flexibilidad en cómo los usuarios formulan sus consultas.

## Aprobado por  
**Scrum Master:** Antonio Macías Ferrera