const { MessageType } = require("@adiwajshing/baileys");
const chalk = require("chalk");
const number = require("../sidekick/input-sanitization");

module.exports = {
    name: "demote",
    description: "Demote",
    extendedDescription: "Demote member from admin",
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(
                BotsApp.from,
                "*This is not a group*",
                MessageType.text
            );
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(
                BotsApp.from,
                "*I am not group admin*",
                MessageType.text
            );
            return;
        }
        const reply = chat.messages.all()[0].message.extendedTextMessage;
        try {
            if (!args.length > 0) {
                var contact = reply.contextInfo.participant.split("@")[0];
            } else {
                var contact = await number.getCleanedContact(args, client, BotsApp);
            }

            var admin = false;
            var isMember = false;
            for (const index in BotsApp.groupMembers) {
                if (contact == BotsApp.groupMembers[index].id.split("@")[0]) {
                    isMember = true;
                    if (BotsApp.groupMembers[index].isAdmin) {
                        admin = true;
                    }
                }
            }

            if (isMember) {
                if (admin == true) {
                    const arr = [contact + "@s.whatsapp.net"];
                    client.groupDemoteAdmin(BotsApp.from, arr);
                    client.sendMessage(
                        BotsApp.from,
                        "*" + contact + " is demoted from admin*",
                        MessageType.text
                    );
                    return;
                } else {
                    client.sendMessage(
                        BotsApp.from,
                        "*" + contact + " was not an admin*",
                        MessageType.text
                    );
                    return;
                }
            }
            if (!isMember && contact.length >= 10 && contact.length < 13) {
                client.sendMessage(
                    BotsApp.from,
                    "*Person is not in the group*",
                    MessageType.text
                );
                return;
            }
        } catch (err) {
            if (typeof(contact) == 'undefined' || err instanceof TypeError) {
                if (reply == null && typeof(args[0]) == 'undefined') {
                    console.log(
                        chalk.redBright.bold("Please reply or tag the person for promotion: " + err));
                    client.sendMessage(BotsApp.from, "*Please reply or tag / enter contact of the person to be demoted*", MessageType.text);
                }
            } else {
                console.log(err);
            }
        }
    }
};