import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
    cuid: { type: 'String', required: true },
    title: { type: 'String', required: true },
    slug: { type: 'String', required: true },
    content: { type: 'String', required: true },
    image: { type: 'String', required: true },
    category: { type: 'String', required: true, enum: ['Technology', 'Lifestyle'] },
    addDate: { type: 'Date', default: Date.now, required: true },
    editDate: { type: 'Date', default: Date.now, required: true },
    isDelete: { type: 'Boolean', default: false }
});

let Post = mongoose.model('Post', postSchema);

export default Post;