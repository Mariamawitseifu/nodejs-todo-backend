const cron = require("node-cron");
const db = require("./db");
const admin = require("firebase-admin");

// Initialize Firebase Admin (Requires firebase-service-account.json)
try {
  const serviceAccount = require("../firebase-service-account.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin initialized successfully.");
} catch (err) {
  console.warn("⚠️ Firebase Admin could not be initialized. Please add firebase-service-account.json to the root folder.");
}

const checkAndSendNotifications = async () => {
  console.log("Checking for due tasks...");
  try {
    // Select tasks that are due TODAY, the time is NOW or EARLIER, they are active, not completed, and not yet notified
    // We join with the users table to get the fcm_token
    const query = `
      SELECT t.id, t.title, t.time, u.fcm_token 
      FROM tasks t 
      JOIN users u ON t.user_id = u.id 
      WHERE 
        t.date = CURRENT_DATE 
        AND t.time <= CURRENT_TIME 
        AND t.completed = false 
        AND t.active = true 
        AND t.notified = false 
        AND u.fcm_token IS NOT NULL
    `;
    
    const { rows } = await db.query(query);

    if (rows.length === 0) {
      return;
    }

    console.log(`Found ${rows.length} tasks due for notification.`);

    const notifications = [];
    const taskIds = [];

    for (const task of rows) {
      taskIds.push(task.id);
      
      const message = {
        notification: {
          title: "Task Reminder!",
          body: `Your task "${task.title}" is due now.`,
        },
        token: task.fcm_token,
      };

      if (admin.apps.length > 0) {
        notifications.push(admin.messaging().send(message));
      }
    }

    if (notifications.length > 0) {
      await Promise.all(notifications);
      console.log(`Successfully sent ${notifications.length} push notifications.`);
    }

    // Mark these tasks as notified
    if (taskIds.length > 0) {
      const updateQuery = `UPDATE tasks SET notified = true WHERE id = ANY($1::int[])`;
      await db.query(updateQuery, [taskIds]);
    }
    
  } catch (err) {
    console.error("Error running notification cron job:", err);
  }
};

// Schedule the cron job to run every minute
const startCronJobs = () => {
  cron.schedule("* * * * *", checkAndSendNotifications);
  console.log("Cron jobs started.");
};

module.exports = { startCronJobs, checkAndSendNotifications };
