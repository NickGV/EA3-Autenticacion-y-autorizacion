-- Script para insertar datos de ejemplo
-- Ejecutar después de npm run init-db

USE talento_humano;

-- Insertar funcionarios de ejemplo
INSERT INTO funcionario (tipo_identificacion, numero_identificacion, nombres, apellidos, estado_civil, sexo, direccion, telefono, fecha_nacimiento)
VALUES
('CC', '1001234567', 'Carlos', 'Pérez López', 'Soltero', 'M', 'Calle 45 #12-23', '3001234567', '1990-05-12'),
('CC', '1009876543', 'María', 'Gómez Ruiz', 'Casada', 'F', 'Carrera 10 #8-20', '3109876543', '1988-09-30'),
('CC', '1005555555', 'Ana', 'Martínez Silva', 'Soltera', 'F', 'Avenida 15 #20-10', '3155554444', '1992-03-15')
ON DUPLICATE KEY UPDATE id_funcionario=id_funcionario;

-- Insertar grupo familiar
INSERT INTO grupo_familiar (id_funcionario, nombre, parentesco, edad, telefono)
VALUES
(1, 'Ana López', 'Madre', 55, '3005557788'),
(1, 'Juan Pérez', 'Hermano', 28, '3012233445'),
(2, 'Carlos Martínez', 'Esposo', 36, '3009998877'),
(2, 'Sofía Gómez', 'Hija', 8, '3109876543');

-- Insertar estudios
INSERT INTO estudio (id_funcionario, universidad, nivel_estudio, titulo)
VALUES
(1, 'Universidad de Antioquia', 'Pregrado', 'Ingeniería de Sistemas'),
(1, 'Instituto CESDE', 'Técnico', 'Programación de Software'),
(2, 'Universidad Nacional', 'Maestría', 'Gestión de Proyectos de TI'),
(3, 'Universidad EAFIT', 'Pregrado', 'Administración de Empresas');

SELECT 'Datos de ejemplo insertados correctamente' AS Mensaje;


