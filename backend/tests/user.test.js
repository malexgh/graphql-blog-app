import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDB, { userOne } from './utils/seedDB';
import getClient from './utils/getClient';
import { createUser, getUsers, login, getProfile } from './utils/operations';

const client = getClient();

beforeEach(seedDB);

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "Marcio",
            email: "marcio@test.com",
            password: "pwd12345"
        }
    };
    const res = await client.mutate({ mutation: createUser, variables });
    const exists = await prisma.exists.User({ id: res.data.createUser.user.id });
    expect(exists).toBe(true);
});

test('Should expose public author profiles', async () => {
    const res = await client.query({ query: getUsers });
    expect(res.data.users.length).toBe(2);
    expect(res.data.users[0].email).toBe(null);
    expect(res.data.users[0].name).toBe('user1');
});

test('Should not loggin with bad credentials', async () => {
    const variables = {
        data: {
            email: "user@test.com",
            password: "pwd12345"
        }
    };
    await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test('Should not create a new user with repeated email', async () => {
    const variables = {
        data: {
            name: "Repeated",
            email: "user1@test.com",
            password: "pwd12345"
        }
    };
    await expect(client.mutate({ mutation: createUser, variables })).rejects.toThrow();
});

test('Should not create a new user with short password', async () => {
    const variables = {
        data: {
            name: "user2",
            email: "user2@test.com",
            password: "pwd"
        }
    };
    await expect(client.mutate({ mutation: createUser, variables })).rejects.toThrow();
});

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt);
    const res = await client.query({ query: getProfile });
    expect(res.data.me.id).toBe(userOne.user.id);
    expect(res.data.me.name).toBe(userOne.user.name);
    expect(res.data.me.email).toBe(userOne.user.email);
});
