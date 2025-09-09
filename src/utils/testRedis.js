const { connectRedisDB, isConnected, publish, subscribe } = require("./eventBus");

(async () => {
  await connectRedisDB();

  if (isConnected()) console.log("✅ Redis Cloud is working!");

  // Test subscriber
  subscribe("testChannel", (data) => {
    console.log("📬 Message received:", data);
  });

  // Test publisher
  await publish("testChannel", { msg: "Hello Redis Cloud!" });
})();
