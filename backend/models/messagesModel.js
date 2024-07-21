const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const savePrivateMessage = async (senderId, targetUserId, content, timestamp) => {
    try {
      return message = await prisma.message.create({
        data: {
          senderId,
          receiverId: targetUserId,
          content,
          timestamp,
        },
      });
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  };

const getMessagesById = async (senderId, targetUserId) => {
  try {
    return messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(senderId),
            receiverId: parseInt(targetUserId),
          },
          {
            senderId: parseInt(targetUserId),
            receiverId: parseInt(senderId),
          }
        ]
      },
      orderBy: {
        timestamp: 'asc',
      }
    });
  } catch (error){
    console.error("Error getting messages:",error);
    throw error;
  }
}

const deleteMessagesById = async (senderId, targetUserId) => {
  try {
    return deletedMessages = await prisma.message.deleteMany({
      where: {
        OR: [
          {
            senderId: parseInt(senderId),
            receiverId: parseInt(targetUserId),
          },
          {
            senderId: parseInt(targetUserId),
            receiverId: parseInt(senderId),
          }
        ]
      }
    });
  } catch (error){
    console.error("Error deleting messages:", error);
    throw error;
  }
}


  module.exports = { savePrivateMessage, getMessagesById, deleteMessagesById };
