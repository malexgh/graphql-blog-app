import getUserId from '../utils/getUserId';

const Subscription = {
    post: {
        subscribe(parent, args, { prisma }, info) {
            return prisma.subscription.post({
                where: { node: { published: true } }
            }, info);
        }
    },
    myPost: {
        subscribe(parent, { postId }, { prisma, request }, info) {
            const userId = getUserId(request);
            return prisma.subscription.post({
                where: { node: { author: { id: userId } } }
            }, info);
        }
    },
    comment: {
        subscribe(parent, { postId }, { prisma }, info) {
            return prisma.subscription.comment({
                where: { node: { post: { id: postId } } }
            }, info);
        }
    }
}

export default Subscription;
