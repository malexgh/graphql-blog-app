import { gql } from 'apollo-boost';

const createUser = gql`mutation($data: CreateUserInput!) {
    createUser(data: $data) {
        token
        user {
            id
            name
            email
        }
    }
}`;

const getUsers = gql`query {
    users {
        id
        name
        email
    }
}`;

const login = gql`mutation($data: LoginInput!) {
    login(data: $data) {
        token
    }
}`;

const getProfile = gql`query {
    me {
        id
        name
        email
    }
}`;

const getPosts = gql`query {
    posts {
        id
        title
        body
        published
    }
}`;

const getMyPosts = gql`query {
    myPosts {
        id
        title
        body
        published
    }
}`;

const updatePost = gql`mutation($id: ID!, $data: UpdatePostInput!) {
    updatePost(
        id: $id, 
        data: $data
    ) {
        id
        title
        body
        published
    }
}`;

const createPost = gql`mutation($data: CreatePostInput!) {
    createPost(
        data: $data
    ) {
        id
        title
        body
        published
    }
}`;

const deletePost = gql`mutation($id: ID!) {
    deletePost(
        id: $id, 
    ) {
        id
        title
        body
        published
    }
}`;

const deleteComment = gql`mutation($id: ID!) {
    deleteComment(
        id: $id, 
    ) {
        id
        text
    }
}`;

const subscribeToPosts = gql`subscription {
    post {
        mutation
        node {
            id
            title
            body
            published
        }
    }
}`;

const subscribeToComments = gql`subscription($postId: ID!) {
    comment(
        postId: $postId, 
    ) {
        mutation
        node {
            id
            text
        }
    }
}`;

export { 
    createUser, 
    getUsers, 
    login, 
    getProfile, 
    getPosts, 
    getMyPosts, 
    updatePost, 
    createPost, 
    deletePost, 
    deleteComment, 
    subscribeToPosts,
    subscribeToComments 
}
