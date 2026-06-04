import React, { useState, useRef } from 'react';
import { Users, MessageCircle, Heart, Send, ArrowLeft, Loader2, ThumbsUp, ThumbsDown, Trash2, Reply as ReplyIcon, Bold, Italic, Code, Plus, X, Search, Bookmark, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../contexts/AppContext';

interface Reply {
  id: number;
  userId: string;
  name: string;
  avatar: string | null;
  role: string;
  text: string;
  time: string;
  score: number;
  userVote: 'up' | 'down' | null;
}

interface Comment {
  id: number;
  userId: string;
  name: string;
  avatar: string | null;
  role: string;
  text: string;
  time: string;
  score: number;
  userVote: 'up' | 'down' | null;
  replies: Reply[];
}

interface Post {
  id: number;
  userId: string;
  name: string;
  avatar: string | null;
  role: string;
  time: string;
  content: string;
  likes: number;
  userLiked: boolean;
  comments: Comment[];
  category: 'discussion' | 'project';
  title?: string;
  projectName?: string;
  techStack?: string;
  projectUrl?: string;
}

const Avatar = ({ name, url, fallbackClass = "bg-blue-500 text-white text-sm", size = "w-8 h-8" }: { name: string, url: string | null, fallbackClass?: string, size?: string }) => {
  if (url) {
    return <img src={url} alt={name} className={`${size} rounded-full object-cover`} />;
  }
  return (
    <div className={`${size} rounded-full flex items-center justify-center font-bold shrink-0 ${fallbackClass}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

const formatText = (text: string) => {
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formattedText = formattedText.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-pink-500 px-1 py-0.5 rounded text-xs">$1</code>');
  return formattedText;
};

export default function Community() {
  const { progress, t, user } = useAppContext();
  const isNewUser = progress.completedLessons.length === 0;

  const currentUserId = user?.uid || 'guest_user';
  const currentUserName = user?.displayName || 'Kamu';
  const currentUserAvatar = user?.photoURL || null;
  const { addXp } = useAppContext();

  const [posts, setPosts] = useState<Post[]>([
    { 
      id: 1, userId: 'user1', name: 'Sarah', avatar: null, role: 'Beginner', time: '2 jam lalu', content: 'Akhirnya berhasil bikin website pertama pakai HTML & CSS doang! Seneng banget!', likes: 24, userLiked: false, 
      category: 'project',
      projectName: 'Website Portfolio Pertama',
      techStack: 'HTML, CSS',
      comments: [
        { id: 101, userId: 'user2', name: 'Budi', avatar: null, role: 'Intermediate', text: 'Keren banget, terus semangat belajarnya!', time: '1 jam lalu', score: 5, userVote: null, replies: [] },
        { id: 102, userId: 'user3', name: 'Anita', avatar: null, role: 'Mentor', text: 'Wah, selamat ya! Coba tambahkan border-radius biar sudutnya melengkung.', time: '45 menit lalu', score: 12, userVote: 'up', replies: [] }
      ] 
    },
    { 
      id: 2, userId: 'user4', name: 'Ahmad', avatar: null, role: 'Hobbyist', time: 'Kemarin', content: 'Ada yang tau kenapa kode Flexbox ku gak mau ke tengah? Udah dikasih justify-center padahal.', likes: 3, userLiked: false, 
      category: 'discussion',
      title: 'Tanya Jawab Flexbox',
      comments: [
        { id: 201, userId: 'user5', name: 'Rian', avatar: null, role: 'Expert', text: 'Pastiin parent-nya punya display: flex, terus atur height-nya misal min-h-screen kalau mau tengah layar vertical. Kalau align-items: center jangan lupa.', time: '20 jam lalu', score: 8, userVote: null, replies: [] }
      ] 
    },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'discussion' | 'project' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPostIds, setSavedPostIds] = useState<number[]>([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newPostCategory, setNewPostCategory] = useState<'discussion' | 'project'>('discussion');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTechStack, setNewPostTechStack] = useState('');
  const [newPostUrl, setNewPostUrl] = useState('');

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [commentSortBy, setCommentSortBy] = useState<'newest' | 'oldest' | 'most_liked'>('newest');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'post' | 'comment' | 'reply', postId: number, commentId?: number, replyId?: number} | null>(null);
  
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const toggleLike = (id: number) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          likes: p.userLiked ? p.likes - 1 : p.likes + 1, 
          userLiked: !p.userLiked 
        };
      }
      return p;
    }));
  };

  const setVote = (postId: number, commentId: number, type: 'up' | 'down', replyId?: number) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: p.comments.map(c => {
            if (replyId === undefined && c.id === commentId) {
              let newScore = c.score;
              if (c.userVote === type) { 
                newScore += type === 'up' ? -1 : 1;
                return { ...c, score: newScore, userVote: null };
              }
              if (c.userVote === 'up' && type === 'down') newScore -= 2;
              else if (c.userVote === 'down' && type === 'up') newScore += 2;
              else newScore += type === 'up' ? 1 : -1;
              return { ...c, score: newScore, userVote: type };
            } else if (replyId !== undefined && c.id === commentId) {
              return {
                ...c,
                replies: c.replies.map(r => {
                  if (r.id === replyId) {
                    let newScore = r.score;
                    if (r.userVote === type) { 
                      newScore += type === 'up' ? -1 : 1;
                      return { ...r, score: newScore, userVote: null };
                    }
                    if (r.userVote === 'up' && type === 'down') newScore -= 2;
                    else if (r.userVote === 'down' && type === 'up') newScore += 2;
                    else newScore += type === 'up' ? 1 : -1;
                    return { ...r, score: newScore, userVote: type };
                  }
                  return r;
                })
              }
            }
            return c;
          })
        };
      }
      return p;
    }));
  };

  const deleteContent = () => {
    if (!showDeleteConfirm) return;
    const { type, postId, commentId, replyId } = showDeleteConfirm;
    
    if (type === 'post') {
      setPosts(posts.filter(p => p.id !== postId));
      setSelectedPostId(null);
    } else if (type === 'comment' && commentId) {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
        }
        return p;
      }));
    } else if (type === 'reply' && commentId && replyId) {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return { ...p, comments: p.comments.map(c => {
            if (c.id === commentId) {
              return { ...c, replies: c.replies.filter(r => r.id !== replyId) };
            }
            return c;
          }) };
        }
        return p;
      }));
    }
    setShowDeleteConfirm(null);
  };

  const openPostDetail = (id: number) => {
    setIsDetailLoading(true);
    setSelectedPostId(id);
    setReplyingTo(null);
    setTimeout(() => {
      setIsDetailLoading(false);
    }, 400);
  };

  const closePostDetail = () => {
    setSelectedPostId(null);
    setCommentText('');
    setShowMentions(false);
    setReplyingTo(null);
  };

  const handleFormat = (prefix: string, suffix: string) => {
    if (!commentInputRef.current) return;
    const { selectionStart, selectionEnd, value } = commentInputRef.current;
    if (selectionStart !== null && selectionEnd !== null) {
      const selectedText = value.substring(selectionStart, selectionEnd);
      const newText = value.substring(0, selectionStart) + prefix + selectedText + suffix + value.substring(selectionEnd);
      if (newText.length <= 280) {
        setCommentText(newText);
        setTimeout(() => {
          commentInputRef.current?.focus();
          commentInputRef.current?.setSelectionRange(selectionStart + prefix.length, selectionEnd + prefix.length);
        }, 0);
      }
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length <= 280) {
      setCommentText(text);
      const lastWord = text.split(' ').pop() || '';
      if (lastWord.startsWith('@')) {
        setShowMentions(true);
        setMentionQuery(lastWord.substring(1).toLowerCase());
      } else {
        setShowMentions(false);
      }
    }
  };

  const handleMentionClick = (name: string) => {
    const words = commentText.split(' ');
    words.pop();
    const newText = [...words, `@${name} `].join(' ').replace(/^ /, '');
    if (newText.length <= 280) {
      setCommentText(newText);
    } else {
      setCommentText(newText.substring(0, 280));
    }
    setShowMentions(false);
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 0);
  };

  const handleAddComment = () => {
    if (!commentText || commentText.trim() === '' || selectedPostId === null) return;

    setPosts(posts.map(p => {
      if (p.id === selectedPostId) {
        if (replyingTo !== null) {
          return {
            ...p,
            comments: p.comments.map(c => {
              if (c.id === replyingTo) {
                return {
                  ...c,
                  replies: [...c.replies, {
                    id: Date.now(),
                    userId: currentUserId,
                    name: currentUserName,
                    avatar: currentUserAvatar,
                    role: 'Student',
                    text: commentText.trim(),
                    time: 'Baru saja',
                    score: 0,
                    userVote: null
                  }]
                };
              }
              return c;
            })
          };
        } else {
          return {
            ...p,
            comments: [...p.comments, { 
              id: Date.now(), 
              userId: currentUserId,
              name: currentUserName, 
              avatar: currentUserAvatar,
              role: 'Student', 
              text: commentText.trim(), 
              time: 'Baru saja',
              score: 0,
              userVote: null,
              replies: []
            }]
          };
        }
      }
      return p;
    }));

    addXp(3); // +3 XP when giving a comment

    setCommentText('');
    setShowMentions(false);
    setReplyingTo(null);
    
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddPost = () => {
    if (!newPostTitle.trim() || newPostContent.trim().length < 20) {
      alert("Judul harus diisi dan isi postingan minimal 20 karakter.");
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      userId: currentUserId,
      name: currentUserName,
      avatar: currentUserAvatar,
      role: 'Student',
      time: 'Baru saja',
      content: newPostContent.trim(),
      likes: 0,
      userLiked: false,
      comments: [],
      category: newPostCategory,
      title: newPostCategory === 'discussion' ? newPostTitle.trim() : undefined,
      projectName: newPostCategory === 'project' ? newPostTitle.trim() : undefined,
      techStack: newPostCategory === 'project' && newPostTechStack.trim() ? newPostTechStack.trim() : undefined,
      projectUrl: newPostCategory === 'project' && newPostUrl.trim() ? newPostUrl.trim() : undefined
    };

    setPosts([newPost, ...posts]);
    setIsCreatingPost(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTechStack('');
    setNewPostUrl('');
    setActiveTab(newPostCategory);
    
    setToastMessage("Postingan berhasil diterbitkan!");
    setTimeout(() => setToastMessage(null), 3000);

    addXp(newPostCategory === 'project' ? 15 : 10);
  };

  const toggleSaved = (id: number) => {
    setSavedPostIds(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.projectName && post.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'saved') return savedPostIds.includes(post.id);
    return post.category === activeTab;
  }).sort((a, b) => b.id - a.id);

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div className="p-6 max-w-3xl mx-auto pb-24 relative">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-lg text-red-500 mb-2">Hapus Konten?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">Tindakan ini tidak dapat dibatalkan. Konten akan dihapus secara permanen.</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={deleteContent}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPostId !== null && selectedPost ? (
        <div className="fixed flex flex-col h-full bg-gray-50 dark:bg-[#0D1117] inset-0 z-50">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate border-b border-gray-200 dark:border-gray-800 shrink-0 sticky top-0 z-10 shadow-sm">
            <button 
              onClick={closePostDetail}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h2 className="font-bold text-lg text-navy dark:text-white">Detail Diskusi</h2>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto custom-scrollbar p-0 relative">
            <div className="bg-white dark:bg-slate border-b border-gray-100 dark:border-gray-800 p-5 shadow-sm relative">
              {selectedPost.userId === currentUserId && (
                <button 
                  onClick={() => setShowDeleteConfirm({ type: 'post', postId: selectedPost.id })}
                  className="absolute top-5 right-5 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  title="Hapus Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedPost.name} url={selectedPost.avatar} fallbackClass="bg-gradient-to-br from-teal-400 to-emerald-500 text-white text-lg" size="w-10 h-10" />
                  <div>
                    <div className="font-bold text-navy dark:text-white flex items-center gap-2">
                      {selectedPost.name}
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider rounded-md">
                        {selectedPost.role}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">{selectedPost.time}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap content" dangerouslySetInnerHTML={{ __html: formatText(selectedPost.content) }}></div>
              
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                <button 
                  onClick={() => toggleLike(selectedPost.id)}
                  className={`flex items-center gap-2 transition-colors font-bold text-sm ${selectedPost.userLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                >
                  <Heart className={`w-5 h-5 ${selectedPost.userLiked ? 'fill-red-500' : ''}`} /> {selectedPost.likes}
                </button>
                <div className="flex items-center gap-2 text-primary-blue font-bold text-sm select-none">
                  <MessageCircle className="w-5 h-5" /> {selectedPost.comments.length} Komentar
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#0D1117] p-5 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-navy dark:text-white">Komentar</h3>
                {selectedPost.comments.length > 0 && (
                  <select 
                    value={commentSortBy}
                    onChange={(e) => setCommentSortBy(e.target.value as any)}
                    className="bg-white dark:bg-slate border border-gray-200 dark:border-gray-800 text-sm rounded-lg px-2 py-1 outline-none text-gray-600 dark:text-gray-300"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="most_liked">Paling Disukai</option>
                  </select>
                )}
              </div>
              
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                  <Loader2 className="w-8 h-8 text-primary-blue animate-spin mb-2" />
                  <p className="text-sm text-gray-500">Memuat komentar...</p>
                </div>
              ) : selectedPost.comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-slate border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  <MessageCircle className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Belum ada komentar.</p>
                  <p className="text-xs text-gray-400">Jadilah yang pertama berkomentar.</p>
                </div>
              ) : (
                [...selectedPost.comments]
                  .sort((a, b) => {
                    if (commentSortBy === 'most_liked') return b.score - a.score;
                    if (commentSortBy === 'oldest') return a.id - b.id;
                    return b.id - a.id; 
                  })
                  .map((comment) => (
                  <div key={comment.id} className="flex gap-3 bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 p-4 rounded-xl shadow-sm">
                    <Avatar name={comment.name} url={comment.avatar} fallbackClass="bg-blue-500 text-white text-sm" size="w-8 h-8" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-navy dark:text-white">{comment.name}</span>
                          <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wide">{comment.role}</span>
                          <span className="text-xs text-gray-400">{comment.time}</span>
                        </div>
                        {comment.userId === currentUserId && (
                          <button 
                            onClick={() => setShowDeleteConfirm({ type: 'comment', postId: selectedPost.id, commentId: comment.id })}
                            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors ml-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: formatText(comment.text) }} />
                      
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-full px-2 py-1">
                          <button 
                            onClick={() => setVote(selectedPost.id, comment.id, 'up')}
                            className={`p-1 rounded-full transition-colors ${comment.userVote === 'up' ? 'text-primary-blue bg-blue-100 dark:bg-blue-900/30' : 'text-gray-400 hover:text-primary-blue hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <span className={`text-xs font-bold w-4 text-center ${comment.userVote === 'up' ? 'text-primary-blue' : comment.userVote === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                            {comment.score}
                          </span>
                          <button 
                            onClick={() => setVote(selectedPost.id, comment.id, 'down')}
                            className={`p-1 rounded-full transition-colors ${comment.userVote === 'down' ? 'text-red-500 bg-red-100 dark:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => setReplyingTo(comment.id)}
                          className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-blue transition-colors"
                        >
                          <ReplyIcon className="w-3.5 h-3.5" /> Balas
                        </button>
                      </div>

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="flex gap-2">
                               <Avatar name={reply.name} url={reply.avatar} fallbackClass="bg-purple-500 text-white text-xs" size="w-6 h-6" />
                               <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-navy dark:text-white">{reply.name}</span>
                                    <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1 py-0.5 rounded uppercase tracking-wide">{reply.role}</span>
                                    <span className="text-[10px] text-gray-400">{reply.time}</span>
                                  </div>
                                  {reply.userId === currentUserId && (
                                    <button 
                                      onClick={() => setShowDeleteConfirm({ type: 'reply', postId: selectedPost.id, commentId: comment.id, replyId: reply.id })}
                                      className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors ml-2"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                <div className="text-xs text-gray-700 dark:text-gray-300 break-words" dangerouslySetInnerHTML={{ __html: formatText(reply.text) }} />
                                
                                <div className="mt-2 flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-full px-1.5 w-fit">
                                  <button 
                                    onClick={() => setVote(selectedPost.id, comment.id, 'up', reply.id)}
                                    className={`p-1 rounded-full transition-colors ${reply.userVote === 'up' ? 'text-primary-blue bg-blue-100 dark:bg-blue-900/30' : 'text-gray-400 hover:text-primary-blue hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                  </button>
                                  <span className={`text-[10px] font-bold w-4 text-center ${reply.userVote === 'up' ? 'text-primary-blue' : reply.userVote === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                                    {reply.score}
                                  </span>
                                  <button 
                                    onClick={() => setVote(selectedPost.id, comment.id, 'down', reply.id)}
                                    className={`p-1 rounded-full transition-colors ${reply.userVote === 'down' ? 'text-red-500 bg-red-100 dark:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                  >
                                    <ThumbsDown className="w-3 h-3" />
                                  </button>
                                </div>
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate border-t border-gray-200 dark:border-gray-800 shrink-0 sticky bottom-0 z-10 w-full">
            {replyingTo !== null && (
              <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 flex items-center justify-between border-b border-blue-100 dark:border-blue-900/50">
                <span className="text-xs font-bold text-primary-blue">
                  Membalas komentar {selectedPost.comments.find(c => c.id === replyingTo)?.name}
                </span>
                <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold">Batal</button>
              </div>
            )}
            
            <div className="px-4 py-2 bg-gray-50 dark:bg-[#0D1117] flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
              <button 
                onClick={() => handleFormat('**', '**')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors tooltip relative group"
                title="Bold (**teks**)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleFormat('*', '*')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors tooltip relative group"
                title="Italic (*teks*)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleFormat('`', '`')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors tooltip relative group"
                title="Inline Code (`kode`)"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 max-w-3xl mx-auto flex gap-2 relative">
              {showMentions && Array.from(new Set([selectedPost.name, ...selectedPost.comments.map(c => c.name)])).filter(n => n.toLowerCase().includes(mentionQuery)).length > 0 && (
                 <div className="absolute bottom-full left-4 mb-2 bg-white dark:bg-slate border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl overflow-hidden min-w-[200px] z-20">
                   {Array.from(new Set([selectedPost.name, ...selectedPost.comments.map(c => c.name)])).filter(n => n.toLowerCase().includes(mentionQuery)).map(name => (
                     <button
                       key={name}
                       onClick={() => handleMentionClick(name)}
                       className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-navy dark:text-white"
                     >
                       @{name}
                     </button>
                   ))}
                 </div>
              )}
              <div className="flex-1 relative">
                <input
                  ref={commentInputRef}
                  type="text"
                  placeholder={replyingTo !== null ? "Tulis balasanmu..." : "Tulis komentarmu (Gunakan @ untuk mention)..."}
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-primary-blue/30 dark:text-white border border-transparent focus:border-primary-blue/30 transition-all font-sans"
                  value={commentText}
                  onChange={handleCommentChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <div className={`text-[10px] mt-1 absolute -top-4 right-1 bg-white dark:bg-slate px-1 ${commentText.length >= 280 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                  {commentText.length}/280
                </div>
              </div>
              <button 
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="bg-primary-blue text-white px-5 border-none rounded-xl disabled:opacity-50 flex items-center justify-center transition-all hover:bg-blue-600 disabled:hover:bg-primary-blue shadow-sm"
                title="Kirim"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-teal-50 dark:bg-teal-500/10 rounded-full mb-4 mt-8">
              <Users className="w-12 h-12 text-teal-600" />
            </div>
            <h1 className="text-3xl font-bold text-navy dark:text-white mb-2">{t('community.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('ui_12')}</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari diskusi, project, atau pengalaman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate border border-gray-200 dark:border-gray-800 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-navy dark:text-white transition-all shadow-sm"
            />
          </div>

          {isNewUser && (
            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex flex-col items-center text-center">
              <MessageCircle className="w-12 h-12 text-primary-blue mb-3 opacity-80" />
              <h3 className="font-bold text-navy dark:text-white mb-2">{t('ui_13')}</h3>
              <p className="text-sm text-gray-500">{t('ui_14')}</p>
            </div>
          )}

          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-5 py-2.5 font-bold rounded-full whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-navy dark:bg-primary-blue text-white shadow-sm' : 'bg-gray-100 dark:bg-slate border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              >
                Post Baru
              </button>
              <button 
                onClick={() => setActiveTab('discussion')}
                className={`px-5 py-2.5 font-bold rounded-full whitespace-nowrap transition-colors ${activeTab === 'discussion' ? 'bg-navy dark:bg-primary-blue text-white shadow-sm' : 'bg-gray-100 dark:bg-slate border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              >
                Berdiskusi
              </button>
              <button 
                onClick={() => setActiveTab('project')}
                className={`px-5 py-2.5 font-bold rounded-full whitespace-nowrap transition-colors ${activeTab === 'project' ? 'bg-navy dark:bg-primary-blue text-white shadow-sm' : 'bg-gray-100 dark:bg-slate border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              >
                Berbagi Project
              </button>
              <button 
                onClick={() => setActiveTab('saved')}
                className={`px-5 py-2.5 font-bold rounded-full whitespace-nowrap transition-colors ${activeTab === 'saved' ? 'bg-navy dark:bg-primary-blue text-white shadow-sm' : 'bg-gray-100 dark:bg-slate border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              >
                Tersimpan
              </button>
            </div>
          </div>

          <div className="space-y-4 min-h-[min(50vh,300px)]">
            {filteredPosts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 bg-white dark:bg-slate border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center text-center"
              >
                <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="font-bold text-navy dark:text-white mb-2">
                  {searchQuery !== '' ? 'Tidak ditemukan postingan yang sesuai.' : activeTab === 'discussion' ? 'Belum ada diskusi.' : activeTab === 'project' ? 'Belum ada project yang dibagikan.' : activeTab === 'saved' ? 'Belum ada postingan yang disimpan.' : 'Belum ada postingan.'}
                </h3>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
              {filteredPosts.map((post) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={post.id} 
                  className="bg-white dark:bg-slate border border-gray-100 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:border-gray-200 dark:hover:border-gray-700 transition-colors relative"
                >
                  <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSaved(post.id); }}
                      className={`p-1.5 rounded-md transition-colors ${savedPostIds.includes(post.id) ? 'text-primary-blue bg-blue-50 dark:bg-blue-500/10' : 'text-gray-400 hover:text-primary-blue hover:bg-blue-50 dark:hover:bg-blue-500/10'}`}
                      title="Simpan Post"
                    >
                      {savedPostIds.includes(post.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                    {post.userId === currentUserId && (
                      <button 
                        onClick={() => setShowDeleteConfirm({ type: 'post', postId: post.id })}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        title="Hapus Post"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div 
                    className="cursor-pointer group" 
                    onClick={() => openPostDetail(post.id)}
                  >
                    <div className="flex items-center justify-between mb-2 pr-20">
                      <div className="flex items-center gap-3">
                        <Avatar name={post.name} url={post.avatar} fallbackClass="bg-gradient-to-br from-teal-400 to-emerald-500 text-white text-lg" size="w-10 h-10" />
                        <div>
                          <div className="font-bold text-navy dark:text-white flex items-center gap-2">
                            {post.name}
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-wider rounded-md">
                              {post.role}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">{post.time}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3 mb-3">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${post.category === 'discussion' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400'}`}>
                        {post.category === 'discussion' ? 'Diskusi' : 'Project'}
                      </span>
                      {post.category === 'project' && post.projectName && (
                         <span className="font-bold text-sm text-navy dark:text-white">{post.projectName}</span>
                      )}
                      {post.category === 'discussion' && post.title && (
                         <span className="font-bold text-sm text-navy dark:text-white">{post.title}</span>
                      )}
                    </div>
                    
                    {post.techStack && (
                      <div className="text-xs text-gray-500 mt-1 mb-2 font-mono">Tech: {post.techStack}</div>
                    )}
                    {post.projectUrl && (
                      <a href={post.projectUrl} target="_blank" rel="noreferrer" className="text-xs text-primary-blue hover:underline mt-1 mb-3 inline-block" onClick={(e) => e.stopPropagation()}>🔗 {post.projectUrl}</a>
                    )}
                    
                    <div className="text-gray-700 dark:text-gray-300 mb-1 whitespace-pre-wrap line-clamp-3" dangerouslySetInnerHTML={{ __html: formatText(post.content) }} />
                  </div>
                  
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                      className={`flex items-center gap-2 transition-colors font-bold text-sm ${post.userLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <Heart className={`w-5 h-5 ${post.userLiked ? 'fill-red-500' : ''}`} /> {post.likes}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); openPostDetail(post.id); }}
                      className="flex items-center gap-2 text-gray-400 hover:text-primary-blue transition-colors font-bold text-sm"
                    >
                      <MessageCircle className="w-5 h-5" /> {post.comments.length} Komentar
                    </button>
                  </div>
                </motion.div>
              ))
              }
              </AnimatePresence>
            )}
          </div>
          
          {/* FAB - Floating Action Button for Create Post */}
          <button
            onClick={() => setIsCreatingPost(true)}
            className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-primary-blue text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-blue-600 hover:-translate-y-1 transition-all z-40 tooltip"
            title="Buat Postingan Baru"
          >
            <Plus className="w-8 h-8" />
          </button>
          
          {/* Create Post Modal */}
          <AnimatePresence>
          {isCreatingPost && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate p-6 rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-navy dark:text-white">Buat Postingan Baru</h3>
                  <button onClick={() => setIsCreatingPost(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="discussion" checked={newPostCategory === 'discussion'} onChange={() => setNewPostCategory('discussion')} className="text-primary-blue focus:ring-primary-blue" />
                        <span className="text-sm font-medium text-navy dark:text-white">Diskusi</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="project" checked={newPostCategory === 'project'} onChange={() => setNewPostCategory('project')} className="text-primary-blue focus:ring-primary-blue" />
                        <span className="text-sm font-medium text-navy dark:text-white">Project</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {newPostCategory === 'discussion' ? 'Judul Diskusi' : 'Nama Project'}
                    </label>
                    <input 
                      type="text" 
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder={newPostCategory === 'discussion' ? 'Contoh: Tanya flexbox tengah...' : 'Contoh: Portfolio Website'}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary-blue dark:text-white transition-colors"
                    />
                  </div>

                  {newPostCategory === 'project' && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tech Stack</label>
                        <input 
                          type="text" 
                          value={newPostTechStack}
                          onChange={(e) => setNewPostTechStack(e.target.value)}
                          placeholder="Contoh: React, Tailwind, Vite"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary-blue dark:text-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Link Project (Opsional)</label>
                        <input 
                          type="url" 
                          value={newPostUrl}
                          onChange={(e) => setNewPostUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary-blue dark:text-white transition-colors"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Isi Postingan</label>
                    <textarea 
                      rows={5}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Bagikan pengalaman, pertanyaan, diskusi, atau project Anda..."
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary-blue dark:text-white transition-colors resize-none mb-1"
                    ></textarea>
                    <div className={`text-xs ${newPostContent.trim().length >= 20 ? 'text-green-500' : 'text-slate-400'}`}>
                      {newPostContent.trim().length}/20 karakter minimal
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button 
                      onClick={() => setIsCreatingPost(false)}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleAddPost}
                      disabled={!newPostTitle.trim() || newPostContent.trim().length < 20}
                      className="px-5 py-2.5 bg-primary-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none"
                    >
                      Kirim Postingan
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>
          
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl font-medium text-sm flex items-center gap-2"
              >
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <BookmarkCheck className="w-3 h-3 text-white" />
                </div>
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
