<p align="center">
  <img src="docs/.img/Logo_FisioFind_Verde_sin_fondo.PNG" alt="Logo FisioFind" width="300" />
</p>
<p align="center"><h1 align="center">FISIOFIND</h1></p>
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
- [Acknowledgments](#acknowledgments)

---

##  Overview

FISIOFIND is a specialized online consultation platform designed to connect physiotherapists with patients. The platform streamlines the process of finding and booking physiotherapy services, while providing professionals with tools to manage their practice efficiently.

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


###  Project Index
<details open>
	<summary><b><code>FISIOFIND/</code></b></summary>
	<details> <!-- frontend Submodule -->
		<summary><b>frontend</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/postcss.config.mjs'>postcss.config.mjs</a></b></td>
				<td><code>❯ PostCSS configuration for processing CSS with plugins</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/tailwind.config.ts'>tailwind.config.ts</a></b></td>
				<td><code>❯ Tailwind CSS configuration for custom styling</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/package-lock.json'>package-lock.json</a></b></td>
				<td><code>❯ Exact dependency tree for frontend packages</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/package.json'>package.json</a></b></td>
				<td><code>❯ Frontend project configuration and dependencies</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/tsconfig.json'>tsconfig.json</a></b></td>
				<td><code>❯ TypeScript compiler configuration</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/eslint.config.mjs'>eslint.config.mjs</a></b></td>
				<td><code>❯ ESLint configuration for code linting</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/next.config.ts'>next.config.ts</a></b></td>
				<td><code>❯ Next.js framework configuration</code></td>
			</tr>
			</table>
			<details>
				<summary><b>app</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/app/layout.tsx'>layout.tsx</a></b></td>
						<td><code>❯ Root layout component for the application</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/app/page.tsx'>page.tsx</a></b></td>
						<td><code>❯ Main landing page component</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/app/globals.css'>globals.css</a></b></td>
						<td><code>❯ Global CSS styles for the application</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>components</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><code>❯ Reusable UI components for the application</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
			<details>
				<summary><b>lib</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/frontend/lib/utils.ts'>utils.ts</a></b></td>
						<td><code>❯ Utility functions and helper methods</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<details> <!-- backend Submodule -->
		<summary><b>backend</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/requirements.txt'>requirements.txt</a></b></td>
				<td><code>❯ Python dependencies for the backend</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/run-backend.ps1'>run-backend.ps1</a></b></td>
				<td><code>❯ PowerShell script to start the backend server</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/.env.example'>.env.example</a></b></td>
				<td><code>❯ Example environment variables configuration</code></td>
			</tr>
			</table>
			<details>
				<summary><b>fisio_find</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/manage.py'>manage.py</a></b></td>
						<td><code>❯ Django project management script</code></td>
					</tr>
					</table>
					<details>
						<summary><b>fisio_find</b></summary>
						<blockquote>
							<td><b><a>❯ Core Django project configuration</a></b></td>
							<table>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/fisio_find/asgi.py'>asgi.py</a></b></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/fisio_find/settings.py'>settings.py</a></b></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/fisio_find/urls.py'>urls.py</a></b></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/fisio_find/wsgi.py'>wsgi.py</a></b></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>gestion_usuarios</b></summary>
						<blockquote>
						<td><b><a>❯ User management Django app</a></b></td>
							<table>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/gestion_usuarios/models.py'>models.py</a></b></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/gestion_usuarios/serializers.py'>serializers.py</a></b></td>
								<td><code>❯ User data serialization for API</code></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/gestion_usuarios/apps.py'>apps.py</a></b></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/gestion_usuarios/admin.py'>admin.py</a></b></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/gestion_usuarios/tests.py'>tests.py</a></b></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/gestion_usuarios/urls.py'>urls.py</a></b></td>
							</tr>
							<tr>
								<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/gestion_usuarios/views.py'>views.py</a></b></td>
							</tr>
							</table>
							<details>
								<summary><b>migrations</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/Proyecto-ISPP/FISIOFIND/blob/master/backend/fisio_find/gestion_usuarios/migrations/0001_initial.py'>0001_initial.py</a></b></td>
										<td><code>❯ ...</code></td>
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
	<details> <!-- .github Submodule -->
		<summary><b>.github</b></summary>
		<blockquote>
			<details>
				<summary><b>workflows</b></summary>
				<blockquote>
					❯ GitHub Actions CI/CD workflow configurations</code></td>
				</blockquote>
			</details>
			<details>
				<summary><b>ISSUE_TEMPLATE</b></summary>
				<blockquote>
					<td><code>❯ Templates for GitHub issue creation</code></td>
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
- [ ] **`Core-2`**: <strike>Basic user management system implemented.</strike>
- [ ] **`Core-3`**: <strike>Core use cases functionality implemented.</strike>
- [ ] **`Core-4`**: <strike>Aesthetic and accessible landing page deployed.</strike>

### Sprint 2: Tools & Payment
- [ ] **`Tools-1`**: Payment and monetization system developed.
- [ ] **`Tools-2`**: Physiotherapist tools implemented.

### Sprint 3: Extras & Testing
- [ ] **`Extra-1`**: Additional application features developed.
- [ ] **`Extra-2`**: User support tools implemented.
- [ ] **`Extra-3`**: Comprehensive application testing completed.
- [ ] **`Task 1`**: Implement feature one.
- [ ] **`Task 2`**: Implement feature two.
- [ ] **`Task 3`**: Implement feature three.


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


##  Acknowledgments

We would like to express our gratitude to the three great teams that have made this project possible:

<table>
        <td align="center">
            <a href="https://github.com/albertocs7">
                <img src="https://avatars.githubusercontent.com/u/91947046?s=96&v=4" width="100px;" alt="Alberto Carmona"/>
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
            <a href="https://github.com/danruiiz">
                <img src="https://avatars.githubusercontent.com/u/91948447?s=96&v=4" width="100px;" alt="Daniel Ruiz"/>
                <br />
                <sub><b>Daniel Ruiz</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/pabferper">
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
            <a href="https://github.com/benjamaurera">
                <img src="https://avatars.githubusercontent.com/u/91946757?s=96&v=4" width="100px;" alt="Benjamín Maureira"/>
                <br />
                <sub><b>Benjamín Maureira</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/delsanrub">
                <img src="https://avatars.githubusercontent.com/u/91948384?s=96&v=4" width="100px;" alt="Delfín Santana"/>
                <br />
                <sub><b>Delfín Santana</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/guadalupe">
                <img src="https://avatars.githubusercontent.com/u/114622587?s=96&v=4" width="100px;" alt="Guadalupe Ridruejo"/>
                <br />
                <sub><b>Guadalupe Ridruejo</b></sub>
            </a>
        </td>
        <td align="center">
            <a href="https://github.com/julenredondo">
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
            <a href="https://github.com/miguelencinaj">
                <img src="https://avatars.githubusercontent.com/u/92793834?s=96&v=4" width="100px;" alt="Miguel Encina"/>
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
