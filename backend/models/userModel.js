const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function createUser(email, password, name) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
}

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: {id : id}
  })
}

async function updateConnectionStatus(id, status){
  return await prisma.user.update({
    where: { id },
    data: { isConnected: status },
  });
}

async function getUserByConnection(){
  return await prisma.user.findMany({
    where: { isConnected: true },
  });
}

module.exports = { createUser, findUserByEmail, getUserById };
