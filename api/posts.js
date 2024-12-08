import instance from ".";

const getAllPosts = async () => {
  const { data } = await instance.get("/posts");
  return data;
};

const getPostById = async (id) => {
  const { data } = await instance.get(`/posts/${id}`);
  return data;
};
const createPost = async (postData) => {
  const { data } = await instance.post(`/posts`, postData);
  return data;
};

const deletePostById = async (id) => {
  const { data } = await instance.delete(`/posts/${id}`);
};
const addCommentToPost = async (id, commentData) => {
  const { data } = await instance.post(`/posts/${id}/comments`, commentData);
};

const deleteCommentFromPost = async (commentId) => {
  const { data } = await instance.delete(`posts/comments/${commentId}`);
};

export {
  getAllPosts,
  getPostById,
  createPost,
  deletePostById,
  addCommentToPost,
  deleteCommentFromPost,
};
