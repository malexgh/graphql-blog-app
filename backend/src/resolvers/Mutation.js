import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: { email: args.data.email }
        });
        if (!user || !await bcrypt.compare(args.data.password, user.password)) {
            throw new Error('Unable to login!');
        }
        return { user, token: generateToken(user.id) };
    },
    async createUser(parent, args, { prisma }, info) {
        const password = await hashPassword(args.data.password);
        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        });
        return { user, token: generateToken(user.id) };
    },
    deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.deleteUser({ where: { id: userId } }, info);
    },
    async updateUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password);
        }
        return prisma.mutation.updateUser({
            data: args.data,
            where: { id: userId }
        }, info);
    },
    createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: { id: userId }
                }
            }
        }, info);
    },
    async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        // check if the post belongs to the logged in user
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!postExists) {
            throw new Error('Unable to delete Post!');
        }
        return prisma.mutation.deletePost({ where: { id: args.id } }, info);
    },
    async updatePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        // check if the post belongs to the logged in user
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!postExists) {
            throw new Error('Unable to update Post!');
        }
        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        });
        if (isPublished && args.data.published === false) {
            await prisma.mutation.deleteManyComments({ where: { post: { id: args.id } } });
        }
        return prisma.mutation.updatePost({
            data: args.data,
            where: { id: args.id }
        }, info);
    },
    async createComment(parent, args, { prisma, request }, info) {
        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true
        });
        if (!postExists) {
            throw new Error('Post not found!');
        }
        const userId = getUserId(request);
        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: { id: userId }
                },
                post: {
                    connect: { id: args.data.post }
                }
            }
        }, info);
    },
    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        // check if the comment belongs to the logged in user
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!commentExists) {
            throw new Error('Unable to delete Comment!');
        }
        return prisma.mutation.deleteComment({ where: { id: args.id } }, info);
    },
    async updateComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        // check if the comment belongs to the logged in user
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author: {
                id: userId
            }
        });
        if (!commentExists) {
            throw new Error('Unable to update Comment!');
        }
        return prisma.mutation.updateComment({
            data: args.data,
            where: { id: args.id }
        }, info);
    }
};

export default Mutation;
