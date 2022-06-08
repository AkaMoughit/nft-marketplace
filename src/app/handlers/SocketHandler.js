const messageRepository = require('../repositories/MessageRepository');
const listingRepository = require('../repositories/ListingRepository');

module.exports = handleSocket = (io) => {
    io.on('connection', socket => {
        socket.on('join', (conversationId) => {
            socket.join(conversationId);
        })

        socket.on('message', async (message) => {
            try {
                let savedMessage;
                if(message.ListingId) {
                    const waitListing = new Promise((resolve) => {
                        // Improvement: use filters to filter out which listing exactly
                        global.eventEmitter.once('listingDone', async () => {
                            const listing = {
                                isPublic: false,
                                updatedAt: new Date()
                            }
                            await listingRepository.updateById(message.ListingId, listing);
                            resolve("listing inserted");
                        });
                    });

                    await waitListing;
                    savedMessage = await messageRepository.save(message);
                    savedMessage = await messageRepository.findDetailedById(savedMessage.id);
                } else {
                    savedMessage = await messageRepository.save(message);
                    savedMessage = await messageRepository.findDetailedById(savedMessage.id);
                }
                io.sockets.in(savedMessage.dataValues.ConversationId.toString()).emit('message', savedMessage.dataValues);
            } catch (e) {
                console.log("error saving message to DB")
                console.log(e);
            }
        });
    });
}