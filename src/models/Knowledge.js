const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'under_review'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'internal', 'restricted'],
    default: 'internal'
  },
  accessLevel: {
    type: String,
    enum: ['all', 'authenticated', 'contributors', 'editors', 'admins'],
    default: 'authenticated'
  },
  version: {
    type: Number,
    default: 1
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarks: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  history: [{
    version: Number,
    content: String,
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: {
      type: Date,
      default: Date.now
    },
    changes: String
  }],
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  publishedAt: {
    type: Date
  },
  archivedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better search performance
knowledgeSchema.index({ title: 'text', content: 'text', summary: 'text' });
knowledgeSchema.index({ category: 1, status: 1 });
knowledgeSchema.index({ tags: 1 });
knowledgeSchema.index({ author: 1, status: 1 });
knowledgeSchema.index({ createdAt: -1 });
knowledgeSchema.index({ views: -1 });

// Virtual for like count
knowledgeSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for bookmark count
knowledgeSchema.virtual('bookmarkCount').get(function() {
  return this.bookmarks.length;
});

// Pre-save middleware to update version and history
knowledgeSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.version += 1;
    this.history.push({
      version: this.version - 1,
      content: this.content,
      editedBy: this.lastEditedBy,
      editedAt: new Date()
    });
  }
  
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  if (this.isModified('status') && this.status === 'archived' && !this.archivedAt) {
    this.archivedAt = new Date();
  }
  
  next();
});

// Method to increment views
knowledgeSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to toggle like
knowledgeSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  
  if (existingLike) {
    this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  } else {
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

// Method to toggle bookmark
knowledgeSchema.methods.toggleBookmark = function(userId) {
  const existingBookmark = this.bookmarks.find(bookmark => bookmark.user.toString() === userId.toString());
  
  if (existingBookmark) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.user.toString() !== userId.toString());
  } else {
    this.bookmarks.push({ user: userId });
  }
  
  return this.save();
};

module.exports = mongoose.model('Knowledge', knowledgeSchema);