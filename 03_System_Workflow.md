# System Workflow
## GlowUp – Beauty & Skincare Website

---

## 1. Overall Application Flow

```mermaid
flowchart TD
    A[Visitor opens website] --> B[Home Page]
    B --> C{Choose action}
    C --> D[Browse Products]
    C --> E[Skin Analysis Quiz]
    C --> F[Routine / Tips]
    C --> G[Login / Register]
    D --> H[Add to Cart]
    H --> I{Logged in?}
    I -- No --> G
    I -- Yes --> J[Cart Updated]
    J --> K[View Cart / Remove Items]
    G --> L{Role}
    L -- User --> B
    L -- Admin --> M[Admin Dashboard]
```

---

## 2. User Registration Workflow

```mermaid
sequenceDiagram
    actor U as User
    participant R as React App
    participant API as Express API
    participant DB as PostgreSQL

    U->>R: Fill name, email, password
    R->>R: Client-side validation
    R->>API: POST /api/auth/register
    API->>API: Validate input
    API->>DB: Check if email exists
    alt Email exists
        API-->>R: 409 Email already registered
    else New email
        API->>API: Hash password (bcrypt)
        API->>DB: Insert user + empty cart
        API-->>R: 201 Created
        R-->>U: Redirect to Login
    end
```

**Steps**
1. User opens the Register page and enters details.
2. React checks required fields, email format and password length.
3. API validates again, checks for duplicate email.
4. Password is hashed and the user (role `USER`) and cart are created.
5. User is redirected to login with a success message.

---

## 3. Login and Logout Workflow

```mermaid
sequenceDiagram
    actor U as User
    participant R as React App
    participant API as Express API
    participant DB as PostgreSQL

    U->>R: Enter email and password
    R->>API: POST /api/auth/login
    API->>DB: Find user by email
    API->>API: bcrypt.compare(password, hash)
    alt Invalid
        API-->>R: 401 Invalid credentials
    else Valid
        API->>API: Sign JWT {id, role}
        API-->>R: 200 {token, user}
        R->>R: Save token in localStorage, update AuthContext
        R-->>U: Admin → /admin, User → /
    end
    U->>R: Click Logout
    R->>R: Remove token, clear AuthContext and cart state
    R-->>U: Redirect to Home
```

---

## 4. Forgot Password Workflow

```mermaid
sequenceDiagram
    actor U as User
    participant R as React App
    participant API as Express API
    participant DB as PostgreSQL

    U->>R: Enter email on Forgot Password page
    R->>API: POST /api/auth/forgot-password
    API->>DB: Find user
    API->>API: Create random token, set expiry (15 min)
    API->>DB: Store hashed token + expiry
    API-->>R: Generic message "If the email exists, a reset link was sent"
    Note over API: Dev mode: reset link printed in server console
    U->>R: Open /reset-password/:token, enter new password
    R->>API: POST /api/auth/reset-password
    API->>DB: Verify token + not expired
    API->>DB: Save new hashed password, clear token
    API-->>R: 200 Password updated
    R-->>U: Redirect to Login
```

---

## 5. Skin Analysis Workflow

```mermaid
flowchart TD
    A[Open Skin Analysis page] --> B[Answer questionnaire step by step]
    B --> C[Submit answers]
    C --> D[POST /api/skin/analyze]
    D --> E[Server scores answers]
    E --> F[Determine skin type]
    F --> G{User logged in?}
    G -- Yes --> H[Save or update SkinProfile]
    G -- No --> I[Skip saving]
    H --> J[Return type + suggestions + matching products]
    I --> J
    J --> K[Display result page]
    K --> L[View recommended products / Retake quiz]
```

**Result page shows:** skin type, short explanation, do's and don'ts, ingredient suggestions, and recommended products filtered by `skinType`.

---

## 6. Product Browsing and Search Workflow

1. User opens `/products`.
2. React calls `GET /api/products` (and `GET /api/categories` for filter tabs).
3. User clicks a category tab → `GET /api/products?category=Serum`.
4. User types in search bar → debounced `GET /api/products?search=vitamin`.
5. API builds a Prisma query with `contains` (case-insensitive) on name and description.
6. Results render as product cards (image, name, description, price, Add to Cart).

---

## 7. Shopping Cart Workflow

```mermaid
sequenceDiagram
    actor U as User
    participant R as React App
    participant API as Express API
    participant DB as PostgreSQL

    U->>R: Click "Add to Cart"
    alt Not logged in
        R-->>U: Redirect to Login
    else Logged in
        R->>API: POST /api/cart/items {productId, quantity}
        API->>API: verifyToken
        API->>DB: Find user's cart
        API->>DB: Upsert CartItem (increase quantity if exists)
        API-->>R: Updated cart
        R-->>U: Navbar badge updates + toast
    end
    U->>R: Open Cart page
    R->>API: GET /api/cart
    API-->>R: Items + total
    U->>R: Click Remove
    R->>API: DELETE /api/cart/items/:id
    API->>DB: Delete CartItem
    API-->>R: Updated cart
    R-->>U: Updated list and total
```

---

## 8. Admin Workflows

### 8.1 Admin Access
```mermaid
flowchart LR
    A[Admin logs in] --> B[JWT contains role ADMIN]
    B --> C[Frontend AdminRoute allows /admin]
    C --> D[API requests include token]
    D --> E[verifyToken then isAdmin middleware]
    E --> F[Controller runs]
```

### 8.2 Product Management
| Action | Flow |
|---|---|
| Add | Admin fills form → `POST /api/products` → validated → saved → table refreshes |
| Edit | Click Edit → form pre-filled → `PUT /api/products/:id` → table refreshes |
| Delete | Click Delete → confirm modal → `DELETE /api/products/:id` → row removed |

### 8.3 Beauty Tip Management
Same pattern as products using `/api/tips`.

### 8.4 View Users
Admin opens Users page → `GET /api/users` → table of name, email, role, joined date (passwords never returned).

---

## 9. Daily Routine and Tips Workflow
- Routine page is mostly static content with Morning and Night tabs; optional personalisation: if the user has a saved skin type, the page highlights suitable products.
- Tips page calls `GET /api/tips`, supports category filter (Makeup, Haircare, Natural Skincare, Articles) and opens a detail page via `GET /api/tips/:id`.

---

## 10. Error Handling Workflow

```mermaid
flowchart TD
    A[Request] --> B{Valid input?}
    B -- No --> C[400 + message]
    B -- Yes --> D{Authenticated if required?}
    D -- No --> E[401]
    D -- Yes --> F{Authorised role?}
    F -- No --> G[403]
    F -- Yes --> H{Resource found?}
    H -- No --> I[404]
    H -- Yes --> J[Process]
    J -- Exception --> K[500 via errorHandler]
    J -- OK --> L[200 / 201]
```

Frontend: Axios interceptor catches `401` → clears token → redirects to login; other errors show an alert message.

---

## 11. Data Flow Summary (Level 0 DFD)

```mermaid
flowchart LR
    U[User] -->|credentials, quiz answers, cart actions| S((GlowUp System))
    A[Admin] -->|product/tip data, user view| S
    S -->|pages, results, products, cart| U
    S -->|dashboard, reports| A
    S <--> D[(PostgreSQL)]
```
