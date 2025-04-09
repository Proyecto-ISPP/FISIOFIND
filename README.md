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
    │   ├── Devising a Project
    │   ├── build-pdf-examples.sh
    │   ├── eisvogel.latex
    │   └── templates
    └── frontend
        ├── README.md
        ├── app
        ├── components
        ├── eslint.config.mjs
        ├── lib
        ├── next.config.ts
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.mjs
        ├── public
        ├── tailwind.config.ts
        └── tsconfig.json
```

### Project Index

<details open>
	<summary><b><code>FISIOFIND/</code></b></summary>
	<!-- __root__ Submodule -->
	<details>
		<summary><b>__root__</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ __root__</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/LICENSE'>LICENSE</a></b></td>
					<td style='padding: 8px;'>- The LICENSE file establishes the projects open-source licensing terms under the MIT License<br>- It grants users broad permissions to use, modify, and distribute the FISIOFIND software, disclaiming any warranties<br>- This ensures legal clarity regarding the softwares usage and distribution within the overall project structure.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/licenses.json'>licenses.json</a></b></td>
					<td style='padding: 8px;'>- The <code>licenses.json</code> file serves as a central repository for license information regarding the third-party dependencies used in the Fisiofind frontend application<br>- It catalogs the licenses, source repositories, and contact information for each dependency, ensuring compliance and facilitating proper attribution within the project.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/next.config.js'>next.config.js</a></b></td>
					<td style='padding: 8px;'>- Next.config.js<code> configures Next.js image optimization<br>- It specifies allowed external image domains, enabling the application to fetch images from </code>ui.aceternity.com<code> and </code>fisiofind-repo.fra1.digitaloceanspaces.com` for display<br>- This ensures correct image loading within the application, contributing to a seamless user experience<br>- The configuration is crucial for the applications visual presentation.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/NOTICE'>NOTICE</a></b></td>
					<td style='padding: 8px;'>- The <code>NOTICE</code> file serves as a comprehensive license registry for the FISIOFIND project<br>- It catalogs the licenses of all third-party dependencies used in the software, ensuring compliance and transparency regarding intellectual property rights<br>- This contributes to the overall projects maintainability and legal soundness.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/package-lock.json'>package-lock.json</a></b></td>
					<td style='padding: 8px;'>- The <code>package-lock.json</code> file in the <code>fisiofind</code> project manages the projects dependencies<br>- It ensures that the correct versions of libraries like FullCalendar (for scheduling), Chart.js (for charting), and Next.js (the React framework) are used consistently across all developers and environments, contributing to the projects build and runtime stability.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>- Package.json` configures the Fisiofind project, specifying project metadata, and defining build and start scripts using Next.js<br>- It lists dependencies including React, charting libraries (Chart.js, react-chartjs-2), and FullCalendar for scheduling, indicating a web application incorporating data visualization and calendar functionalities<br>- The file manages project dependencies for development and production.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/startup.sh'>startup.sh</a></b></td>
					<td style='padding: 8px;'>- Startup.sh initializes the fisio_find application<br>- It activates the virtual environment, optionally applies database migrations, and launches the Gunicorn WSGI server, making the application accessible via port 8000<br>- This script facilitates the deployment and execution of the fisio_find Django project.</td>
				</tr>
			</table>
		</blockquote>
	</details>
	<!-- backend Submodule -->
	<details>
		<summary><b>backend</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ backend</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/.env.example'>.env.example</a></b></td>
					<td style='padding: 8px;'>- The <code>.env.example</code> file configures the backend environment<br>- It sets crucial database credentials, enabling connection to a PostgreSQL instance<br>- Furthermore, it provides API keys for Stripe payment processing and email services, along with debug and security settings<br>- This file facilitates the applications interaction with external services and manages its operational mode.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/custom_storage.py'>custom_storage.py</a></b></td>
					<td style='padding: 8px;'>- DigitalOceanMediaStorage integrates DigitalOcean Spaces cloud storage into the Django application<br>- It provides a custom storage backend, enabling the application to seamlessly store and retrieve files from DigitalOcean Spaces<br>- The backend handles file uploads, retrieval, existence checks, and URL generation, abstracting away the underlying DigitalOcean Spaces API interactions<br>- Configuration details are managed via Django settings.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/deploy.py'>deploy.py</a></b></td>
					<td style='padding: 8px;'>- Deploy.py` configures the Django application for deployment<br>- It sets the environment variable pointing to the projects settings and retrieves the WSGI application, enabling the backend server to run<br>- This script is crucial for deploying the fisio_find application, acting as the entry point for the WSGI server to interact with the Django framework.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/requirements.txt'>requirements.txt</a></b></td>
					<td style='padding: 8px;'>- The <code>requirements.txt</code> file specifies all Python packages necessary for the backend application<br>- It includes libraries for web framework (Django, Channels), database interaction (psycopg2-binary), authentication (djangorestframework-simplejwt), caching (redis), and various other utilities supporting the projects functionality<br>- The listed packages ensure the backends proper operation and deployment.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/run-backend.ps1'>run-backend.ps1</a></b></td>
					<td style='padding: 8px;'>- The PowerShell script activates a virtual environment, then executes database migrations for a Django project located in the <code>fisio_find</code> directory<br>- Finally, it launches the Django development server, preparing the backend for use<br>- This ensures the applications database schema is up-to-date before starting the server.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/run-backend.sh'>run-backend.sh</a></b></td>
					<td style='padding: 8px;'>- The <code>run-backend.sh</code> script initializes and starts the backend server for the FisioFind application<br>- It performs database migrations to ensure the database schema is up-to-date before launching the Django development server, making the application accessible<br>- This script is crucial for the projects deployment and development workflow, providing a simple way to run the backend.</td>
				</tr>
			</table>
			<!-- fisio_find Submodule -->
			<details>
				<summary><b>fisio_find</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ backend.fisio_find</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/coverage.xml'>coverage.xml</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/manage.py'>manage.py</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
					<!-- appointment Submodule -->
					<details>
						<summary><b>appointment</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.appointment</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment/emailUtils.py'>emailUtils.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment/permissions.py'>permissions.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- appointment_rating Submodule -->
					<details>
						<summary><b>appointment_rating</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.appointment_rating</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment_rating/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment_rating/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment_rating/emailUtils.py'>emailUtils.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment_rating/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment_rating/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment_rating/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment_rating/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/appointment_rating/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- files Submodule -->
					<details>
						<summary><b>files</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.files</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/files/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/files/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/files/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/files/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/files/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/files/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/files/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- fisio_find Submodule -->
					<details>
						<summary><b>fisio_find</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.fisio_find</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/fisio_find/asgi.py'>asgi.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/fisio_find/exampledata.json'>exampledata.json</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/fisio_find/settings.py'>settings.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/fisio_find/settings_postman.py'>settings_postman.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/fisio_find/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/fisio_find/wsgi.py'>wsgi.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- gestion_survey Submodule -->
					<details>
						<summary><b>gestion_survey</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.gestion_survey</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/gestion_survey/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/gestion_survey/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/gestion_survey/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/gestion_survey/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/gestion_survey/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- guest_session Submodule -->
					<details>
						<summary><b>guest_session</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.guest_session</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/guest_session/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/guest_session/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/guest_session/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/guest_session/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/guest_session/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/guest_session/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- payment Submodule -->
					<details>
						<summary><b>payment</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.payment</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/payment/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/payment/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/payment/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/payment/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/payment/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/payment/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/payment/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
							<!-- utils Submodule -->
							<details>
								<summary><b>utils</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ backend.fisio_find.payment.utils</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/payment/utils/pdf_generator.py'>pdf_generator.py</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- management Submodule -->
							<details>
								<summary><b>management</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ backend.fisio_find.payment.management</b></code>
									<!-- commands Submodule -->
									<details>
										<summary><b>commands</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ backend.fisio_find.payment.management.commands</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/payment/management/commands/cancel_unpaid_appointments.py'>cancel_unpaid_appointments.py</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- questionnaire Submodule -->
					<details>
						<summary><b>questionnaire</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.questionnaire</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/questionnaire/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/questionnaire/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/questionnaire/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/questionnaire/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/questionnaire/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/questionnaire/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/questionnaire/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- ratings Submodule -->
					<details>
						<summary><b>ratings</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.ratings</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/ratings/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/ratings/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/ratings/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/ratings/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/ratings/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/ratings/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/ratings/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- terms Submodule -->
					<details>
						<summary><b>terms</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.terms</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/terms/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/terms/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/terms/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/terms/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/terms/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/terms/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/terms/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- treatments Submodule -->
					<details>
						<summary><b>treatments</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.treatments</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/treatments/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/treatments/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/treatments/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/treatments/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/treatments/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/treatments/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
							<!-- management Submodule -->
							<details>
								<summary><b>management</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ backend.fisio_find.treatments.management</b></code>
									<!-- commands Submodule -->
									<details>
										<summary><b>commands</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ backend.fisio_find.treatments.management.commands</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/treatments/management/commands/send_exercise_reminders_local.py'>send_exercise_reminders_local.py</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/treatments/management/commands/send_exercise_reminders_prod.py'>send_exercise_reminders_prod.py</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- users Submodule -->
					<details>
						<summary><b>users</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.users</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/emailUtils.py'>emailUtils.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/forms.py'>forms.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/permissions.py'>permissions.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/subscription_views.py'>subscription_views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/util.py'>util.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/validacionFisios.py'>validacionFisios.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/users/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- videocall Submodule -->
					<details>
						<summary><b>videocall</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ backend.fisio_find.videocall</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/admin.py'>admin.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/apps.py'>apps.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/consumers.py'>consumers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/models.py'>models.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/routes.py'>routes.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/routing.py'>routing.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/serializers.py'>serializers.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/tests.py'>tests.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/urls.py'>urls.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/backend/fisio_find/videocall/views.py'>views.py</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- frontend Submodule -->
	<details>
		<summary><b>frontend</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ frontend</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/ middleware.ts'> middleware.ts</a></b></td>
					<td style='padding: 8px;'>- Middleware enhances the Next.js applications security posture<br>- It intercepts all requests, adding crucial HTTP security headers like <code>X-Frame-Options</code>, <code>X-Content-Type-Options</code>, and <code>X-XSS-Protection</code> to protect against common web vulnerabilities<br>- Additionally, it attempts to remove the <code>Server</code> header to prevent revealing server information<br>- This ensures a more secure user experience.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components.json'>components.json</a></b></td>
					<td style='padding: 8px;'>- Components.json` configures the frontends UI framework, specifying styling preferences (New York style), enabling React Server Components (RSC) and TypeScript (TSX), and integrating Tailwind CSS with custom configurations<br>- It defines aliases for commonly used project directories (components, utilities, etc.) and selects Lucide as the icon library, streamlining development and improving code organization within the larger application.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/eslint.config.mjs'>eslint.config.mjs</a></b></td>
					<td style='padding: 8px;'>- The <code>eslint.config.mjs</code> file configures ESLint for the frontend, leveraging Next.jss core web vitals and TypeScript configurations<br>- It uses a compatibility layer to manage ESLint extensions, ensuring consistent linting rules across the project<br>- This standardized linting process enhances code quality and maintainability within the larger frontend application.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/netlify.toml'>netlify.toml</a></b></td>
					<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/next.config.ts'>next.config.ts</a></b></td>
					<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/package-lock.json'>package-lock.json</a></b></td>
					<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/postcss.config.mjs'>postcss.config.mjs</a></b></td>
					<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/tailwind.config.ts'>tailwind.config.ts</a></b></td>
					<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/tsconfig.json'>tsconfig.json</a></b></td>
					<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
				</tr>
			</table>
			<!-- app Submodule -->
			<details>
				<summary><b>app</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ frontend.app</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/globals.css'>globals.css</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/layout.tsx'>layout.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/not-found.tsx'>not-found.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/page.tsx'>page.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
					<!-- advanced-search Submodule -->
					<details>
						<summary><b>advanced-search</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.advanced-search</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/advanced-search/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- login Submodule -->
					<details>
						<summary><b>login</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.login</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/login/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- logout Submodule -->
					<details>
						<summary><b>logout</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.logout</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/logout/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- modelo Submodule -->
					<details>
						<summary><b>modelo</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.modelo</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/modelo/page.jsx'>page.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- my-appointments Submodule -->
					<details>
						<summary><b>my-appointments</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.my-appointments</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/my-appointments/my-appointments.css'>my-appointments.css</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/my-appointments/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- permissions-error Submodule -->
					<details>
						<summary><b>permissions-error</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.permissions-error</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/permissions-error/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- questionnaires Submodule -->
					<details>
						<summary><b>questionnaires</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.questionnaires</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/questionnaires/Cuestionarios.jsx'>Cuestionarios.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/questionnaires/MyGroupRenderer.jsx'>MyGroupRenderer.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/questionnaires/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- register Submodule -->
					<details>
						<summary><b>register</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.register</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/register/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
							<!-- patient Submodule -->
							<details>
								<summary><b>patient</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.register.patient</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/register/patient/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- physio Submodule -->
							<details>
								<summary><b>physio</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.register.physio</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/register/physio/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- verified Submodule -->
							<details>
								<summary><b>verified</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.register.verified</b></code>
									<!-- [token] Submodule -->
									<details>
										<summary><b>[token]</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ frontend.app.register.verified.[token]</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/register/verified/[token]/page.tsx'>page.tsx</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- terms Submodule -->
					<details>
						<summary><b>terms</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.terms</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/terms/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- unsubscribe Submodule -->
					<details>
						<summary><b>unsubscribe</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.unsubscribe</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/unsubscribe/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- videocalls Submodule -->
					<details>
						<summary><b>videocalls</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.videocalls</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/ChatPanel.jsx'>ChatPanel.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/Controls.jsx'>Controls.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/page.tsx'>page.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/Room.jsx'>Room.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/Room.module.css'>Room.module.css</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/RoomHeader.jsx'>RoomHeader.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/RoomModal.jsx'>RoomModal.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/SettingsPanel.jsx'>SettingsPanel.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/ToolPanel.jsx'>ToolPanel.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/ToolsContainer.jsx'>ToolsContainer.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/VideoGrid.jsx'>VideoGrid.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
							<!-- css Submodule -->
							<details>
								<summary><b>css</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.videocalls.css</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/css/AnatomicalModel.css'>AnatomicalModel.css</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- end Submodule -->
							<details>
								<summary><b>end</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.videocalls.end</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/end/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- hooks Submodule -->
							<details>
								<summary><b>hooks</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.videocalls.hooks</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/hooks/3DModel.js'>3DModel.js</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/hooks/useChat.js'>useChat.js</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/hooks/useMediaControls.js'>useMediaControls.js</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/hooks/useRoomManagement.js'>useRoomManagement.js</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/hooks/useWebRTC.js'>useWebRTC.js</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/hooks/useWebSocket.js'>useWebSocket.js</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- tools Submodule -->
							<details>
								<summary><b>tools</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.videocalls.tools</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/3DModel.jsx'>3DModel.jsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/Historial.jsx'>Historial.jsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/MapaDolor.jsx'>MapaDolor.jsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/PatientQuestionnaire.jsx'>PatientQuestionnaire.jsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/QuestionnaireResponseViewer.jsx'>QuestionnaireResponseViewer.jsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/Questionnaires.jsx'>Questionnaires.jsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/QuestionnaireTool.jsx'>QuestionnaireTool.jsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/Templates.jsx'>Templates.jsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
									<!-- body-highlighter Submodule -->
									<details>
										<summary><b>body-highlighter</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ frontend.app.videocalls.tools.body-highlighter</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/body-highlighter/index.tsx'>index.tsx</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/body-highlighter/LICENSE'>LICENSE</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/body-highlighter/package-lock.json'>package-lock.json</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/body-highlighter/package.json'>package.json</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/body-highlighter/rn-cli.config.js'>rn-cli.config.js</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
											</table>
											<!-- components Submodule -->
											<details>
												<summary><b>components</b></summary>
												<blockquote>
													<div class='directory-path' style='padding: 8px 0; color: #666;'>
														<code><b>⦿ frontend.app.videocalls.tools.body-highlighter.components</b></code>
													<table style='width: 100%; border-collapse: collapse;'>
													<thead>
														<tr style='background-color: #f8f9fa;'>
															<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
															<th style='text-align: left; padding: 8px;'>Summary</th>
														</tr>
													</thead>
														<tr style='border-bottom: 1px solid #eee;'>
															<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/body-highlighter/components/SvgFemaleWrapper.tsx'>SvgFemaleWrapper.tsx</a></b></td>
															<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
														</tr>
														<tr style='border-bottom: 1px solid #eee;'>
															<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/tools/body-highlighter/components/SvgMaleWrapper.tsx'>SvgMaleWrapper.tsx</a></b></td>
															<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
														</tr>
													</table>
												</blockquote>
											</details>
										</blockquote>
									</details>
								</blockquote>
							</details>
							<!-- [roomCode] Submodule -->
							<details>
								<summary><b>[roomCode]</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.videocalls.[roomCode]</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/videocalls/[roomCode]/page.jsx'>page.jsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- account Submodule -->
					<details>
						<summary><b>account</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.account</b></code>
							<!-- delete Submodule -->
							<details>
								<summary><b>delete</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.account.delete</b></code>
									<!-- confirm Submodule -->
									<details>
										<summary><b>confirm</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ frontend.app.account.delete.confirm</b></code>
											<!-- [token] Submodule -->
											<details>
												<summary><b>[token]</b></summary>
												<blockquote>
													<div class='directory-path' style='padding: 8px 0; color: #666;'>
														<code><b>⦿ frontend.app.account.delete.confirm.[token]</b></code>
													<table style='width: 100%; border-collapse: collapse;'>
													<thead>
														<tr style='background-color: #f8f9fa;'>
															<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
															<th style='text-align: left; padding: 8px;'>Summary</th>
														</tr>
													</thead>
														<tr style='border-bottom: 1px solid #eee;'>
															<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/account/delete/confirm/[token]/page.tsx'>page.tsx</a></b></td>
															<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
														</tr>
													</table>
												</blockquote>
											</details>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- appointments Submodule -->
					<details>
						<summary><b>appointments</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.appointments</b></code>
							<!-- create Submodule -->
							<details>
								<summary><b>create</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.appointments.create</b></code>
									<!-- [id] Submodule -->
									<details>
										<summary><b>[id]</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ frontend.app.appointments.create.[id]</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/appointments/create/[id]/page.tsx'>page.tsx</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- confirm-alternative Submodule -->
					<details>
						<summary><b>confirm-alternative</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.confirm-alternative</b></code>
							<!-- [token] Submodule -->
							<details>
								<summary><b>[token]</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.confirm-alternative.[token]</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/confirm-alternative/[token]/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- confirm-appointment Submodule -->
					<details>
						<summary><b>confirm-appointment</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.confirm-appointment</b></code>
							<!-- [token] Submodule -->
							<details>
								<summary><b>[token]</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.confirm-appointment.[token]</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/confirm-appointment/[token]/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- patient-management Submodule -->
					<details>
						<summary><b>patient-management</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.patient-management</b></code>
							<!-- follow-up Submodule -->
							<details>
								<summary><b>follow-up</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.patient-management.follow-up</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/patient-management/follow-up/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
									<!-- [id] Submodule -->
									<details>
										<summary><b>[id]</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ frontend.app.patient-management.follow-up.[id]</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/patient-management/follow-up/[id]/page.tsx'>page.tsx</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
											</table>
											<!-- sessions Submodule -->
											<details>
												<summary><b>sessions</b></summary>
												<blockquote>
													<div class='directory-path' style='padding: 8px 0; color: #666;'>
														<code><b>⦿ frontend.app.patient-management.follow-up.[id].sessions</b></code>
													<table style='width: 100%; border-collapse: collapse;'>
													<thead>
														<tr style='background-color: #f8f9fa;'>
															<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
															<th style='text-align: left; padding: 8px;'>Summary</th>
														</tr>
													</thead>
														<tr style='border-bottom: 1px solid #eee;'>
															<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/patient-management/follow-up/[id]/sessions/page.tsx'>page.tsx</a></b></td>
															<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
														</tr>
													</table>
													<!-- [sessionId] Submodule -->
													<details>
														<summary><b>[sessionId]</b></summary>
														<blockquote>
															<div class='directory-path' style='padding: 8px 0; color: #666;'>
																<code><b>⦿ frontend.app.patient-management.follow-up.[id].sessions.[sessionId]</b></code>
															<table style='width: 100%; border-collapse: collapse;'>
															<thead>
																<tr style='background-color: #f8f9fa;'>
																	<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																	<th style='text-align: left; padding: 8px;'>Summary</th>
																</tr>
															</thead>
																<tr style='border-bottom: 1px solid #eee;'>
																	<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/patient-management/follow-up/[id]/sessions/[sessionId]/page.tsx'>page.tsx</a></b></td>
																	<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
																</tr>
															</table>
														</blockquote>
													</details>
												</blockquote>
											</details>
											<!-- videos Submodule -->
											<details>
												<summary><b>videos</b></summary>
												<blockquote>
													<div class='directory-path' style='padding: 8px 0; color: #666;'>
														<code><b>⦿ frontend.app.patient-management.follow-up.[id].videos</b></code>
													<table style='width: 100%; border-collapse: collapse;'>
													<thead>
														<tr style='background-color: #f8f9fa;'>
															<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
															<th style='text-align: left; padding: 8px;'>Summary</th>
														</tr>
													</thead>
														<tr style='border-bottom: 1px solid #eee;'>
															<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/patient-management/follow-up/[id]/videos/page.tsx'>page.tsx</a></b></td>
															<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
														</tr>
													</table>
												</blockquote>
											</details>
										</blockquote>
									</details>
								</blockquote>
							</details>
							<!-- profile Submodule -->
							<details>
								<summary><b>profile</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.patient-management.profile</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/patient-management/profile/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- physio-management Submodule -->
					<details>
						<summary><b>physio-management</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.app.physio-management</b></code>
							<!-- balance Submodule -->
							<details>
								<summary><b>balance</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.physio-management.balance</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/balance/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- follow-up Submodule -->
							<details>
								<summary><b>follow-up</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.physio-management.follow-up</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
									<!-- components Submodule -->
									<details>
										<summary><b>components</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ frontend.app.physio-management.follow-up.components</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/components/FilterBar.tsx'>FilterBar.tsx</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/components/TreatmentCard.tsx'>TreatmentCard.tsx</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
											</table>
										</blockquote>
									</details>
									<!-- [id] Submodule -->
									<details>
										<summary><b>[id]</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ frontend.app.physio-management.follow-up.[id]</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/[id]/page.tsx'>page.tsx</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
											</table>
											<!-- sessions Submodule -->
											<details>
												<summary><b>sessions</b></summary>
												<blockquote>
													<div class='directory-path' style='padding: 8px 0; color: #666;'>
														<code><b>⦿ frontend.app.physio-management.follow-up.[id].sessions</b></code>
													<table style='width: 100%; border-collapse: collapse;'>
													<thead>
														<tr style='background-color: #f8f9fa;'>
															<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
															<th style='text-align: left; padding: 8px;'>Summary</th>
														</tr>
													</thead>
														<tr style='border-bottom: 1px solid #eee;'>
															<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/[id]/sessions/page.tsx'>page.tsx</a></b></td>
															<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
														</tr>
													</table>
													<!-- [sessionId] Submodule -->
													<details>
														<summary><b>[sessionId]</b></summary>
														<blockquote>
															<div class='directory-path' style='padding: 8px 0; color: #666;'>
																<code><b>⦿ frontend.app.physio-management.follow-up.[id].sessions.[sessionId]</b></code>
															<!-- exercises Submodule -->
															<details>
																<summary><b>exercises</b></summary>
																<blockquote>
																	<div class='directory-path' style='padding: 8px 0; color: #666;'>
																		<code><b>⦿ frontend.app.physio-management.follow-up.[id].sessions.[sessionId].exercises</b></code>
																	<table style='width: 100%; border-collapse: collapse;'>
																	<thead>
																		<tr style='background-color: #f8f9fa;'>
																			<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
																			<th style='text-align: left; padding: 8px;'>Summary</th>
																		</tr>
																	</thead>
																		<tr style='border-bottom: 1px solid #eee;'>
																			<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/[id]/sessions/[sessionId]/exercises/page.tsx'>page.tsx</a></b></td>
																			<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
																		</tr>
																	</table>
																</blockquote>
															</details>
														</blockquote>
													</details>
												</blockquote>
											</details>
											<!-- videos Submodule -->
											<details>
												<summary><b>videos</b></summary>
												<blockquote>
													<div class='directory-path' style='padding: 8px 0; color: #666;'>
														<code><b>⦿ frontend.app.physio-management.follow-up.[id].videos</b></code>
													<table style='width: 100%; border-collapse: collapse;'>
													<thead>
														<tr style='background-color: #f8f9fa;'>
															<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
															<th style='text-align: left; padding: 8px;'>Summary</th>
														</tr>
													</thead>
														<tr style='border-bottom: 1px solid #eee;'>
															<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/follow-up/[id]/videos/page.tsx'>page.tsx</a></b></td>
															<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
														</tr>
													</table>
												</blockquote>
											</details>
										</blockquote>
									</details>
								</blockquote>
							</details>
							<!-- profile Submodule -->
							<details>
								<summary><b>profile</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.physio-management.profile</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/profile/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- video Submodule -->
							<details>
								<summary><b>video</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.physio-management.video</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/video/page.tsx'>page.tsx</a></b></td>
											<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- [id] Submodule -->
							<details>
								<summary><b>[id]</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ frontend.app.physio-management.[id]</b></code>
									<!-- exercises Submodule -->
									<details>
										<summary><b>exercises</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ frontend.app.physio-management.[id].exercises</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/app/physio-management/[id]/exercises/page.tsx'>page.tsx</a></b></td>
													<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
												</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<!-- components Submodule -->
			<details>
				<summary><b>components</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ frontend.components</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/3d-card-demo.tsx'>3d-card-demo.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/CheckoutForm.tsx'>CheckoutForm.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ClientWrapper.tsx'>ClientWrapper.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/CookieConsent.tsx'>CookieConsent.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/demo-window.tsx'>demo-window.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/IdentityVerificationStep.tsx'>IdentityVerificationStep.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ratings.module.css'>ratings.module.css</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ratings.tsx'>ratings.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/RestrictedAccess.tsx'>RestrictedAccess.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/service-create-modal.tsx'>service-create-modal.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/service-edit-modal.tsx'>service-edit-modal.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/sidebar-demo.tsx'>sidebar-demo.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/user-update-password-modal.tsx'>user-update-password-modal.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
					<!-- ui Submodule -->
					<details>
						<summary><b>ui</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ frontend.components.ui</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/3d-card.tsx'>3d-card.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/Alert.tsx'>Alert.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/alternative-selector.tsx'>alternative-selector.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/AnimatedIcons.tsx'>AnimatedIcons.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/appointment-modal.tsx'>appointment-modal.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/AppointmentCalendar.tsx'>AppointmentCalendar.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/AppointmentComment.tsx'>AppointmentComment.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/bento-grid.tsx'>bento-grid.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/calendar.tsx'>calendar.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/cards.tsx'>cards.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/checkoutButton.jsx'>checkoutButton.jsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/ConfirmModal.tsx'>ConfirmModal.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/dinamic-form-modal.tsx'>dinamic-form-modal.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/draftAppointmentModal.tsx'>draftAppointmentModal.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/EditableStarRatingDisplay.tsx'>EditableStarRatingDisplay.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/focus-cards.tsx'>focus-cards.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/gradient-button.tsx'>gradient-button.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/hero-highlight.tsx'>hero-highlight.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/LoadingStar.css'>LoadingStar.css</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/Modal.tsx'>Modal.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/PaymentSelector.tsx'>PaymentSelector.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/physio-cta-adv.tsx'>physio-cta-adv.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/physio-cta.tsx'>physio-cta.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/PhysioterapistRating.tsx'>PhysioterapistRating.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/PhysiotherapistModal.tsx'>PhysiotherapistModal.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/RatingForm.tsx'>RatingForm.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/restore-filters.tsx'>restore-filters.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/ScheduleCalendar.tsx'>ScheduleCalendar.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/search-button.tsx'>search-button.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/ServiceQuestionary.tsx'>ServiceQuestionary.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/sidebar.tsx'>sidebar.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/StarRating.tsx'>StarRating.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/StarRatingDisplay.tsx'>StarRatingDisplay.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/SubscriptionSlider.tsx'>SubscriptionSlider.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/Wizard.tsx'>Wizard.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/WizardContent.tsx'>WizardContent.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/WizardHeader.tsx'>WizardHeader.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/components/ui/WizardNavigation.tsx'>WizardNavigation.tsx</a></b></td>
									<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
								</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<!-- context Submodule -->
			<details>
				<summary><b>context</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ frontend.context</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/context/appointmentContext.tsx'>appointmentContext.tsx</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- lib Submodule -->
			<details>
				<summary><b>lib</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ frontend.lib</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/lib/definitions.ts'>definitions.ts</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/lib/utils.ts'>utils.ts</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- public Submodule -->
			<details>
				<summary><b>public</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ frontend.public</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/public/photo.css'>photo.css</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- services Submodule -->
			<details>
				<summary><b>services</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ frontend.services</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/services/check-role.ts'>check-role.ts</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- utils Submodule -->
			<details>
				<summary><b>utils</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ frontend.utils</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/frontend/utils/api.ts'>api.ts</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- .github Submodule -->
	<details>
		<summary><b>.github</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ .github</b></code>
			<!-- ISSUE_TEMPLATE Submodule -->
			<details>
				<summary><b>ISSUE_TEMPLATE</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ .github.ISSUE_TEMPLATE</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/.github/ISSUE_TEMPLATE/config.yml'>config.yml</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- workflows Submodule -->
			<details>
				<summary><b>workflows</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ .github.workflows</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/.github/workflows/automatic_pr.yml'>automatic_pr.yml</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/.github/workflows/changelog.yml'>changelog.yml</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/.github/workflows/codeql.yml'>codeql.yml</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/.github/workflows/process_payments.yml'>process_payments.yml</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/.github/workflows/s3-back.yml'>s3-back.yml</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/.github/workflows/s3-front.yml'>s3-front.yml</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='../FISIOFIND/.github/workflows/sonarqube.yml'>sonarqube.yml</a></b></td>
							<td style='padding: 8px;'>Code>❯ REPLACE-ME</code></td>
						</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---


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
