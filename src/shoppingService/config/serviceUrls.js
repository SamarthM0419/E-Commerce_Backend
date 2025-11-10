const ENV = process.env.NODE_ENV || "development";

const getServiceUrl = (serviceName) => {
  const fromEnv = process.env[`${serviceName.toUpperCase()}_SERVICE_URL`];
  if (fromEnv) return fromEnv;

  const defaults = {
    auth:
      ENV === "production" ? "http://auth-service" : "http://localhost:5001",
    notification:
      ENV === "production"
        ? "http://notification-service"
        : "http://localhost:5002",
    product:
      ENV === "production" ? "http://product-service" : "http://localhost:5003",
    cart:
      ENV === "production" ? "http://cart-service" : "http://localhost:5004",
    order:
      ENV === "production" ? "http://order-service" : "http://localhost:5005",
    payment:
      ENV === "production" ? "http://payment-service" : "http://localhost:5006",
  };

  return defaults[serviceName];
};

module.exports = { getServiceUrl };
