import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDB, { userOne, commentOne, commentTwo, postOne } from './utils/seedDB';
import getClient from './utils/getClient';
import { deleteComment, subscribeToComments } from './utils/operations';

const client = getClient();

beforeEach(seedDB);

test('Should be able to delete own comment', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: commentOne.comment.id,
    }
    const res = await client.mutate({ mutation: deleteComment, variables });
    const exists = await prisma.exists.Comment({ id: commentOne.comment.id });
    expect(exists).toBe(false);
});

test('Should not be able to delete other users comment', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: commentTwo.comment.id,
    }
    await expect(client.mutate({ mutation: deleteComment, variables })).rejects.toThrow();
});

test('Should subscribe to comment for a post', async (done) => {
    const variables = {
        postId: postOne.post.id,
    }
    client.subscribe({ query: subscribeToComments, variables }).subscribe({
        next(response) {
            expect(response.data.comment.mutation).toBe('DELETED');
            done();
        }
    });
    await prisma.mutation.deleteComment({ where: { id: commentOne.comment.id } });
});
