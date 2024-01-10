const { expect } = require('chai');
const errorDictionary = {
  'PRODUCT_NOT_FOUND': 'El producto no se encontró.',
  'INVALID_REQUEST': 'La solicitud no es válida.',
  'DUPLICATE_PRODUCT': 'Ya existe un producto con la misma información.',
  'UNAUTHORIZED_ACCESS': 'Acceso no autorizado.',
  'INVALID_CREDENTIALS': 'Credenciales inválidas. Verifica tu nombre de usuario y contraseña.',
  'USER_NOT_FOUND': 'Usuario no encontrado.',
  'USER_ALREADY_EXISTS': 'El usuario ya existe.',
  'SESSION_EXPIRED': 'La sesión ha expirado. Por favor, vuelve a iniciar sesión.',
  'INSUFFICIENT_PERMISSIONS': 'Permisos insuficientes para realizar esta acción.',
  'INTERNAL_SERVER_ERROR': 'Ocurrió un error interno en el servidor. Por favor, inténtalo de nuevo más tarde.',
};

function errorHandlerMiddleware(err, req, res, next) {
  const errorCode = err.code || 'UNKNOWN_ERROR';
  const errorMessage = errorDictionary[errorCode] || 'Error desconocido';

  // Set appropriate status code based on error type
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: true,
    code: errorCode,
    message: errorMessage,
  });

  // Log the error
  console.error(`Error: ${errorCode} - ${errorMessage}`);
}

module.exports = {
  errorHandlerMiddleware,
};

  