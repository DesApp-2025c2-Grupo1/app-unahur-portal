# Notas para desarrollar

CREATE TABLE roles(
    id INT primary key auto_increment,
    role_name VARCHAR(255) NOT NULL,
    role_description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users(
    id INT primary key auto_increment,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles(
    id INT primary key auto_increment,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE affiliates(
    id INT primary key auto_increment,
    user_id INT NOT NULL,
    credencial_number VARCHAR(20) NOT NULL,
    document_number VARCHAR(10) NOT NULL,
    document_type VARCHAR(7) NOT NULL,   
    birth_date DATE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    affiliate_state_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE affiliate_states(
    id INT primary key auto_increment,
    affiliate_id INT NOT NULL,
    state VARCHAR(20) NOT NULL, -- Pendiente, Activo, Inactivo.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses(
    id INT primary key auto_increment,
    affiliate_id INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE providers(
    id INT primary key auto_increment,
    user_id INT NOT NULL, -- el usuario creado por el admin
    cuit VARCHAR(20) NOT NULL UNIQUE, -- los prestadores se identifican por CUIT
    name VARCHAR(255) NOT NULL,
    role_id INT NOT NULL, -- los roles son asignados por el admin (ADMIN, PRESTADOR, AFILIADO),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

### Nota:
- Cuando un afiliado se registra, se crea un registro en la tabla affiliates con el estado Pendiente.
- Cuando el administrador activa el registro, se cambia el estado a Activo y se lo deja iniciar sesión.
- El alta de un prestador lo hace directamente el administrador y relaciona el usuario creado con la tabla prestadores.