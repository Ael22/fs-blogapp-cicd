const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((acc, blog) => {
    return acc + blog.likes
  }, 0)
  return total;
}

const favouriteBlog = (blogs) => {
  const favouriteBlog = blogs.reduce((max, curr) => curr.likes > max.likes ? curr : max, blogs[0] || {})
  return favouriteBlog;
}

const mostBlogs = (blogs) => {
  let counts = {};
  let mostBlogsAuthor = '';
  let highestCount = 0;

  for (const blog of blogs) {
    const author = blog.author;

    // update tracker
    counts[author] = (counts[author] || 0) + 1;

    // check if it is highest count
    if (counts[author] > highestCount) {
      mostBlogsAuthor = author;
      highestCount = counts[author]
    }
  }

  return {
    author: mostBlogsAuthor,
    blogs: highestCount
  }
}

const mostLikes = (blogs) => {
  let counts = {}
  let mostLikesAuthor = ''
  let highestLikes = 0;

  for (const blog of blogs) {
    let author = blog.author;
    let likes = blog.likes;

    counts[author] = (counts[author] || 0) + likes

    if (counts[author] > highestLikes) {
      mostLikesAuthor = author
      highestLikes = counts[author]
    }
  }

  return {
    author: mostLikesAuthor,
    likes: highestLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}