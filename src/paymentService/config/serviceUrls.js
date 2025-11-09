const ENV = process.env.NODE_ENV || "development";

const getServiceUrl = (serviceName) => {
  const fromEnv = process.env[`${serviceName.toUpperCase()}_SERVICE_URL`];
  if (fromEnv) return fromEnv;

  const defaults = {
    order:
      ENV === "production"
        ? "http://order-service"
        : "http://localhost:5005",
    cart:
      ENV === "production"
        ? "http://cart-service"
        : "http://localhost:5004",
    product:
      ENV === "production"
        ? "http://product-service"
        : "http://localhost:5003",
    payment:
      ENV === "production"
        ? "http://payment-service"
        : "http://localhost:5006",
  };

  return defaults[serviceName];
};

module.exports = { getServiceUrl };
