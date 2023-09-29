//clase para manejo de errores del cliente
class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.status = statusCode;
  }
}

module.exports = ClientError;
