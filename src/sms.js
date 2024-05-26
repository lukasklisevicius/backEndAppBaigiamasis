const twilio = require('twilio');
const {TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN} = require('./config')
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
function assignGifts(contacts) {
    const participants = Array.from({ length: contacts.length }, (_, index) => index);
    const shuffledParticipants = shuffle(participants);

    const assignments = shuffledParticipants.map((giver, index) => {
        let receiver;
        do {
            receiver = shuffledParticipants[index];
            index = (index + 1) % contacts.length;
        } while (giver === receiver);

        return { giver, receiver };
    });

    return assignments;
}

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

async function buildMsg(contacts, prefix, comment) {
    const assignments = assignGifts(contacts)
    for (const assignment of assignments) {
        const giver = contacts[assignment.giver];
        const receiver = contacts[assignment.receiver];

        const message = `${prefix} ${receiver.name}.${comment}`;
        await sendMessage(message, giver.phoneNumber);
    }
}

async function sendMessage(msg, phoneNr) {
    console.log(`body: ${msg}, to: ${phoneNr}`);

    // Uncomment the following lines to actually send the message
    await client.messages.create({
      body: msg,
      from: "Gifters SMS" || "+16305065489",
      to: phoneNr
    });
}

module.exports = {
    // assignGifts: (contacts) => assignGifts(contacts),
    buildMessage: async (contacts, prefix, comment) => buildMsg(contacts, prefix, comment)
}