# Health Check

| METHOD | Endpoint | Description                                |
| ------ | -------- | ------------------------------------------ |
| GET    | /        | Checks if the backend is running correctly |

# Authentication

| METHOD | Endpoint           | Description                                            |
| ------ | ------------------ | ------------------------------------------------------ |
| POST   | /api/auth/register | Register a new user                                    |
| POST   | /api/auth/login    | Log in a user                                          |
| POST   | /api/auth/logout   | Logs out the user (clears HTTPOnly cookie & JWT token) |

# User

| METHOD | Endpoint            | Description                                      |
| ------ | ------------------- | ------------------------------------------------ |
| POST   | /api/user           | Creates a new user                               |
| GET    | /api/user/`:idUser` | Retrieves user information                       |
| PUT    | /api/user/`:idUser` | Updates user details (password, username, email) |
| DELETE | /api/user/`:idUser` | Deletes a user account                           |

# Book

| METHOD | Endpoint                      | Description                          |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | /api/books                    | Retrieves a list of books            |
| GET    | /api/books?`filter1=value...` | Retrieves books based on filters     |
| GET    | /api/books/`:idBook`          | Retrieves details of a specific book |

# Library

| METHOD | Endpoint               | Description                                                         |
| ------ | ---------------------- | ------------------------------------------------------------------- |
| GET    | /api/library           | Retrieves books from the user's list (user ID extracted from token) |
| PUT    | /api/library/`:idBook` | Updates book status in the list (read/unread, etc.)                 |
| POST   | /api/library/`:idBook` | Adds a book to the user's list (in `list_book` table)               |
| DELETE | /api/library/`:idBook` | Removes a book from the library                                     |

---

# DOC

Book creation and modification are handled internally when a user adds a book to their list via `api/library/:idBook`.

| POST | /api/books | Creates a new book |

<!--



# Check-Health

| METHODE | Endpoint | Description |
| --- | --- | --- |
| GET | / | Permet d'envoyer une requête pour checker si le backend est bien en cours d'exécution |

# Authentification

| METHODE | Endpoint | Description |
| --- | --- | --- |
| POST | /api/auth/register | Inscription d'un utilisateur |
| POST | /api/auth/login | Connexion d'un utilisateur |
| POST | /api/auth/logout | Permet de supprimer le cookie HTTPOnly & le token JWT |

# User

| METHODE | Endpoint | Description |
| --- | --- | --- |
| POST | /api/user | Permet de créer un nouvel utilisateur |
| GET | /api/user/`:idUser` | Récupération des info utilisateur |
| PUT | /api/user/`:idUser` | Permet un update des valeurs de l'utilisateur (mdp, username, email) |
| DELETE | /api/user/`:idUser` | Permet la supression d'un compte utilisateur |

# Book

| METHODE | Endpoint | Description |
| --- | --- | --- |
| GET | /api/books | Permet de récupérer des livres |
| GET | /api/books?`filter1=value&filter2=value&...` | Permet de récupérer des livres selon un filtres |
| GET | /api/books/`:idBook` | Permet de récupérer les détails d'un livre |

# Library
| METHODE | Endpoint | Description |
| --- | --- | --- |
| GET | /api/library | Permet de récupérer les livres de la liste d'un user => id user récupérer via le token |
| PUT | /api/library/`:idBook` | Permet d'update le status (list_book), modifier info de la liste |
| POST | /api/library/`:idBook` | Permet d'ajouter un nouveau livre à la liste (dans la table `list_book) |
| DELETE | /api/library/`:idBook` | Permet de supprimer un livre de la library (list_book) |

---

# DOC

L'ajout, et la modif des livres est géré en interne lorsqu'un utilisateur viens ajouter un livre dans sa liste. `api/library/:idBook`




| POST | /api/books | Permet de créer un nouveau livre |

 -->
