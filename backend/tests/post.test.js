import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDB, { userOne, postOne, postTwo, commentTwo  } from './utils/seedDB';
import getClient from './utils/getClient';
import { getPosts, getMyPosts, updatePost, createPost, deletePost, subscribeToPosts } from './utils/operations';

const client = getClient();

beforeEach(seedDB);

test('Should expose published posts', async () => {
    const res = await client.query({ query: getPosts });
    expect(res.data.posts.length).toBe(1);
    expect(res.data.posts[0].title).toBe('title1');
    expect(res.data.posts[0].body).toBe('body1');
    expect(res.data.posts[0].published).toBe(true);
});

test('Should fetch users posts', async () => {
    const client = getClient(userOne.jwt);
    const res = await client.query({ query: getMyPosts });
    expect(res.data.myPosts.length).toBe(2);
});

test('Should be able to update own post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: postOne.post.id,
        data: { published: false }
    }
    const res = await client.mutate({ mutation: updatePost, variables });
    const exists = await prisma.exists.Post({ id: postOne.post.id, published: false });
    expect(exists).toBe(true);
});

test('Should be able to create a post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        data: {
            title: "created post",
            body: "created post",
            published: false
        }
    }
    const res = await client.mutate({ mutation: createPost, variables });
    expect(res.data.createPost.title).toBe('created post');
    expect(res.data.createPost.body).toBe('created post');
    expect(res.data.createPost.published).toBe(false);
});

test('Should be able to delete a post', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: postTwo.post.id,
    }
    const res = await client.mutate({ mutation: deletePost, variables });
    const exists = await prisma.exists.Post({ id: postTwo.post.id });
    expect(exists).toBe(false);
});

test('Should subscribe to posts', async (done) => {
    client.subscribe({ query: subscribeToPosts }).subscribe({
        next(response) {
            expect(response.data.post.mutation).toBe('DELETED');
            done();
        }
    });
    await prisma.mutation.deletePost({ where: { id: postTwo.post.id } });
});
