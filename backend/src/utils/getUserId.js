import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
    const header = request.request ?
        request.request.headers.authorization : //from http
        request.connection.context.Authorization; //from socket
    if(!header) {
        if(requireAuth) {
            throw new Error('Authorization required!');
        }
        return null;
    }
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
}

export default getUserId;
