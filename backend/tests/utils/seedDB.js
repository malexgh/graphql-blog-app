import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
    input: {
        name: 'user1',
        email: 'user1@test.com',
        password: bcrypt.hashSync('pwd12345')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'user2',
        email: 'user2@test.com',
        password: bcrypt.hashSync('pwd12345')
    },
    user: undefined,
    jwt: undefined
}

const postOne = {
    input: {
        title: 'title1',
        body: 'body1',
        published: true,
    },
    post: undefined
}

const postTwo = {
    input: {
        title: 'title2',
        body: 'body2',
        published: false,
    },
    post: undefined
}

const commentOne = {
    input: {
        text: 'text1'
    },
    comment: undefined
}

const commentTwo = {
    input: {
        text: 'text2'
    },
    comment: undefined
}

const seedDB = async () => {
    // clean DB
    await prisma.mutation.deleteManyComments();
    await prisma.mutation.deleteManyPosts();
    await prisma.mutation.deleteManyUsers();
    // create userOne
    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    });
    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);
    // create userTwo
    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    });
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET);
    // create postOne for userOne
    postOne.post = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });
    // create postTwo for userOne
    postTwo.post = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });
    // create commentOne for postOne of UserOne
    commentOne.comment = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            post: {
                connect: {
                    id: postOne.post.id
                }
            },
            author: {
                connect: {
                    id: userOne.user.id
                }
            }
        }
    });
    // create commentOne for postOne of UserTwo
    commentTwo.comment = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            post: {
                connect: {
                    id: postOne.post.id
                }
            },
            author: {
                connect: {
                    id: userTwo.user.id
                }
            }
        }
    });
}

export { seedDB as default, userOne, userTwo, postOne, postTwo, commentOne, commentTwo };
