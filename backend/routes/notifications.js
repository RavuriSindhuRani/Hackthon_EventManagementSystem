  const express = require("express")

const router = express.Router()

const cron = require("node-cron")

const nodemailer = require("nodemailer")

const Notification = require("../models/notifications")
const Event = require("../models/events")
const User = require("../models/users")

// Transporter
const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {

    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS
  }

})

// Event Reminder API
router.get("/event-reminder", async (req, res) => {

  cron.schedule("* * * * *", async () => {

    const now = new Date()

    const events = await Event.find({

      status: "ONGOING"

    })

    for (let event of events) {

      const eventTime =
        new Date(event.eventDateTime)

      // Minutes left
      const minutesLeft =
        Math.floor((eventTime - now) / (1000 * 60))

      // 1 hour before
      if (
        minutesLeft === 60 &&
        !event.oneHourReminderSent
      ) {

        for (let userId of event.registeredUsers) {

          const user =
            await User.findById(userId)

          // Save notification
          await Notification.create({

            userId: userId,

            title: "Event Reminder",

            message:
              `${event.title} starts in 1 hour`,

            type: "EVENT_REMINDER",

            deliveryStatus: "SENT"
          })

          // Send Email
          await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: user.email,

            subject: "Event Reminder",

            text: `Hello ${user.name},
            Your event "${event.title}"
            starts in 1 hour.
            Thank You `})

          console.log("Reminder Email Sent")
        }

        // Prevent duplicate emails
        event.oneHourReminderSent = true

        await event.save()
      }
    }

  })

  res.json({

    message: "Reminder Service Started"

  })

})

module.exports = router