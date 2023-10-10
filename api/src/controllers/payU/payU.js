const axios = require('axios');

// URL base de la API de prueba de PayU Latam
const apiUrl = 'https://sandbox.api.payulatam.com/payments-api/4.0/';

// Credenciales de prueba de PayU Latam (reemplaza con tus propias credenciales)
const apiKey = 'tu-api-key';
const apiLogin = 'tu-api-login';

// Función para realizar una solicitud POST a la API de PayU Latam
async function realizarPago(datosPago) {
  try {
    // Configura los encabezados de autenticación
    const headers = {
      Authorization: `Basic ${Buffer.from(`${apiLogin}:${apiKey}`).toString('base64')}`,
    };

    // Realiza la solicitud POST a la API de PayU Latam para procesar el pago
    const response = await axios.post(`${apiUrl}payments`, datosPago, { headers });

    // Devuelve la respuesta de la API de PayU Latam
    return response.data;
  } catch (error) {
    throw new Error(`Error al procesar el pago: ${error.message}`);
  }
}

module.exports = {
  realizarPago,
};
