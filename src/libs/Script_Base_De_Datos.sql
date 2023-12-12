-- Crear tabla "usuarios"
CREATE TABLE "usuarios" (
  "id" integer PRIMARY KEY,
  "nombre" varchar,
  "apellido_pat" varchar,
  "apellido_mat" varchar,
  "run" integer,
  "usuario" varchar,
  "correo" varchar,
  "contrasena" varchar,
  "id_profesor" integer, 
  "created_at" timestamp
);


CREATE TABLE "roles" (
  "id" integer PRIMARY KEY,
  "nombre" varchar,
  "created_at" timestamp
);


CREATE TABLE "roles_usuarios" (
  "id_rol" integer,
  "id_user" integer,
  "created_at" timestamp
);


CREATE TABLE "token_premio" (
  "id" varchar PRIMARY KEY,
  "descripcion" varchar,
  "profesor_creador" integer,
  "alumno_premio" integer,
  "estado" boolean DEFAULT True
);


CREATE TABLE "premio" (
  "id" serial PRIMARY KEY,
  "tipo_premio" varchar, 
  "descripcion" varchar,
  "profesor_creador" integer,
  "created_at" timestamp
);


ALTER TABLE "premio" ADD CONSTRAINT unique_tipo_premio UNIQUE ("tipo_premio");


CREATE TABLE "premio_disponible" (
  "id" serial PRIMARY KEY,
  "tipo_premio" varchar,
  "id_estudiante" integer,
  "id_profesor_creador" integer,
  "fecha_asignacion" timestamp DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "premio_disponible" ADD FOREIGN KEY ("tipo_premio") REFERENCES "premio" ("tipo_premio");
ALTER TABLE "premio_disponible" ADD FOREIGN KEY ("id_estudiante") REFERENCES "usuarios" ("id");
ALTER TABLE "premio_disponible" ADD FOREIGN KEY ("id_profesor_creador") REFERENCES "usuarios" ("id");


ALTER TABLE "premio" ADD FOREIGN KEY ("profesor_creador") REFERENCES "usuarios" ("id");


ALTER TABLE "usuarios" ADD FOREIGN KEY ("id_profesor") REFERENCES "usuarios" ("id");


ALTER TABLE "roles_usuarios" ADD FOREIGN KEY ("id_user") REFERENCES "usuarios" ("id");
ALTER TABLE "roles_usuarios" ADD FOREIGN KEY ("id_rol") REFERENCES "roles" ("id");


CREATE SEQUENCE usuarios_id_seq;


ALTER TABLE usuarios ALTER COLUMN id SET DEFAULT nextval('usuarios_id_seq');
ALTER SEQUENCE usuarios_id_seq OWNED BY usuarios.id;


CREATE SEQUENCE roles_id_seq;


ALTER TABLE roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq');
ALTER SEQUENCE roles_id_seq OWNED BY roles.id;
