import messageModel from "../models/messages.model.js"

export default class MessagesManager {
    getMessages = async () => {
        try {
            return await messageModel.find().lean().exec();
        } catch (error) {
            throw new Error(`Error getting messages: ${error.message}`);
        }
    }

    createMessage = async (message) => {
        this.validateMessage(message);
        try {
            return await messageModel.create(message);
        } catch (error) {
            throw new Error(`Error creating message: ${error.message}`);
        }
    }

    validateMessage = (message) => {
        if (!message.user || !message.message) { 
            throw new Error("Invalid message format");
        }
    }
}
