// subscriptionController.js
const { Subscription } = require('../../models/Subscription'); // Importa el modelo Subscription

async function createSubscription(req, res) {
  try {
    const newSubscription = await Subscription.create(req.body);
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear la suscripción' });
  }
}

async function getSubscription(req, res) {
  try {
    const { subscriptionId } = req.params;
    const subscription = await Subscription.findByPk(subscriptionId);
    if (subscription) {
      res.json(subscription);
    } else {
      res.status(404).json({ error: 'Suscripción no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function getAllSubscriptions(req, res) {
  try {
    const subscriptions = await Subscription.findAll();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateSubscription(req, res) {
  try {
    const { subscriptionId } = req.params;
    const subscription = await Subscription.findByPk(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ error: 'Suscripción no encontrada' });
    }

    await subscription.update(req.body);

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function deleteSubscription(req, res) {
  try {
    const { subscriptionId } = req.params;
    const subscription = await Subscription.findByPk(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ error: 'Suscripción no encontrada' });
    }

    await subscription.destroy();

    res.json({ message: 'Suscripción eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  createSubscription,
  getSubscription,
  getAllSubscriptions,
  updateSubscription,
  deleteSubscription,
};
