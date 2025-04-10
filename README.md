<p align="center">
  <img src="docs/.img/Logo_FisioFind_Verde_sin_fondo.webp" alt="Logo FisioFind" width="300" />
</p>
<p align="center"><h1 align="center">Fisio Find</h1></p>
<p align="center">
	<em><code>The specialized online consultation platform for physiotherapists</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/last-commit/Proyecto-ISPP/FISIOFIND?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Proyecto-ISPP/FISIOFIND?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Proyecto-ISPP/FISIOFIND?style=default&color=0080ff" alt="repo-language-count">
</p>
<p align="center"><!-- default option, no dependency badges. -->
</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>
<br>

**Table of Contents**

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
	- [Project Index](#project-index)
- [Local Deployment](#local-deployment)
	- [Prerequisites](#prerequisites)
	- [Installation](#installation)
	- [Database Setup](#database-setup)
	- [Usage](#usage)
- [Project Roadmap](#project-roadmap)
	- [Sprint 1: Core Use Cases](#sprint-1-core-use-cases)
	- [Sprint 2: Tools \& Payment](#sprint-2-tools--payment)
	- [Sprint 3: Extras \& Testing](#sprint-3-extras--testing)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

##  Overview

Fisio Find is a specialized online consultation platform designed to connect physiotherapists with patients. The platform streamlines the process of finding and booking physiotherapy services, while providing professionals with tools to manage their practice efficiently.

---

##  Features

- **📅 Appointment Management**
  - Interactive calendar system
  - Automated scheduling
  - Reminder notifications
  - Real-time availability updates

- **💻 Virtual Consultations**
  - High-quality video calls
  - Secure chat system
  - File sharing capabilities
  - Session recording options

- **💰 Payment Integration**
  - Secure payment processing
  - Multiple payment methods
  - Automated invoicing
  - Subscription management

- **📊 Professional Tools**
  - Patient record management
  - Treatment tracking
  - Progress reports

---

##  Project Structure

```sh
└── FISIOFIND/
    ├── .github
    │   ├── ISSUE_TEMPLATE
    │   ├── PULL_REQUEST_TEMPLATE.md
    │   └── workflows
    ├── README.md
    ├── backend
    │   ├── .env.example
    │   ├── fisio_find
	│ 	│   ├── appointment
	│ 	│   ├── appointment_rating
	│ 	│   ├── files
	│ 	│   ├── fisio_find
	│ 	│   ├── gestion_survey
	│ 	│   ├── guest_session
	│ 	│   ├── payment
	│ 	│   │	├── management/commands
	│ 	│   │	└── utils
	│ 	│   ├── questionnaire
	│ 	│   ├── ratings
	│ 	│   ├── terms
	│ 	│   ├── treatments
	│ 	│   │	└── management/commands
	│ 	│   ├── users
	│ 	│   └── videocall
    │   ├── requirements.txt
    │   └── run-backend.ps1
    ├── docs
    │   ├── .DS_Store
    │   ├── .backgrounds
    │   ├── .img
    │   ├── 01_organization
    │   ├── 02_planification
    │   ├── 03_reports
    │   ├── 04_monitoring
    │   ├── 05_knowledge_base
    │   ├── 06_terms
    │   ├── Devising a Project
    │   ├── SPRINT 1
    │   ├── SPRINT 2
    │   ├── build-pdf-examples.sh
    │   ├── eisvogel.latex
    │   └── templates
    └── frontend
        ├── README.md
        ├── app
		│   ├── account/delete/confirm/[token]
		│   ├── advanced-search
		│   ├── appointments/create/[id]
		│   ├── confirm-alternative/[token]
		│   ├── confirm-appointment/[token]
		│   ├── login
		│   ├── logout
		│   ├── modelo
		│   ├── my-appointments
		│   ├── patient-management
		│	│   ├── follow-up
		│	│   │	├── [id]
		│	│   │	│	├── sessions
		│	│   │	│	│	└── [sessionId]
		│	│   │	│	└── videos
		│	│   └── profile
		│   ├── permissions-error
		│   ├── physio-management
		│	│   ├── [id]/exercises
		│	│   ├── balance
		│	│   ├── follow-up
		│	│   │	├── [id]
		│	│   │	│	├── sessions
		│	│   │	│	│	└── [sessionId]
		│	│   │	│	└── videos
		│	│   │	└──	 components
		│	│   ├── profile
		│	│   └── video
		│   ├── questionnaires
		│   ├── register
		│	│   ├── patient
		│	│   ├── physio
		│	│   └── verified/[token]
		│   ├── terms
		│   ├── unsubscribe
		│   ├── videocalls
		│	│   ├── [roomCode]
		│	│   ├── css
		│	│   ├── end
		│	│   ├── hooks
		│	│   ├── tools
		│	│   │	├── body-highlighter
		│	│	│   │	├── assests
		│	│	└── └──	└── components
		│   ├── globals.css
		│   ├── layout.tsx
		│   ├── not-found.tsx
		│   └── page.tsx
        ├── components
		│   └── ui
        ├── context
        ├── lib
        ├── public
		│   ├── images
		│   └── pdfs/06_terms
        ├── services
        ├── static
		│   ├── images
		│   │ 	├── body-regions
		│   └── └── exercise-types
        └── utils
```

### Project Index

<details open>
	<summary><b><code>FISIOFIND/</code></b></summary>
	<ul style="list-style-type: none; padding-left: 20px;">
		<li>
			<details>
				<summary><b>.github</b></summary>
				<ul style="list-style-type: none; padding-left: 20px;">
					<li><b><a href='../FISIOFIND/.github/ISSUE_TEMPLATE'>ISSUE_TEMPLATE</a></b> - Plantillas para la creación de issues en GitHub</li>
					<li><b><a href='../FISIOFIND/.github/PULL_REQUEST_TEMPLATE.md'>PULL_REQUEST_TEMPLATE.md</a></b> - Plantilla para pull requests en GitHub</li>
					<li><b><a href='../FISIOFIND/.github/workflows'>workflows</a></b> - Configuraciones de flujos de trabajo para GitHub Actions</li>
				</ul>
			</details>
		</li>
		<li><b><a href='../FISIOFIND/README.md'>README.md</a></b> - Documento principal del proyecto FISIOFIND</li>
		<li>
			<details>
				<summary><b>backend</b></summary>
				<ul style="list-style-type: none; padding-left: 20px;">
					<li><b><a href='../FISIOFIND/backend/.env.example'>.env.example</a></b> - Ejemplo de archivo de entorno</li>
					<li>
						<details>
							<summary><b>fisio_find</b></summary>
							<ul style="list-style-type: none; padding-left: 20px;">
								<li><b><a href='../FISIOFIND/backend/fisio_find/appointment'>appointment</a></b> - Módulo para gestionar citas</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/appointment_rating'>appointment_rating</a></b> - Módulo para calificaciones de citas</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/files'>files</a></b> - Módulo para gestión de archivos</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/fisio_find'>fisio_find</a></b> - Configuración principal del proyecto Django</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/gestion_survey'>gestion_survey</a></b> - Módulo para gestión de encuestas</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/guest_session'>guest_session</a></b> - Módulo para sesiones de invitados</li>
								<li>
									<details>
										<summary><b>payment</b></summary>
										<ul style="list-style-type: none; padding-left: 20px;">
											<li><b><a href='../FISIOFIND/backend/fisio_find/payment/management/commands'>management/commands</a></b> - Comandos personalizados para pagos</li>
											<li><b><a href='../FISIOFIND/backend/fisio_find/payment/utils'>utils</a></b> - Utilidades para el módulo de pagos</li>
										</ul>
									</details>
								</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/questionnaire'>questionnaire</a></b> - Módulo para cuestionarios</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/ratings'>ratings</a></b> - Módulo para calificaciones generales</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/terms'>terms</a></b> - Módulo para términos y condiciones</li>
								<li>
									<details>
										<summary><b>treatments</b></summary>
										<ul style="list-style-type: none; padding-left: 20px;">
											<li><b><a href='../FISIOFIND/backend/fisio_find/treatments/management/commands'>management/commands</a></b> - Comandos personalizados para tratamientos</li>
										</ul>
									</details>
								</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/users'>users</a></b> - Módulo para gestión de usuarios</li>
								<li><b><a href='../FISIOFIND/backend/fisio_find/videocall'>videocall</a></b> - Módulo para videollamadas</li>
							</ul>
						</details>
					</li>
					<li><b><a href='../FISIOFIND/backend/requirements.txt'>requirements.txt</a></b> - Lista de dependencias del backend</li>
					<li><b><a href='../FISIOFIND/backend/run-backend.ps1'>run-backend.ps1</a></b> - Script para ejecutar el backend</li>
				</ul>
			</details>
		</li>
		<li>
			<details>
				<summary><b>docs</b></summary>
				<ul style="list-style-type: none; padding-left: 20px;">
					<li><b><a href='../FISIOFIND/docs/.DS_Store'>.DS_Store</a></b> - Archivo de configuración de macOS</li>
					<li><b><a href='../FISIOFIND/docs/.backgrounds'>.backgrounds</a></b> - Fondos para documentación</li>
					<li><b><a href='../FISIOFIND/docs/.img'>.img</a></b> - Imágenes para documentación</li>
					<li><b><a href='../FISIOFIND/docs/01_organization'>01_organization</a></b> - Documentación sobre organización</li>
					<li><b><a href='../FISIOFIND/docs/02_planification'>02_planification</a></b> - Documentación sobre planificación</li>
					<li><b><a href='../FISIOFIND/docs/03_reports'>03_reports</a></b> - Informes del proyecto</li>
					<li><b><a href='../FISIOFIND/docs/04_monitoring'>04_monitoring</a></b> - Documentación sobre monitoreo</li>
					<li><b><a href='../FISIOFIND/docs/05_knowledge_base'>05_knowledge_base</a></b> - Base de conocimiento del proyecto</li>
					<li><b><a href='../FISIOFIND/docs/06_terms'>06_terms</a></b> - Términos y condiciones documentados</li>
					<li><b><a href='../FISIOFIND/docs/Devising a Project'>Devising a Project</a></b> - Guía para diseñar el proyecto</li>
					<li><b><a href='../FISIOFIND/docs/SPRINT 1'>SPRINT 1</a></b> - Documentación del Sprint 1</li>
					<li><b><a href='../FISIOFIND/docs/SPRINT 2'>SPRINT 2</a></b> - Documentación del Sprint 2</li>
					<li><b><a href='../FISIOFIND/docs/build-pdf-examples.sh'>build-pdf-examples.sh</a></b> - Script para generar PDFs de ejemplo</li>
					<li><b><a href='../FISIOFIND/docs/eisvogel.latex'>eisvogel.latex</a></b> - Plantilla LaTeX para documentación</li>
					<li><b><a href='../FISIOFIND/docs/templates'>templates</a></b> - Plantillas para documentación</li>
				</ul>
			</details>
		</li>
		<li>
			<details>
				<summary><b>frontend</b></summary>
				<ul style="list-style-type: none; padding-left: 20px;">
					<li><b><a href='../FISIOFIND/frontend/README.md'>README.md</a></b> - Documentación principal del frontend</li>
					<li>
						<details>
							<summary><b>app</b></summary>
							<ul style="list-style-type: none; padding-left: 20px;">
								<li>
									<b><a href='../FISIOFIND/frontend/app/account'>account</a></b> - Gestión de cuentas
									<ul style="list-style-type: none; padding-left: 20px;">
										<li>
											<b><a href='../FISIOFIND/frontend/app/account/delete'>delete</a></b> - Eliminación de cuenta
											<ul style="list-style-type: none; padding-left: 20px;">
												<li>
													<b><a href='../FISIOFIND/frontend/app/account/delete/confirm'>confirm</a></b> - Confirmación
													<ul style="list-style-type: none; padding-left: 20px;">
														<li><b><a href='../FISIOFIND/frontend/app/account/delete/confirm/[token]'>[token]</a></b> - Token de confirmación</li>
													</ul>
												</li>
											</ul>
										</li>
									</ul>
								</li>
								<li><b><a href='../FISIOFIND/frontend/app/advanced-search'>advanced-search</a></b> - Ruta para búsqueda avanzada</li>
								<li>
									<b><a href='../FISIOFIND/frontend/app/appointments'>appointments</a></b> - Gestión de citas
									<ul style="list-style-type: none; padding-left: 20px;">
										<li>
											<b><a href='../FISIOFIND/frontend/app/appointments/create'>create</a></b> - Crear citas
											<ul style="list-style-type: none; padding-left: 20px;">
												<li><b><a href='../FISIOFIND/frontend/app/appointments/create/[id]'>[id]</a></b> - Crear cita por ID</li>
											</ul>
										</li>
									</ul>
								</li>
								<li>
									<b><a href='../FISIOFIND/frontend/app/confirm-alternative'>confirm-alternative</a></b> - Confirmación alternativa
									<ul style="list-style-type: none; padding-left: 20px;">
										<li><b><a href='../FISIOFIND/frontend/app/confirm-alternative/[token]'>[token]</a></b> - Token de alternativa</li>
									</ul>
								</li>
								<li>
									<b><a href='../FISIOFIND/frontend/app/confirm-appointment'>confirm-appointment</a></b> - Confirmación de citas
									<ul style="list-style-type: none; padding-left: 20px;">
										<li><b><a href='../FISIOFIND/frontend/app/confirm-appointment/[token]'>[token]</a></b> - Token de cita</li>
									</ul>
								</li>
								<li><b><a href='../FISIOFIND/frontend/app/login'>login</a></b> - Ruta para inicio de sesión</li>
								<li><b><a href='../FISIOFIND/frontend/app/logout'>logout</a></b> - Ruta para cerrar sesión</li>
								<li><b><a href='../FISIOFIND/frontend/app/modelo'>modelo</a></b> - Ruta para modelo</li>
								<li><b><a href='../FISIOFIND/frontend/app/my-appointments'>my-appointments</a></b> - Ruta para mis citas</li>
								<li>
									<details>
										<summary><b>patient-management</b></summary>
										<ul style="list-style-type: none; padding-left: 20px;">
											<li>
												<b><a href='../FISIOFIND/frontend/app/patient-management/follow-up'>follow-up</a></b> - Seguimiento de pacientes
												<ul style="list-style-type: none; padding-left: 20px;">
													<li>
														<b><a href='../FISIOFIND/frontend/app/patient-management/follow-up/[id]'>[id]</a></b> - Seguimiento por ID
														<ul style="list-style-type: none; padding-left: 20px;">
															<li>
																<b><a href='../FISIOFIND/frontend/app/patient-management/follow-up/[id]/sessions'>sessions</a></b> - Sesiones
																<ul style="list-style-type: none; padding-left: 20px;">
																	<li><b><a href='../FISIOFIND/frontend/app/patient-management/follow-up/[id]/sessions/[sessionId]'>[sessionId]</a></b> - Sesión por ID</li>
																</ul>
															</li>
															<li><b><a href='../FISIOFIND/frontend/app/patient-management/follow-up/[id]/videos'>videos</a></b> - Vídeos de seguimiento</li>
														</ul>
													</li>
												</ul>
											</li>
											<li><b><a href='../FISIOFIND/frontend/app/patient-management/profile'>profile</a></b> - Perfil del paciente</li>
										</ul>
									</details>
								</li>
								<li><b><a href='../FISIOFIND/frontend/app/permissions-error'>permissions-error</a></b> - Ruta para errores de permisos</li>
								<li>
									<details>
										<summary><b>physio-management</b></summary>
										<ul style="list-style-type: none; padding-left: 20px;">
											<li>
												<b><a href='../FISIOFIND/frontend/app/physio-management/[id]'>[id]</a></b> - Gestión por ID
												<ul style="list-style-type: none; padding-left: 20px;">
													<li><b><a href='../FISIOFIND/frontend/app/physio-management/[id]/exercises'>exercises</a></b> - Ejercicios por ID</li>
												</ul>
											</li>
											<li><b><a href='../FISIOFIND/frontend/app/physio-management/balance'>balance</a></b> - Balance de fisioterapeutas</li>
											<li>
												<b><a href='../FISIOFIND/frontend/app/physio-management/follow-up'>follow-up</a></b> - Seguimiento
												<ul style="list-style-type: none; padding-left: 20px;">
													<li>
														<b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/[id]'>[id]</a></b> - Seguimiento por ID
														<ul style="list-style-type: none; padding-left: 20px;">
															<li>
																<b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/[id]/sessions'>sessions</a></b> - Sesiones
																<ul style="list-style-type: none; padding-left: 20px;">
																	<li><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/[id]/sessions/[sessionId]'>[sessionId]</a></b> - Sesión por ID</li>
																</ul>
															</li>
															<li><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/[id]/videos'>videos</a></b> - Vídeos</li>
														</ul>
													</li>
													<li><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/components'>components</a></b> - Componentes de seguimiento</li>
												</ul>
											</li>
											<li><b><a href='../FISIOFIND/frontend/app/physio-management/profile'>profile</a></b> - Perfil del fisioterapeuta</li>
											<li><b><a href='../FISIOFIND/frontend/app/physio-management/video'>video</a></b> - Vídeos de fisioterapeutas</li>
										</ul>
									</details>
								</li>
								<li><b><a href='../FISIOFIND/frontend/app/questionnaires'>questionnaires</a></b> - Ruta para cuestionarios</li>
								<li>
									<details>
										<summary><b>register</b></summary>
										<ul style="list-style-type: none; padding-left: 20px;">
											<li><b><a href='../FISIOFIND/frontend/app/register/patient'>patient</a></b> - Registro de pacientes</li>
											<li><b><a href='../FISIOFIND/frontend/app/register/physio'>physio</a></b> - Registro de fisioterapeutas</li>
											<li>
												<b><a href='../FISIOFIND/frontend/app/register/verified'>verified</a></b> - Verificación
												<ul style="list-style-type: none; padding-left: 20px;">
													<li><b><a href='../FISIOFIND/frontend/app/register/verified/[token]'>[token]</a></b> - Token de verificación</li>
												</ul>
											</li>
										</ul>
									</details>
								</li>
								<li><b><a href='../FISIOFIND/frontend/app/terms'>terms</a></b> - Ruta para términos y condiciones</li>
								<li><b><a href='../FISIOFIND/frontend/app/unsubscribe'>unsubscribe</a></b> - Ruta para darse de baja</li>
								<li>
									<details>
										<summary><b>videocalls</b></summary>
										<ul style="list-style-type: none; padding-left: 20px;">
											<li><b><a href='../FISIOFIND/frontend/app/videocalls/[roomCode]'>[roomCode]</a></b> - Videollamada por código de sala</li>
											<li><b><a href='../FISIOFIND/frontend/app/videocalls/css'>css</a></b> - Estilos para videollamadas</li>
											<li><b><a href='../FISIOFIND/frontend/app/videocalls/end'>end</a></b> - Finalización de videollamadas</li>
											<li><b><a href='../FISIOFIND/frontend/app/videocalls/hooks'>hooks</a></b> - Hooks para videollamadas</li>
											<li>
												<b><a href='../FISIOFIND/frontend/app/videocalls/tools'>tools</a></b> - Herramientas
												<ul style="list-style-type: none; padding-left: 20px;">
													<li>
														<b><a href='../FISIOFIND/frontend/app/videocalls/tools/body-highlighter'>body-highlighter</a></b> - Resaltador de cuerpo
														<ul style="list-style-type: none; padding-left: 20px;">
															<li><b><a href='../FISIOFIND/frontend/app/videocalls/tools/body-highlighter/assests'>assests</a></b> - Recursos</li>
														</ul>
													</li>
													<li><b><a href='../FISIOFIND/frontend/app/videocalls/tools/components'>components</a></b> - Componentes</li>
												</ul>
											</li>
										</ul>
									</details>
								</li>
								<li><b><a href='../FISIOFIND/frontend/app/globals.css'>globals.css</a></b> - Estilos globales</li>
								<li><b><a href='../FISIOFIND/frontend/app/layout.tsx'>layout.tsx</a></b> - Diseño principal del frontend</li>
								<li><b><a href='../FISIOFIND/frontend/app/not-found.tsx'>not-found.tsx</a></b> - Página de no encontrado</li>
								<li><b><a href='../FISIOFIND/frontend/app/page.tsx'>page.tsx</a></b> - Página principal</li>
							</ul>
						</details>
					</li>
					<li>
						<details>
							<summary><b>components</b></summary>
							<ul style="list-style-type: none; padding-left: 20px;">
								<li><b><a href='../FISIOFIND/frontend/components/ui'>ui</a></b> - Componentes de interfaz de usuario</li>
							</ul>
						</details>
					</li>
					<li><b><a href='../FISIOFIND/frontend/context'>context</a></b> - Gestión de contexto</li>
					<li><b><a href='../FISIOFIND/frontend/lib'>lib</a></b> - Librerías y utilidades</li>
					<li>
						<details>
							<summary><b>public</b></summary>
							<ul style="list-style-type: none; padding-left: 20px;">
								<li><b><a href='../FISIOFIND/frontend/public/images'>images</a></b> - Imágenes públicas</li>
								<li>
									<b><a href='../FISIOFIND/frontend/public/pdfs'>pdfs</a></b> - Documentos PDF
									<ul style="list-style-type: none; padding-left: 20px;">
										<li><b><a href='../FISIOFIND/frontend/public/pdfs/06_terms'>06_terms</a></b> - Términos y condiciones</li>
									</ul>
								</li>
							</ul>
						</details>
					</li>
					<li><b><a href='../FISIOFIND/frontend/services'>services</a></b> - Servicios del frontend</li>
					<li>
						<details>
							<summary><b>static</b></summary>
							<ul style="list-style-type: none; padding-left: 20px;">
								<li>
									<b><a href='../FISIOFIND/frontend/static/images'>images</a></b> - Imágenes estáticas
									<ul style="list-style-type: none; padding-left: 20px;">
										<li><b><a href='../FISIOFIND/frontend/static/images/body-regions'>body-regions</a></b> - Regiones del cuerpo</li>
										<li><b><a href='../FISIOFIND/frontend/static/images/exercise-types'>exercise-types</a></b> - Tipos de ejercicios</li>
									</ul>
								</li>
							</ul>
						</details>
					</li>
					<li><b><a href='../FISIOFIND/frontend/utils'>utils</a></b> - Utilidades del frontend</li>
				</ul>
			</details>
		</li>
	</ul>
</details>

##  Local Deployment

###  Prerequisites

Before getting started with FISIOFIND, ensure your runtime environment meets the following requirements:

- **Programming Language:** Python
- **Package Manager:** Npm, Pip
- **Database:** Postrgres


###  Installation

Install FISIOFIND using one of the following methods:

1. Clone the FISIOFIND repository:
```sh
❯ git clone https://github.com/Proyecto-ISPP/FISIOFIND
```

1. Navigate to the project directory:
```sh
❯ cd FISIOFIND
```

1. Install the project dependencies:

**Using `pip`** &nbsp; [<img align="center" src="https://img.shields.io/badge/Pip-3776AB.svg?style={badge_style}&logo=pypi&logoColor=white" />](https://pypi.org/project/pip/)

First, create and activate a Python virtual environment in the backend directory:

```sh
❯ cd backend
❯ python -m venv venv
❯ source venv/bin/activate
```
Then we proceed to install the dependencies:

```sh
❯ pip install -r requirements.txt
```
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)


We now install the frontend framework dependencies in the `frontend` directory:

```sh
❯ cd ../fronend
❯ npm install
```

### Database Setup

To set up the database for FISIOFIND, follow these steps:

1. **Create the Database:**

	Ensure you have PostgreSQL installed and running. Then, create a new database named `fisiofind`:

	```sh
	❯ psql -U postgres
	postgres=# CREATE DATABASE fisiofind;
	postgres=# \q
	```

2. **Configure Environment Variables:**

	Copy the `.env.example` file to create a new `.env` file in the `backend` directory:

	```sh
	❯ cd backend
	❯ cp .env.example .env
	```

	Open the `.env` file and update the database configuration with your PostgreSQL credentials:

	```env
	DATABASE_NAME=fisiofind
	DATABASE_USER=your_postgres_user
	DATABASE_PASSWORD=your_postgres_password
	DATABASE_HOST=localhost
	DATABASE_PORT=5432
	```

	Replace `your_postgres_user` and `your_postgres_password` with your actual PostgreSQL username and password.

3. **Apply Migrations:**

	With the virtual environment activated, apply the database migrations to set up the initial schema:

	```sh
	❯ python manage.py makemigrations
	❯ python manage.py migrate
	```

4. **Create a Superuser:**

	Create a superuser account to access the Django admin panel:

	```sh
	❯ python manage.py createsuperuser
	```

	Follow the prompts to set up the superuser credentials.

Once these steps are completed, your database should be set up and ready for use with FISIOFIND.


###  Usage

The first time the project is locally deployed, we need to create a .env filed in the `backend` directory according to the `.env.example` file.

To run the backend server, follow these steps on the `backend` directory **and with the venv activated**:

```sh
❯ cd .\fisio_find
❯ python .\manage.py makemigrations
❯ python .\manage.py migrate
❯ python .\manage.py runserver
```
Additionaly, the first time the project is locally deployed, we need to create a superuser to access the admin panel:

```sh
❯ python.\manage.py createsuperuser
```

After the local backend server is running, we can run the frontend server **in a new terminal window**:

**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ cd ../../fronted
❯ npm run dev
```


---
##  Project Roadmap

### Sprint 1: Core Use Cases
- [X] **`Core-1`**: <strike>Team training and onboarding completed.</strike>
- [X] **`Core-2`**: <strike>Basic user management system implemented.</strike>
- [X] **`Core-3`**: <strike>Core use cases functionality implemented.</strike>
- [X] **`Core-4`**: <strike>Aesthetic and accessible landing page deployed.</strike>

### Sprint 2: Tools & Payment
- [X] **`Tools-1`**: <strike>Payment and monetization system developed.</strike>
- [X] **`Tools-2`**: <strike>Physiotherapist tools implemented.</strike>

### Sprint 3: Extras & Testing
- [X] **`Extra-1`**: <strike>Additional application features developed.</strike>
- [X] **`Extra-2`**: <strike>User support tools implemented.</strike>
- [X] **`Extra-3`**: <strike>Comprehensive application testing completed.</strike>



---

##  Contributing

For the **techniacal pilot users** or any other interested contributor:

**🐛 [Report Issues](https://github.com/Proyecto-ISPP/FISIOFIND/issues)**: Submit bugs found or log feature requests for the `FISIOFIND` project.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Proyecto-ISPP/FISIOFIND
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b feature/new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Feat: Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/Proyecto-ISPP/FISIOFIND/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Proyecto-ISPP/FISIOFIND">
   </a>
</p>
</details>


##  License

This project is protected under the [MIT License](https://choosealicense.com/licenses/mit/) License. For more details, refer to the [LICENSE](LICENSE) file.


##  Acknowledgments

We would like to express our gratitude to the three great teams that have made this project possible:

<table>
        <td align="center">
            <a href="https://github.com/albcarsic">
                <img src="https://avatars.githubusercontent.com/u/91947046?s=60&v=4" width="100px;" alt="Alberto Carmona"/>
                <br />
                <sub><b>Alberto Carmona</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/DanielAlors">
                <img src="https://avatars.githubusercontent.com/u/92856731?s=96&v=4" width="100px;" alt="Daniel Alors"/>
                <br />
                <sub><b>Daniel Alors</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/DaniFdezCab">
                <img src="https://avatars.githubusercontent.com/u/92794081?s=96&v=4" width="100px;" alt="Daniel Fernández"/>
                <br />
                <sub><b>Daniel Fernández</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/Danielruizlopezcc">
                <img src="https://avatars.githubusercontent.com/u/91948447?s=96&v=4" width="100px;" alt="Daniel Ruiz"/>
                <br />
                <sub><b>Daniel Ruiz</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/Letee2">
                <img src="https://avatars.githubusercontent.com/u/91889823?s=96&v=4" width="100px;" alt="Pablo Fernández"/>
                <br />
                <sub><b>Pablo Fernández</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/rafpulcif">
                <img src="https://avatars.githubusercontent.com/u/91948036?v=4" width="100px;" alt="Rafael Pulido"/>
                <br />
                <sub><b>Rafael Pulido</b></sub>
            </a>
        </td>
</table>

<table>
        <td align="center">
            <a href="https://github.com/antoniommff">
                <img src="https://avatars.githubusercontent.com/u/91947070?v=4" width="100px;" alt="Antonio Macías"/>
                <br />
                <sub><b>Antonio Macías</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/benjimrfl">
                <img src="https://avatars.githubusercontent.com/u/91946757?s=96&v=4" width="100px;" alt="Benjamín Maureira"/>
                <br />
                <sub><b>Benjamín Maureira</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/DelfinSR">
                <img src="https://avatars.githubusercontent.com/u/91948384?v=4" width="100px;" alt="Delfín Santana"/>
                <br />
                <sub><b>Delfín Santana</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/guaridpin">
                <img src="https://avatars.githubusercontent.com/u/114622587?s=96&v=4" width="100px;" alt="Guadalupe Ridruejo"/>
                <br />
                <sub><b>Guadalupe Ridruejo</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/Julenrp">
                <img src="https://avatars.githubusercontent.com/u/83759055?s=96&v=4" width="100px;" alt="Julen Redondo"/>
                <br />
                <sub><b>Julen Redondo</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/rgavira123">
                <img src="https://avatars.githubusercontent.com/u/91947011?v=4" width="100px;" alt="Ramón Gavira"/>
                <br />
                <sub><b>Ramón Gavira</b></sub>
            </a>
        </td>
</table>


<table>
        <td align="center">
            <a href="https://github.com/dantorbar">
                <img src="https://avatars.githubusercontent.com/u/92780308?s=96&v=4" width="100px;" alt="Daniel Tortorici"/>
                <br />
                <sub><b>Daniel Tortorici</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/danvelcam">
                <img src="https://avatars.githubusercontent.com/u/93273683?s=96&v=4" width="100px;" alt="Daniel Vela"/>
                <br />
                <sub><b>Daniel Vela</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/MiguelEncina">
                <img src="https://avatars.githubusercontent.com/u/92793834?v=4" width="100px;" alt="Miguel Encina"/>
                <br />
                <sub><b>Miguel Encina</b></sub>
            </a>
        </td>
		<td align="center">
            <a href="https://github.com/franciiscocg">
                <img src="https://avatars.githubusercontent.com/u/92797553?v=4" width="100px;" alt="Francisco Capote"/>
                <br />
                <sub><b>Francisco Capote</b></sub>
            </a>
        </td>
		<td align="center">
            <a href="https://github.com/pacomateos10">
                <img src="https://avatars.githubusercontent.com/u/92785830?v=4" width="100px;" alt="Francisco Mateos"/>
                <br />
                <sub><b>Francisco Mateos</b></sub>
            </a>
        </td>
</table>

---
